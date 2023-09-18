FROM node:20-alpine3.17

WORKDIR /api

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["sh","-c","npm start"]