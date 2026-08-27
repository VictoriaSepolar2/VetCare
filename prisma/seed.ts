import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma';

async function main() {
  console.log('Iniciando o seed da base de dados do DriveRent...');
const popular = await prisma.categoriaVeiculo.create({
    data: {
      nomeCategoria: 'Popular',
      valorDiaria: 120,
      valorCaucao: 500,
    },
  });

  const sedan = await prisma.categoriaVeiculo.create({
    data: {
      nomeCategoria: 'Sedan',
      valorDiaria: 180,
      valorCaucao: 800,
    },
  });

  const suv = await prisma.categoriaVeiculo.create({
    data: {
      nomeCategoria: 'SUV',
      valorDiaria: 250,
      valorCaucao: 1200,
    },
  });
}

  console.log('Categorias criadas: Popular, Sedan, SUV.');
await prisma.veiculo.createMany({
    data: [
      {
        categoriaId: popular.id,
        placa: 'ABC1D23',
        modelo: 'Fiat Mobi',
        ano: 2022,
        statusDisponibilidade: 'Disponivel',
      },
      {
        categoriaId: popular.id,
        placa: 'ABC2D34',
        modelo: 'Chevrolet Onix',
        ano: 2023,
        statusDisponibilidade: 'Disponivel',
      },
      {
        categoriaId: sedan.id,
        placa: 'DEF3E45',
        modelo: 'Toyota Corolla',
        ano: 2023,
        statusDisponibilidade: 'Disponivel',
      },
      {
        categoriaId: sedan.id,
        placa: 'DEF4E56',
        modelo: 'Honda Civic',
        ano: 2022,
        statusDisponibilidade: 'Manutencao',
      },
      {
        categoriaId: suv.id,
        placa: 'GHI5F67',
        modelo: 'Jeep Compass',
        ano: 2023,
        statusDisponibilidade: 'Disponivel',
      },
    ],
  });

  console.log('5 veículos criados (4 disponíveis, 1 em manutenção).');
   const senhaHash = await bcrypt.hash('123456', 10);

   await prisma.cliente.create({
    data: {
      nome: 'Cliente Teste',
      cpf: '12345678900',
      email: 'cliente@teste.com',
      senha: senhaHash,
      telefone: '11999999999',
    },
  });
{
  console.log('Cliente de teste criado (email: cliente@teste.com, senha: 123456).');

  console.log('----------------------------------------------------');
  console.log('Seed concluído com sucesso! Resumo do que foi criado:');
  console.log('- 3 categorias de veículo: Popular, Sedan, SUV');
  console.log('- 5 veículos (placas ABC1D23, ABC2D34, DEF3E45, DEF4E56, GHI5F67)');
  console.log('- 1 cliente de teste (cliente@teste.com / senha: 123456)');
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