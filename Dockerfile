FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

ENV DATABASE_URL=${DATABASE_URL}

COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN apk update && apk add --no-cache postgresql-client
RUN chmod +x /app/entrypoint.sh
RUN yarn install
ENTRYPOINT ["/app/entrypoint.sh"]
EXPOSE 6060
