FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# 1. COPY INTO A SUB-FOLDER: Notice the /career-compass at the end
COPY --from=builder /app/dist /usr/share/nginx/html/career-compass

# 2. UPDATE NGINX: Tell it to listen for the sub-path
RUN echo $'server {\n\
    listen 80;\n\
    location /career-compass/ {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /career-compass/index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80