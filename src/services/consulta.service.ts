import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

interface CriarConsultaInput {
  petId: number;
  veterinarioId: number;
  data: string;
  horario: string;
}

export async function criarConsulta(dados: CriarConsultaInput) {
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

  const consulta = await prisma.consulta.create({
    data: {
      petId: dados.petId,
      veterinarioId: dados.veterinarioId,
      data: new Date(dados.data),
      horario: dados.horario,
      status: 'Agendada',
    },
    include: {
      pet: true,
      veterinario: true,
    },
  });

  return consulta;
}

export async function listarConsultas() {
  return prisma.consulta.findMany({
    include: {
      pet: true,
      veterinario: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
}

export async function buscarConsultaPorId(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id },
    include: {
      pet: true,
      veterinario: true,
    },
  });

  if (!consulta) {
    throw new AppError('Consulta não encontrada.', 404);
  }

  return consulta;
}

export async function concluirConsulta(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id },
  });

  if (!consulta) {
    throw new AppError('Consulta não encontrada.', 404);
  }

  if (consulta.status !== 'Agendada') {
    throw new AppError(
      'Somente consultas agendadas podem ser concluídas.',
      400,
    );
  }

  return prisma.consulta.update({
    where: { id },
    data: {
      status: 'Concluida',
    },
    include: {
      pet: true,
      veterinario: true,
    },
  });
}

export async function cancelarConsulta(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id },
  });

  if (!consulta) {
    throw new AppError('Consulta não encontrada.', 404);
  }

  if (consulta.status !== 'Agendada') {
    throw new AppError(
      'Somente consultas agendadas podem ser canceladas.',
      400,
    );
  }

  return prisma.consulta.update({
    where: { id },
    data: {
      status: 'Cancelada',
    },
    include: {
      pet: true,
      veterinario: true,
    },
  });
}