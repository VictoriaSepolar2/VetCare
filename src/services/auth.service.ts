import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";

interface LoginInput {
  usuario: string;
  senha: string;
}

export async function login(dados: LoginInput) {
  const usuario = await prisma.usuario.findUnique({
    where: { usuario: dados.usuario },
  });

  if (!usuario) {
    throw new AppError("Usuário ou senha inválidos.", 401);
  }

  const senhaConfere = await bcrypt.compare(
    dados.senha,
    usuario.senha
  );

  if (!senhaConfere) {
    throw new AppError("Usuário ou senha inválidos.", 401);
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      usuario: usuario.usuario,
      tipo: usuario.tipo,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"],
    }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      usuario: usuario.usuario,
      tipo: usuario.tipo,
    },
  };
}

export async function criarPrimeiroAdmin(dados: {
  usuario: string;
  senha: string;
}) {
  const quantidadeUsuarios = await prisma.usuario.count();

  if (quantidadeUsuarios > 0) {
    throw new AppError(
      'O primeiro Administrador Principal já foi cadastrado.',
      403
    );
  }

  const senhaHash = await bcrypt.hash(
    dados.senha,
    10
  );

  const usuario = await prisma.usuario.create({
    data: {
      usuario: dados.usuario,
      senha: senhaHash,
      tipo: 'ADMIN_PRINCIPAL',
    },
  });

  return {
    id: usuario.id,
    usuario: usuario.usuario,
    tipo: usuario.tipo,
  };
}