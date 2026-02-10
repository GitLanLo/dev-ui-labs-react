import { Router } from 'express';
import { getAllOffers } from '../controllers/offerController.js';

const offerRouter = Router();

offerRouter.get('/offers', getAllOffers);

export default offerRouter;
