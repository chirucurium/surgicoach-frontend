FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 7051

CMD [ "npm", "run", "dev" ]