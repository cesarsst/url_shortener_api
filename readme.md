# Run project locally

## # Init PostgreSQL

1. Crie o banco de dados com o nome "dbdev" e execute o script "init.sql" para adicionar as tabelas e dados iniciais do projeto.
   Você precisa ter instalado o postgreSQL e a ferramenta 'psql'.

- IMPORTANTE: Altere o nome do banco de dados no script './init.sql' para o banco de dados de desenvolvimento para criar automáticamente a estrutura de tabelas.

```
psql -h localhost -U {USER} -d {DB_NAME} -f ./init.sql
```

s 2. Instale as depêndencias do projeto e execute a aplicação

```
npm install
npm run dev
```

# Run project with docker-compose:

```
npm run dev:docker
```
