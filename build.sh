#!/bin/sh
IMAGE_NAME=doge/react-chat-api

docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME:latest
