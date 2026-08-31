import { Router } from 'express';
import * as veterinarioController from '../controllers/veterinario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/', veterinarioController.criar);
router.get('/', veterinarioController.listar);
router.get('/:id', veterinarioController.buscarPorId);
router.put('/:id', veterinarioController.atualizar);

export default router;