---
order: 11
title: script 脚本命令和npm包
group:
  path: /berantakan
  title: 杂谈
  order: 3
---

# 介绍一些好玩的脚本命令

最近在看 qiankun 的框架,发现了一些好玩的脚本和 npm 包，之前很少接触这些，做一些记录。

### 一：bash , 直接放 demo

```js
// package.json中

"scripts": {
  "clone:all": "bash ./scripts/clone-all.sh",
}
```

```sh
# scripts/clone-all.sh, 创建.sh后缀的脚本

#!/bin/bash

# 子仓库一
git clone git@xxx1.git

# 子仓库二
git clone git@xxx2.git
```

可以使用 bash 命令去执行.sh 后缀的脚本

说明如下:

1. 创建文件，可以不加后缀
2. 可以在文件中顶部声明，for example

```sh
#!/bin/bash  // 需要用bash命令去执行
#!/user/bin/env node // 需要用node命令去执行
```

### 二： npm-run-all

```js
"scripts": {
  "install": "npm-run-all --serial install:*",
  "install:package1": "npm install package1",
  "install:package2": "npm install package2"
}
```

- npm-run-all 的--serial 表示有顺序地一个个执行，--parallel 表示同时并行地运行
- install:：这个模式匹配所有以 install: 开头的脚本名称

### 三: dotenv

说明：dotenv 是一个 Node.js 模块，用于加载环境变量。它通过读取 .env 文件中的键值对，将这些变量注入到 process.env 中，使得在应用中可以方便地访问这些配置。

1. 安装

```js
npm install dotenv

```

2. 创建 .env.local 文件

```env
DB_HOST=localhost:local
DB_USER=root:local
DB_PASS=password:local

```

3. 创建 .env.prod 文件

```env
DB_HOST=localhost:prod
DB_USER=root:prod
DB_PASS=password:prod

```

4. 在代码中加载环境变量

```js
const dotenv = require('dotenv');

// 根据 NODE_ENV 变量选择文件
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local';
dotenv.config({ path: envFile });

// 现在可以访问环境变量
const dbHost = process.env.DB_HOST;
console.log(`Database Host: ${dbHost}`);
```

5. package.json 中 script 脚本

```js
"scripts": {
  "clone:all": "bash ./scripts/clone-all.sh",
  "dev:prod": "NODE_ENV=production node index.js",
  "dev:local": "NODE_ENV=development node index.js"
},
```

### 四: node-dev

说明：node-dev 是一个用于 Node.js 应用程序的开发工具，它可以自动监视文件变化并重新启动应用，从而提升开发效率。

自动重启：当文件发生变化时，node-dev 会自动重启 Node.js 应用，无需手动干预。

快速启动：与 nodemon 类似，但 node-dev 在重启时会更快，因为它优化了文件监听和重启的流程。

支持调试：可以与 Node.js 的调试选项结合使用，方便调试代码。

1. 安装

```js
npm install --save-dev node-dev

```

2. 在 package.json 中添加脚本

```json
{
  "scripts": {
    "dev": "node-dev index.js"
  }
}
```

3. 运行开发脚本

```js
npm run dev
```
