import { Router } from 'express';
import * as clienteController from '../controllers/cliente.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, clienteController.criar);
router.get('/', authMiddleware, clienteController.listar);
router.get('/:id', authMiddleware, clienteController.buscarPorId);

export default router;