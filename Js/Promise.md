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

## 加强版

实现状态、链式调用
- 定义一个status属性用于记录当前Promise 的状态
- 定义两个数组用来存储then的两个回调 resolvedQueues 、rejectedQueues (将回调塞进数组中)
- 完善then函数
```js
class MyPromise {
    PENDING = 'pending'
    RESOLVED = 'resolved'
    REJECTED = 'rejected'
    constructor (executor){
        // 这里不适用this的原因是then函数返回的新的一个Promise
        this.status = MyPromise.PENDING
        this.value = null // 用于保存 resolve 的值
        this.reason = null // 用于保存reject的值
        this.onFulfilled = null;// 用于保存 then 的成功回调
        this.onRejected = null;// 用于保存 then 的失败回调
        // 用于保存 then 的成功回调数组
        this.resolvedQueues = [];
        // 用于保存 then 的失败回调数组
        this.rejectedQueues = [];
        // executor 的 resolve 参数
        // 用于改变状态 并执行 then 中的失败回调
        let resolve = value => {
            // 当目前Promise 状态是Pending时，改为Resolve
            if(this,status === MyPromise.PENDING){
                this.value = value
                this.status = MyPromise.RESOLVED
                this.resolvedQueues.forEach(cb => cb(this.value))
            }
        }
        // executor 的 reject 参数
        // 用于改变状态 并执行 then 中的失败回调
        let reject = reason => {
            // 当状态是 pending 是，将 promise 的状态改为失败态
            // 同时遍历执行 失败回调数组中的函数，将 reason 传入
            if (this.status == MyPromise.PENDING) {
                this.reason = reason;
                this.status = MyPromise.REJECTED;
                this.rejectedQueues.forEach(cb => cb(this.reason))
            }
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
        // this.onFulfilled = onFulfilled
        // this.onRejected = onRejected
        // 实现透传
        // 判断 onFulfilled和onRejected是否是函数，如果不是创建一个函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason}


        // 当Promise当前状态为Pending时将回调调入对应数组中,当executor有异步代码时Promise当前状态为Pending
        if(this.status === MyPromise.PENDING){
            this.resolvedQueues.push(onFulfilled)
            this.rejectedQueues.push(onRejected)
        }
         // 状态是成功态，直接就调用 onFulfilled 函数
        if (this.status === MyPromise.RESOLVED) {
        onFulfilled(this.value)
        }
        // 状态是成功态，直接就调用 onRejected 函数
        if (this.status === MyPromise.REJECTED) {
        onRejected(this.reason)
        }
    }
}
```

### 支持链式调用（返回新的Promise实例）

简单的做法可以直接在then函数中返回本身（this）但这样会导致当初始化实例时调用resolve后已将状态从pending -> resolved了所以后面value属性保存的一直是最开始的值

示例代码如下：
```js
const p1 = new MyPromise((resolved, rejected) => {
  resolved('resolved');  
});

p1.then((res) => {
  console.log(res);
  return 'then1';
})
.then((res) => {
  console.log(res);
  return 'then2';
})
.then((res) => {
  console.log(res);
  return 'then3';
})

// 预测输出：resolved -> then1 -> then2
// 实际输出：resolved -> resolved -> resolved
```
改造代码（返回一个全新的Promise实例）
```js
then(onFulfilled,onRejected){
    // this.onFulfilled = onFulfilled
    // this.onRejected = onRejected
    // 实现透传
    // 判断 onFulfilled和onRejected是否是函数，如果不是创建一个函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason}
    return new MyPromise((resolve, reject) => {
        
        // 状态是成功态，直接就调用 onFulfilled 函数
        if (this.status === MyPromise.RESOLVED) {
            let resolvedValue = onFulfilled(this.value)
            resolve(resolvedValue)
        }
        // 状态是成功态，直接就调用 onRejected 函数
        if (this.status === MyPromise.REJECTED) {
            let rejectedValue = onRejected(this.reason)
            reject(rejectedValue)
        }
        // 当Promise当前状态为Pending时将回调调入对应数组中,当executor有异步代码时Promise当前状态为Pending
        if(this.status === MyPromise.PENDING){
            this.resolvedQueues.push((value) => {
                const res = onResolved(value);
                resolve(res)
            })
            this.rejectedQueues.push((reason) => {
                const res = onRejected(reason)
                reject(res);
            })
        }
        })

    }
```


