FROM node:9-alpine

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm i --silent
COPY . .

EXPOSE 5000
CMD npm start
