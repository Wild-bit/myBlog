## Promise
> Promise 是 JavaScript 异步编程的一种流行解决方案，它的出现是为了解决 回调地狱 的问题，让使用者可以通过链式的写法去编写写异步代码。

实现Promise的前置知识：
- Promise是一个构造函数，通过new关键字创建对应Promise实例，接收一个**执行器函数**作为参数，该函数接收两个参数分别是resolve、reject，在构造函数中，**执行器函数立刻执行**
- Promise有三种状态 **pending(进行中)、resovled(已成功)、rejected(已失败)**
- resolve的作用是将Promise对象的状态将**pending -> resolved**
- reject函数的作用是，将Promise对象的状态**pendng -> rejected**
- then 方法 返回一个**新的Promise实例**（实现链式调用的基础），then 接收两个参数，分别是 Promise 成功的回调 **onFulfilled**，和失败的回调 **onRejected**
- catch用于指定发生错误时的回调函数。

## 基础版
> 不考虑链式调用、状态变化、只支持调用then方法

先上个单测代码：
```js
let p1 = new MyPromise((resolve, reject) => {
    console.log('立即执行')
    setTimeout(() => {
      resolved('成功了');
    }, 1000);
})

p1.then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
})
```
实现：
```js
class MyPromise {
    constructor (executor){
        this.value = null // 用于保存 resolve 的值
        this.reason = null // 用于保存reject的值
        this.onFulfilled = null;// 用于保存 then 的成功回调
        this.onRejected = null;// 用于保存 then 的失败回调
        // executor 的 resolve 参数
        // 用于改变状态 并执行 then 中的失败回调
        let resolve = value => {
            this.value = value
            this.onFulfilled && this.onFulfilled(this.value)
        }
        // executor 的 reject 参数
        // 用于改变状态 并执行 then 中的失败回调
        let reject = reason => {
            this.reason = reason;
            this.onRejected && this.onRejected(this.reason);
        }
        // 执行executor 将resolve、reject两个函数作为参数传入
        try {
            executor(resolve, reject);
        } catch(err) {
            reject(err);
        }
    }
    // 接收两个参数onFulfilled 、onRejected
    then(onFulfilled,onRejected){
        this.onFulfilled = onFulfilled
        this.onRejected = onRejected
    }
}
```
这样基础版的Promise就完成了
未实现：
- 由于还没支持状态改变所以现在状态可以随意变，不符合 Promise 状态只能从等待态变化的规则。
- 不支持链式调用