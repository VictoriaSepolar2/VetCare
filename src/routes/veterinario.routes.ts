import { Router } from 'express';

import * as veterinarioController from '../controllers/veterinario.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /veterinarios:
 *   post:
 *     tags:
 *       - Veterinários
 *     summary: Cadastrar um veterinário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - crmv
 *               - especialidade
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Dra. Ana Souza
 *               crmv:
 *                 type: string
 *                 example: "12345"
 *               especialidade:
 *                 type: string
 *                 example: Clínica Geral
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ana@vetcare.com
 *     responses:
 *       201:
 *         description: Veterinário criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autorizado.
 */
router.post(
  '/',
  veterinarioController.criar
);

/**
 * @openapi
 * /veterinarios:
 *   get:
 *     tags:
 *       - Veterinários
 *     summary: Listar veterinários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veterinários.
 *       401:
 *         description: Não autorizado.
 */
router.get(
  '/',
  veterinarioController.listar
);

/**
 * @openapi
 * /veterinarios/{id}:
 *   get:
 *     tags:
 *       - Veterinários
 *     summary: Buscar veterinário por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Veterinário encontrado.
 *       404:
 *         description: Veterinário não encontrado.
 */
router.get(
  '/:id',
  veterinarioController.buscarPorId
);

/**
 * @openapi
 * /veterinarios/{id}:
 *   put:
 *     tags:
 *       - Veterinários
 *     summary: Atualizar um veterinário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               crmv:
 *                 type: string
 *               especialidade:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Veterinário atualizado.
 *       404:
 *         description: Veterinário não encontrado.
 */
router.put(
  '/:id',
  veterinarioController.atualizar
);

/**
 * @openapi
 * /veterinarios/{id}:
 *   delete:
 *     tags:
 *       - Veterinários
 *     summary: Excluir um veterinário
 *     description: Exclui um veterinário cadastrado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Veterinário excluído com sucesso.
 *       401:
 *         description: Não autorizado.
 *       404:
 *         description: Veterinário não encontrado.
 */
router.delete(
  '/:id',
  veterinarioController.excluir
);

export default router;