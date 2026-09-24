import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";

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
    throw new AppError("Pet não encontrado.", 404);
  }

  const veterinario = await prisma.veterinario.findUnique({
    where: { id: dados.veterinarioId },
  });

  if (!veterinario) {
    throw new AppError("Veterinário não encontrado.", 404);
  }

  const dataHora = new Date(`${dados.data}T${dados.horario}`);

  const consulta = await prisma.consulta.create({
    data: {
      petId: dados.petId,
      veterinarioId: dados.veterinarioId,
      dataConsulta: dataHora,
      statusConsulta: "Agendada",
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
      id: "desc",
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
    throw new AppError("Consulta não encontrada.", 404);
  }

  return consulta;
}

export async function atualizarConsulta(
  id: number,
  dados: { petId?: number; veterinarioId?: number; data?: string; horario?: string }
) {
  const atual = await buscarConsultaPorId(id);
  if (dados.petId !== undefined) {
    const pet = await prisma.pet.findUnique({ where: { id: dados.petId } });
    if (!pet) throw new AppError('Pet não encontrado.', 404);
  }
  if (dados.veterinarioId !== undefined) {
    const vet = await prisma.veterinario.findUnique({ where: { id: dados.veterinarioId } });
    if (!vet) throw new AppError('Veterinário não encontrado.', 404);
  }
  let dataConsulta: Date | undefined;
  if (dados.data || dados.horario) {
    const base = new Date(atual.dataConsulta);
    const data = dados.data || base.toISOString().slice(0,10);
    const horario = dados.horario || base.toTimeString().slice(0,5);
    dataConsulta = new Date(`${data}T${horario}`);
    if (Number.isNaN(dataConsulta.getTime())) throw new AppError('Data ou horário inválido.', 400);
  }
  return prisma.consulta.update({
    where: { id },
    data: { petId: dados.petId, veterinarioId: dados.veterinarioId, dataConsulta },
    include: { pet: true, veterinario: true },
  });
}

export async function concluirConsulta(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id },
  });

  if (!consulta) {
    throw new AppError("Consulta não encontrada.", 404);
  }

  if (consulta.statusConsulta !== "Agendada") {
    throw new AppError(
      "Somente consultas agendadas podem ser concluídas.",
      400,
    );
  }

  return prisma.consulta.update({
    where: { id },
    data: {
      statusConsulta: "Concluida",
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
    throw new AppError("Consulta não encontrada.", 404);
  }

  if (consulta.statusConsulta !== "Agendada") {
    throw new AppError(
      "Somente consultas agendadas podem ser canceladas.",
      400,
    );
  }

  return prisma.consulta.update({
    where: { id },
    data: {
      statusConsulta: "Cancelada",
    },
    include: {
      pet: true,
      veterinario: true,
    },
  });
}


export async function excluirConsulta(id: number) {
  const consulta = await prisma.consulta.findUnique({
    where: { id },
    include: { prontuario: true },
  });

  if (!consulta) {
    throw new AppError("Consulta não encontrada.", 404);
  }

  if (consulta.prontuario) {
    throw new AppError(
      "Esta consulta possui prontuário. Exclua o prontuário primeiro.",
      409,
    );
  }

  await prisma.consulta.delete({
    where: { id },
  });

  return {
    mensagem: "Consulta excluída com sucesso.",
  };
}
