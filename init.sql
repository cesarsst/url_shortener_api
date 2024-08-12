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
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    END IF;
END $$;

DO $$
BEGIN
    -- Verificar se a tabela "urls" existe
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'urls'
    ) THEN
        -- Criar a tabela "urls" se não existir
        CREATE TABLE urls (
            id VARCHAR(6) PRIMARY KEY,
            owner INTEGER REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL,
            url_target TEXT NOT NULL,
            access_counter INTEGER DEFAULT 0,
            last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            exclude_date TIMESTAMP DEFAULT NULL
        );
    END IF;
END $$;