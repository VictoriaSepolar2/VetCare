import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface LoginInput {
  email: string;
  senha: string;
}

export async function login(dados: LoginInput) {
  // 1) Buscamos o cliente pelo e-mail informado. Se "cliente" for "null",
  // significa que não existe nenhum Cliente cadastrado com esse e-mail.
  const cliente = await prisma.cliente.findUnique({
    where: { email: dados.email },
  });

  const senhaConfere = await bcrypt.compare(
    dados.senha,
    cliente?.senha ?? ''
  );

  if (!cliente || !senhaConfere) {
    throw new AppError('E-mail ou senha inválidos.', 401);
  }
const token = jwt.sign(
    { id: cliente.id, email: cliente.email },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'] }
  );
return {
    token,
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
    },
  };
}

