import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";

const SELECT_CLIENTE_PUBLICO = {
  id: true,
  nome: true,
  cpf: true,
  email: true,
  telefone: true,
  criadoEm: true,
  criadoPorId: true,
  criadoPor: {
    select: {
      id: true,
      nome: true,
      usuario: true,
    },
  },
} as const;

interface CriarClienteInput {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  criadoPorId: number;
}

export async function criarCliente(dados: CriarClienteInput) {
  const clienteExistente = await prisma.cliente.findFirst({
    where: {
      OR: [
        { cpf: dados.cpf },
        { email: dados.email },
      ],
    },
  });

  if (clienteExistente) {
    throw new AppError("CPF ou e-mail já cadastrado.", 409);
  }

  const clienteCriado = await prisma.cliente.create({
    data: dados,
    select: SELECT_CLIENTE_PUBLICO,
  });

  return clienteCriado;
}

export async function listarClientes() {
  return prisma.cliente.findMany({
    select: SELECT_CLIENTE_PUBLICO,
    orderBy: {
      id: "asc",
    },
  });
}

export async function buscarClientePorId(id: number) {
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    select: SELECT_CLIENTE_PUBLICO,
  });

  if (!cliente) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  return cliente;
}

export async function atualizarCliente(
  id: number,
  dados: { nome?: string; cpf?: string; email?: string; telefone?: string }
) {
  const atual = await prisma.cliente.findUnique({ where: { id } });
  if (!atual) throw new AppError('Cliente não encontrado.', 404);
  return prisma.cliente.update({
    where: { id },
    data: dados,
    select: SELECT_CLIENTE_PUBLICO,
  });
}

export async function excluirCliente(id: number) {
  const cliente = await prisma.cliente.findUnique({
    where: { id },
    include: { pets: true },
  });

  if (!cliente) {
    throw new AppError("Cliente não encontrado.", 404);
  }

  if (cliente.pets.length > 0) {
    throw new AppError(
      "Este cliente possui pets cadastrados. Exclua os pets primeiro.",
      409,
    );
  }

  await prisma.cliente.delete({
    where: { id },
  });

  return {
    mensagem: "Cliente excluído com sucesso.",
  };
}
