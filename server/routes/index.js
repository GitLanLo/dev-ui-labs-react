import { Router } from 'express';
import offerRouter from './offerRoute.js';
import reviewRouter from './reviewRoute.js';
import userRouter from './userRoute.js';

const router = Router();

router.use('/', offerRouter);
router.use('/', reviewRouter);
router.use('/', userRouter);

export default router;
