import { Router } from 'express';
import upload from '../middleware/upload.js';
import { getAllUsers, registration } from '../controllers/userController.js';

const router = new Router();

router.get('/users', getAllUsers);
router.post('/register', upload.single('avatar'), registration);

export default router;
