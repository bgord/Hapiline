# hapiline

## Setup

**Create `.env` file**

Copy `.env.example` to `.env`.

```bash
$ cp .env.example .env
```

Fill missing values for the following keys: `APP_KEY` and `DB_PASSWORD`.

**Create `.env-docker` file**

Copy `.env-docker.example` to `.env-docker`.

```bash
$ cp .env-docker.example .env-docker
```

Supposing your `.env` file is already created, paste:

- value of `DB_DATABASE`, and, after a comma, `DB_DATABASE` with **\_test** suffix to `POSTGRES_MULTIPLE_DATABASES` in `.env-docker` (e.g POSTGRES_MULTIPLE_DATABASES=app,app_test)
- value of `DB_USER` from `.env` to `POSTGRES_USER` in `.env-docker`
- value of `DB_PASSWORD` from `.env` to `POSTGRES_PASSWORD` in `.env-docker`

**Run server and db containers**

```bash
$ docker-compose up
```

**Run migrations**

```bash
$ ./run.sh adonis migration:run
```

**Run seeds**

```bash
$ ./run.sh adonis seed
```

**Build CSS**

```bash
$ ./npm.sh run frontend:css:build:dev
```

Or start it in watch mode:

```bash
$ ./npm.sh run frontend:css:watch
```

**Start frontend app**

```bash
$ ./npm.sh run frontend:build:dev
```

The app should be already up and running at localhost:3333.

## Development

**Run tests**

Ensure the Docker containers are up before running tests (`docker-compose up`).

API

```bash
$ ./npm.sh run api:test
$ ./npm.sh run api:test:specific "some test description"
```

Frontend

```
$ ./npm.sh run frontend:test
$ ./npm.sh run frontend:test:watch
```

E2E

```
# Ensure the containers are up: (docker-compose up)

$ npm run e2e:test
```
