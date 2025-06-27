# Base stage for shared setup
FROM node:22.17-slim AS base
WORKDIR /app
ARG API_URL=http://localhost:3001/api/v1
# Install dependencies
COPY package*.json ./client/
RUN cd client && npm install

# Client development stage
FROM base AS client-dev
COPY . ./client
WORKDIR /app/client
EXPOSE 8080
ENV API_URL=${API_URL}
CMD ["npm", "run", "dev"]

# Client production build stage
FROM base AS client-build
COPY . ./client
WORKDIR /app/client
RUN npm run build
# Install a lightweight server for serving the build
RUN npm install -g serve
EXPOSE 8080
ENV API_URL=${API_URL}
CMD ["serve", "-s", "build", "-l", "8080"]