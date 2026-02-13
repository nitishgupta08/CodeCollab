const Space = require("../models/spaceSchema");

const SPACE_LIST_FIELDS = "spaceId spaceName createdAt";

const getSpaceRole = (space, userId) => {
  if (space.owner.toString() === userId.toString()) {
    return "owner";
  }

  const membership = (space.members || []).find(
    (entry) => entry.user.toString() === userId.toString()
  );

  return membership?.role || null;
};

const requireSpaceAccess = async (spaceId, userId) => {
  const space = await Space.findOne({ spaceId });

  if (!space) {
    const error = new Error("No space found with this spaceId!");
    error.status = 404;
    throw error;
  }

  const role = getSpaceRole(space, userId);
  if (!role) {
    const error = new Error("Not authorized to access this space");
    error.status = 403;
    throw error;
  }

  return { space, role };
};

const validateSpaceData = (spaceData) => {
  if (!Array.isArray(spaceData) || spaceData.length === 0) {
    throw new Error("spaceData must be a non-empty array");
  }

  const isValid = spaceData.every((item) => {
    return (
      item &&
      typeof item.fileName === "string" &&
      typeof item.fileData === "string" &&
      typeof item.fileLang === "string"
    );
  });

  if (!isValid) {
    throw new Error("Invalid spaceData payload");
  }
};

/*
 * @desc GET spaces
 * @route GET /spaces
 * @access Private
 * */
const getSpaces = async (req, res) => {
  const spaces = await Space.find({
    $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
  }).select(SPACE_LIST_FIELDS);

  res.status(200).send(spaces);
};

/*
 * @desc Create spaces
 * @route POST /spaces
 * @access Private
 * */
const createSpaces = async (req, res) => {
  try {
    if (!req.body.spaceId || !req.body.spaceName) {
      throw new Error("One or more fields missing");
    }

    const spaceData = [
      {
        fileName: "Untitled-1",
        fileData: "",
        fileLang: "javascript",
      },
    ];

    const space = new Space({
      spaceId: req.body.spaceId,
      spaceName: req.body.spaceName,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
      spaceData,
    });

    await space.save();

    const spaces = await Space.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    }).select(SPACE_LIST_FIELDS);

    res.status(200).send(spaces);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Join a space by id
 * @route POST /spaces/:id/join
 * @access Private
 * */
const joinSpace = async (req, res) => {
  try {
    const space = await Space.findOne({ spaceId: req.params.id });

    if (!space) {
      throw new Error("No space found with this spaceId!");
    }

    const role = getSpaceRole(space, req.user._id);
    if (!role) {
      space.members.push({ user: req.user._id, role: "editor" });
      await space.save();
    }

    res.status(200).send({ data: "Joined space" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Get data of a particular space
 * @route GET /spaces/:id
 * @access Private
 * */
const getSpaceData = async (req, res) => {
  try {
    const space = await Space.findOne({ spaceId: req.params.id });
    if (!space) {
      throw new Error("No space found with this spaceId!");
    }

    const role = req.user ? getSpaceRole(space, req.user._id) : null;
    const canEdit = role === "owner" || role === "editor";

    res.status(200).send({
      spaceId: space.spaceId,
      spaceName: space.spaceName,
      spaceData: space.spaceData,
      activeUsers: space.activeUsers,
      canEdit,
    });
  } catch (e) {
    res.status(e.status || 400).send({ error: e.message });
  }
};

/*
 * @desc Update spaces
 * @route PUT /spaces/:id
 * @access Private
 * */
const updateSpaces = async (req, res) => {
  try {
    const { space, role } = await requireSpaceAccess(req.params.id, req.user._id);

    if (role === "viewer") {
      return res.status(403).send({ error: "Viewers cannot update spaces" });
    }

    if (req.body.field === "name") {
      if (role !== "owner") {
        return res.status(403).send({ error: "Only owner can rename space" });
      }

      if (!req.body.name || typeof req.body.name !== "string") {
        return res.status(400).send({ error: "Invalid space name" });
      }

      space.spaceName = req.body.name;
      await space.save();

      const spaces = await Space.find({
        $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
      }).select(SPACE_LIST_FIELDS);

      return res.status(201).send(spaces);
    }

    const payloadKeys = Object.keys(req.body);
    const allowedKeys = ["spaceData"];

    const hasOnlyAllowedKeys = payloadKeys.every((key) => allowedKeys.includes(key));
    if (!hasOnlyAllowedKeys) {
      return res.status(400).send({ error: "Invalid update payload" });
    }

    if (req.body.spaceData !== undefined) {
      validateSpaceData(req.body.spaceData);
      space.spaceData = req.body.spaceData;
    }

    await space.save();

    res.status(201).json("Saved!");
  } catch (e) {
    res.status(e.status || 400).send({ error: e.message });
  }
};

/*
 * @desc Delete spaces
 * @route DELETE /spaces/:id
 * @access Private
 * */
const deleteSpaces = async (req, res) => {
  try {
    const space = await Space.findOne({
      owner: req.user._id,
      spaceId: req.params.id,
    });
    if (!space) {
      throw new Error("No space found with this spaceId!");
    }

    await space.deleteOne();

    const spaces = await Space.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    }).select(SPACE_LIST_FIELDS);

    res.status(201).send(spaces);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

module.exports = {
  getSpaces,
  createSpaces,
  joinSpace,
  updateSpaces,
  deleteSpaces,
  getSpaceData,
};
