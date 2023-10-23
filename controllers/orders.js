const { Order } = require('../models/order')
const { ctrlWrapper, HttpError, getTotalPrice } = require('../helpers');
const { Tour } = require('../models/tour');
const { isValidObjectId } = require('mongoose');

// increaseTourAmount, updateStatus, submitOrder

const getAll = async (req, res) => {
    const orders = await Order.find();
    if (!orders) {
        throw HttpError(400)
    }
    res.json(orders)
}

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const { tourId } = req.params
    if (!isValidObjectId(tourId)) {
        throw HttpError(400, `${tourId} is not valid id`)
    }
    const tour = await Tour.findById(tourId)
    if (!tour) {
        throw HttpError(404, "Invalid tour id")
    }

    const order = await Order.findOne({ owner, status: "waiting", tour: tourId });

    if (order) {
        order.amount++
        order.totalPrice = await getTotalPrice(tour, order.amount)
        await order.save()
        res.json(order)
    }
    else {
        const newOrder = await Order.create({ tour: tourId, owner })
        newOrder.totalPrice = await getTotalPrice(tour, newOrder.amount)
        await newOrder.save()
        res.status(201).json(newOrder)
    }
}

const deleteById = async (req, res) => {
    const { id } = req.params
    const deleted = await Order.findByIdAndDelete(id)
    if (!deleted) {
        throw HttpError(404)
    }
    res.json(deleted)
}

const getWaiting = async (req, res) => {
    const { _id: owner } = req.user;
    const orders = await Order.find({ owner, status: "waiting" });
    if (!orders) {
        throw HttpError(404)
    }
    res.json(orders)
}

const updateStatus = async (req, res) => {

}
const increaseTourAmount = async (req, res) => {

}
const submit = async (req, res) => {

}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getWaiting: ctrlWrapper(getWaiting),
    updateStatus: ctrlWrapper(updateStatus),
    increaseTourAmount: ctrlWrapper(increaseTourAmount),
    submit: ctrlWrapper(submit),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
}