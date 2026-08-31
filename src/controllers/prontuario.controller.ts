import { Request, Response } from 'express';
import * as prontuarioService from '../services/prontuario.service';

export async function criar(req: Request, res: Response): Promise<void> {
  const { consultaId, diagnostico, medicamentos, dataRetorno } = req.body;

  const prontuarioCriado = await prontuarioService.criarProntuario({
    consultaId,
    diagnostico,
    medicamentos,
    dataRetorno,
  });

  res.status(201).json(prontuarioCriado);
}

export async function listar(
  _req: Request,
  res: Response
): Promise<void> {
  const prontuarios = await prontuarioService.listarProntuarios();

  res.status(200).json(prontuarios);
}

export async function buscarPorId(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const prontuario = await prontuarioService.buscarProntuarioPorId(id);

  res.status(200).json(prontuario);
}

export async function atualizar(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const prontuarioAtualizado =
    await prontuarioService.atualizarProntuario(id, req.body);

  res.status(200).json(prontuarioAtualizado);
}