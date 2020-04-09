FROM node:12.16.1
COPY . /usr/src/app/frontend
WORKDIR /usr/src/app/frontend
RUN yarn install
RUN yarn global add @vue/cli
RUN yarn global upgrade --latest @vue/cli
RUN yarn global upgrade vue cli service / plugins