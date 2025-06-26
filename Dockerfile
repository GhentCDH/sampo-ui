# Base stage for shared setup
FROM node:22.17-slim AS base
WORKDIR /app
ARG API_URL=http://localhost:3001/api/v1
# Install dependencies for both client and server to leverage caching
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN cd client && npm install && cd ../server && npm install

# Client development stage
FROM base AS client-dev
COPY client ./client
WORKDIR /app/client
EXPOSE 8080
ENV API_URL=${API_URL}
CMD ["npm", "run", "dev"]

## Client production build stage
#FROM base AS client-build
#COPY client ./client
#WORKDIR /app/client
#RUN npm run build
## Install a lightweight server for serving the build
#RUN npm install -g serve
#EXPOSE 8080
#ENV API_URL=${API_URL}
#CMD ["serve", "-s", "build", "-l", "8080"]

# Server development stage
FROM base AS server-dev
COPY server ./server
WORKDIR /app/server
EXPOSE 3001
CMD ["npm", "run", "dev"]

## Server production build stage
#FROM base AS server-build
#COPY server ./server
#WORKDIR /app/server
#RUN npm run build
#EXPOSE 3001
#CMD ["node", "dist/index.js"]