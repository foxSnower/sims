# 指定我们的基础镜像是node，版本是v8.14.0
FROM node:8.14.0-slim
# 指定制作我们的镜像的联系人信息（镜像创建者）
MAINTAINER xiayt

# 将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
ADD . /app/
# cd到app文件夹下
WORKDIR /app

# 安装项目依赖包
RUN  npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install --unsafe-perm

# 配置环境变量
ENV NODE_ENV_BUILD  DEV
ENV HOST 0.0.0.0
ENV PORT 32206
ENV GATEWAY_URL http://172.16.200.110:30111/

# 容器对外暴露的端口号
EXPOSE 32206

# 容器启动时执行的命令，类似npm run start
CMD ["npm", "start"]
