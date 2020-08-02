#!/bin/bash

ARG1=${1:-dev}

BASE_FILE="$PWD/configs/.env.$ARG1"
CORE_FILE=/.appenv
TARGET_FILE="$PWD/.env"


if test -f "$BASE_FILE"; then
  echo "Base env exists."
else
  echo "Base env not found"
  exit 126;
fi

if test -f "$CORE_FILE"; then
  cat $BASE_FILE $CORE_FILE > $TARGET_FILE
else
  cat $BASE_FILE > $TARGET_FILE
fi

READY_CONTAINERS=$(docker-compose ps -q)
if [ "$READY_CONTAINERS" ]; then
    echo "Stop containers"
    docker-compose down
fi

if [ "$(docker ps -q)" ]; then
    docker-compose down
fi;

docker-compose build

docker-compose up -d 