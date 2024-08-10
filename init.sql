-- DO $$
-- BEGIN
--     -- Verificar se o banco de dados "dbdev" existe
--     IF NOT EXISTS (
--         SELECT FROM pg_database WHERE datname = 'test'
--     ) THEN
--         -- Criar o banco de dados "dbdev" se não existir
--         PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE test');
--     END IF;
-- END $$;

DO $$
BEGIN
    -- Verificar se o banco de dados "dbdev" existe
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'dbdev'
    ) THEN
        -- Criar o banco de dados "dbdev" se não existir
        PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE dbdev');
    END IF;
END $$;

-- Conectar ao banco de dados "dbdev"
\c dbdev;

DO $$
BEGIN
    -- Verificar se a tabela "users" existe
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'users'
    ) THEN
        -- Criar a tabela "users" se não existir
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL
        );
        
        -- Inserir um usuário administrador
        INSERT INTO users (username, email, password)
        VALUES ('admin', 'admin@example.com', 'admin123');
    END IF;
END $$;
