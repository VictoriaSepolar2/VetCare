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
 *     description: Cadastra um novo veterinário. É necessário estar autenticado.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veterinario'
 *       400:
 *         description: Veterinário com este CRMV já está cadastrado.
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.post('/', veterinarioController.criar);

/**
 * @openapi
 * /veterinarios:
 *   get:
 *     tags:
 *       - Veterinários
 *     summary: Listar veterinários
 *     description: Retorna todos os veterinários cadastrados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veterinários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Veterinario'
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get('/', veterinarioController.listar);

/**
 * @openapi
 * /veterinarios/{id}:
 *   get:
 *     tags:
 *       - Veterinários
 *     summary: Buscar veterinário por ID
 *     description: Retorna os dados de um veterinário específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do veterinário.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Veterinário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veterinario'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Veterinário não encontrado.
 */
router.get('/:id', veterinarioController.buscarPorId);

/**
 * @openapi
 * /veterinarios/{id}:
 *   put:
 *     tags:
 *       - Veterinários
 *     summary: Atualizar um veterinário
 *     description: Atualiza os dados de um veterinário existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do veterinário.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Veterinário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veterinario'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Veterinário não encontrado.
 */
router.put('/:id', veterinarioController.atualizar);

export default router;