## 实现call方法
先看看call的MDN
**Function.prototype.call()**
> call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。

使用：
```js
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
```

思路
- call是构造函数的原型对象上的一个方法
- 改变this的指向到函数并传入指定参数
- 如果第一个参数不传，默认为window对象

```js
/**
 * @prams context 上下文 也就是this要指向的函数
 * @paams args 传入的参数
 * @return 使用调用者提供的 this 值和参数调用该函数的返回值。若该方法没有返回值，则返回 undefined
 */
Function.prototype._call = function(context = window, ...args){
    if(typeof this !== 'function'){
        throw new Error('Type Error: this is not a function')
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
  Product._call(this, name, price);
  this.category = 'food';
}
const text = new Food('麻辣烫',15)
console.log(text); // Food {name: '麻辣烫', price: 15, category: 'food'}
```