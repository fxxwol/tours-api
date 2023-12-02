const { User } = require('../models/user')
const { ctrlWrapper, HttpError } = require('../helpers')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { nanoid } = require("nanoid");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    const verificationToken = nanoid();

    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({ ...req.body, password: hashPassword, verificationToken });


    res.status(201).json({
        token: verificationToken,
        user: {
            name
        }
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            name: user.name,
            role: user.role
        }
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' })

    res.json({
        message: "Logout success"
    })
}

const current = async (req, res) => {
    const { name } = req.user;
    res.json({
        name
    })
}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current)
}