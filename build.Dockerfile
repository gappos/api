FROM node:18-alpine

WORKDIR /gapp

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn compile

ARG PR_DATE_NUMBER
ENV PR_DATE_NUMBER=${PR_DATE_NUMBER}

EXPOSE 3000

CMD ["yarn", "start"]
