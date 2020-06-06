#!/usr/bin/env bash

printf "You're about to deploy Hapiline!\n\n"

ALLOWED_BRANCH="master"
CURRENT_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)

echo "Your current branch: $CURRENT_BRANCH"

if [ $ALLOWED_BRANCH == "$CURRENT_BRANCH" ]; then
  printf "Correct branch, proceeding\n\n";
else
  echo "The deployment script is required to be run on branch \`master\`";
  echo "Quitting..."
  exit 1
fi

VERSION_CHANGE=$1
echo "Requested version change: $VERSION_CHANGE"

if [[ $VERSION_CHANGE != "major" && $VERSION_CHANGE != "minor" && $VERSION_CHANGE != "patch" ]]; then
  echo "Incorrect requested version, must be one of: major, minor, or patch."
else
  echo "Correct version change, proceeding"
fi

printf '\nDeployment procedure will be started in 5 seconds\n'
printf 'Press Ctrl-C (or Command-C) is you want to quit.\n\n'

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

echo "Running backend tests..."

./run.sh npm run api:test

echo "Running e2e tests..."

./run.sh npm run e2e:test:headless

echo "Pushing latest tag"

git push --tags --no-verify
