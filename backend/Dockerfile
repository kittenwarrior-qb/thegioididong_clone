FROM node:22-alpine

WORKDIR /app

# Copy package.json và cài dependencies (bao gồm pm2)
COPY package*.json ./
RUN npm install --production
RUN npm install pm2 -g

# Copy toàn bộ code
COPY . .

EXPOSE 4000

# Chạy backend với pm2-runtime
CMD ["npm", "start"]
