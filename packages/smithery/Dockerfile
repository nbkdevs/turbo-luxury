FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
ENV NODE_ENV=production PORT=8081
USER node
EXPOSE 8081
CMD ["node", "src/index.js"]
