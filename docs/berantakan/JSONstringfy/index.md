---
order: 5
title: JSON.stringfy
group:
  path: /berantakan
  title: 杂谈
  order: 4
---

# JSON.stringfy 的三个参数

## 方法概述

JSON.stringify 方法是 JavaScript 中的一个内置函数，用于将 JavaScript 对象转换为 JSON 字符串。该函数接受三个参数：value、replacer 和 space。

## 参数

以下是 JSON.stringify 方法的三个参数的详细说明。

### 1.value 参数

类型：任意 JavaScript 值（对象、数组、字符串、数字、布尔值等）

描述：要转换为 JSON 字符串的 JavaScript 值。

举个 🌰

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj);
// {"name":"John","age":30,"hobbies":["reading","coding","gaming"]}
```

注意点 ❗️❗️

```js
//  1. value值不允许存在undefined, 如果为undefined，会直接将这个key过滤掉
const obj = {
  name: 'John',
  age: undefined,
  hobbies: undefined,
};

const str = JSON.stringify(obj);
// {"name":"John"}

// 2. value值不允许存在function, 如果为function，会直接将这个key过滤掉
const obj = {
  name: 'John',
  age: function () {},
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj);
// {"name":"John","hobbies":["reading","coding","gaming"]}

// 3. value值不允许为日期格式，会转成字符串格式
const obj = {
  name: 'John',
  age: new Date(),
  hobbies: ['reading', 'coding', 'gaming'],
};
// {
//   name: 'John',
//   age: 2023-06-27T02:59:36.871Z,
//   hobbies: [ 'reading', 'coding', 'gaming' ]
// }

const str = JSON.stringify(obj);
// {"name":"John","age":"2023-06-27T03:00:09.727Z","hobbies":["reading","coding","gaming"]}

// 4. 数组属性中的 undefined、Symbol 类型的元素 null
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', undefined, Symbol('three'), 'gaming'],
};
const str = JSON.stringify(obj);
// {"name":"John","age":30,"hobbies":["reading",null,null,"gaming"]}
```

### 2.replacer 参数

类型：函数或数组

描述：可选参数。用于控制字符串化过程的转换功能。

如果 replacer 是一个函数，则每次转换过程中，都会调用该函数，并传递两个参数：键和值。可以在函数内部对值进行转换，返回的值将成为最终的 JSON 字符串的一部分。如果返回 undefined，则忽略该属性。

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, (k, v) => {
  if (k === 'age') {
    return v + 10;
  }
  return v;
});
console.log('str :>> ', str);
// {"name":"John","age":40,"hobbies":["reading","coding","gaming"]}
```

注意点 ❗️❗️

当为函数的情况下，会迭代循环遍历该函数个每一项

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, (k, v) => {
  console.log('k :>> ', k);
  console.log('v :>> ', v);
  return v;
});
// k :>>
// v :>>  { name: 'John', age: 30, hobbies: [ 'reading', 'coding', 'gaming' ] }
// k :>>  name
// v :>>  John
// k :>>  age
// v :>>  30
// k :>>  hobbies
// v :>>  [ 'reading', 'coding', 'gaming' ]
// k :>>  0
// v :>>  reading
// k :>>  1
// v :>>  coding
// k :>>  2
// v :>>  gaming
```

如果 replacer 是一个数组，可以理解为白名单，只有在数组中的 key 将会被保留。其他属性将被忽略。

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, ['name', 'age']);
// {"name":"John","age":30}
```

如果 replacer 为 null 或未提供，则所有属性都会被包含在最终的 JSON 字符串中。

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, null);
// {"name":"John","age":30,"hobbies":["reading","coding","gaming"]}
```

### 3.space 参数

类型：字符串或数值

描述：可选参数。用于美化输出 JSON 字符串的格式。

如果 space 是一个字符串，则用于缩进<font color="red">每一级</font>的空白字符，最大长度为 10 个字符。例如，可以传递 " " 以使用两个空格缩进。

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, null, '**');
// {
// **"name": "John",
// **"age": 30,
// **"hobbies": [
// ****"reading",
// ****"coding",
// ****"gaming"
// **]
// }

const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, null, '****');
// {
// ****"name": "John",
// ****"age": 30,
// ****"hobbies": [
// ********"reading",
// ********"coding",
// ********"gaming"
// ****]
// }
```

如果 space 是一个数值，则表示缩进的空格数。最大值为 10。

```js
const obj = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding', 'gaming'],
};

const str = JSON.stringify(obj, null, 2);
// {
//   "name": "John",
//   "age": 30,
//   "hobbies": [
//     "reading",
//     "coding",
//     "gaming"
//   ]
// }
```

### 4.返回值

类型：字符串
描述：一个表示输入对象的 JSON 字符串。

<font color="#dddd00">失败并不可怕，真正可怕的是从不去尝试。</font>

<!-- git talk -->

```tsx
import React from 'react';
import Talk from '../../talk.tsx';
export default () => <>{Talk('stringfy')}</>;
```
