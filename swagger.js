import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API de Livros + Autenticação',
    description: 'API com autenticação JWT e manipulação de livros.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./api/routes/*.js']; 

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger JSON gerado com sucesso!');
});


