<!--
 * @Description:
 * @Author: Devin
 * @Date: 2022-11-21 21:21:14
-->
<div align="center">
  <h1>OHIF Medical Imaging Viewer</h1>
</div>

## 1、打包流程

注意：node.js 和 yarn 与 cnpm 需提前安装

```bash
# 切换镜像
yarn config set workspaces-experimental true

# 安装依赖
yarn install


cnpm  install  pdfjs-dist@2.2.228 react-transition-group@4.2.1 --save  //react-transition-group依赖出错问题

#打包命令
yarn build

#打包的文件路径
/platform/viewer/dist

```

<hr />

## 2、OHIF 前端服务配置

```js
 server {
        listen       8042;#①配置访问端口
        server_name  localhost;#②配置访问方式

        location / {
            root   /home/dechang/dist;
            index  index.html index.htm;
                }
    }
```

## 3、nginx Orthanc 后端服务配置

```js
server {
   listen  2099  default_server;
   location  /  {
	  add_header  'Access-Control-Allow-Credentials' 'true' always;
      add_header  'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type' always;
      add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
      add_header  'Access-Control-Allow-Origin' '*' always ;
	  if ($request_method = 'OPTIONS'){
       add_header 'Access-Control-Allow-Origin' '*' always;
       add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range' always;
        return 200;
      }
      proxy_pass http://127.0.0.1:8042;
      proxy_set_header HOST $host;
      proxy_set_header X-Real-IP $remote_addr;
      #rewrite /orthanc(.*) $1 break;
   }
}


```

## 4、文件目录

```bash
.
├── extensions              #
│   ├── _example            # Skeleton of example extension
│   ├── cornerstone         # 2D images w/ Cornerstone.js
│   ├── dicom-html          # Structured Reports as HTML in viewport
│   ├── dicom-microscopy    # Whole slide microscopy viewing
│   ├── dicom-pdf           # View DICOM wrapped PDFs in viewport
│   └── vtk                 # MPR and Volume support w/ VTK.js
│
├── platform                #
│   ├── core                # Business Logic
│   ├── i18n                # Internationalization Support
│   ├── ui                  # React component library
│   └── viewer              # Connects platform and extension projects
│
├── ...                     # misc. shared configuration
├── lerna.json              # MonoRepo (Lerna) settings
├── package.json            # Shared devDependencies and commands
└── README.md               # This file
```
