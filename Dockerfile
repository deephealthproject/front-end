# Build frontend with npm and Angular-CLI
FROM node:8 as frontend-build

# Create image based on the official Node 10 image from dockerhub
#FROM node:10

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm install
RUN npm install -g @angular/cli@7.3.9

# Get all the code needed to run the app
COPY . /app/

RUN ./node_modules/.bin/ng build --base-href "." --prod 

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "start"]