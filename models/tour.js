const Joi = require('joi')
const { Schema, model } = require('mongoose')

const tourSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        date: {
            type: Date,
            required: [true, "Date is required"]
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"]
        },
        country: {
            type: String,
            required: [true, "Country is required"]
        },
        city: {
            type: String,
            required: [true, "City is required"]
        },
        price: {
            type: Number,
            required: [true, "Price is required"]
        },
        duration: {
            type: Number,
            required: [true, "Duration is required"]
        }

    }, { versionKey: false })

const Tour = model("tour", tourSchema);

const tourJoiSchema = Joi.object({
    name: Joi.string().required(),
    date: Joi.date().greater('now').iso().required(),
    description: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    price: Joi.number().min(1).required(),
    duration: Joi.number().min(1).required()
})

const updateTourSchema = Joi.object({
    name: Joi.string(),
    date: Joi.date().greater('now').iso(),
    description: Joi.string(),
    amount: Joi.number().min(0),
    country: Joi.string(),
    city: Joi.string(),
    price: Joi.number().min(1),
    duration: Joi.number().min(1)
})

module.exports = {
    Tour,
    tourJoiSchema,
    updateTourSchema
}