## 实现一个简易的Ref
在上篇文章中我们简单的实现了reactive,而ref是基于reactive来实现的。
我们先来看看如果使用它
```js
// 在vue3中你可能会这样使用ref  
import { ref } from 'vue'
const count = ref(0)
const isShow = ref(false)
const obj = ref({})
const list = ref([])

console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```
ref函数接收一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性.value。

在这里大家有没有疑问呢？为什么我们传进去的值被指向内部属性value，这样设计的目的是什么呢？

这是因为ref可以接收任意值（原始值、引用值），而当ref接收原始值时，要想使其具有响应式需要借助构造函数的getter和setter的能力，对valye属性设置存值函数和取值函数，拦截该属性的存取行为,这样我们就能让原始值也具有响应值，值也被指向内部属性value
下面一起来实现ref

```js
// 先声明函数
function myref(val){
    // 这里返回的是构造函数实例
    return new RefImpl(val)
}

class RefImpl {
    #value //用来存储值 #表示私有属性，外部访问不了该属性
    constructor(val){
        this.#value = val
    }
    get value(){
        return this.#value
    }
}
const count = myref(1)
console.log(count.value) // 1
```
这样我们访问.value属性就是接收的内部值了。