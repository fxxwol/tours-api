const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");
require('dotenv').config()
const { SECRET_KEY } = process.env;

const authAccess = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next(HttpError(401));
    }
    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            next(HttpError(401));
        }
        req.user = user;
        next();
    }
    catch {
        next(HttpError(401));
    }
}
const adminAccess = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(401);
        return res.send('Not allowed')
    }
    next()
}

module.exports = {authAccess, adminAccess};