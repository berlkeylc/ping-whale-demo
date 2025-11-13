# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG ENV=production
RUN npm run build -- --configuration=$ENV

# RUN npm run build

# Runtime stage
FROM nginx:alpine

ENV PORT=80
EXPOSE 80

COPY --from=build /app/dist/pw-client/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
CMD ["nginx", "-g", "daemon off;"]
