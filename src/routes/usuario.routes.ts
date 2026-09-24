import { Router } from 'express';

import * as usuarioController from '../controllers/usuario.controller';

const router = Router();

/**
 * @openapi
 * /usuarios:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cadastrar um usuário
 *     description: Cria um novo usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - usuario
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Maria Silva
 *               usuario:
 *                 type: string
 *                 example: maria
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@email.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Nome de usuário ou e-mail já cadastrado.
 */
router.post(
  '/',
  usuarioController.criar
);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Listar usuários
 *     description: Retorna todos os usuários cadastrados.
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
router.get(
  '/',
  usuarioController.listar
);

router.put('/:id', usuarioController.atualizar);

export default router;

router.delete(
  '/:id',
  usuarioController.excluir
);