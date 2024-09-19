---
order: 9
title: JS 循环
group:
  path: /berantakan
  title: 杂谈
  order: 3
---

# 原生 js 循环

### for 循环

1. 用于任何类型的循环，特别是需要根据条件进行复杂循环时。
1. 可以使用 break 和 continue 控制循环。
1. 可以自定义索引和步长

```js
const array = [1, 2, 3, 4, 5];

for (let i = 0; i < array.length; i++) {
  if (array[i] === 3) {
    break; // 当值为3时终止循环
  }
  console.log(array[i]); // 输出 1, 2
}
```

### for ... of

1. 用于遍历可迭代对象（如数组、字符串、Set、Map）
2. 可以使用 break 和 continue 控制循环。
3. 不适用于普通对象（需要使用 for...in）

```js
const array = [1, 2, 3, 4, 5];

for (const value of array) {
  if (value === 3) {
    break; // 当值为3时终止循环
  }
  console.log(value); // 输出 1, 2
}
```

### for ... in

1. 适用于普通对象
2. 遍历对象的可枚举属性：for...in 可以用来遍历一个对象的所有可枚举属性，包括继承的属性。

```js
const person = {
  name: 'Alice',
  age: 30,
  occupation: 'Engineer',
};

for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
// 输出：
// name: Alice
// age: 30
// occupation: Engineer

// 使用hasOwnProperty 是为了确保只遍历对象自身的属性，而不包括其原型链上的属性
const obj = {
  a: 1,
  b: 2,
};

Object.prototype.c = 3; // 添加一个继承属性

for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(`${key}: ${obj[key]}`);
  }
}
// 输出：
// a: 1
// b: 2

// 不使用的情况下
for (const key in obj) {
  console.log(`${key}: ${obj[key]}`);
}
// 输出：
// a: 1
// b: 2
// c: 3
```

### map

1. map 方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。
2. map 不会修改原数组，会返回一个新的数组。因此适用于转换数据格式
3. 可以链式调用，因为它返回新数组，允许与其他数组方法一起使用

```js
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // 输出: [2, 4, 6, 8]
```

### forEach

1. forEach 方法与 map 方法很相似, 不返回值，只用来操作数据
2. 主要用于遍历数组
3. 不能链式调用，因为它返回 undefined

```js
numbers.forEach((num) => {
  console.log(num * 2); // 输出: 2, 4, 6
});
```

### filter

1. filter 方法用于过滤数组成员，满足条件的成员组成一个新数组返回。它的参数是一个函数，所有数组成员依次执行该函数，返回结果为 true 的成员组成一个新数组返回。该方法不会改变原数组

```js
[1, 2, 3, 4, 5].filter(function (elem) {
  return elem > 3;
});
// [4, 5]

// 上面代码将大于3的数组成员，作为一个新数组返回。
var arr = [0, 1, 'a', false];
arr.filter(Boolean);
// [1, "a"]
```

### reduce

1. reduce 方法是 JavaScript 数组中的一个强大功能，用于将数组中的元素累积成一个单一的值。它通常用于总和、平均值、扁平化数组等操作。

```js
const result = array.reduce((accumulator, currentValue, index, array) => {
  // 处理逻辑
  return newAccumulator; // 返回新的累积值
}, initialValue);
```

2. 参数

- callback: 一个函数，接收以下参数：

- - accumulator: 累积器，存储上一次调用 callback 的返回值，初始为 initialValue。
- - currentValue: 当前处理的数组元素。
- - index (可选): 当前元素的索引。
- - array (可选): 原数组。
- - initialValue (可选): 指定第一次调用 callback 时 accumulator 的初始值。如果未提供，reduce 将使用数组的第一个元素作为初始值，并从第二个元素开始处理。

```js
// 计算数组元素的和
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, num) => acc + num);
console.log(sum); // 输出: 10

// 扁平化数组
const nestedArray = [[1, 2], [3, 4], [5]];
const flatArray = nestedArray.reduce((acc, val) => acc.concat(val), []);
console.log(flatArray); // 输出: [1, 2, 3, 4, 5]
```

### Object.keys

1. 方法的参数是一个对象，返回一个数组。该数组的成员都是该对象自身的（而不是继承的）所有属性名，且只返回可枚举的属性。

```js
const obj = {
  p1: 123,
  p2: 456,
};

Object.keys(obj);
// ["p1", "p2"]
```
