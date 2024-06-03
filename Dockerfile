FROM node:18.16.0 as base

WORKDIR /opt/workspace

COPY . .

RUN yarn config set \
    registry https://registry.yarnpkg.com/ \
    && yarn \
    && yarn build


FROM node:18.16.0-alpine

WORKDIR /opt/workspace

COPY --from=base /opt/workspace /opt/workspace

ENTRYPOINT yarn start -p 3002

EXPOSE 3002
