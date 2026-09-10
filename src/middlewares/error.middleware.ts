import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export class AppError extends Error {
  public readonly statusCode: number

  constructor(
    message: string,
    statusCode: number = 400
  ) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      erro: err.message,
    })
    return
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    if (err.code === 'P2002') {
      res.status(409).json({
        erro:
          'Já existe um registro com um valor único em conflito',
      })
      return
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        erro: 'Registro não encontrado',
      })
      return
    }
  }

  console.error(err)

  res.status(500).json({
    erro: 'Erro interno do servidor.',
  })
}
