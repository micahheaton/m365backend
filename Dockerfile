# Use an official Node.js runtime as the base image
FROM node:17-alpine

# Set the working directory in the container
WORKDIR /back

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]