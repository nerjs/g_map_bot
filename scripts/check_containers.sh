READY_CONTAINERS=$(docker-compose ps -q)
EXITED_CONTAINERS=$(docker-compose ps | grep Exit)
RESTARTING_CONTAINERS=$(docker-compose ps | grep Restarting)


if [ -z "$READY_CONTAINERS" ]; then
    exit 1
fi

echo $EXITED_CONTAINERS
echo $RESTARTING_CONTAINERS
if [ "$EXITED_CONTAINERS" ] | [ "$RESTARTING_CONTAINERS" ]; then
  docker-compose down
  exit 1
fi

echo "Success!!!"