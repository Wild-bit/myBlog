## 定义变量的关键字

> 在JavaScript中定义变量可以使用三个关键字:
> - var
> - let
> - const

```js
var VAR = '我是var'
let LET =  '我是let'
const CONST = '我是const'
```
以上代码都以各自的大写名称定义了变量，并赋予了值。既然这样可能就会有人困惑了？我该用哪种来定义变量？那我们就来分析一下：
**这三种定义变量的方式都有什么区别呢？**

1、var声明提升
```js
console.log(VAR)
var VAR = '我是VAR'
```
使用var时，上面的代码不会报错，正常来讲我在定义变量之前去使用变量应该会报错，但var不会。这是因为使用var这个关键字来声明的变量会自动提升到**函数作用域**的顶部，因为这个缘故ECMAScript会把这段代码看成等价于以下代码：
```js
var VAR; // 这个时候它的值为undefined
console.log(VAR)
var VAR = '我是VAR'
```
这就是“提升”，也就是把所有变量声明都拉到函数作用域的顶部。

2、let声明
let 跟 var 的作用差不多，但有着非常重要的区别。最明显的区别是，let 声明的范围是块作用域，
而 var 声明的范围是函数作用域。

let定义的变量会有暂时性死区，就是 let 声明的变量不会在作用域中被提升。
```js
// name 会被提升
console.log(name); // undefined 
var name = 'Matt'; 
// age 不会被提升
console.log(age); // ReferenceError：age 没有定义
let age = 26;
```
在解析代码时，JavaScript 引擎也会注意出现在块后面的 let 声明，只不过在此之前不能以任何方式来引用未声明的变量。在 let 声明之前的执行瞬间被称为“暂时性死区”（temporal dead zone），在此阶段引用任何后面才声明的变量都会抛出 ReferenceError。
**注意：这并不是常说的 let 不会提升，let 提升了，在第一阶段内存也已经为他开辟好了空间（暂时性死区），因为这个声明的特性导致了并不能在声明前使用**

3、const声明
const 的行为与 let 基本相同，唯一一个重要的区别是用它声明变量时必须同时初始化变量，且
尝试修改 const 声明的变量会导致运行时错误。
- 声明创建一个值的只读引用 (即指针)
- 基本数据当值发生改变时，那么其对应的指针也将发生改变，故造成 const申明基本数据类型时再将其值改变时，将会造成报错， 例如 const a = 3 ; a = 5时 将会报错（**Assignment to constant variable.**）赋值给常量变量
- 但是如果是复合类型时，如果只改变复合类型的其中某个Value项时， 将还是正常使用
