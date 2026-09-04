import { Router } from 'express';

import * as usuarioController from '../controllers/usuario.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

import { somenteAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  somenteAdmin,
  usuarioController.criar
);

router.get(
  '/',
  somenteAdmin,
  usuarioController.listar
);

export default router;