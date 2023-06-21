---
order: 1
title: 手写 promise基本逻辑
group:
  path: /berantakan
  title: 杂谈
  order: 4
---

# JS 手写 promise 基本逻辑

```js
/*
1. 有一个执行器，执行器立即执行
2. 执行器包含2个参数，且参数为函数
3. 需要有then函数, 有两个函数参数，onFullFilled, onRejected
4. 执行完then函数之后需要变更状态，且状态一旦发生改变即不可再变
5. 考虑executor内可能为异步函数, 所以需要在then中添加status为pending的状态判断
6. 支持链式调用，所以需要返回一个promise对象
7. 后面的then函数执行resolve 或reject 应该依赖于上一个then的返回状态
8. 只要上一个then的返回不为reject或者抛出异常，即走resolve
9. 对于then的返回值，可以为（普通数据，undefined）都是作为fullfilled来处理, 也可以为promise，对于返回promise的then则需要进行判断promise的返回值是为fullfilled还是rejected
10. 完成实例的catch方法
11. 完成实例的finally方法
12. 完成promise.all方法
13. 完成promise.race方法
14. 完成promise.resolve方法
15. 完成promise.reject方法
*/

const PENDING = 'PENDING';
const FULLFILLED = 'FULLFILLED';
const REJECTED = 'REJECTED';

const resolvePromise = (x, promise2, resolve, reject) => {
  // 通过判断x的值来决定promise2是成功还是失败
  if (x === promise2) {
    // 如果相等, 特殊错误提示
    reject(new TypeError('sdasd'));
  }
  // 判断返回的是不是promise，如果返回的是对象或者是函数，则有可能是promsie
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        // 可以认为返回的x 是一个promise
        // 调用then方法，并传两个参数onResolved，onRejected两个函数
        then.call(
          x,
          (value) => {
            resolvePromise(value, promise2, resolve, reject);
          },
          (reason) => {
            reject(reason);
          },
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      reject(error);
    }
  } else {
    resolve(x);
  }
};

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.errorHandler = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      // 因为状态一旦发生改变就不能再变化，所以加个if
      if (this.status === PENDING) {
        // 1. 如果参数是普通值, 相当于直接new promise对象，然后调用resolve
        // 2. 如果参数是一个 Promise 实例, 直接值返回，因为promise对象有then方法，可以直接使用
        // 3. 如果参数是有thenable的对象或者函数, 相当于new Promise对象，然后立即调用then方法将之作为执行器，并
        // 向then方法传递resolve和reject
        if (
          value instanceof Promise ||
          (value && typeof value.then === 'function')
        ) {
          value.then(resolve, reject);
        } else {
          this.status = FULLFILLED;
          this.value = value;
          this.onResolvedCallbacks.forEach((fn) => fn());
        }
      }
    };
    const reject = (reason) => {
      this.reason = reason;
      this.status = REJECTED;
      this.onRejectedCallbacks.forEach((fn) => fn());
      // 如果有catch方法则执行
      if (this.errorHandler) {
        this.errorHandler(reason);
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullFilled, onRejected) {
    // promise的穿透，即可以不传onFullFilled或者onFullFilled，可向下传递
    onFullFilled = typeof onFullFilled === 'function' ? onFullFilled : (v) => v;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : () => {
            throw this.reason;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULLFILLED) {
        process.nextTick(() => {
          try {
            let x = onFullFilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === REJECTED) {
        process.nextTick(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === PENDING) {
        // 调用then的时候既没成功，也没失败，因为可能是异步
        // 那么就需要把函数给存储起来，待异步完成后再去执行，但是同时需要把传递的值也给存储起来
        // 存储值，考虑高阶函数闭包
        this.onResolvedCallbacks.push(() => {
          process.nextTick(() => {
            try {
              let x = onFullFilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          process.nextTick(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return promise2;
  }

  catch(onError) {
    this.errorHandler = onError;
  }
  // 不管 Promise 对象最后状态如何，都会执行的操作,其实可以理解为特殊的then方法
  finally(callback) {
    return this.then(
      () => Promise.resolve(callback()),
      () => Promise.resolve(callback()),
    );
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      const results = [];
      let completeCount = 0;
      for (let i = 0; i < promises.length; i++) {
        try {
          promises[i].then(
            (res) => {
              // 确保顺序，所以此处不用push
              results[i] = res;
              if (++completeCount === promises.length) {
                resolve(results);
              }
            },
            (e) => {
              reject(e);
            },
          );
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        try {
          promises[i].then(
            (res) => {
              resolve(res);
            },
            (e) => {
              reject(e);
            },
          );
          // 拿到一个结果之后不需要继续执行
          return;
        } catch (e) {
          reject(e);
        }
      }
    });
  }

  // 有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。
  static resolve(value) {
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  // 传入的参数会原封不动的作为reject理由
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
}
```

你只看到了别人表面的轻松, 殊不知别人背后可能更加的轻松, 不可否认总是有那么一部分天才的存在。

<!-- git talk -->

```tsx
import React from 'react';
import Talk from '../../talk.tsx';
export default () => <>{Talk('promise')}</>;
```
