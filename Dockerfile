FROM node:9.11-alpine

COPY . /opt/application

WORKDIR /opt/application
RUN ["chmod", "+x", "wait-for.sh"]

ARG     MT_PORT
ARG     MONGODB_URI

ENV     MT_PORT "$MT_PORT"
ENV     MONGODB_URI "$MONGODB_URI"

RUN apk update && \
    yarn install
