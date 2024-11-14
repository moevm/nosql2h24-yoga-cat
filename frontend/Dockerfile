FROM node:20.15.0

WORKDIR /app

COPY . .

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]