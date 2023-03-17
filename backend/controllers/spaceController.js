const Space = require("../models/spaceSchema");
const User = require("../models/userSchema");

/*
 * @desc GET spaces
 * @route GET /api/spaces
 * @access Private
 * */
const getSpaces = async (req, res) => {
  //Find returns a cursor(empty array or always truthy)
  const spaces = await Space.find({ owner: req.user._id }).select(
    "spaceId spaceName createdAt -_id"
  );
  res.status(200).send(spaces);
};

/*
 * @desc Get data of a particular space
 * @route GET /api/spaces/:id
 * @access Private
 * */
const getSpaceData = async (req, res) => {
  try {
    const space = await Space.findOne({
      spaceId: req.params.id,
    }).select("-owner -_id -__v -updatedAt -createdAt");
    if (!space) {
      throw new Error("No space found with this spaceId!");
    }
    res.status(200).send(space);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Create spaces
 * @route POST /api/spaces
 * @access Private
 * */
const createSpaces = async (req, res) => {
  try {
    if (!req.body.spaceId || !req.body.spaceName) {
      throw new Error("One or more fields missing");
    }

    const space = new Space({
      spaceId: req.body.spaceId,
      spaceName: req.body.spaceName,
      owner: req.user._id,
      spaceData: req.body.spaceData,
    });

    await space.save();

    const spaces = await Space.find({ owner: req.user._id }).select(
      "spaceId spaceName createdAt"
    );

    res.status(200).send(spaces);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Update spaces
 * @route PUT /api/spaces/:id
 * @access Private
 * */
const updateSpaces = async (req, res) => {
  try {
    const space = await Space.findOne({
      owner: req.user._id,
      spaceId: req.params.id,
    });
    if (!space) {
      throw new Error("No space found with this spaceId!");
    }

    const updatedSpace = await Space.findOneAndUpdate(
      { spaceId: req.params.id },
      req.body,
      { new: true }
    ).select("-owner -_id -__v -updatedAt");
    res.status(200).json(updatedSpace);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Delete spaces
 * @route DELETE /api/spaces/:id
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

    await space.remove();

    const spaces = await Space.find({ owner: req.user._id }).select(
      "spaceId spaceName createdAt"
    );

    res.status(201).send(spaces);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc update Activeusers in particular space
 * @route GET /api/spaces/updateActive/:id
 * @access Public
 * */
const updateActive = async (req, res) => {
  const space = await UserSpaces.findOne({ spaceId: req.params.id });

  if (!space) {
    req.status(400);
    throw new Error("NO space found.");
  }

  req.body.incoming
    ? await UserSpaces.findOneAndUpdate(
        { spaceId: req.params.id },
        { $push: { activeUsers: req.body } },
        { new: true }
      )
    : await UserSpaces.findOneAndUpdate(
        { spaceId: req.params.id },
        { $pullAll: { activeUsers: req.body } },
        { new: true }
      );

  res.status(200).json({ message: "User added to active users" });
};

const verifySpace = async (req, res) => {
  try {
  } catch (e) {}
  const space = await Space.findOne({ spaceId: req.params.id });
};

module.exports = {
  getSpaces,
  createSpaces,
  updateSpaces,
  deleteSpaces,
  getSpaceData,
  updateActive,
  verifySpace,
};
