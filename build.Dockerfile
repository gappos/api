FROM node:18-alpine

WORKDIR /gapp

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn compile

EXPOSE 3000

CMD ["yarn", "start"]
