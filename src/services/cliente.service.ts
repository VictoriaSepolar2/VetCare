import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

const SELECT_CLIENTE_PUBLICO = {
  id: true,
  nome: true,
  cpf: true,
  email: true,
  telefone: true,
  criadoEm: true,
} as const;

interface CriarClienteInput {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
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
    throw new AppError('CPF ou e-mail já cadastrado.', 409);
  }

  const clienteCriado = await prisma.cliente.create({
    data: dados,
    select: SELECT_CLIENTE_PUBLICO,
  });

  return clienteCriado;
}