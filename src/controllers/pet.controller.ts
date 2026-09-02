import { Request, Response } from 'express';
import * as petService from '../services/pet.service';

export async function criar(req: Request, res: Response): Promise<void> {
  const { nome, especie, raca, dataNascimento, clienteId } = req.body;

  const petCriado = await petService.criarPet({
    nome,
    especie,
    raca,
    dataNascimento,
    clienteId,
  });

  res.status(201).json(petCriado);
}

export async function listar(_req: Request, res: Response): Promise<void> {
  const pets = await petService.listarPets();

  res.status(200).json(pets);
}

export async function buscarPorId(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const pet = await petService.buscarPetPorId(id);

  res.status(200).json(pet);
}

export async function atualizar(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  const petAtualizado = await petService.atualizarPet(
    id,
    req.body
  );

  res.status(200).json(petAtualizado);
}