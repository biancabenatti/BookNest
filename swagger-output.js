export default {
  openapi: "3.0.0",
  info: {
    title: "API de Livros + Autenticação",
    version: "1.0.0",
    description: "API com autenticação JWT e manipulação de livros."
  },
  servers: [
    {
      url: "https://booknest-s381.onrender.com/api",
      description: "Servidor Local"
    }
  ],
  tags: [
    {
      name: "Autenticação",
      description: "Rotas para registro e login de usuários"
    },
    {
      name: "Livros",
      description: "Rotas para manipulação de livros"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Insira seu token JWT Bearer no formato \"Bearer TOKEN\""
      }
    },
    schemas: {
      UserRegister: {
        type: "object",
        required: [
          "name",
          "email",
          "password"
        ],
        properties: {
          name: {
            type: "string",
            example: "João Silva"
          },
          email: {
            type: "string",
            format: "email",
            example: "joao@example.com"
          },
          password: {
            type: "string",
            format: "password",
            example: "minhasenha123"
          }
        }
      },
      UserLogin: {
        type: "object",
        required: [
          "email",
          "password"
        ],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "joao@example.com"
          },
          password: {
            type: "string",
            format: "password",
            example: "minhasenha123"
          }
        }
      },
      LivroCreate: {
        type: "object",
        required: [
          "titulo",
          "autor"
        ],
        properties: {
          titulo: {
            type: "string",
            example: "O Senhor dos Anéis"
          },
          avaliacao: {
            type: "number",
            example: 5
          },
          autor: {
            type: "string",
            example: "J.R.R. Tolkien"
          },
          data_leitura: {
            type: "string",
            format: "date",
            example: "2023-01-15"
          },
          descricao: {
            type: "string",
            example: "Uma aventura épica..."
          },
          categoria: {
            type: "string",
            example: "Fantasia"
          }
        }
      },
      LivroUpdate: {
        type: "object",
        properties: {
          titulo: {
            type: "string",
            example: "O Senhor dos Anéis - Edição Especial"
          },
          avaliacao: {
            type: "number",
            example: 4
          },
          autor: {
            type: "string",
            example: "J.R.R. Tolkien"
          },
          data_leitura: {
            type: "string",
            format: "date",
            example: "2023-01-20"
          },
          descricao: {
            type: "string",
            example: "Uma aventura épica atualizada..."
          },
          categoria: {
            type: "string",
            example: "Fantasia Épica"
          }
        }
      }
    }
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Registrar um novo usuário",
        tags: ["Autenticação"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserRegister"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Created"
          },
          "400": {
            description: "Bad Request"
          },
          "409": {
            description: "Conflict"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Autenticar usuário e gerar token JWT",
        tags: ["Autenticação"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserLogin"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK"
          },
          "400": {
            description: "Bad Request"
          },
          "401": {
            description: "Unauthorized"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      }
    },
    "/livros": {
      get: {
        summary: "Listar livros (com filtros opcionais)",
        tags: ["Livros"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "categoria",
            in: "query",
            description: "Filtrar livros por categoria",
            required: false,
            schema: {
              type: "string"
            }
          },
          {
            name: "ordem",
            in: "query",
            description: "Ordenar livros (ex: 'titulo', '-data_leitura')",
            required: false,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "OK"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      },
      post: {
        summary: "Criar novo livro",
        tags: ["Livros"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LivroCreate"
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Created"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      }
    },
    "/livros/{id}": {
      get: {
        summary: "Buscar livro por ID",
        tags: ["Livros"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do livro a ser buscado",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "OK"
          },
          "400": {
            description: "Bad Request"
          },
          "404": {
            description: "Not Found"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      },
      put: {
        summary: "Atualizar livro por ID",
        tags: ["Livros"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do livro a ser atualizado",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LivroUpdate"
              }
            }
          }
        },
        responses: {
          "200": {
            description: "OK"
          },
          "400": {
            description: "Bad Request"
          },
          "404": {
            description: "Not Found"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      },
      delete: {
        summary: "Remover livro por ID",
        tags: ["Livros"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID do livro a ser removido",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "OK"
          },
          "400": {
            description: "Bad Request"
          },
          "404": {
            description: "Not Found"
          },
          "500": {
            description: "Internal Server Error"
          }
        }
      }
    }
  }
};