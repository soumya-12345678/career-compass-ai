FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# 1. Clear out any default Nginx junk
RUN rm -rf /usr/share/nginx/html/*

# 2. Copy the built React app into the standard root folder
COPY --from=builder /app/dist /usr/share/nginx/html

# 3. Write a simple, standard Nginx config for React routing
RUN printf 'server {\n\
    listen 80;\n\
    \n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
