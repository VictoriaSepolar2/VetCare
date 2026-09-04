import { Router } from 'express';

import * as petController
  from '../controllers/pet.controller';

import { authMiddleware }
  from '../middlewares/auth.middleware';

import { somenteComPermissao }
  from '../middlewares/permission.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  somenteComPermissao('PETS'),
  petController.criar
);

router.get(
  '/',
  somenteComPermissao('PETS'),
  petController.listar
);

router.get(
  '/:id',
  somenteComPermissao('PETS'),
  petController.buscarPorId
);

router.put(
  '/:id',
  somenteComPermissao('PETS'),
  petController.atualizar
);

export default router;