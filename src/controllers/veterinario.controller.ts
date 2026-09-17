import { Request, Response } from 'express';
import * as veterinarioService from '../services/veterinario.service';

export async function criar(
  req: Request,
  res: Response
): Promise<void> {
  const {
    nome,
    crmv,
    especialidade,
    email,
  } = req.body;

  const veterinarioCriado =
    await veterinarioService.criarVeterinario({
      nome,
      crmv,
      especialidade,
      email,
    });

  res.status(201).json(veterinarioCriado);
}

export async function listar(
  _req: Request,
  res: Response
): Promise<void> {
  const veterinarios =
    await veterinarioService.listarVeterinarios();

  res.status(200).json(veterinarios);
}

export async function buscarPorId(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const veterinario =
    await veterinarioService.buscarVeterinarioPorId(
      id
    );

  res.status(200).json(veterinario);
}

export async function atualizar(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const veterinarioAtualizado =
    await veterinarioService.atualizarVeterinario(
      id,
      req.body
    );

  res.status(200).json(veterinarioAtualizado);
}

export async function excluir(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const resultado =
    await veterinarioService.excluirVeterinario(
      id
    );

  res.status(200).json(resultado);
}