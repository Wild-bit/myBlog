## js实现继承的方式

### 原型链
> 基本思想：通过原型继承多个引用类型的属性和方法
> 
代码示例：
```js
function Animal(){
    this.name = 'father'
}
Animal.prototype.getName = function(){return this.name}
function Cat(){}
Cat.prototype = new Animal()
const cat1 = new Cat()
cat1.name = 'dudu'
console.log(cat1.getName()) // dudu
```
缺点：引用类型的属性被所有实例共享、子类型在实例化时不能给父类型的构造函数传参

### 借用构造函数
> 基本思想：在子类的构造函数中调用父类的构造函数，通过call()、bind()方法访问父类的构造函数属性

代码示例：
```js
function Animal(name,type){
    this.name = name
    this.animalType = type
    console.log(name,type)
}
function Cat(name,animalType,type){
    // 继承Animal
    Animal.call(this,name,animalType)
    this.type = '田园猫'
    
}
const cat = new Cat('dudu','猫科动物','田园猫')
console.log(cat.animalType,cat.name,cat.type)
```
优势：
- 避免了引用类型的属性被所有实例共享；
- 可以直接在子类中向父类传参；

缺点：父类构造函数的方法无法复用，因为方法都是写在构造函数中，每创建实例都会重新创建一遍方法，子类也不能访问父类原型上定义的方法

## 组合继承

> 基本思想：把原型链继承和借用构造函数继承结合一起

```js
function Animal(name,type){
    this.name = name
    this.animalType = type
}
Animal.prototype.getName = function(){
    // console.log(this.name);
    return this.name
}
function Cat(name,animalType,type){
    // 继承Animal
    Animal.call(this,name,animalType)
    this.type = type
}
Cat.prototype = new Animal()

const cat = new Cat('dudu','猫科动物','田园猫')
console.log(cat.animalType,cat.name,cat.type,cat.getName())

```

优势：既能实现父类构造函数的方法复用，又能够保证每个实例有自己的属性

### 原型式继承
> 基本思想：通过Object.create()创建新对象以及新对象定义的额外属性

```js
let person = { 
 name: "Nicholas", 
 friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = object(person); 
anotherPerson.name = "Greg"; 
anotherPerson.friends.push("Rob"); 
let yetAnotherPerson = object(person); 
yetAnotherPerson.name = "Linda"; 
yetAnotherPerson.friends.push("Barbie"); 
console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie"
```
优点：适合不需要创建构造函数的方式，但需要对象间共享信息。
缺点：属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的

### 寄生式继承
> 基本思想：实现一个创建对象的工厂函数，并返回对象

```js
const objFactory = function(obj){
    function fn(){}
    fn.prototype = obj
    return new fn()
}
function createAnother(original){ 
 let clone = objFactory(original); // 通过调用函数创建一个新对象
 clone.sayHi = function() { // 以某种方式增强这个对象
 console.log("hi"); 
 }; 
 return clone; // 返回这个对象
}
let person = { 
 name: "Nicholas", 
 friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = createAnother(person); 
anotherPerson.sayHi(); // "hi"
```




