## computed

接受一个 getter 函数，返回一个只读的响应式 ref 对象。该 ref 通过 .value 暴露 getter 函数的返回值。它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。

要实现的功能

- 接受一个getter存取函数
- 返回一个只读的响应式对象（借助reactive的effect）
- 计算属性值会基于其响应式依赖被缓存

**声明computed函数**
```ts
function computed(getter){
    // 返回一个对象
    return new ComputedRefImpl(getter)
}
```

**实现ComputedRefImpl类**

```js
class ComputedRefImpl {
    #value
    #effect
    #dirty
    #dep
    constructor(getter){
        this.dep = new Set();
        this.#dirty = true
        // ReactiveEffect 接收一个fn在这里是computed的getter，scheduler一个调度中心
        this.#effect = new ReactiveEffect(getter,{
            // 只要触发了这个函数说明响应式对象的值发生改变了
            // 那么就解锁，后续在调用 get 的时候就会重新执行，所以会得到最新的值
            if(!this.#dirty){
                this.#dirty = true
                triggerRefValue(this)
            }
        }) 
    }
    get value(){
        // 收集依赖
        trackRefValue(this)
        // 当第一次调用时计算getter的结果
        // 第二次如果已经被调用过了直接返回缓存值
        if(this.#dirty){
            this.#dirty = false
            this.#value = this.#effect.run()
        }
        return this.#value
    }
}
```