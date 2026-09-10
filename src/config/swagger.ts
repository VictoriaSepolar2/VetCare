import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'VetCare API',
      version: '1.0.0',
      description:
        'API RESTful do sistema de gerenciamento veterinário VetCare.',
    },

    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Ambiente de desenvolvimento',
      },
    ],

    tags: [
      {
        name: 'Autenticação',
        description: 'Login do sistema',
      },
      {
        name: 'Usuários',
        description: 'Cadastro e consulta de usuários',
      },
      {
        name: 'Clientes',
        description: 'Cadastro e consulta de clientes',
      },
      {
        name: 'Pets',
        description: 'Cadastro e gerenciamento de pets',
      },
      {
        name: 'Veterinários',
        description: 'Cadastro e gerenciamento de veterinários',
      },
      {
        name: 'Consultas',
        description: 'Agendamento e gerenciamento de consultas',
      },
      {
        name: 'Prontuários',
        description: 'Cadastro e gerenciamento de prontuários',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Cole aqui o token JWT obtido através do login.',
        },
      },

      schemas: {
        RespostaErro: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              example: 'Mensagem explicando o que deu errado.',
            },
          },
        },

        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nome: {
              type: 'string',
              example: 'Maria Silva',
            },
            usuario: {
              type: 'string',
              example: 'maria',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'maria@email.com',
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        Cliente: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nome: {
              type: 'string',
              example: 'João Silva',
            },
            cpf: {
              type: 'string',
              example: '12345678900',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            telefone: {
              type: 'string',
              example: '24999999999',
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        Pet: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            clienteId: {
              type: 'integer',
              example: 1,
            },
            nome: {
              type: 'string',
              example: 'Max',
            },
            especie: {
              type: 'string',
              example: 'Cachorro',
            },
            raca: {
              type: 'string',
              example: 'Chow Chow',
            },
            dataNascimento: {
              type: 'string',
              format: 'date-time',
              example: '2022-05-10T00:00:00.000Z',
            },
          },
        },

        Veterinario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            nome: {
              type: 'string',
              example: 'Dra. Ana Souza',
            },
            crmv: {
              type: 'string',
              example: '12345',
            },
            especialidade: {
              type: 'string',
              example: 'Clínica Geral',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'ana@vetcare.com',
            },
          },
        },

        Consulta: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            petId: {
              type: 'integer',
              example: 1,
            },
            veterinarioId: {
              type: 'integer',
              example: 1,
            },
            dataConsulta: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-15T14:00:00.000Z',
            },
            statusConsulta: {
              type: 'string',
              example: 'Agendada',
            },
          },
        },

        Prontuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            consultaId: {
              type: 'integer',
              example: 1,
            },
            diagnostico: {
              type: 'string',
              example: 'Infecção de ouvido',
            },
            medicamentosPrescritos: {
              type: 'string',
              example: 'Medicamento conforme prescrição veterinária',
            },
            dataRetorno: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
});