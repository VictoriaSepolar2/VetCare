import { Request, Response, NextFunction } from 'express';

import { AppError } from './error.middleware';

export function somenteAdminPrincipal(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.tipo !== 'ADMIN_PRINCIPAL') {
    throw new AppError(
      'Acesso permitido somente ao Administrador Principal.',
      403
    );
  }

  next();
}

export function somenteAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    req.user?.tipo !== 'ADMIN_PRINCIPAL' &&
    req.user?.tipo !== 'ADMIN'
  ) {
    throw new AppError(
      'Acesso permitido somente para administradores.',
      403
    );
  }

  next();
}