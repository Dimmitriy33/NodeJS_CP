import swaggerAutogen from 'swagger-autogen';

const autoSwagger = swaggerAutogen();
const outputFile = './swagger.json';
const endpointsFiles = ['./src/routes.ts'];

autoSwagger(outputFile, endpointsFiles);
