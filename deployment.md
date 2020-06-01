# Deployment

Prerequisites:

- you have to be able to `ssh` to your VPS/remote server
- you have to have `Docker` installed on your remote machine

## Deployment checklist (about to be automated)

[] ensure you're on the `master` branch and have all the changes you want to deploy synced with origin

[] run backend tests

```bash
./run.sh npm run api:test
```

[] run e2e tests

```bash
./run.sh npm run e2e:test
```

[] check the latest git tag

```bash
$ git describe --tags
```

[] apply a new tag (remember about semver)

```bash
$ npm version <major | minor | patch>
```

[] push the latest tag

```bash
$ git push --tags
```

[] push the commit with the version change (package(-lock).json)

```bash
$ git push --tags
```

[] run the env validation script

```bash
$ npm run env:validate
```

[] check if all entries in the `.env-prod` are correct

[] check if all entries in the `.env-frontend.prod` are correct

[] run app on your local machine

```bash
$ docker-compose up
```

[] build frontend bundle

```bash
$ ./run.sh npm run frontend:prod
```

[] stop app on your local machine

```bash
$ docker-compose down
```

[] use production Docker host

```bash
$ export DOCKER_HOST="ssh://<user>@<ip>:<optional port>"
```

[] create a backup

```
$ ./scripts/backup_db.sh
```

[] stop production containers

```bash
$ docker-compose down
```

[] start docker-compose

```bash
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --detach --build --force-recreate
```

[] check if services are running

```bash
$ docker-compose logs
```

[] check if healthcheck responds correctly from local

```bash
$ http GET bgord.tech:3333/healthcheck
```

[] go to the URL to inspect the app

[] run migrations if needed

```bash
$ ./run.sh adonis migration:run --force
```

[] unset DOCKER_HOST

```bash
$ unset DOCKER_HOST
```

[] merge `master` to `develop`
