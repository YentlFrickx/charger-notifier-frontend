FROM node:alpine AS builder
WORKDIR /app
COPY package.json .

RUN npm install

COPY . .

RUN npx tailwindcss -i ./src/input.css -o ./public/main.css

FROM nginx:alpine

WORKDIR /app

COPY --from=builder /app/public .
COPY ./nginx.conf /etc/nginx/nginx.conf