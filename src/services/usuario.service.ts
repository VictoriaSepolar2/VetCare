import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarUsuarioInput {
  usuario: string;
  senha: string;
  tipo: string;
}

export async function criarUsuario(dados: CriarUsuarioInput) {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      usuario: dados.usuario,
    },
  });

  if (usuarioExistente) {
    throw new AppError('Este usuário já existe.', 400);
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      usuario: dados.usuario,
      senha: senhaHash,
      tipo: dados.tipo,
    },
  });

  return {
    id: usuario.id,
    usuario: usuario.usuario,
    tipo: usuario.tipo,
  };
}

export async function listarUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      usuario: true,
      tipo: true,
    },
  });

  return usuarios;
}