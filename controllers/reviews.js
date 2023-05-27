const Reviews = require('../models/Review');


const getReviews = async (req, res) => {
    const reviews = await Reviews.find()

    res.status(200).json({reviews})
}


const createReview = async (req, res) => {
    const { review } = req.body
    const { id } = req.params

    if(!review) return res.satus(400).json({message: 'Review field cannot be blank'})

    const new_review = new Reviews({
        review,
        post: id
    })

    await new_review.save()

    if(new_review) {
        return res.status(201).json({message: 'Review has been posted'})
    } else {
        return res.status(400).json({message: 'Invalid data received.'})
    }
}

module.exports = {
    getReviews,
    createReview
}