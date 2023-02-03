FROM node:18

WORKDIR /usr/gapp

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install --pure-lockfile

COPY dist ./dist

COPY ./.sequelizerc ./.sequelizerc
COPY ./scripts ./scripts
ENV PATH="/usr/gapp/scripts:${PATH}"
RUN apt-get update && apt-get install -y postgresql-client

EXPOSE 3000

CMD ["yarn", "start"]