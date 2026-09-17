import { Router } from 'express';

import * as clienteController from '../controllers/cliente.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /clientes:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Cadastrar um cliente
 *     description: Cria um novo cliente no sistema. É necessário estar autenticado.
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
 *               - cpf
 *               - email
 *               - telefone
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               cpf:
 *                 type: string
 *                 example: '12345678900'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               telefone:
 *                 type: string
 *                 example: '24999999999'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       409:
 *         description: CPF ou e-mail já cadastrado.
 */
router.post('/', authMiddleware, clienteController.criar);

/**
 * @openapi
 * /clientes:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Listar clientes
 *     description: Retorna todos os clientes cadastrados. É necessário estar autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get('/', authMiddleware, clienteController.listar);

/**
 * @openapi
 * /clientes/{id}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Buscar cliente por ID
 *     description: Retorna os dados de um cliente específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do cliente.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Cliente não encontrado.
 */
router.get('/:id', authMiddleware, clienteController.buscarPorId);


/**
 * @openapi
 * /clientes/{id}:
 *   delete:
 *     tags:
 *       - Clientes
 *     summary: Excluir um cliente
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
 *         description: Cliente excluído com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Cliente não encontrado.
 *       409:
 *         description: O cliente possui pets cadastrados.
 */
router.delete('/:id', authMiddleware, clienteController.excluir);

export default router;