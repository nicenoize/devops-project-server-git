# Syntax directive to enable BuildKit features
# syntax=docker/dockerfile:1.3

FROM --platform=linux/amd64 node:alpine

WORKDIR /server

COPY package*.json yarn.lock ./

RUN yarn

COPY ./src ./src

EXPOSE 5000

CMD [ "yarn", "start" ]
