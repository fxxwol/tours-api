
const getTotalPrice = async (tour, amount) => {
    return tour.price * amount
}

module.exports= getTotalPrice