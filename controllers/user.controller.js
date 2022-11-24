const user = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const admin = {
    username: "Admin",
    email: "admin",
    password: "admin"
}

const getAll = async (req, res) => {
    try {
        let users = await user.find().select("-password");
        res.json({
            status: "success",
            result: users
        })
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }
}

const create = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const jwtSecret = process.env.SECRET;
        let exist = await user.findOne({ email: email })
        if (!exist && admin.email != email) {
            const salt = await bcrypt.genSalt(10)
            let proc_password = await bcrypt.hash(password, salt)
            let created = await user.create({
                username: username,
                email: email,
                password: proc_password,
            })
            let token = jwt.sign({
                id: created._id,
                username: created.username,
                email: created.email,
            }, jwtSecret, {
                expiresIn: 3600
            })
            res.json({
                status: "success",
                token: token
            })
        } else {
            res.json({
                status: "fail",
                result: "A user with this email already exists"
            })
        }
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body
        let queryUser = await user.findOne({ email: email })
        if (queryUser) {
            let password_match = await bcrypt.compare(password, queryUser.password)
            let jwtSecret = process.env.SECRET
            if (password_match) {
                let token = jwt.sign({
                    id: queryUser._id,
                    email: queryUser.email,
                }, jwtSecret, {
                    expiresIn: 3600
                })
                res.json({
                    status: "success",
                    token: token,
                })
            } else {
                res.json({
                    status: "fail",
                    result: "Incorrect password"
                })
            }
        } else {
            res.json({
                status: "fail",
                result: "User not found"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400);
        res.json({
            error: err
        })
    }
}

const auth = async (req, res) => {
    try {
        let result = await user.findOne({ _id: req.user.id }).select("-password")
        if (result) {
            res.json({
                status: "success",
                result: result
            })
        } else {
            res.json({
                status: "fail",
                result: "User not found"
            })
        }
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }
}

const update = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        let proc_password = await bcrypt.hash(req.body.password, salt)
        let result = await user.findOneAndUpdate({ _id: req.user.id }, {
            username: req.body.username,
            email: req.body.email,
            password: proc_password,
        }).select("-password")
        res.json({
            status: "successful",
            result: result
        })
    } catch (err) {
        res.status(400);
        res.json({
            error: err
        })
    }
}

module.exports = { getAll, create, login, auth, update }