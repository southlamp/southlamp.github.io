---
order: 4
title: JsonPath
group:
  path: /berantakan
  title: 杂谈
  order: 3
---

# JsonPath

使用 JSONPath 表达式查询 JavaScript 对象。

### Install

```js
$ npm install jsonpath
```

### JSONPath 语法

| 语法             | 描述                                           |
| ---------------- | ---------------------------------------------- |
| $                | 根节点                                         |
| @                | 当前的对象                                     |
| .                | 子节点                                         |
| ..               | 递归所有的子节点                               |
| \*               | 通配符，匹配所有对象/元素                      |
| []               | 下标运算符                                     |
| [,]              | 并集运算符，用于替代名称或数组索引作为一个集合 |
| [start:end:step] | 数组切片运算符                                 |
| ?()              | 静态表达式                                     |

### demo

```js
{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      }, {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }, {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }, {
         "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
```

| 路径                                            | 描述                                             |
| ----------------------------------------------- | ------------------------------------------------ |
| $.store.book[*].author                          | 商店中所有书籍的作者。                           |
| $..author                                       | 所有书籍的作者                                   |
| $.store.\*                                      | 商店里的所有物品，其中包括书和自行车             |
| $.store..price                                  | 商店里的所有价格                                 |
| $..book[2]                                      | 通过下标获取第三本书                             |
| $..book[(@.length-1)]                           | 通过脚本下标获取最后一本书                       |
| $..book[-1:]                                    | 通过切片获取最后一本书                           |
| $..book[0,1]                                    | 通过下标获取前两本书                             |
| $..book[:2]                                     | 获取前两本书                                     |
| $..book[?(@.isbn)]                              | 所有的书(包含 isbn 的)                           |
| $..book[?(@.price<10)]                          | 所有的书价格低于 10 的                           |
| $..book[?(@.price==8.95)]                       | 所有的书价格为 8.95 的                           |
| $..book[?(@.price<30 && @.category=="fiction")] | 所有的书价格低于 30 而且 category 为 function 的 |

### Methods

1. jp.query(obj, pathExpression[, count])

在 obj 中查找与 pathExpression 匹配的元素。如果没有匹配的元素，则返回一个空数组。如果指定了数量（count），则只返回前 count 个元素。

```js
var authors = jp.query(data, '$..author');
// [ 'Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien' ]
```

2. jp.paths(obj, pathExpression[, count])

查找在 obj 中与 pathExpression 匹配的元素路径。返回一个满足所提供的 JSONPath 表达式的元素路径数组。每个路径本身都是一个由键组成的数组，表示匹配元素在 obj 内的位置。如果指定了数量（count），则只返回前 count 条路径。

```js
var paths = jp.paths(data, '$..author');
// [
//   ['$', 'store', 'book', 0, 'author'] },
//   ['$', 'store', 'book', 1, 'author'] },
//   ['$', 'store', 'book', 2, 'author'] },
//   ['$', 'store', 'book', 3, 'author'] }
// ]
```

3. jp.nodes(obj, pathExpression[, count])

在 obj 中查找与 pathExpression 匹配的元素及其对应的路径。返回一个节点对象数组，每个节点都包含一个路径，其中包含一个由键组成的数组，表示匹配元素在 obj 内的位置，以及一个指向匹配元素的值。如果指定了数量（count），则只返回前 count 个节点。

```js
var nodes = jp.nodes(data, '$..author');
// [
//   { path: ['$', 'store', 'book', 0, 'author'], value: 'Nigel Rees' },
//   { path: ['$', 'store', 'book', 1, 'author'], value: 'Evelyn Waugh' },
//   { path: ['$', 'store', 'book', 2, 'author'], value: 'Herman Melville' },
//   { path: ['$', 'store', 'book', 3, 'author'], value: 'J. R. R. Tolkien' }
// ]
```

4. jp.value(obj, pathExpression[, newValue])

   返回与 pathExpression 匹配的第一个元素的值。如果提供了 newValue，则设置第一个匹配元素的值并返回新值。

5. jp.parent(obj, pathExpression)

   返回第一个匹配元素的父级。

6. jp.apply(obj, pathExpression, fn)

   在每个匹配元素上运行提供的函数 fn，并用函数的返回值替换每个匹配元素。该函数接受匹配元素的值作为唯一参数。返回具有更新值的匹配节点。

   ```js
   var nodes = jp.apply(data, '$..author', function (value) {
     return value.toUpperCase();
   });
   // [
   //   { path: ['$', 'store', 'book', 0, 'author'], value: 'NIGEL REES' },
   //   { path: ['$', 'store', 'book', 1, 'author'], value: 'EVELYN WAUGH' },
   //   { path: ['$', 'store', 'book', 2, 'author'], value: 'HERMAN MELVILLE' },
   //   { path: ['$', 'store', 'book', 3, 'author'], value: 'J. R. R. TOLKIEN' }
   // ]
   ```

7. jp.stringify(path)

给定一个路径，返回一个路径表达式的字符串形式。提供的路径可以是一个扁平的键数组，例如由 jp.nodes 返回的结果，或者可以是一个完全解析的路径表达式，以路径组件的数组形式表示，就像 jp.parse 返回的结果一样

```js
var pathExpression = jp.stringify(['$', 'store', 'book', 0, 'author']);
// "$.store.book[0].author"
```
