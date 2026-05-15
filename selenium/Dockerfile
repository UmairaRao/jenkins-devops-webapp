FROM node:20-alpine

WORKDIR /selenium-tests

COPY package*.json ./

RUN npm install

COPY e2e.test.js ./

CMD ["npm", "test"]
