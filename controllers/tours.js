const { Tour } = require('../models/tour')
const { ctrlWrapper, HttpError } = require('../helpers')

// addToCart, deleteFromCart, search?

const getAll = async (req, res) => {
    const tours = await Tour.find()
    if (!tours) {
        throw HttpError(400)
    }
    res.json(tours)
}

const getById = async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId)
    if (!tour) {
        throw HttpError(400)
    }
    res.json(tour)
}

const add = async (req, res) => {
    const { name } = req.body
    const tours = await Tour.find({ name })
    if (tours.length) {
        throw HttpError(409, "Tour already exists")
    }
    const newTour = await Tour.create({ ...req.body })
    res.status(201).json(newTour)
}

const updateById = async (req, res) => {
    const { id } = req.params;
    const updated = await Tour.findByIdAndUpdate(id, req.body, {
        new: true
    })
    if (!updated) {
        throw HttpError(404)
    }
    res.json(updated)
}

const deleteById = async (req, res, next) => {
    const { id } = req.params
    const deleted = await Tour.findByIdAndDelete(id)
    if (!deleted) {
        throw HttpError(404)
    }
    res.json(deleted)
}
module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById)
}