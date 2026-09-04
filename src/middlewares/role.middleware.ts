import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export function somenteAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.tipo !== 'ADMIN') {
    throw new AppError(
      'Acesso permitido somente para administradores.',
      403
    );
  }

  next();
}

export function somenteAdminOuFuncionario(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    req.user?.tipo !== 'ADMIN' &&
    req.user?.tipo !== 'FUNCIONARIO'
  ) {
    throw new AppError(
      'Usuário sem permissão para realizar esta ação.',
      403
    );
  }

  next();
}