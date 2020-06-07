#!/usr/bin/env bash

# `set -e` means that the script will quit/abort after the first failed command.
#
# REASONING: We want to ensure all steps defined in this script have been run successfully.
#
set -e

printf "🛈  You're about to deploy Hapiline!\n\n"


# Right now, the deployment can be performed only from the `master` branch.
#
# REASONING: In the future we may want to switch to release branches, but
#            keeping the things simple now.
#
ALLOWED_BRANCH="master"
ALLOWED_BRANCH_ORIGIN="origin/$ALLOWED_BRANCH"


# Checking if there're any uncommited changes.
#
# The `git status --porcelain` command returns an empty string
# if there're no changes.
#
# REASONING: Otherwise, npm version bump won't work.
#
if [ -z "$(git status --porcelain)" ]; then
  echo "✓  Clean working directory"
else
  echo "⚠  You have some uncommited changes"
  echo "Quitting..."
  exit 1
fi


# Obtaining the name of the branch that the deployment is fired from.
CURRENT_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
echo "🛈  Your current branch: $CURRENT_BRANCH"


# Checking if we're on the $ALLOWED_BRANCH.
if [ $ALLOWED_BRANCH == "$CURRENT_BRANCH" ]; then
  printf "✓  Correct branch, proceeding\n\n";
else
  echo "⚠  The deployment script is required to be run on branch \`master\`";
  echo "Quitting..."
  exit 1
fi


# Checking if the `master` branch is synced with the origin.
#
# `git rev-parse` returns a commit hash, and then, we compare them.
#
# REASONING: We enforce consistency of the code that's being deployed.
#
if [ "$(git rev-parse $ALLOWED_BRANCH)" == "$(git rev-parse $ALLOWED_BRANCH_ORIGIN)" ]; then
    echo "✓  Your current branch is in sync with it's origin, proceeding"
else
    echo "⚠  Your current branch is not with sync with it's origin"
    echo "Quitting..."
    exit 1
fi


# Checking if the `master` branch is synced with the local develop.
#
# `git rev-parse` returns a commit hash, and then, we compare them.
#
# REASONING: We enforce consistency of the code that's being deployed
#
if [ "$(git rev-parse $ALLOWED_BRANCH)" == "$(git rev-parse develop)" ]; then
    echo "✓  Your current branch is in sync with develop branch, proceeding"
else
    echo "⚠  Your current branch is not with sync with develop branch"
    echo "Quitting..."
    exit 1
fi

VERSION_CHANGE=$1
echo "🛈  Requested version change: $VERSION_CHANGE"


# Check if $VERSION_CHANGE adjust to the semantic versioning scheme: https://semver.org/.
if [[ $VERSION_CHANGE != "major" && $VERSION_CHANGE != "minor" && $VERSION_CHANGE != "patch" ]]; then
  echo "⚠  Incorrect requested version, must be one of: major, minor, or patch."
  echo "Quitting..."
  exit 1
else
  echo "✓  Correct version change, proceeding"
fi


# We allow to bailout before we start doing anything serious (after tests).
printf '\n🛈  Deployment procedure will be started in 5 seconds\n'
printf '🛈  Press Ctrl-C (or Command-C) if you want to quit.\n\n'

echo '5'
sleep 1s

echo '4'
sleep 1s

echo '3'
sleep 1s

echo '2'
sleep 1s

echo '1'
sleep 1s

printf '\n🛈  Deployment procedure started!\n\n'


# Checking all development and production env files (server and frontend).
echo "🛈  Validating env files..."
npm run env:validate:all


# Running the app's containers locally so we're able to run tests.
printf "\n🛈  Running the app locally...\n\n"
docker-compose up --detach


# Run the Adonis API tests and end-to-end Cypress tests.
#
# REASONING: We don't want to deploy the app that has tests that don't pass
#            Also, by including this step in the deployment process,
#            we ensure that tests are treated seriously.
#            We want them to pass reliably.
#
printf "\n🛈  Running backend tests...\n\n"
./run.sh npm run api:test

# WARNING:   If the end-to-end tests are failing right one after another, it may be
#            the case that the last frontend bundle was created for production.
#
#            The solution is to run `./run.sh npm run frontend:dev`` and run the script
#            one more time.
#
printf "\n🛈  Running e2e tests...\n\n"
npm run e2e:test:headless


# Using the $VERSION_CHANGE variable to bump the version using `npm version`.
#
# It automatically created a git tag, and updates the version in both
# package(-lock).json files.
#
# It doesn't push any commits though.
printf "\n🛈  Applying new version\n\n"
npm version "$VERSION_CHANGE"


# Pushing the tags created by `npm version`.
# We use `--no-verify` to skip running api tests in the git pre-push hook.
printf "\n🛈  Pushing latest tag...\n\n"
git push --tags --no-verify


# Pushing the package(-lock).json changes created by `npm version`.
# We use `--no-verify` to skip running api tests in the git pre-push hook.
printf "\n🛈  Pushing latest package(-lock).json version changes...\n\n"
git push --no-verify


# Building the frontend bundle for production, using the local instance
# of the app running in the containers.
printf "\n🛈  Building frontend bundle...\n\n"
./run.sh npm run frontend:prod


# The local app is no longer needed, so we need to stop it.
printf "\n🛈  Stopping app on your local machine...\n\n"
docker-compose down


# We switch to the production docker host, so we can operate on the
# docker deaemon running on the production VPS.
#
# After that, every docker(-compose) command operates on the VPS,
# not on the local machine.
printf "\n🛈  Setting production docker host...\n\n"
export DOCKER_HOST="ssh://deploy@137.74.192.86:25"


# Creating DB backup.
#
# More about backups in docs/backups.md file.
#
# REASONING: We don't want to mess up the db during the deployment.
#
printf "\n🛈  Creating a backup...\n\n"
./scripts/backup_db.sh


# Stopping the Hapiline containers running on the production VPS.
#
# We don't run `docker-compose down` as a standalone command.
#
# REASONING: Somehow the docker daemon, when running on a remote host,
#            tends to drop the connection after completing it's job.
#            This doesn't really mean that a command has failed.
#            From what I've observed, in most cases it works ok.
#
# WARNING:   It may be a fragile solution.
#
printf "\n🛈  Stopping production containers...\n\n"
if docker-compose down; then
 printf "\n🛈  Production containers stopped\n\n"
else
 printf "\n🛈  Production containers stopped, but docker threw a connection lost error, proceeding\n\n"
fi


# Building the app's containers on the production VPS from scratch.
printf "\n🛈  Starting docker-compose...\n\n"
docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --detach --build --force-recreate


# Switching back to the local docker host
printf "\n🛈  Changing docker host to local\n\n"
unset DOCKER_HOST


# Sending a request to the /healthcheck endpoint after 5s.
#
# REASONING: If a request is fired immediately, it may fail
#            because the containers didn't have enough time
#            to become responsive.
#
printf "\n🛈  Checking if healthcheck responds correctly from localhost  in 5s...\n\n"
sleep 5s
http GET bgord.tech:3333/healthcheck

printf "\n✓  Everything seems to be fine!\n\n"


# Opening the production app with the Firefox browser.
#
# REASONING: We chose Firefox because it's preinstalled on most Linux
#            distributions. And it's the only operating system (for now!)
#            that we deploy from.
#
echo "🛈  Trying to open the Firefox browser with the deployed app..."
firefox bgord.tech:3333
