import { Router } from 'express';
import upload from '../middleware/upload.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkAuth, getAllUsers, login, logout, registration } from '../controllers/userController.js';

const router = new Router();

router.get('/users', getAllUsers);
router.post('/register', upload.single('avatar'), registration);
router.post('/login', login);
router.get('/login', authenticateToken, checkAuth);
router.delete('/logout', logout);

export default router;
