import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";

interface CriarVeterinarioInput {
  nome: string;
  crmv: string;
  especialidade: string;
  email: string;
}

interface AtualizarVeterinarioInput {
  nome?: string;
  crmv?: string;
  especialidade?: string;
  email?: string;
}

export async function criarVeterinario(dados: CriarVeterinarioInput) {
  const veterinarioExistente = await prisma.veterinario.findUnique({
    where: { crmv: dados.crmv },
  });

  if (veterinarioExistente) {
    throw new AppError(
      "Veterinário com este CRMV já está cadastrado.",
      400,
    );
  }

  const veterinario = await prisma.veterinario.create({
    data: dados,
  });

  return veterinario;
}

export async function listarVeterinarios() {
  return prisma.veterinario.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export async function buscarVeterinarioPorId(id: number) {
  const veterinario = await prisma.veterinario.findUnique({
    where: { id },
  });

  if (!veterinario) {
    throw new AppError("Veterinário não encontrado.", 404);
  }

  return veterinario;
}

export async function atualizarVeterinario(
  id: number,
  dados: AtualizarVeterinarioInput,
) {
  await buscarVeterinarioPorId(id);

  const veterinarioAtualizado = await prisma.veterinario.update({
    where: { id },
    data: dados,
  });

  return veterinarioAtualizado;
}

export async function excluirVeterinario(id: number) {
  await buscarVeterinarioPorId(id);

  await prisma.veterinario.delete({
    where: { id },
  });

  return {
    mensagem: "Veterinário excluído com sucesso.",
  };
}