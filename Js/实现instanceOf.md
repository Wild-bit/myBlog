## instanceOf 
> instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上

使用方式如下：
```js
console.log([] instanceof Array) // true
console.log({} instanceof Object) // true
console.log((()=>{}) instanceof Function) // true
```
**思路：**
- 取得比较的当前类的原型和当前实例对象的原型链

- 按照原型链的查找机制一直向上查找
  - 取得当前实例对象原型链的原型链（proto = proto.__proto__，沿着原型链一直向上查找）
  - 如果 当前实例的原型链__proto__上找到了当前类的原型prototype，则返回 true
  - 如果 一直找到Object.prototype.__proto__ == null，Object的基类(null)上面都没找到，则返回 false

```js
function _instanceof(example,classFn){
    //基本数据类型直接返回false
    if(typeof example !== 'object' || example === null) return false;
    let proto = Object.getPrototypeOf(example)
    while (true) {
        if(proto == null) return false;
         // 在当前实例对象的原型链上，找到了当前类
        if(proto == classFunc.prototype) return true
        // 沿着原型链__ptoto__一层一层向上查
        proto = Object.getPrototypeof(proto); // 等于proto.__ptoto__
    }
}

console.log('test', _instanceof(null, Array)) // false
console.log('test', _instanceof([], Array)) // true
console.log('test', _instanceof('', Array)) // false
console.log('test', _instanceof({}, Object)) // true
```