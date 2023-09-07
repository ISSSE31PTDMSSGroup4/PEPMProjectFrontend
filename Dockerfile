FROM node:latest as builder

WORKDIR /app

COPY ./ /app
RUN npm install
RUN npm run build

FROM alpine:latest
COPY --from=builder /app/build /build
