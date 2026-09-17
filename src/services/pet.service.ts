import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarPetInput {
  nome: string;
  especie: string;
  raca: string;
  dataNascimento: string;
  clienteId: number;
}

export async function criarPet(dados: CriarPetInput) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: dados.clienteId },
  });

  if (!cliente) {
    throw new AppError('Cliente não encontrado.', 404);
  }

  const dataNascimento = new Date(dados.dataNascimento);

  if (Number.isNaN(dataNascimento.getTime())) {
    throw new AppError('Data de nascimento inválida.', 400);
  }

  const pet = await prisma.pet.create({
    data: {
      nome: dados.nome,
      especie: dados.especie,
      raca: dados.raca,
      dataNascimento,
      clienteId: dados.clienteId,
    },
    include: {
      cliente: true,
    },
  });

  return pet;
}

export async function listarPets() {
  return prisma.pet.findMany({
    include: {
      cliente: true,
    },
    orderBy: {
      id: 'desc',
    },
  });
}

export async function buscarPetPorId(id: number) {
  const pet = await prisma.pet.findUnique({
    where: { id },
    include: {
      cliente: true,
    },
  });

  if (!pet) {
    throw new AppError('Pet não encontrado.', 404);
  }

  return pet;
}

export async function atualizarPet(
  id: number,
  dados: Partial<CriarPetInput>,
) {
  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet) {
    throw new AppError('Pet não encontrado.', 404);
  }

  if (dados.clienteId !== undefined) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: dados.clienteId },
    });

    if (!cliente) {
      throw new AppError('Cliente não encontrado.', 404);
    }
  }

  let dataNascimento: Date | undefined;

  if (dados.dataNascimento !== undefined) {
    dataNascimento = new Date(dados.dataNascimento);

    if (Number.isNaN(dataNascimento.getTime())) {
      throw new AppError('Data de nascimento inválida.', 400);
    }
  }

  const petAtualizado = await prisma.pet.update({
    where: { id },
    data: {
      nome: dados.nome,
      especie: dados.especie,
      raca: dados.raca,
      dataNascimento,
      clienteId: dados.clienteId,
    },
    include: {
      cliente: true,
    },
  });

  return petAtualizado;
}

export async function excluirPet(id: number) {
  const pet = await prisma.pet.findUnique({
    where: { id },
    include: { consultas: true },
  });

  if (!pet) {
    throw new AppError('Pet não encontrado.', 404);
  }

  if (pet.consultas.length > 0) {
    throw new AppError(
      'Este pet possui consultas cadastradas. Exclua as consultas primeiro.',
      409,
    );
  }

  await prisma.pet.delete({
    where: { id },
  });

  return {
    mensagem: 'Pet excluído com sucesso.',
  };
}