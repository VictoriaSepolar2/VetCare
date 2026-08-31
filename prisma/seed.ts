import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma';

async function main() {
  console.log('Iniciando o seed da base de dados da VetCare...');

  const senhaHash = await bcrypt.hash('123456', 10);

  const cliente = await prisma.cliente.create({
    data: {
      nome: 'Cliente Teste',
      cpf: '12345678900',
      email: 'cliente@teste.com',
      telefone: '11999999999',
    },
  });

  const pet = await prisma.pet.create({
    data: {
      clienteId: cliente.id,
      nome: 'Max',
      especie: 'Cão',
      raca: 'Chow Chow',
      dataNascimento: new Date('10-05-2022'),
    },
  });

  const veterinario = await prisma.veterinario.create({
    data: {
      nome: 'Dr. João Silva',
      crmv: '12345',
      especialidade: 'Clínico Geral',
      email: 'joao@vetcare.com',
    },
  });

  const consulta = await prisma.consulta.create({
    data: {
      petId: pet.id,
      veterinarioId: veterinario.id,
      dataConsulta: new Date('10-09-2026T14:00:00'),
      statusConsulta: 'Agendada',
    },
  });

  await prisma.prontuario.create({
    data: {
      consultaId: consulta.id,
      diagnostico: 'Animal saudável.',
      medicamentosPrescritos: 'Nenhum medicamento prescrito.',
      dataRetorno: new Date('10-10-2026'),
    },
  });

  await prisma.usuario.create({
    data: {
      usuario: 'admin',
      senha: senhaHash,
      tipo: 'Administrador',
    },
  });

  console.log('----------------------------------------------------');
  console.log('Seed concluído com sucesso!');
  console.log('- 1 cliente criado');
  console.log('- 1 pet criado');
  console.log('- 1 veterinário criado');
  console.log('- 1 consulta criada');
  console.log('- 1 prontuário criado');
  console.log('- 1 usuário criado');
  console.log('----------------------------------------------------');
}

main()
  .catch((erro) => {
    console.error('Erro ao executar o seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });