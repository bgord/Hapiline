# hapiline

## Setup

**Create `.env` file**

```bash
$ cp .env.example .env
```

Fill missing values for the following keys: `APP_KEY`, `SMTP_HOST`, `SMTP_PORT`, and `DB_PASSWORD` in `.env`.

**Create `.env-frontend` file**

```
$ cp .env.example .env
```

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

**Start frontend app**

```bash
$ ./npm.sh run frontend:dev
```

The app should be already up and running at `localhost:3333`.

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
