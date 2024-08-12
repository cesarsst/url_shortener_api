# Use a imagem oficial do Node.js como base
FROM node:20

# Defina o diretório de trabalho dentro do container
WORKDIR .

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código do projeto para o diretório de trabalho
COPY . .

# Compile o código TypeScript
RUN npm run build

# Dont use user root
USER node

# Exponha a porta que o aplicativo usará
EXPOSE 80

# Development mode
# CMD ["npm", "run", "dev"]

# Production mode
CMD ["npm", "run", "start"]
