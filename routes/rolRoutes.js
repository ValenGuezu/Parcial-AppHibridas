import express from 'express';
import { getRoles, getRolById, createRol, updateRol, deleteRol } from '../controllers/rolController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.get('/', authMiddleware, getRoles);
router.get('/:id', authMiddleware, getRolById);
router.post('/', authMiddleware, createRol);
router.put('/:id', authMiddleware, updateRol);
router.delete('/:id', authMiddleware, deleteRol);

export default router;
