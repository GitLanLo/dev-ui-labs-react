import { Router } from 'express';
import upload from '../middleware/upload.js';
import { createOffer, getAllOffers, getFullOffer } from '../controllers/offerController.js';

const router = new Router();

router.get('/offers', getAllOffers);
router.post(
  '/offers',
  upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'photos', maxCount: 6 },
  ]),
  createOffer
);
router.get('/offers/:id', getFullOffer);

export default router;
