FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# 1. Clear out any default Nginx junk
RUN rm -rf /usr/share/nginx/html/*

# 2. Copy the built React app into the specific sub-folder
COPY --from=builder /app/dist /usr/share/nginx/html/career-compass

# 3. Use printf (which Alpine loves) to write a perfect Nginx config
RUN printf 'server {\n\
    listen 80;\n\
    \n\
    location /career-compass/ {\n\
        alias /usr/share/nginx/html/career-compass/;\n\
        index index.html;\n\
        try_files $uri $uri/ /career-compass/index.html;\n\
    }\n\
    \n\
    location / {\n\
        return 301 /career-compass/;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80