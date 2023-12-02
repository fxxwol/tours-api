async function getTotalPrice(order) {
    let totalPrice = 0;
    for (const tourObject of order.tours) {
            const amount = tourObject.amount;
            totalPrice += tourObject.tour.price * amount;
    }
    return totalPrice;
}

module.exports = getTotalPrice