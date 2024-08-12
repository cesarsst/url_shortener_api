# Run project locally

## Requisitos

1. Node >=20.0.0 <21.0.0
2. NPM
3. PostgreSQL
4. Docker

### IMPORNTANTE: Para executar esse projeto você precisa configurar as variaveis de ambiente, um exemplo das variaveis utilizadas por ser encontrada no arquivo "exemple.env".

# Run project with docker-compose:

```
npm run docker
```

# Executar lint

```
npm run lint
```

# Verificar documentação:

Para acessar a documentação Swagger da aplicação, acesse:

```
http://localhost/doc/api
```

## # Iniciar o projeto manualmente

1. Crie o banco de dados {DB_NAME} e execute o script "init.sql" para criar a estrutura de tabelas.
   Você precisa ter instalado o postgreSQL e a ferramenta 'psql'.

```
psql -U postgres
CREATE DATABASE dbdev;
psql -h localhost -U {USER} -p {PORT} -d {DB_NAME} -f ./init.sql
```

Exemplo:
psql -h localhost -U postgres -p 5432 -d dbdev -f ./init.sql

2. Instale as depêndencias do projeto e execute a aplicação

```
npm install
npm run dev
```
