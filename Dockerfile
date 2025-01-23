# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 将构建产物放在 /app/dist 目录
VOLUME /app/dist

CMD ["npm", "run", "preview"] 