#!/usr/bin/env bash

set -e

printf "You're about to deploy Hapiline!\n\n"

ALLOWED_BRANCH="master"
ALLOWED_BRANCH_ORIGIN="origin/$ALLOWED_BRANCH"

if [ -z "$(git status --porcelain)" ]; then
  echo "Clean working directory, quitting..."
else
  echo "You have some uncommited changes"
  echo "Quitting..."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)

echo "Your current branch: $CURRENT_BRANCH"

if [ $ALLOWED_BRANCH == "$CURRENT_BRANCH" ]; then
  printf "Correct branch, proceeding\n\n";
else
  echo "The deployment script is required to be run on branch \`master\`";
  echo "Quitting..."
  exit 1
fi

if [ "$(git rev-parse $ALLOWED_BRANCH)" == "$(git rev-parse $ALLOWED_BRANCH_ORIGIN)" ]; then
    echo "Your current branch is in sync with it's origin, proceeding..."
else
    echo "Your current branch is not with sync with it's origin"
    echo "Quitting..."
    exit 1
fi

VERSION_CHANGE=$1
echo "Requested version change: $VERSION_CHANGE"

if [[ $VERSION_CHANGE != "major" && $VERSION_CHANGE != "minor" && $VERSION_CHANGE != "patch" ]]; then
  echo "Incorrect requested version, must be one of: major, minor, or patch."
  exit 1
else
  echo "Correct version change, proceeding"
fi

printf '\nDeployment procedure will be started in 5 seconds\n'
printf 'Press Ctrl-C (or Command-C) if you want to quit.\n\n'

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

printf '\nDeployment procedure started!\n\n'

echo "Validating env files..."
npm run env:validate:all

printf "\nRunning the app locally...\n\n"
docker-compose up --detach

echo "Running backend tests..."
./run.sh npm run api:test

echo "Running e2e tests..."
npm run e2e:test:headless

printf "\nBuilding frontend bundle...\n"
./run.sh npm run frontend:prod

echo "Stopping app on your local machine..."
docker-compose down

echo "Applying new version"
npm version "$VERSION_CHANGE"

echo "Pushing latest tag..."
git push --tags --no-verify

echo "Pushing latest package(-lock).json version changes..."
git push --no-verify

echo "Setting production docker host..."
export DOCKER_HOST="ssh://deploy@137.74.192.86:25"

echo "Creating a backup..."
./scripts/backup_db.sh

echo "Stopping production containers..."
docker-compose down

echo "Starting docker-compose..."
docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --detach --build --force-recreate

echo "Changing docker host to local"
unset DOCKER_HOST

echo "Checking if healthcheck responds correctly from local..."
http GET bgord.tech:3333/healthcheck
