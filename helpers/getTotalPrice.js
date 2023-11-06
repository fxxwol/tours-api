const { Tour } = require("../models/tour");

async function getTotalPrice(order) {
    let totalPrice = 0;
    for (const tourObject of order.tours) {
        const tour = await Tour.findById(tourObject.tour);
        if (tour) {
            const tourPrice = tour.price;
            const amount = tourObject.amount;
            totalPrice += tourPrice * amount;
        }
    }
    return totalPrice;
}

module.exports = getTotalPrice