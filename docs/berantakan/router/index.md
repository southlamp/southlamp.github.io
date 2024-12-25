---
order: 12
title: 路由之hash/history
group:
  path: /berantakan
  title: 杂谈
  order: 3
---

# 前端的路由基本上是靠 hash 和 history 来实现的

无论是 react 还是 vue, 其路由实现都是靠 hash 和 history 来实现的, 下面分别进行详细说明。

## hash 模式

### 形式

比如在用超链接做锚点的时候，在 url 后面会跟着`#id`, hash 值指的就是从`#`到最后。

### 原理

hash 值变化，不会触发浏览器的重新请求。但是会触发`window.hashChange`事件。加入我们在 hashChange 的时候，获取当前的 hash 值,然后根据 hash 值来修改页面内容，就达到了前端路由的目的。

```html
<ul id="menu">
  <li>
    <a href="#index">首页</a>
  </li>
  <li>
    <a href="#news">资讯</a>
  </li>
  <li>
    <a href="#user">个人中心</a>
  </li>
</ul>

<div id="app"></div>
```

```js
class Router {
  constructor() {
    this.routers = []; //存放我们的路由配置
  }
  add(route, callback) {
    this.routers.push({
      path: route,
      render: callback,
    });
  }
  listen(callback) {
    window.onhashchange = this.hashChange(callback);
    this.hashChange(callback)(); //首次进入页面的时候没有触发hashchange，必须要就单独调用一下
  }
  hashChange(callback) {
    let self = this;
    return function () {
      let hash = location.hash;
      console.log(hash);
      for (let i = 0; i < self.routers.length; i++) {
        let route = self.routers[i];
        if (hash === route.path) {
          callback(route.render());
          return;
        }
      }
    };
  }
}

let router = new Router();
router.add('#index', () => {
  return '<h1>这是首页内容</h1>';
});
router.add('#news', () => {
  return '<h1>这是新闻内容</h1>';
});
router.add('#user', () => {
  return '<h1>这是个人中心内容</h1>';
});
router.listen((renderHtml) => {
  let app = document.getElementById('app');
  app.innerHTML = renderHtml;
});
```

简单实现一个 Router 类, 然后通过 add 方法添加路由。第一个参数为 path 路径，第二个参数为 render 函数，返回要插入的页面的 html。然后通过 listen 方法监听 hash 变化，并将每个路由返回的 html 插入到 app 中，这样就实现了一个简单的路由。

### history 模式

相对于 hash 模式的`#`比较丑来说，history 会漂亮很多，这也是我们平时看到的政策的连接形式。history 模式是基于 window.history 对象的方法

### 形式

正常的 url 路径，不携带`#`

### 原理

history 利用了 HTML5 的`pushState()`和`replaceState()`,提供了对浏览器的历史记录进行修改的功能。调用`pushState()`和`replaceState()`时虽然改变了当前的 url，但是不会对后端发起请求。但是如果浏览器刷新，则会对服务器发起请求。如果后端没有做出适当的响应，则会显示 404 页面。

### 区别

pushState()是在 history 栈中添加一个新的条目，replaceState()是替换当前的记录值。用 pushState 的时候会产生一条新的 history，replaceState 则不会产生。

1. 使用 pushState 会朝 history 栈中新增一项纪录。而使用 replaceState 则是替换 history 栈中的一项纪录。
2.

```js
// 首先打开百度页面 https://www.baidu.com/

history.pushState({}, null, 'https://www.baidu.com/?a=1');

// 如上：代码执行完毕后，浏览器的url发生变化为“https://www.baidu.com/?a=1”，不会向服务器发出新的请求。此时浏览器向后退的箭头可以执行，后退后会回到页面https://www.baidu.com/

history.replaceState({}, null, 'https://www.baidu.com/?a=1');

// 如上：代码执行完毕后，浏览器的url发生变化为“https://www.baidu.com/?a=1”，不会向服务器发出新的请求。此时浏览器向后退箭头为灰色不可执行。
```

### 注意

需要注意的是调用 history.pushState()或 history.replaceState()不会触发 popstate 事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在 Javascript 代码中调用 history.back()）
