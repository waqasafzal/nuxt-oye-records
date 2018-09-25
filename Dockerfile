FROM node:7.8

ADD . /app
WORKDIR /app

RUN npm install
RUN npm rebuild node-sass

ARG APP_API="'https://oye-records.com'"
ARG APP_NODE_ENV=production
ARG ADYEN_CSE=https://live.adyen.com/hpp/cse/js/1115135975200408.shtml
ARG ADYEN_SKIN_URL="'https://live.adyen.com/hpp/skipDetails.shtml'"
ARG GA_URL="'UA-25861640-1'"

ENV API_ROOT ${APP_API}
ENV NODE_ENV ${NODE_ENV}
ENV ADYEN_CSE ${ADYEN_CSE}
ENV ADYEN_SKIN_URL ${ADYEN_SKIN_URL}
ENV GA_URL ${GA_URL}
ENV NODE_PRESERVE_SYMLINKS 1
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
