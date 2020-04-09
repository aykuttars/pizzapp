FROM node:12.16.1
WORKDIR /app
ADD ./package.json /app/package.json
RUN yarn install
RUN yarn global add @vue/cli
RUN yarn global upgrade --latest @vue/cli
RUN yarn global upgrade vue cli service / plugins
RUN yarn serve
COPY . .