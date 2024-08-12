# Live Demo:
https://urlshortenerapi-production-b995.up.railway.app/

# About the Project

This project is a Node.js + Express server that provides a URL shortening service.
Any user, whether logged in or not, can request a shortened URL.
Registered users can add, update, or delete shortened URLs.
All accessed shortened URLs are tracked to measure how many times they have been accessed.

## Run the Project Locally

### Requirements

1. Node (>=20.0.0 <21.0.0) ([Download](https://nodejs.org/en/download/package-manager/current))
2. NPM
3. PostgreSQL ([Download](https://www.postgresql.org/download/))
4. Docker ([Download](https://www.docker.com/))

# Run the Project with Docker Compose (recommended):

```bash
git clone https://github.com/cesarsst/url_shortener_api.git
npm run docker
```

# Run lint

```bash
npm run lint
```

# Run tests

```bash
npm run test
```

## Manually Start the Project

### IMPORTANT: To run this project, you need to configure environment variables. An example of the variables used can be found in the file `example.env`.

```env
NODE_ENV=dev
PORT=80
SECRET_KEY=your_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_USER=<YOUR_POSTGRES_USER>
DB_PASSWORD=<YOUR_POSTGRES_PASSWORD>
DB_NAME=<YOUR_DB>
DB_NAME_TEST=test
BASE_URL=http://localhost
SENTRY_DSN=<YOUR_SENTRY_DNS>
```

1. Clone the repository:

```bash
git clone https://github.com/cesarsst/url_shortener_api.git
```

2. Start PostgreSQL, create the database {DB_NAME} and the "test" database.

```bash
psql -U postgres
CREATE DATABASE {DB_NAME};
CREATE DATABASE test;
```

3. Run the init.sql script to create the table structure.
   You need to have PostgreSQL installed and the psql tool available.

```bash
psql -h localhost -U {USER} -p {PORT} -d {DB_NAME} -f ./init.sql
```

Exemple:

```bash
psql -h localhost -U postgres -p 5432 -d dbdev -f ./init.sql
```

4. Install the project dependencies and run the application:

```bash
npm install
npm run dev
```

# View Documentation

To access the Swagger documentation of the application, start the application and navigate to:

```url
http://localhost/doc/api
```

Obs: In the /src/doc folder you can find the InsomniaRequests.json file that can be imported into Insomnia to perform the application's requests.

## Suggestions for Horizontal Scalability

To enhance the horizontal scalability of the application, it is recommended to install a load balancer that can redirect and manage multiple instances and requests of the app. A good option for this is using Nginx.
