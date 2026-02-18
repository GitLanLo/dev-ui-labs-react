import { adaptReviewToClient } from '../adapters/reviewAdapter.js';
import ApiError from '../error/ApiError.js';
import Review from '../models/review.js';
import User from '../models/user.js';

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
      where: { offerId },
      include: { model: User, as: 'author' },
      order: [['publishDate', 'DESC']],
    });

    const adaptedReviews = reviews.map(adaptReviewToClient);
    return res.status(200).json(adaptedReviews);
  } catch (error) {
    return next(ApiError.internal('Ошибка при получении комментариев'));
  }
}

async function addReview(req, res, next) {
  try {
    const { comment, rating } = req.body;
    const { offerId } = req.params;
    const userId = req.user.id;

    if (!comment || !rating || !offerId) {
      return next(ApiError.badRequest('Не хватает данных для комментария'));
    }

    const review = await Review.create({
      text: comment,
      rating,
      authorId: userId,
      offerId,
    });

    return res.status(201).json(review);
  } catch (error) {
    return next(ApiError.badRequest('Ошибка при добавлении комментария'));
  }
}

export { addReview, getAllReviews, getReviewsByOfferId };
