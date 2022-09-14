## 实现new的过程

**new操作符做了这些事：**
- 创建一个全新的对象
- 这个对象的__proto__要指向构造函数的原型prototype
- 执行构造函数，使用 call/apply 改变 this 的指向
- 返回值为object类型则作为new方法的返回值返回，否则返回上述全新对象

代码实现：

```js
function myNew(fn, ...args) {
  // 基于原型链 创建一个新对象
  let newObj = Object.create(fn.prototype);
  // 添加属性到新对象上 并获取obj函数的结果
  let res = fn.apply(newObj, args); // 改变this指向

  // 如果执行结果有返回值并且是一个对象, 返回执行的结果, 否则, 返回新创建的对象
  return typeof res === 'object' ? res: newObj;
}
```
用法：
```js
// 用法
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function() {
  console.log(this.age);
};
let p1 = myNew(Person, "poety", 18);
console.log(p1.name);
console.log(p1);
p1.say();
```