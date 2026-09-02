import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";

interface CriarProntuarioInput {
  consultaId: number;
  diagnostico: string;
  medicamentosPrescritos: string;
  dataRetorno?: string;
}

export async function criarProntuario(dados: CriarProntuarioInput) {
  const consulta = await prisma.consulta.findUnique({
    where: { id: dados.consultaId },
  });

  if (!consulta) {
    throw new AppError("Consulta não encontrada.", 404);
  }

  const prontuario = await prisma.prontuario.create({
    data: {
      consultaId: dados.consultaId,
      diagnostico: dados.diagnostico,
      medicamentosPrescritos: dados.medicamentosPrescritos,
      dataRetorno: dados.dataRetorno
        ? new Date(dados.dataRetorno)
        : null,
    },
    include: {
      consulta: {
        include: {
          pet: true,
          veterinario: true,
        },
      },
    },
  });

  return prontuario;
}

export async function listarProntuarios() {
  return prisma.prontuario.findMany({
    include: {
      consulta: {
        include: {
          pet: true,
          veterinario: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
}

export async function buscarProntuarioPorId(id: number) {
  const prontuario = await prisma.prontuario.findUnique({
    where: { id },
    include: {
      consulta: {
        include: {
          pet: true,
          veterinario: true,
        },
      },
    },
  });

  if (!prontuario) {
    throw new AppError("Prontuário não encontrado.", 404);
  }

  return prontuario;
}

export async function listarProntuariosDoPet(petId: number) {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
  });

  if (!pet) {
    throw new AppError("Pet não encontrado.", 404);
  }

  return prisma.prontuario.findMany({
    where: {
      consulta: {
        petId: petId,
      },
    },
    include: {
      consulta: {
        include: {
          pet: true,
          veterinario: true,
        },
      },
    },
    orderBy: {
      id: "desc",
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
    data: {
      diagnostico: dados.diagnostico,
      medicamentosPrescritos: dados.medicamentosPrescritos,
      dataRetorno: dados.dataRetorno
        ? new Date(dados.dataRetorno)
        : undefined,
    },
    include: {
      consulta: {
        include: {
          pet: true,
          veterinario: true,
        },
      },
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
    mensagem: "Prontuário excluído com sucesso.",
  };
}