import { Router } from 'express';
import * as petController from '../controllers/pet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.post('/', petController.criar);
router.get('/', petController.listar);
router.get('/:id', petController.buscarPorId);
router.put('/:id', petController.atualizar);

export default router;