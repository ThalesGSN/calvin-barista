FROM node:18
WORKDIR /usr/calvin
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 8000
WORKDIR /usr/calvin/src
CMD [ "ls" ]
CMD [ "tsc" ]
CMD [ "node", "./app.js" ]



