import { Request, Response, NextFunction } from 'express';

import { AppError } from './error.middleware';

export function somenteComPermissao(
  permissao: string
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {

    // O Administrador Principal pode acessar tudo
    if (req.user?.tipo === 'ADMIN_PRINCIPAL') {
      next();
      return;
    }

    // Verifica se o usuário possui a permissão
    const possuiPermissao =
      req.user?.permissoes.includes(permissao);

    if (!possuiPermissao) {
      throw new AppError(
        `Você não possui permissão para acessar ${permissao}.`,
        403
      );
    }

    next();
  };
}