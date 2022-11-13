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
在来看一个测试用例：
```js
const count = myref(1)
// 第一次获取.value值
console.log(count.value) // 1
// 当设置.value的值为2时
count.value = 2
console.log(count.value) // 2 再次获取.value也相应变为2
```
目前上面的测试代码是无法通过的，因为我们还没有实现ref对原始值的响应式，那么如何实现ref的响应式呢？
很简单，当我们第一次访问count.value时会触发RefImpl类的getter，而当我们设置count.value为2时就触发setter函数，我们将新的值重新赋值给私有属性，当再次访问时就是最新的值了
```js
class RefImpl {
    #value //用来存储值 #表示私有属性，外部访问不了该属性
    constructor(val){
        this.#value = val
    }
    get value(){
        return this.#value
    }
    set value(newVal){
        this.#value = newVal
    }
}
```
这样就实现了ref对原始值的响应式操作了，其实就是利用了对象中属性的 **Descriptor** 对象上的**存值函数（getter）**和**取值函数（setter）**

**那如果ref传入的是一个引用值类型（对象，数组）的呢？**
如果一个对象、数组的话，那就需要借助reactive来实现响应式操作。
```js
// 首先需要判断传入的val是引用值类型还是原始值类型
// 是则触发getter的时候执行track(val)，触发setter的时候执行trigger
function reactive(obj){
    return new Proxy(obj,{
        get(target,key){
            const res = Reflect.get(target, key)
            track(target, key)
            return res
        },
        set(target,key,value){
            const res = Reflect.set(target, key, value)
            trigger(target, key, value)
            return res
        }
    })
}
// 由于本篇文章只涉及ref，这里指简单实现,更多内容请看reactive
function track(traget,key){ 

}

class RefImpl {
    #value //用来存储值 #表示私有属性，外部访问不了该属性
    constructor(val){
        this.#value = val
    }
    get value(){
        return this.#value
    }
    set value(newVal){
        this.#value = newVal
    }
}

```


