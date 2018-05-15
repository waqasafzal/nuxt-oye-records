FROM node:8.5

ADD . /app
WORKDIR /app

RUN npm install
RUN npm rebuild node-sass

ARG APP_API="'https://oye-records.com'"
ARG APP_NODE_ENV=production
ARG ADYEN_CSE=https://live.adyen.com/hpp/cse/js/1115135975200408.shtml

ENV API_ROOT ${APP_API}
ENV NODE_ENV ${NODE_ENV}
ENV ADYEN_CSE ${ADYEN_CSE}
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
