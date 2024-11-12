FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm turbo run build --filter=backend
CMD ["pnpm", "run", "start:prod"]

# 외부에서 접근할 수 있도록 포트 노출
EXPOSE 3000
