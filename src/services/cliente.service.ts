import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

const SELECT_CLIENTE_PUBLICO ={
    id: true,
    nome: true,
    cpf: true,
    email:true,
    telefone: true,
    criadoEm: true,
} as const; 

interface CriarClienteInput{
     nome: string,
     cpf: string,
     email:string,
     senha:string,
     telefone:string,
}

export async function criarCliente(dados:CriarClienteInput){
    const senhaHash = await bcrypt.hash(dados.senha,10 )

    const clienteCriado= await prisma.cliente.create({
        data: {...dados, senha:senhaHash},
        select: SELECT_CLIENTE_PUBLICO
    })

    return clienteCriado
}