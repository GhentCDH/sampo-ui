# Build client using client/Dockerfile
FROM dockerfile AS client-build
WORKDIR /app/client
COPY client/ .
RUN npm run build

# Build server using server/Dockerfile
FROM dockerfile AS server-build
WORKDIR /app/server
COPY server/ .
RUN npm run build

# Final production stage
FROM node:22.17-slim
WORKDIR /app
# Copy client build output and server.js
COPY --from=client-build /app/client/dist ./client/dist
COPY --from=client-build /app/client/server.js ./client/
COPY --from=client-build /app/client/node_modules/express ./client/node_modules/express
# Copy server build output
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/node_modules ./server/node_modules
# Install pm2 to manage multiple processes
RUN npm install -g pm2@5.4.2
# Expose ports
EXPOSE 8080
EXPOSE 3001
# Start both client and server with pm2
CMD ["pm2-runtime", "start", "--name", "client", "client/server.js", "--", "--name", "server", "server/dist/index.js"]