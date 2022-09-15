## 实现apply方法
先看看apply的MDN
**Function.prototype.apply()**
> apply() 方法调用一个具有给定 this 值的函数，以及以一个数组（或一个类数组对象）的形式提供的参数

使用：
```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.apply(this, name, price);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
```

实现思路跟call一样，只不过传参不同，不了解的请看上篇：[实现call方法](https://github.com/Wild-bit/myBlog/issues/23)

```js
/**
 * @prams context 上下文 也就是this要指向的函数
 * @parms args 传入的参数 Array
 * @return 返回结果
 */
Function.prototype._apply = function(context = window, args){
    if(typeof this !== 'function'){
        throw new Error('Type Error: this is not a function')
    }
    const isArray = args instanceof Array
    if(!isArray){
        throw new Error('Type Error: args is not a Array')
    }
    // 在context上加一个唯一值不影响context上的属性
    let key = Symbol('key')
    context[key] = this //将调用者提供的this指向传入的context的属性
    let result = context[key](...args)
    // 清除定义的this 不删除会导致context属性越来越多
    delete context[key];
    return result
}
```
测试：
```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product._apply(this, name, price);
  this.category = 'food';
}
const text = new Food('麻辣烫',15)
console.log(text); // Food {name: '麻辣烫', price: 15, category: 'food'}
```