FROM node:20-alpine AS builder

WORKDIR /app

# Copy EVERYTHING first
COPY . .

# Then install
RUN npm install

# Then build
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html