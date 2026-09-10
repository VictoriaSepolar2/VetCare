import { Router } from 'express';

import * as consultaController from '../controllers/consulta.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /consultas:
 *   post:
 *     tags:
 *       - Consultas
 *     summary: Agendar uma consulta
 *     description: Cria uma nova consulta para um pet com um veterinário.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - veterinarioId
 *               - dataConsulta
 *             properties:
 *               petId:
 *                 type: integer
 *                 example: 1
 *               veterinarioId:
 *                 type: integer
 *                 example: 1
 *               dataConsulta:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-15T14:00:00.000Z
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Dados inválidos para criar a consulta.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Pet ou veterinário não encontrado.
 */
router.post('/', consultaController.criar);

/**
 * @openapi
 * /consultas:
 *   get:
 *     tags:
 *       - Consultas
 *     summary: Listar consultas
 *     description: Retorna todas as consultas cadastradas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consulta'
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get('/', consultaController.listar);

/**
 * @openapi
 * /consultas/{id}:
 *   get:
 *     tags:
 *       - Consultas
 *     summary: Buscar consulta por ID
 *     description: Retorna os dados de uma consulta específica.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da consulta.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Consulta não encontrada.
 */
router.get('/:id', consultaController.buscarPorId);

/**
 * @openapi
 * /consultas/{id}/status:
 *   patch:
 *     tags:
 *       - Consultas
 *     summary: Atualizar status da consulta
 *     description: Atualiza o status de uma consulta existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da consulta.
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statusConsulta
 *             properties:
 *               statusConsulta:
 *                 type: string
 *                 example: Concluída
 *     responses:
 *       200:
 *         description: Status da consulta atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Status inválido.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Consulta não encontrada.
 */
router.patch('/:id/status', consultaController.atualizarStatus);

/**
 * @openapi
 * /consultas/{id}/cancelar:
 *   patch:
 *     tags:
 *       - Consultas
 *     summary: Cancelar uma consulta
 *     description: Cancela uma consulta existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da consulta.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Consulta cancelada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Consulta não encontrada.
 */
router.patch('/:id/cancelar', consultaController.cancelar);

export default router;