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
    && adduser -S production_user -G production  \
    && chown -R production_user:production /var/cache/nginx /var/run/ /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown production_user:production /var/run/nginx.pid
COPY production-nginx.conf /etc/nginx/conf.d/production-nginx.conf
COPY --from=build /app/dist/gorrila_shop/ /usr/share/nginx/html
USER production_user
EXPOSE 81
CMD ["nginx", "-g", "daemon off;"]
