import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarUsuarioInput {
  nome: string;
  usuario: string;
  email: string;
  senha: string;
}

export async function criarUsuario(
  dados: CriarUsuarioInput
) {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      usuario: dados.usuario,
    },
  });

  if (usuarioExistente) {
    throw new AppError(
      'Este nome de usuário já está cadastrado.',
      400
    );
  }

  const emailExistente = await prisma.usuario.findUnique({
    where: {
      email: dados.email,
    },
  });

  if (emailExistente) {
    throw new AppError(
      'Este e-mail já está cadastrado.',
      400
    );
  }

  const senhaHash = await bcrypt.hash(
    dados.senha,
    10
  );

  const usuario = await prisma.usuario.create({
    data: {
      nome: dados.nome,
      usuario: dados.usuario,
      email: dados.email,
      senha: senhaHash,
    },
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    usuario: usuario.usuario,
    email: usuario.email,
    criadoEm: usuario.criadoEm,
  };
}

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      usuario: true,
      email: true,
      criadoEm: true,
    },
  });
}