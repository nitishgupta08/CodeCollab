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
    res.status(200).json(spaces)
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
        user: req.user.id
    })

    res.status(200).json(space)
})


/*
* @desc Update spaces
* @route PUT /api/spaces/:id
* @access Private
* */
const updateSpaces = asyncHandler(async (req, res) => {
    const space = await Spaces.findById(req.params.id)

    if (!space) {
        req.status(400)
        throw new Error("NO space found.")
    }
    const user = await User.findById(req.user.id)

    if (space.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized.")
    }


    const updatedSpace = await Spaces.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedSpace)
    res.status(200).json({ message: "successfull array update" })
})


/*
* @desc Delete spaces
* @route DELETE /api/spaces/:id
* @access Private
* */
const deleteSpaces = asyncHandler(async (req, res) => {
    const space = await Spaces.findById(req.params.id)
    console.log(req.params.id)
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

module.exports = {
    getSpaces,
    createSpaces,
    updateSpaces,
    deleteSpaces
}