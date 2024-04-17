# Use the official Node.js image as the build stage
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular app for production
RUN npm run build --configuration=production

# Use Nginx as the base image for the final stage
FROM nginx:1.25-alpine

# Copy the built application to the Nginx document root
COPY --from=builder /app/dist/mlc-angular /usr/share/nginx/html

# Expose port 80 for serving
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]