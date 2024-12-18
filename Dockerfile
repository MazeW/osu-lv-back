FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN rm -rf src node_modules && npm install --production

EXPOSE 3042

CMD ["node", "dist/server.js"]