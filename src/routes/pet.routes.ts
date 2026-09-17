import { Router } from 'express'

import * as petController from '../controllers/pet.controller'

import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

/**
 * @openapi
 * /pets:
 *   post:
 *     tags:
 *       - Pets
 *     summary: Cadastrar um pet
 *     description: Cadastra um novo pet vinculado a um cliente. É necessário estar autenticado.
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
 *               - especie
 *               - raca
 *               - dataNascimento
 *               - clienteId
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Max
 *               especie:
 *                 type: string
 *                 example: Cachorro
 *               raca:
 *                 type: string
 *                 example: Chow Chow
 *               dataNascimento:
 *                 type: string
 *                 format: date-time
 *                 example: 2022-05-10T00:00:00.000Z
 *               clienteId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Pet criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Cliente não encontrado.
 *       400:
 *         description: Data de nascimento inválida.
 */
router.post(
  '/',
  petController.criar
)

/**
 * @openapi
 * /pets:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Listar pets
 *     description: Retorna todos os pets cadastrados. É necessário estar autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Token não fornecido ou inválido.
 */
router.get(
  '/',
  petController.listar
)

/**
 * @openapi
 * /pets/{id}:
 *   get:
 *     tags:
 *       - Pets
 *     summary: Buscar pet por ID
 *     description: Retorna os dados de um pet específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet.
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Pet encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Pet não encontrado.
 */
router.get(
  '/:id',
  petController.buscarPorId
)

/**
 * @openapi
 * /pets/{id}:
 *   put:
 *     tags:
 *       - Pets
 *     summary: Atualizar um pet
 *     description: Atualiza os dados de um pet existente. É necessário estar autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet.
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
 *                 example: Max
 *               especie:
 *                 type: string
 *                 example: Cachorro
 *               raca:
 *                 type: string
 *                 example: Chow Chow
 *               dataNascimento:
 *                 type: string
 *                 format: date-time
 *                 example: 2022-05-10T00:00:00.000Z
 *               clienteId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Data de nascimento inválida.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Pet ou cliente não encontrado.
 */
router.put(
  '/:id',
  petController.atualizar
)


/**
 * @openapi
 * /pets/{id}:
 *   delete:
 *     tags:
 *       - Pets
 *     summary: Excluir um pet
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
 *         description: Pet excluído com sucesso.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Pet não encontrado.
 *       409:
 *         description: O pet possui consultas cadastradas.
 */
router.delete(
  '/:id',
  petController.excluir
)

export default router