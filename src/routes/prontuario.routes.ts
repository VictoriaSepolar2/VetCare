import { Router } from 'express';

import * as prontuarioController from '../controllers/prontuario.controller';

import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /prontuarios:
 *   post:
 *     tags:
 *       - Prontuários
 *     summary: Criar um prontuário
 *     description: Cria um prontuário vinculado a uma consulta.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultaId
 *               - diagnostico
 *               - medicamentosPrescritos
 *             properties:
 *               consultaId:
 *                 type: integer
 *                 example: 1
 *               diagnostico:
 *                 type: string
 *                 example: Infecção de ouvido
 *               medicamentosPrescritos:
 *                 type: string
 *                 example: Medicamento conforme prescrição veterinária
 *               dataRetorno:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2026-09-30T14:00:00.000Z
 *     responses:
 *       201:
 *         description: Prontuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Consulta não encontrada.
 */
router.post('/', prontuarioController.criar);

/**
 * @openapi
 * /prontuarios:
 *   get:
 *     tags:
 *       - Prontuários
 *     summary: Listar prontuários
 *     description: Retorna todos os prontuários cadastrados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de prontuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prontuario'
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get('/', prontuarioController.listar);

/**
 * @openapi
 * /prontuarios/{id}:
 *   get:
 *     tags:
 *       - Prontuários
 *     summary: Buscar prontuário por ID
 *     description: Retorna os dados de um prontuário específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do prontuário.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Prontuário encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Prontuário não encontrado.
 */
router.get('/:id', prontuarioController.buscarPorId);

/**
 * @openapi
 * /prontuarios/{id}:
 *   put:
 *     tags:
 *       - Prontuários
 *     summary: Atualizar um prontuário
 *     description: Atualiza os dados de um prontuário existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do prontuário.
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
 *               diagnostico:
 *                 type: string
 *                 example: Infecção de ouvido
 *               medicamentosPrescritos:
 *                 type: string
 *                 example: Medicamento conforme prescrição veterinária
 *               dataRetorno:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2026-09-30T14:00:00.000Z
 *     responses:
 *       200:
 *         description: Prontuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Prontuário não encontrado.
 */
router.put('/:id', prontuarioController.atualizar);


/**
 * @openapi
 * /prontuarios/{id}:
 *   delete:
 *     tags:
 *       - Prontuários
 *     summary: Excluir um prontuário
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
 *         description: Prontuário excluído com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Prontuário não encontrado.
 */
router.delete('/:id', prontuarioController.excluir);

export default router;