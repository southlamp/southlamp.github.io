---
order: 2
title: TS关键字和工具类型
group:
  path: /berantakan
  title: 杂谈
  order: 3
---

# TS 关键字和工具类型

## 一. 关键字

### 1. keyof

keyof 与 Object.keys()相似，不过 keyof 是用来获取对象类型的键

举个 🌰

```ts
interface Person {
  age: number;
  name: string;
}

type PersonKeys = typeof Person; // "age" | "name"
```

### 2. typeof

typeof 是获取数据的类型，常用用于获取 对象、数组、函数、class、枚举等类型

举个 🌰

```ts
// 对象
const person = {
  name: 'lili',
  age: 18,
};

type Person = typeof person;
// 相当于

type Person = {
  name: string;
  age: number;
};

// 数组
const arr = ['as', 10];
type Arr = typeof arr;

// 相当于
type Arr = (string | number)[];
```

### 3. extends

extends 是用来继承

注意只有 interface 和 class 才可以继承

type 声明的类型无法继承

举个 🌰

```ts
interface Person {
  name: string;
  age: number;
}

interface Player extends Person {
  item: 'ball' | 'swing';
}
// 相当于
interface Player {
  name: string;
  age: number;
  item: 'ball' | 'swing';
}
```

### 4. in

in 关键字可以帮我们生成映射类型。 一般循环的是 联合类型。

举个 🌰

```ts
type Keys = 'name' | 'gender';
type PersonMap = {
  [key in Keys]: string;
};

// 相当于
type PersonMap = {
  name: string;
  gender: string;
};
```

### 5. is

常用作为类型保护

举个 🌰

```ts
function isNumber(val): val is number {
  return typeof val === 'number';
}
function isNumber0(val): boolean {
  return typeof val === 'number';
}

const a = isNumber(10);
const b = isNumber0(10);
```

上述表达式来看, 两者似乎并没有差别, is 的效果不明显。

```ts
function doSomething(params: any) {
  if (isNumber(params)) {
    params.toFixed();
    // params.xxx(); // --> Property 'xxx' does not exist on type 'string'
  }
  if (isNumber0(params)) {
    params.xxx();
  }
}

doSomething(30);
```

上述复杂场景已经可以发现，在调用 params 时已经有相关 ts 提示可以调用的方法。当符合 isNumber 时有提示仅可调用 number 的方法，但是当 isNumber0 时并没有任何提示，仅会在运行时报错。

### 6. infer

目前还晕晕乎乎没理解，单独整理一节吧。

## 二. 工具类型

### Record

#### 1.1 源码

```typescript
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};
```

#### 1.2 作用

作用: 定义一个对象的 key 和 value 类型

```ts
Record < string, never > 空对象;
Record < string, unknown > 任意对象;
```

#### 1.3 实例

```ts
type Bar = Record<string, number | string>;
// 相当于
type Bar = {
  [key: string]: number | string;
};
```

### Partial

#### 2.1 源码

```typescript
type Partial<T> = {
  [P in keyof T]?: Partical<T[P]>;
};
```

#### 2.2 作用

作用: 生成一个新的类型，这个类型与 T 拥有相同的属性，但是所有的属性都是可选属性。

#### 2.3 实例

```ts
interface Foo {
  age: number;
  name: string;
}

type Bar = Partial<Foo>;
// 相当于
type Bar = {
  age?: number;
  name?: string;
};
```

### Required

#### 3.1 源码

```ts
type Require<T> = {
  // -? 表示移除所有可选的属性
  [P in keyof T]-?: T[P];
};
```

#### 3.2 作用

作用: 生成一个新的类型，这个类型与 T 拥有相同的属性，但是所有的属性都是必选属性。

#### 3.3 实例

```ts
interface Foo {
  age?: number;
  name?: string;
}

type Bar = Require<Foo>;
// 相当于
type Bar = {
  age: number;
  name: string;
};
```

### Readonly

#### 4.1 源码

```ts
type Readonly<T> = {
  // -? 表示移除所有可选的属性
  readonly [P in keyof T]: T[P];
};
```

#### 4.2 作用

作用: 生成一个新的类型，这个类型与 T 拥有相同的属性，但是所有的属性都是只读属性。

#### 4.3 实例

```ts
interface Foo {
  age: number;
  name: string;
}

type Bar = Readonly<Foo>;
// 相当于
type Bar = {
  readonly age: number;
  readonly name: string;
};
```

### Pick

#### 5.1 源码

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

#### 5.2 作用

作用: 从 T 中筛选属性为 K 的集合。

#### 5.3 实例

```ts
interface A {
  name: string;
}

interface B {
  name: string;
  age: number;
}

type C = Pick<B, keyof A>;

// 等价于
type C = {
  name: string;
};
```

### Omit

#### 6.1 源码

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

#### 6.2 作用

作用：生成一个新类型，该类型拥有 T 中除了 K 属性以外的所有属性; Exclude<keyof T, K> => 过滤掉 T 中的 K 属性 ;

#### 6.3 实例

```ts
type Foo = {
  name: string;
  age: number;
};

type Bar = Omit<Foo, 'age'>;
// 相当于
type Bar = {
  name: string;
};
```

### Extract

#### 7.1 源码

```ts
type Exclude<T, U> = T extends U ? T : never;
```

#### 7.2 作用

`Extract<Type, Union>`
作用：提取 Type 中所有能够赋值给 Union 的属性，将这些属性构成一个新的类型

#### 7.3 实例

```ts
type A = number | string | boolean;
type B = number | boolean;

type Foo = Extract<A, B>;
// 相当于
type Foo = number | boolean;
```

### Exclude

#### 8.1 源码

```ts
type Exclude<T, U> = T extends U ? never : T;
```

#### 8.2 作用

`Exclude<UnionType, ExcludedMembers>`

作用：从 UnionType 中去掉所有能够赋值给 ExcludedMembers 的属性，然后剩下的属性构成一个新的类型

#### 8.3 实例

```ts
type A = number | string | boolean;
type B = number | boolean;

type Foo = Exclude<A, B>;
// 相当于
type Foo = string;
```

### NonNullable

#### 9.1 源码

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### 9.2 作用

作用：约束类型不能为 null 和 undefined

### Parameters

#### 10.1 作用

作用： 获取一个函数的参数类型，返回的是一组包含类型的数组

#### 10.2 实例

```ts
function foo(p1: string, p2: number) {}

type params = Parameters<typeof foo>;

// 相同于
type params = [p1: string, p2: number];
```
