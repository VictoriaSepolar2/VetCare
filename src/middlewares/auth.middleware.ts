import {
  Request,
  Response,
  NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

import { prisma } from '../config/prisma';
import { AppError } from './error.middleware';

interface TokenPayload {
  id: number;
  usuario: string;
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      'Token não fornecido.',
      401
    );
  }

  const partes =
    authHeader.split(' ');

  if (
    partes.length !== 2 ||
    partes[0] !== 'Bearer'
  ) {
    throw new AppError(
      'Token mal formatado. Utilize o formato: Bearer <token>.',
      401
    );
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id: payload.id,
        },
      });

    if (!usuario) {
      throw new AppError(
        'Usuário não encontrado.',
        401
      );
    }

    req.user = {
      id: usuario.id,
      usuario: usuario.usuario,
    };

    next();
  } catch (erro) {
    if (erro instanceof AppError) {
      throw erro;
    }

    throw new AppError(
      'Token inválido ou expirado.',
      401
    );
  }
}