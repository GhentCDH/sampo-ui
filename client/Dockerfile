# Base stage for client setup
FROM node:22.17-slim AS base
WORKDIR /app
# Install dependencies
COPY package*.json ./client/
RUN cd client && npm install

# Client development stage
FROM base AS client-dev
COPY . ./client
WORKDIR /app/client
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Client production build stage
FROM base AS client-build
COPY . ./client
WORKDIR /app/client
RUN npm run build
EXPOSE 8080
CMD ["node", "server.js"]