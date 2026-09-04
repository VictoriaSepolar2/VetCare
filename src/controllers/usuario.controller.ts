import { Request, Response } from 'express';

import * as usuarioService
  from '../services/usuario.service';

export async function criar(
  req: Request,
  res: Response
): Promise<Response> {

  const {
    usuario,
    senha,
    tipo,
    permissoes,
  } = req.body;

  const usuarioCriado =
    await usuarioService.criarUsuario({
      usuario,
      senha,
      tipo,
      permissoes,
    });

  return res.status(201).json(
    usuarioCriado
  );
}

export async function listar(
  req: Request,
  res: Response
): Promise<Response> {

  const usuarios =
    await usuarioService.listarUsuarios();

  return res.status(200).json(
    usuarios
  );
}