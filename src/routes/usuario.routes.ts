import { Router } from 'express';
import * as usuarioController
  from '../controllers/usuario.controller';

import { authMiddleware }
  from '../middlewares/auth.middleware';

import { somenteAdminPrincipal }
  from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  somenteAdminPrincipal,
  usuarioController.criar
);

router.get(
  '/',
  somenteAdminPrincipal,
  usuarioController.listar
);

export default router;