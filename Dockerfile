FROM node:14 as base

ARG PORT=1993

WORKDIR /usr/src/app

COPY package.json .

RUN curl -o- -L https://yarnpkg.com/install.sh | bash && yarn install

COPY . .

EXPOSE $PORT

############# JavaScript development build stage #############

FROM base as dev

COPY . .

CMD ["yarn", "dev:apollo"]

############# JavaScript production build stage #############

FROM base as production

CMD ["yarn", "start"]

