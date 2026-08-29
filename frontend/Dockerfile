FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BACKENDURL=http://localhost:3000
ENV VITE_BACKENDURL=$VITE_BACKENDURL

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
