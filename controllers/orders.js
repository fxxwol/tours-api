const { Order } = require('../models/order')
const { ctrlWrapper, HttpError, getTotalPrice } = require('../helpers');
const { isValidObjectId } = require('mongoose');

// submitOrder

const getAll = async (req, res) => {
    const orders = await Order.find();
    if (!orders) {
        throw HttpError(400)
    }
    res.json(orders)
}

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const { tourId } = req.body;
    if (!isValidObjectId(tourId)) {
        throw HttpError(400, `${tourId} is not valid id`)
    }

    let order = await Order.findOne({
        owner, status: "waiting"
    })

    if (!order) {
        order = await Order.create({ tours: [{ tour: tourId }], owner });
    } else {
        const tourIndex = order.tours.findIndex((tourObject) => tourObject.tour.toString() === tourId.toString());

        if (tourIndex !== -1) {
            order.tours[tourIndex].amount++;
        } else {
            order.tours.push({ tour: tourId });
        }
    }
    const totalPrice = await getTotalPrice(order);
    order.totalPrice = totalPrice;

    await order.save();
    res.status(order.isNew ? 201 : 200).json(order);
}

const deleteById = async (req, res) => {
    const { id } = req.params
    const deleted = await Order.findByIdAndDelete(id)
    if (!deleted) {
        throw HttpError(404)
    }
    res.json(deleted)
}

const deleteTourById = async (req, res) => {
    const { _id: owner } = req.user
    const { tourId } = req.body

    if (!isValidObjectId(tourId)) {
        throw HttpError(400, `${tourId} is not valid id`)
    }

    const order = await Order.findOne({ owner, status: "waiting", 'tours._id': tourId })
    if (!order) {
        throw HttpError(404)
    }
    const tourIndex = order.tours.findIndex((tourObject) => tourObject._id.toString() === tourId.toString());
    if (order.tours[tourIndex].amount > 1) {
        order.tours[tourIndex].amount--;
    } else {
        order.tours.splice(tourIndex, 1)
    }
    order.totalPrice = await getTotalPrice(order)
    await order.save()
    if (order.tours.length === 0) {
        await Order.findByIdAndDelete(order._id);
        res.status(204).send();
    } else {
        res.json(order);
    }
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
    const { id } = req.params
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
    if (!order) {
        throw HttpError(404, 'Not found')
    }
    res.json(order)
}

// const submit = async (req, res) => {
//     const { _id: owner } = req.user;
//     const result = await Order.updateMany({ owner, status: "waiting" }, { $set: { status: 'pending' } });
//     if (!result.matchedCount) {
//         throw HttpError(404)
//     }
//     res.json({
//         message: 'Submitted successfuly',
//         orderId: 
//     })
// }

module.exports = {
    getAll: ctrlWrapper(getAll),
    getWaiting: ctrlWrapper(getWaiting),
    updateStatus: ctrlWrapper(updateStatus),
    // submit: ctrlWrapper(submit),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    deleteTourById: ctrlWrapper(deleteTourById),
}