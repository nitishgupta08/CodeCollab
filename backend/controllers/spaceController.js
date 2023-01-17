const asyncHandler = require('express-async-handler')
const Spaces = require('../models/spaceSchema')
const User = require('../models/userSchema')
/*
* @desc GET spaces
* @route GET /api/spaces
* @access Private
* */
const getSpaces = asyncHandler(async (req, res) => {
    const spaces = await Spaces.find({ user: req.user.id })
    const newSpace = spaces.map(({ spaceId, spaceName, createdAt }) => ({ spaceId, spaceName, createdAt }))
    res.status(200).json(newSpace);
})


/*
* @desc Create spaces
* @route POST /api/spaces
* @access Private
* */
const createSpaces = asyncHandler(async (req, res) => {
    if (!req.body.spaceId || !req.body.spaceName) {
        res.status(400)
        throw new Error("One or more fileds missing")
    }

    const space = await Spaces.create({
        spaceId: req.body.spaceId,
        spaceName: req.body.spaceName,
        user: req.user.id,
        activeUsers: req.body.activeUsers,
        spaceData: req.body.spaceData
    })

    res.status(200).json({ message: "Space Created" })
})


/*
* @desc Update spaces
* @route PUT /api/spaces/:id
* @access Private
* */
const updateSpaces = asyncHandler(async (req, res) => {
    const space = await Spaces.findOne({ spaceId: req.params.id })
    console.log(req.body);
    if (!space) {
        req.status(400)
        throw new Error("NO space found.")
    }
    const user = await User.findById(req.user.id)

    if (space.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized.")
    }


    const updatedSpace = await Spaces.findOneAndUpdate({ spaceId: req.params.id }, req.body, { new: true })

    res.status(200).json({ message: "successfull array update" })
})


/*
* @desc Delete spaces
* @route DELETE /api/spaces/:id
* @access Private
* */
const deleteSpaces = asyncHandler(async (req, res) => {
    const space = await Spaces.findOne({ spaceId: req.params.id })

    if (!space) {
        req.status(400)
        throw new Error("NO space found.")
    }

    const user = await User.findById(req.user.id)

    if (space.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized.")
    }

    await space.remove()

    res.status(200).json({ message: `Space Deleted` })
})


/*
* @desc Get data of a particular space
* @route GET /api/spaces/:id
* @access Private
* */
const getSpaceData = asyncHandler(async (req, res) => {
    const space = await Spaces.findOne({ spaceId: req.params.id })
    res.status(200).json(space);
})


/*
* @desc update Activeusers in particular space
* @route GET /api/spaces/updateActive/:id
* @access Public
* */
const updateActive = asyncHandler(async (req, res) => {
    const space = await Spaces.findOne({ spaceId: req.params.id })

    if (!space) {
        req.status(400)
        throw new Error("NO space found.")
    }
    console.log(req.body)

    req.body.incoming ?
        await Spaces.findOneAndUpdate({ spaceId: req.params.id }, { $push: { activeUsers: req.body } }, { new: true }) :
        await Spaces.findOneAndUpdate({ spaceId: req.params.id }, { $pullAll: { activeUsers: req.body } }, { new: true })

    res.status(200).json({ message: "User added to active users" })
})


module.exports = {
    getSpaces,
    createSpaces,
    updateSpaces,
    deleteSpaces,
    getSpaceData,
    updateActive
}