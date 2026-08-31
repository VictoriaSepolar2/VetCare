import { Router } from 'express';
import * as consultaController from '../controllers/consulta.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.post('/', consultaController.criar);
router.get('/', consultaController.listar);
router.get('/:id', consultaController.buscarPorId);
router.patch('/:id/status', consultaController.atualizarStatus);
router.patch('/:id/cancelar', consultaController.cancelar);

export default router;