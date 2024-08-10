FROM node:18
WORKDIR /app
COPY back/package*.json ./
RUN npm install
COPY back/ ./
EXPOSE 8080
CMD ["node", "/app/server.js"]
