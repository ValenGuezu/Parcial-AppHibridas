import express from 'express';
import { getAgentes, getAgenteById, createAgente, updateAgente, deleteAgente } from '../controllers/agenteController.js';

const router = express.Router();

router.get('/', getAgentes);
router.get('/:id', getAgenteById);
router.post('/', createAgente);
router.put('/:id', updateAgente);
router.delete('/:id', deleteAgente);

export default router;
