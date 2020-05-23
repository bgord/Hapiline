# Deployment

Prerequisites:

- you have to be able to `ssh` to your VPS/remote server
- you have to have `Docker` installed on your remote machine

## Deployment checklist (about to be automated)

[] check the latest git tag

```bash
$ git describe --tags
```

[] check if all entries in the `.env-prod` are defined and correct

[] check if all entries in the `.env-frontend.prod` are defined and correct

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
http GET bgord.tech:3333/healthcheck
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
