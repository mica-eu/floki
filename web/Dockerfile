FROM node:9-alpine

WORKDIR /usr/src/web

COPY package*.json ./
RUN npm i --silent
COPY . .

EXPOSE 8080
CMD npm start
