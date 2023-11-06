const Joi = require('joi')
const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
    {
        totalPrice: {
            type: Number,
            required: [true, "Price is required"],
            default: 0
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        status: {
            type: String,
            enum: ["waiting", "pending", "doing", "completed", "canceled"],
            required: [true, "Status is required"],
            default: "waiting"
        },
        tours: [
            {
                tour: {
                    type: Schema.Types.ObjectId,
                    ref: 'tour',
                },
                amount: {
                    type: Number,
                    required: [true, "Amount is required"],
                    default: 1
                }
            }
        ]


    }, {
    versionKey: false, timestamps: {
        createdAt: true,
        updatedAt: false
    }
})

const Order = model("order", orderSchema);

const updateStatusSchema = Joi.object({
    status: Joi.string().valid("waiting", "pending", "doing", "completed", "canceled").required(),
});

const schemas = { updateStatusSchema }

module.exports = {
    Order,
    schemas
}