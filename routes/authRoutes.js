import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta protegida (requiere autenticación)
router.get('/me', authMiddleware, getProfile);

export default router;

