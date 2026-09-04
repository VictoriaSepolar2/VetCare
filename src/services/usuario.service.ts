import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

interface CriarUsuarioInput {
  usuario: string;
  senha: string;
  tipo: string;
  permissoes?: string[];
}

export async function criarUsuario(
  dados: CriarUsuarioInput
) {
  const usuarioExistente =
    await prisma.usuario.findUnique({
      where: {
        usuario: dados.usuario,
      },
    });

  if (usuarioExistente) {
    throw new AppError(
      'Este usuário já existe.',
      400
    );
  }

  const tiposAdministradores = [
    'ADMIN_PRINCIPAL',
    'ADMIN',
  ];

  if (
    tiposAdministradores.includes(dados.tipo)
  ) {
    const quantidadeAdmins =
      await prisma.usuario.count({
        where: {
          tipo: {
            in: tiposAdministradores,
          },
        },
      });

    if (quantidadeAdmins >= 5) {
      throw new AppError(
        'O VetCare já atingiu o limite de 5 administradores.',
        400
      );
    }
  }

  if (dados.tipo === 'ADMIN_PRINCIPAL') {
    throw new AppError(
      'Não é permitido criar outro Administrador Principal.',
      403
    );
  }

  const senhaHash = await bcrypt.hash(
    dados.senha,
    10
  );

  const usuario = await prisma.usuario.create({
    data: {
      usuario: dados.usuario,
      senha: senhaHash,
      tipo: dados.tipo,
      permissoes: {
        create: (dados.permissoes || []).map(
          (permissao) => ({
            permissao,
          })
        ),
      },
    },
    include: {
      permissoes: true,
    },
  });

  return {
    id: usuario.id,
    usuario: usuario.usuario,
    tipo: usuario.tipo,
    permissoes: usuario.permissoes.map(
      (item) => item.permissao
    ),
  };
}

export async function listarUsuarios() {
  const usuarios =
    await prisma.usuario.findMany({
      select: {
        id: true,
        usuario: true,
        tipo: true,
        criadoEm: true,
        permissoes: {
          select: {
            permissao: true,
          },
        },
      },
    });

  return usuarios.map((usuario) => ({
    id: usuario.id,
    usuario: usuario.usuario,
    tipo: usuario.tipo,
    criadoEm: usuario.criadoEm,
    permissoes: usuario.permissoes.map(
      (item) => item.permissao
    ),
  }));
}