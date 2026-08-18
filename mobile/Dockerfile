FROM node:20-alpine

# Set working directory
WORKDIR /app/mobile

# Install global dependencies as root
RUN npm install -g @expo/ngrok@^4.1.0

# Keep as root for dev


# Expose Metro bundler port
EXPOSE 8081

# Command to run (can be overridden by docker-compose)
CMD ["npx", "expo", "start", "--clear", "--tunnel"]
