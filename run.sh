#!/usr/bin/env bash

if [ "$ENV" == "test" ]; then
  docker-compose exec -T app "$@"
else
  docker-compose exec app "$@"
fi
