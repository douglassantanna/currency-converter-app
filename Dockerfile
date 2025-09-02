FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN mkdir -p backend/public
RUN cd backend && npm install 
RUN npm run build 
EXPOSE 3000

CMD ["node", "backend/server.js"]