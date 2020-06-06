# Deployment

Prerequisites:

- you have to be able to `ssh` to your VPS/remote server
- you have to have `Docker` installed on your remote machine

## Deployment checklist (about to be automated)

Before:

[x] check if all entries in the `.env-prod` are correct

[x] check if all entries in the `.env-frontend.prod` are correct

[x] check the latest version in `package.json` and decide how you want to bump it

After:

[x] check if services are running

```bash
$ docker-compose logs
```

[x] go to the URL to inspect the app

[x] run migrations if needed

```bash
$ ./run.sh adonis migration:run --force
```

[x] merge `master` to `develop`

Steps:

[+] ensure you're on the `master` branch and have all the changes you want to deploy synced with origin

[+] run backend tests

```bash
./run.sh npm run api:test
```

[+] run e2e tests

```bash
./run.sh npm run e2e:test
```

[+] apply a new tag (remember about semver)

```bash
$ npm version <major | minor | patch>
```

[+] push the latest tag

```bash
$ git push --tags --no-verify
```

[+] push the commit with the version change (package(-lock).json)

```bash
$ git push --no-verify
```

[+] run the env validation script

```bash
$ npm run env:validate:all
```

[-] run app on your local machine

```bash
$ docker-compose up
```

[-] build frontend bundle

```bash
$ ./run.sh npm run frontend:prod
```

[-] stop app on your local machine

```bash
$ docker-compose down
```

[-] use production Docker host

```bash
$ export DOCKER_HOST="ssh://<user>@<ip>:<optional port>"
```

[-] create a backup

```
$ ./scripts/backup_db.sh
```

[-] stop production containers

```bash
$ docker-compose down
```

[-] start docker-compose

```bash
$ docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --detach --build --force-recreate
```

[-] check if healthcheck responds correctly from local

```bash
$ http GET bgord.tech:3333/healthcheck
```

[-] unset DOCKER_HOST

```bash
$ unset DOCKER_HOST
```
