const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require("../models/userSchema")

/*
* @desc Register user
* @route POST /api/users/register
* @access Public
* */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new Error("One or more fields missing");
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            throw new Error("User already registered with this email")
        }

        const newUser = new User(req.body)
        await newUser.save();
        const token = await newUser.generateToken()
        const user = newUser.publicUser()

        res.status(201).send({
            user,
            token
        })

    }catch (e) {
        res.status(400).send({"error":e.message})
    }
}


/*
* @desc Login user
* @route POST /api/users/login
* @access Public
* */
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const checkUser = await User.findByCredentials(email,password);
        const token = await checkUser.generateToken();
        const user = checkUser.publicUser();

        res.status(200).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send({"error":e.message})
    }
}


/*
* @desc Get user data
* @route GET /api/users/me
* @access Private
* */
const getUser = async (req, res) => {
    res.status(200).json(req.user)
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}