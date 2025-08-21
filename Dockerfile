# Use the official Node.js 20 Alpine image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all other application files to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to start the application
CMD ["node", "src/server.js"]
