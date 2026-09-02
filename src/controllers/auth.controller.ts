import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function login(
  req: Request,
  res: Response,
): Promise<Response> {
  const { usuario, senha } = req.body;

  const resultado = await authService.login({
    usuario,
    senha,
  });

  return res.status(200).json(resultado);
}