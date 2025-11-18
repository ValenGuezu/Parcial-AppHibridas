import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.get('/', authMiddleware, getUsuarios);
router.get('/:id', authMiddleware, getUsuarioById);
router.post('/', authMiddleware, createUsuario);
router.put('/:id', authMiddleware, updateUsuario);
router.delete('/:id', authMiddleware, deleteUsuario);

export default router;
