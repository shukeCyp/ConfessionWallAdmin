# 构建阶段
FROM npmjs/npm-docker-baseline:18 as builder

WORKDIR /app

# 设置 npm 使用阿里云镜像源
RUN npm config set registry https://registry.npmmirror.com \
    && npm config set disturl https://npmmirror.com/mirrors/node \
    && npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass \
    && npm config set electron_mirror https://npmmirror.com/mirrors/electron/ \
    && npm config set puppeteer_download_host https://npmmirror.com/mirrors \
    && npm config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver \
    && npm config set operadriver_cdnurl https://npmmirror.com/mirrors/operadriver \
    && npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs \
    && npm config set selenium_cdnurl https://npmmirror.com/mirrors/selenium \
    && npm config set node_inspector_cdnurl https://npmmirror.com/mirrors/node-inspector

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