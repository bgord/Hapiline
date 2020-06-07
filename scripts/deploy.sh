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
    echo "Your current branch is in sync with it's origin, proceeding"
else
    echo "Your current branch is not with sync with it's origin"
    echo "Quitting..."
    exit 1
fi

if [ "$(git rev-parse $ALLOWED_BRANCH)" == "$(git rev-parse develop)" ]; then
    echo "Your current branch is in sync with develop branch, proceeding"
else
    echo "Your current branch is not with sync with develop branch"
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

printf "\nRunning backend tests..."
./run.sh npm run api:test

printf "\nRunning e2e tests..."
npm run e2e:test:headless

printf "\nApplying new version"
npm version "$VERSION_CHANGE"

printf "\nPushing latest tag..."
git push --tags --no-verify

printf "\nPushing latest package(-lock).json version changes..."
git push --no-verify

printf "\nBuilding frontend bundle...\n"
./run.sh npm run frontend:prod

printf "\nStopping app on your local machine..."
docker-compose down

printf "\nSetting production docker host..."
export DOCKER_HOST="ssh://deploy@137.74.192.86:25"

printf "\nCreating a backup..."
./scripts/backup_db.sh

printf "\nStopping production containers..."
if docker-compose down; then
 echo "Production containers stopped"
else
 echo "Production containers stopped, but docker threw a connection lost error, proceeding"
fi

printf "\nStarting docker-compose..."
docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --detach --build --force-recreate

printf "\nChanging docker host to local"
unset DOCKER_HOST

printf "\nChecking if healthcheck responds correctly from localhost..."
http GET bgord.tech:3333/healthcheck
