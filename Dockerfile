# Build stage
FROM node:18-alpine3.14 AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm install
COPY . .
RUN pnpm run build 

# Runtime stage
FROM node:18-alpine3.14
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist /app

RUN adduser -D appuser
USER appuser
CMD ["node", "main"]
