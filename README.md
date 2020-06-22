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

**Clear database**

```bash
$ ./run.sh adonis migration:refresh
```

**Run seeds**

```bash
$ ./run.sh adonis seed
```

**Generate types**

```bash
$ npx prisma generate
```

**Start frontend app**

```bash
$ ./npm.sh run frontend:dev
```

The app should be already up and running at `hapiline.localhost`.

## Development

**Run tests**

Ensure the Docker containers are up before running tests (`docker-compose up`).

API tests:

```bash
$ ./npm.sh run api:test
$ ./npm.sh run api:test:specific "some test description"
```

E2E tests:

> Cypress tests are run from the host, not inside the containers, so before the first test run, you need to install the dependencies on the host machine.

```bash
$ npm install
```

```
# Ensure the containers are up: (docker-compose up)

$ npm run e2e:desktop # opens the Cypress UI for desktop screen resolution
$ npm run e2e:desktop:headless # runs tests in the headless mode for desktop screen resolution

$ npm run e2e:mobile # opens the Cypress UI for mobile screen resolution
$ npm run e2e:mobile:headless # runs tests in the headless mode for mobile screen resolution
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

**Regenerate TypeScript types basing on the database schema with Prisma**

```bash
$ npx prisma introspect

// Double-check the changes added to `prisma/schema.prisma` and commit them.

$ npx prisma generate

// Now, the new types for the current database schema should be accessible via `@prisma/client`
// in `frontend/src/models.ts`.
```

---
