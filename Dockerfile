FROM node:16-alpine AS build

ARG ENV='production'
WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts
COPY angular.json ./
COPY src ./src
COPY background.jpg ./
COPY tsconfig*.json ./
RUN npm run build  --  --output-path=dist/gorrila_shop --configuration=$ENV
# Serve Application using Nginx Server
FROM nginx:alpine AS runtime
WORKDIR /app
RUN addgroup -S production \
    && adduser -S administrator_user -G production  \
    && chown -R administrator_user:production /var/cache/nginx /var/run/ /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown administrator_user:production /var/run/nginx.pid
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/gorrila_shop/ /usr/share/nginx/html
USER administrator_user
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
