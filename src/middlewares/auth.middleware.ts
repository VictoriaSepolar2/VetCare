import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

interface TokenPayload {
  id: number;
  usuario: string;
  tipo: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido.', 401);
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
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

    req.user = {
      id: payload.id,
      usuario: payload.usuario,
      tipo: payload.tipo,
    };

    next();
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}