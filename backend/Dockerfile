FROM node:18

WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ source code
COPY . .

EXPOSE 4000

# Run production (nếu dev thì để npm run dev)
CMD ["npm", "start"]
