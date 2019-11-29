#!/usr/bin/env bash

if [ "$ENV" == "test" ]; then
  docker-compose exec -T app npm "$@"
else
  docker-compose exec app npm "$@"
fi
