import { Router } from 'express';
import { getAllReviews, getReviewsByOfferId } from '../controllers/reviewController.js';

const reviewRouter = Router();

reviewRouter.get('/reviews', getAllReviews);
reviewRouter.get('/offers/:offerId/reviews', getReviewsByOfferId);

export default reviewRouter;
