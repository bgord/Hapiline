# Automated Deployment

Prerequisites:

- you have to be able to `ssh` to your VPS/remote server
- you have to have `Docker` installed on your remote machine

## Deployment process

**Before**

[] Check if all entries in the `.env-prod` are correct

[] Check if all entries in the `.env-frontend.prod` are correct

> Don't proceed if you're unsure of some of the values

[] Check the latest version in `package.json` and decide how you want to bump it

> Remember about semantic versioning: https://semver.org/

**Running the script**

> Ensure you're on the master branch, and in the root directory of the app

```bash
$ ./scripts/deploy.sh <version_bump: major | minor | patch>

# For example:

$ ./scripts/deploy.sh minor
```

> The script will try to open the app with the Firefox browser

**After**

After the script has run correctly, it's advisable to perform the following steps:

[] Perform some anecdotal tests on the app:

- check the developer info
- try to login/logout
- observe the dashboard stats
- observe the calendar

- click through the new functionalities that you've deployed

etc.

[] Check if the production services are running

```bash
$ export DOCKER_HOST="ssh://<user>@<ip>:<optional port>"
$ docker-compose logs
$ unset DOCKER_HOST
```

[] Run migrations if needed

```bash
$ export DOCKER_HOST="ssh://<user>@<ip>:<optional port>"
$ ./run.sh adonis migration:run --force
$ unset DOCKER_HOST
```

[] Merge the `master` branch to the `develop` if the deployment process has been successful.
