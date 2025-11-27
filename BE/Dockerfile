# dùng để build trên render

FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# build TypeScript -> dist
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
