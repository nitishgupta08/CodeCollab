const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userSchema')
/*
* @desc Register user
* @route POST /api/users/register
* @access Public
* */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Add all fields")
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already registered with this email")
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name: name,
        email: email,
        password: hashPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            email: user.email,
            name: user.name,
            token: generateToken(user._id),
            createdAt: user.createdAt
        })
    } else {
        res.status(400)
        throw new Error("Invalid user details")
    }
})


/*
* @desc Login user
* @route POST /api/users/login
* @access Public
* */
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body


    const user = await User.findOne({ email })


    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            res.status(201).json({
                _id: user.id,
                email: user.email,
                name: user.name,
                token: generateToken(user._id),
                createdAt: user.createdAt
            })
        } else {
            res.status(400)
            throw new Error("Invalid credentials")
        }

    } else {
        res.status(400)
        throw new Error("No user found with this email.")
    }
})


/*
* @desc Get user data
* @route GET /api/users/me
* @access Private
* */
const getUser = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        _id,
        name,
        email
    })
})


// Generate JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}