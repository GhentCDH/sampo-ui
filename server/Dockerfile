# Base stage for shared setup
FROM node:22.17-slim AS base
WORKDIR /app
# Install dependencies
COPY package*.json ./server/
RUN cd server && npm install

# Server development stage
FROM base AS server-dev
COPY . ./server
WORKDIR /app/server
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Server production build stage
FROM base AS server-build
COPY . ./server
WORKDIR /app/server
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]