# Используем официальный образ Node.js как основу
FROM node:20.15.0

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]