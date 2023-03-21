FROM node:18

WORKDIR /gapp

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install --pure-lockfile

COPY . .

ENV PATH="/usr/gapp/scripts:${PATH}"
RUN apt-get update && apt-get install -y postgresql-client

EXPOSE 3000

CMD ["yarn", "start"]