FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV PORT=3000 \
    NODE_ENV=production \
    MONGODB_URI=mongodb://admin:password@mongo:27017/ecommerce \
    JWT_KEY=supersecretkey \
    ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8000

EXPOSE 3000

CMD ["node", "./bin/www"]
