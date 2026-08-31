import { Request, Response } from 'express';
import * as consultaService from '../services/consulta.service';

export async function criar(req: Request, res: Response): Promise<void> {
  const { petId, veterinarioId, dataHora, status } = req.body;

  const consultaCriada = await consultaService.criarConsulta({
    petId,
    veterinarioId,
    dataHora,
    status,
  });

  res.status(201).json(consultaCriada);
}

export async function listar(
  _req: Request,
  res: Response
): Promise<void> {
  const consultas = await consultaService.listarConsultas();

  res.status(200).json(consultas);
}

export async function buscarPorId(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const consulta = await consultaService.buscarConsultaPorId(id);

  res.status(200).json(consulta);
}

export async function atualizarStatus(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);
  const { status } = req.body;

  const consulta = await consultaService.atualizarStatusConsulta(
    id,
    status
  );

  res.status(200).json(consulta);
}

export async function cancelar(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const consulta = await consultaService.atualizarStatusConsulta(
    id,
    'Cancelada'
  );

  res.status(200).json(consulta);
}