FROM node:12-alpine

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 4000

CMD ["pm2-runtime", "build/index.js"]
