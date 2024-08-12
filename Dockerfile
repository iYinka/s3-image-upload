FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy the backend's package.json and package-lock.json and install dependencies
COPY back/package*.json ./
RUN npm install

# Copy the backend code to the container
COPY back/ ./

# Copy the frontend HTML files to a public directory inside the container
COPY front/ ./public/

# Expose port 8080
EXPOSE 8080

# Start the backend server
CMD ["node", "server.js"]
