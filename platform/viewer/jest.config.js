/*
 * @Description: 
 * @Author: Deven
 * @Date: 2022-11-21 21:21:43
 */
const base = require("../../jest.config.base.js");
const pkg = require("./package");

module.exports = {
  ...base,
  name: pkg.name,
  displayName: pkg.name,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/globalSetup.js"]
  // rootDir: "../.."
  // testMatch: [
  //   //`<rootDir>/platform/${pack.name}/**/*.spec.js`
  //   "<rootDir>/platform/viewer/**/*.test.js"
  // ]
};


# 主进程叫master，负责管理子进程，子进程叫worker
# worker_processes配置项表示开启几个业务进程，一般和cpu核数有关
worker_processes  1;

events {
    worker_connections  1024;
}

http {
        # include表示可以引入其他文件，此处表示引入http mime类型
    include       mime.types;
    default_type  application / octet - stream;
    sendfile        on;
    keepalive_timeout  65;

        # 虚拟主机，可以配置多个
    server {
        listen       80;
        server_name  localhost;

    location / {
                # 路径匹配之后，哪个目录下去匹配相应的网页, html是相对路径
            root   / home / dechang / dist;
            index  index.html index.htm;
  }

        error_page   500 502 503 504 / 50x.html;
  location = /50x.html {
            root   html;
}
        }
