#!/usr/bin/env bash

set -e

printf "🛈  You're about to deploy Hapiline!\n\n"

ALLOWED_BRANCH="master"
ALLOWED_BRANCH_ORIGIN="origin/$ALLOWED_BRANCH"

if [ -z "$(git status --porcelain)" ]; then
  echo "✓  Clean working directory"
else
  echo "⚠  You have some uncommited changes"
  echo "Quitting..."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)

echo "🛈  Your current branch: $CURRENT_BRANCH"

if [ $ALLOWED_BRANCH == "$CURRENT_BRANCH" ]; then
  printf "✓  Correct branch, proceeding\n\n";
else
  echo "⚠  The deployment script is required to be run on branch \`master\`";
  echo "Quitting..."
  exit 1
fi

if [ "$(git rev-parse $ALLOWED_BRANCH)" == "$(git rev-parse $ALLOWED_BRANCH_ORIGIN)" ]; then
    echo "✓  Your current branch is in sync with it's origin, proceeding"
else
    echo "⚠  Your current branch is not with sync with it's origin"
    echo "Quitting..."
    exit 1
fi

if [ "$(git rev-parse $ALLOWED_BRANCH)" == "$(git rev-parse develop)" ]; then
    echo "✓  Your current branch is in sync with develop branch, proceeding"
else
    echo "⚠  Your current branch is not with sync with develop branch"
    echo "Quitting..."
    exit 1
fi

VERSION_CHANGE=$1
echo "🛈  Requested version change: $VERSION_CHANGE"

if [[ $VERSION_CHANGE != "major" && $VERSION_CHANGE != "minor" && $VERSION_CHANGE != "patch" ]]; then
  echo "⚠  Incorrect requested version, must be one of: major, minor, or patch."
  echo "Quitting..."
  exit 1
else
  echo "✓  Correct version change, proceeding"
fi

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

echo "🛈  Validating env files..."
npm run env:validate:all

printf "\n🛈  Running the app locally...\n\n"
docker-compose up --detach

printf "\n🛈  Running backend tests...\n\n"
./run.sh npm run api:test

printf "\n🛈  Running e2e tests...\n\n"
npm run e2e:test:headless

printf "\n🛈  Applying new version\n\n"
npm version "$VERSION_CHANGE"

printf "\n🛈  Pushing latest tag...\n\n"
git push --tags --no-verify

printf "\n🛈  Pushing latest package(-lock).json version changes...\n\n"
git push --no-verify

printf "\n🛈  Building frontend bundle...\n\n"
./run.sh npm run frontend:prod

printf "\n🛈  Stopping app on your local machine...\n\n"
docker-compose down

printf "\n🛈  Setting production docker host...\n\n"
export DOCKER_HOST="ssh://deploy@137.74.192.86:25"

printf "\n🛈  Creating a backup...\n\n"
./scripts/backup_db.sh

printf "\n🛈  Stopping production containers...\n\n"
if docker-compose down; then
 printf "\n🛈  Production containers stopped\n\n"
else
 printf "\n🛈  Production containers stopped, but docker threw a connection lost error, proceeding\n\n"
fi

printf "\n🛈  Starting docker-compose...\n\n"
docker-compose --file docker-compose.yml --file docker-compose.prod.yml up --detach --build --force-recreate

printf "\n🛈  Changing docker host to local\n\n"
unset DOCKER_HOST

printf "\n🛈  Checking if healthcheck responds correctly from localhost  in 5s...\n\n"
sleep 5s
http GET bgord.tech:3333/healthcheck

echo "✓  Everything seems to be fine!"
