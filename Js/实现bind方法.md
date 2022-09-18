## 实现bind方法
老样子实现之前先看看bind做了啥
> **Function.prototype.bind()**
> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用
> - bind返回一个新的函数
> - 调用函数的方式有两种，一种是普通调用，一种是构造函数调用

对于普通函数，绑定this指向

对于构造函数，要保证原函数的原型对象上的属性不能丢失

代码实现：
```js
Function.prototype._bind = function(context = window,...args){
    // 先保存this指向,这里表示调用_bind的函数
    let self = this 
    /**
     * @params innerArgs 表示实际调用时传入的参数 fn.bind(obj, 1)(2)
     */
    let fBound = function (...innerArgs) {
        // 需要判断是否是普通函数调用还是构造函数调用
        //this instanceof fBound为true表示构造函数的情况。如new func.bind(obj)
        // 当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true，可以让实例获得来自绑定函数的值
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(
            this instanceof fBound
                ? this 
                : context
            ,args.concat(innerArgs)
        )
    }
    // 如果是构造函数需要通过原型式继承 Object.cteate()的方式保证原函数原型对象上属性不丢失
    fBound.prototype = Object.create(this.prototype)
    return fBound
}
```
```js
// 测试用例

function Person(name, age) {
  console.log('Person name：', name);
  console.log('Person age：', age);
  console.log('Person this：', this); // 构造函数this指向实例对象
}

// 构造函数原型的方法
Person.prototype.say = function() {
  console.log('person say');
}

// 普通函数
function normalFun(name, age) {
  console.log('普通函数 name：', name); 
  console.log('普通函数 age：', age); 
  console.log('普通函数 this：', this);  // 普通函数this指向绑定bind的第一个参数 也就是例子中的obj
}


var obj = {
  name: 'poetries',
  age: 18
}

// 先测试作为构造函数调用
var bindFun = Person.myBind(obj, 'poetry1') // undefined
var a = new bindFun(10) // Person name: poetry1、Person age: 10、Person this: fBound {}
a.say() // person say

// 再测试作为普通函数调用
var bindNormalFun = normalFun.myBind(obj, 'poetry2') // undefined
bindNormalFun(12) // 普通函数name: poetry2 普通函数 age: 12 普通函数 this: {name: 'poetries', age: 18}
```














```