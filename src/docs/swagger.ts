import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

// Configurações do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Shorten URL API",
      version: "1.0.0",
      description: "Documentation for the URL Shortener API",
    },
    servers: [
      {
        url: "http://localhost:80", // URL base do seu servidor
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.ts")], // Caminho para os arquivos de rotas (usando extensão .ts)
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
