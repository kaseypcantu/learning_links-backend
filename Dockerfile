FROM node:14 as base

ARG PORT=1993

WORKDIR /usr/src/app

COPY ./package.json .

RUN curl -o- -L https://yarnpkg.com/install.sh | bash && yarn install

COPY . .

EXPOSE $PORT

############# JavaScript development build stage #############

FROM base as dev

ENV NODE_ENV=development

COPY --from=base /usr/src/app .
COPY --from=base /usr/src/app/package.json .

CMD ["yarn", "dev:apollo"]

############# JavaScript production build stage #############

FROM base as production

ENV NODE_ENV=production

WORKDIR /prod

COPY --from=base /usr/src/app .
COPY --from=base /usr/src/app/package*.json .

CMD ["yarn", "start"]

