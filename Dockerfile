FROM node:12.18.3

WORKDIR /app

COPY ./package.json .

RUN yarn

COPY . .

ENTRYPOINT ["yarn", "start:prod"]