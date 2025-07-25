import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BTG OTP API',
      version: '1.0.0',
      description: 'API de Gerenciamento de OTP (One-Time Password)',
      contact: {
        name: 'BTG Desafio',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      schemas: {
        CreateOTPRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'ID do usuário (opcional)',
              example: 'user123',
            },
          },
        },
        CreateOTPResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'Token OTP gerado',
                  example: '123456',
                },
              },
            },
            message: {
              type: 'string',
              example: 'OTP criado com sucesso',
            },
          },
        },
        ValidateOTPRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: {
              type: 'string',
              description: 'Token OTP a ser validado (query parameter)',
              example: '123456',
            },
          },
        },
        ValidateOTPResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                isValid: {
                  type: 'boolean',
                  description: 'Se o token é válido',
                  example: true,
                },
                message: {
                  type: 'string',
                  description: 'Mensagem de validação',
                  example: 'Token válido',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erro interno do servidor',
            },
          },
        },
      },
    },
  },
  apis: ['./src/infrastructure/routes/*.ts', './src/infrastructure/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options); 