FROM node:18-alpine

WORKDIR /gapp

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install --pure-lockfile

COPY ./dist ./dist

EXPOSE 3000

CMD ["yarn", "start"]
