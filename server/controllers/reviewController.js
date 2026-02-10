import Review from '../models/review.js';

async function getAllReviews(_req, res, next) {
  try {
    const reviews = await Review.findAll();
    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
}

async function getReviewsByOfferId(req, res, next) {
  const { offerId } = req.params;

  try {
    const reviews = await Review.findAll({
      where: {
        offerId,
      },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
}

export { getAllReviews, getReviewsByOfferId };
