import express from 'express';
import { getAgentes, getAgenteById, createAgente, updateAgente, deleteAgente } from '../controllers/agenteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.get('/', authMiddleware, getAgentes);
router.get('/:id', authMiddleware, getAgenteById);
router.post('/', authMiddleware, createAgente);
router.put('/:id', authMiddleware, updateAgente);
router.delete('/:id', authMiddleware, deleteAgente);

export default router;
