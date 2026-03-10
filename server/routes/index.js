import { Router } from 'express';
import offerRouter from './offerRoutes.js';
import reviewRouter from './reviewRoutes.js';
import userRotes from './userRoutes.js';

const router = new Router();

router.use('/', offerRouter);
router.use('/', userRotes);
router.use('/comments', reviewRouter);
router.use('/reviews', reviewRouter);

export { router };
