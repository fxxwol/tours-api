const Joi = require('joi')
const { Schema, model } = require('mongoose')
const { patterns } = require("../helpers")

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"]
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        token: String,
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    }
    , { versionKey: false })

userSchema.post("save", (error, next) => {
    error.status = 400;
    next()
});

const User = model("user", userSchema);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().regex(patterns.emailPattern),
    password: Joi.string().regex(patterns.passwordPattern),
    role: Joi.string().valid("admin", "user")
})

const loginSchema = Joi.object({
    email: Joi.string().regex(patterns.emailPattern),
    password: Joi.string().regex(patterns.passwordPattern),
})

const schemas = { registerSchema, loginSchema }


module.exports = {
    User,
    schemas
}