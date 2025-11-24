# ---------- 构建阶段 ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # 如果你是 pnpm：
    COPY package*.json pnpm-lock.yaml* ./
    RUN npm install -g pnpm
    RUN pnpm install --frozen-lockfile
    
    # 如果你是 npm：
    # COPY package*.json ./
    # RUN npm install
    
    COPY . .
    
    # 假设你有 "build": "tsc" 或类似
    RUN pnpm build
    # npm 的话： RUN npm run build
    
    # ---------- 运行阶段 ----------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # 只安装生产依赖
    COPY package*.json pnpm-lock.yaml* ./
    RUN npm install -g pnpm
    RUN pnpm install --prod --frozen-lockfile
    # npm 的话： RUN npm install --only=production
    
    # 把编译好的 dist 拷贝进来
    COPY --from=builder /app/dist ./dist
    
    ENV NODE_ENV=production
    ENV PORT=3000
    
    EXPOSE 3000
    
    CMD ["node", "dist/index.js"]
    