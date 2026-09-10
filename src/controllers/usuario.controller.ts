import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';

export async function criar(
  req: Request,
  res: Response
): Promise<Response> {
  const {
    nome,
    usuario,
    email,
    senha,
  } = req.body;

  const usuarioCriado =
    await usuarioService.criarUsuario({
      nome,
      usuario,
      email,
      senha,
    });

  return res.status(201).json(usuarioCriado);
}

export async function listar(
  _req: Request,
  res: Response
): Promise<Response> {

  const usuarios =
    await usuarioService.listarUsuarios();

  return res.status(200).json(usuarios);
}