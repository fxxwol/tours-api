const { Order } = require('../models/order')
const { ctrlWrapper, HttpError, getTotalPrice } = require('../helpers');
const { isValidObjectId } = require('mongoose');

const getAll = async (req, res) => {
    const orders = await Order.find().populate({
        path: 'owner',
        select: 'name lastName email',
    })
        .populate({
            path: 'tours.tour',
            select: 'name price country city',
        });;
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
        const tourIndex = order.tours.findIndex((tourObject) => tourObject.tour._id.toString() === tourId.toString());

        if (tourIndex !== -1) {
            order.tours[tourIndex].amount++;
        } else {
            order.tours.push({ tour: tourId });
        }
    }
    order = await Order.populate(order, "tours.tour");
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
    const { tourId } = req.params

    if (!isValidObjectId(tourId)) {
        throw HttpError(400, `${tourId} is not valid id`)
    }

    const order = await Order.findOne({ owner, status: "waiting", 'tours._id': tourId }).populate("tours.tour")
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
    const order = await Order.findOne({ owner, status: "waiting" }).populate("tours.tour");
    if (!order) {
        throw HttpError(404)
    }
    res.json(order)
}

const updateStatus = async (req, res) => {
    const { id } = req.params
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true })
    if (!order) {
        throw HttpError(404, 'Not found')
    }
    res.json(order)
}

const submit = async (req, res) => {
    const { _id: owner } = req.user;
    const order = await Order.findOneAndUpdate({ owner, status: 'waiting' }, { $set: { status: 'pending' } }, { new: true })
    if (!order) {
        throw HttpError(404)
    }
    res.json({
        orderId: order._id,
        message: 'Submitted successfuly',
    })
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getWaiting: ctrlWrapper(getWaiting),
    updateStatus: ctrlWrapper(updateStatus),
    submit: ctrlWrapper(submit),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    deleteTourById: ctrlWrapper(deleteTourById),
}