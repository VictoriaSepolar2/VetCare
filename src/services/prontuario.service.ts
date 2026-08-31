import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarProntuarioInput {
  petId: number;
  veterinarioId: number;
  descricao: string;
  diagnostico?: string;
  tratamento?: string;
}

export async function criarProntuario(dados: CriarProntuarioInput) {
  const pet = await prisma.pet.findUnique({
    where: { id: dados.petId },
  });

  if (!pet) {
    throw new AppError('Pet não encontrado.', 404);
  }

  const veterinario = await prisma.veterinario.findUnique({
    where: { id: dados.veterinarioId },
  });

  if (!veterinario) {
    throw new AppError('Veterinário não encontrado.', 404);
  }

  const prontuario = await prisma.prontuario.create({
    data: dados,
    include: {
      pet: true,
      veterinario: true,
    },
  });

  return prontuario;
}

export async function listarProntuarios() {
  return prisma.prontuario.findMany({
    include: {
      pet: true,
      veterinario: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
}

export async function buscarProntuarioPorId(id: number) {
  const prontuario = await prisma.prontuario.findUnique({
    where: { id },
    include: {
      pet: true,
      veterinario: true,
    },
  });

  if (!prontuario) {
    throw new AppError('Prontuário não encontrado.', 404);
  }

  return prontuario;
}

export async function listarProntuariosDoPet(petId: number) {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
  });

  if (!pet) {
    throw new AppError('Pet não encontrado.', 404);
  }

  return prisma.prontuario.findMany({
    where: {
      petId,
    },
    include: {
      veterinario: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
}

export async function atualizarProntuario(
  id: number,
  dados: Partial<CriarProntuarioInput>,
) {
  await buscarProntuarioPorId(id);

  const prontuarioAtualizado = await prisma.prontuario.update({
    where: { id },
    data: dados,
    include: {
      pet: true,
      veterinario: true,
    },
  });

  return prontuarioAtualizado;
}

export async function excluirProntuario(id: number) {
  await buscarProntuarioPorId(id);

  await prisma.prontuario.delete({
    where: { id },
  });

  return {
    mensagem: 'Prontuário excluído com sucesso.',
  };
}