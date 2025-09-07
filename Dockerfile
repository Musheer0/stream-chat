FROM node:20-alpine
WORKDIR /main
RUN npm i -g pnpm

COPY package*.json ./
RUN pnpm i 
COPY . .
COPY .env . 
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "start"]
