FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

RUN mkdir -p uploads

EXPOSE ${PORT:-5000}

CMD ["node", "app.js"]
