import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Livros + Autenticação',
    version: '1.0.0',
    description: 'API com autenticação JWT e manipulação de livros.',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: 'https://booknest-s381.onrender.com/api',
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: ['./api/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;



