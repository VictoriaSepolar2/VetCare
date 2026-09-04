import { Router } from 'express';

import * as petController from '../controllers/pet.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

import { somenteAdminOuFuncionario } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  somenteAdminOuFuncionario,
  petController.criar
);

router.get(
  '/',
  somenteAdminOuFuncionario,
  petController.listar
);

router.get(
  '/:id',
  somenteAdminOuFuncionario,
  petController.buscarPorId
);

router.put(
  '/:id',
  somenteAdminOuFuncionario,
  petController.atualizar
);

export default router;