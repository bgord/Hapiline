# hapiline

## Setup

**Create `.env` file**

```bash
$ cp .env.example .env
```

Fill missing value for `DB_PASSWORD` in `.env` with whatever password (it's just for local database).

Ask for credentials for the following SMTP/EMAIL values:

`SMTP_HOST`
`SMTP_PORT`
`MAIL_USERNAME`
`MAIL_PASSWORD`

**Create `.env-frontend` file**

```bash
$ cp .env-frontend.example .env-frontend
```

Ask for `BUGSNAG_API_KEY` value.

**Generate APP_KEY in .env file**

```bash
$ adonis key:generate
```

**Run server and db containers**

```bash
$ docker-compose up
```

In case the `npm install` step doesn't work (which seems to sometimes happen due to a npm bug),
do the following:

```bash
$ docker-compose up -d
$ ./run.sh npm install
```

---

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

API tests:

```bash
$ ./npm.sh run api:test
$ ./npm.sh run api:test:specific "some test description"
```

E2E tests:

```
# Ensure the containers are up: (docker-compose up)

$ npm run e2e:test
```

**Env validation**

To validate the development env files (server and frontend):

```bash
$ npm run validate:env:dev
```

To validate both development and production env files (server and frontend):

```bash
$ npm run validate:env:all
```

---
