FROM node:13-alpine


RUN mkdir -p /app

COPY . /app
COPY /back/package.json /app/back
# set default dir so that next commands executes in /home/app dir
WORKDIR /app/back
# will execute npm install in /home/app because of WORKDIR
RUN npm install

WORKDIR /app
EXPOSE 8080
# no need for /home/app/server.js because of WORKDIR
CMD ["node", "./back/server.js"]

