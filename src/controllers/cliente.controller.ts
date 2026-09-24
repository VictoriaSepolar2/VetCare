import { Request, Response } from 'express';
import * as clienteService from '../services/cliente.service';

export async function criar(req: Request, res: Response): Promise<void> {
  const { nome, cpf, email, telefone } = req.body;

  const clienteCriado = await clienteService.criarCliente({
    nome,
    cpf,
    email,
    telefone,
    criadoPorId: req.user!.id,
  });

  res.status(201).json(clienteCriado);
}

export async function listar(_req: Request, res: Response): Promise<void> {
  const clientes = await clienteService.listarClientes();

  res.status(200).json(clientes);
}

export async function buscarPorId(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const cliente = await clienteService.buscarClientePorId(id);

  res.status(200).json(cliente);
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const cliente = await clienteService.atualizarCliente(id, req.body);
  res.status(200).json(cliente);
}

export async function excluir(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const resultado = await clienteService.excluirCliente(id);

  res.status(200).json(resultado);
}
