FROM node:8.5

ADD . /app
WORKDIR /app

RUN npm install
# RUN node-gyp rebuild

ARG APP_API="'https://oye-records.com'"
ARG APP_NODE_ENV=production

ENV API_ROOT ${APP_API}
ENV NODE_ENV ${NODE_ENV}
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
