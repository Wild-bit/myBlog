## 前言
Set 和 Map 都是 ES6 中新增的数据结构，是对当前 JS 数组和对象这两种重要数据结构的扩展。

- Set类似数组，但是成员的值都是唯一的，没有重复的值。
- Map类似对象，但是对象的key只能是number和string类型的，而Map的key可以使任意类型

## Set
> **Set**实例不允许允许有重复，可以通过以下示例证明。可以通过一个数组初始化一个 Set 实例，或者通过add添加元素，元素不能重复，重复的会被忽略。

```js
// 例1
const set = new Set([1, 2, 3, 4, 4]);
console.log(set) // Set(4) {1, 2, 3, 4}

// 例2
const set = new Set();
[2, 3, 5, 4, 5, 8, 8].forEach(item => set.add(item));
for (let item of set) {
  console.log(item);
}
// 2 3 5 4 8
```
**Set的实例属性和方法：**
- **size**：获取元素数量
- **add(val)**：添加元素，返回Set实例本身
- **delete(val)**：删除元素，返回一个布尔值，表示是否删除成功
- **has(val)**：返回一个布尔值，表示该值是否是Set实例的元素
- **clear()**：清除所有元素，没有返回值

```js
const s = new Set();
s.add(1).add(2).add(2); // 添加元素

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false

s.clear();
console.log(s);  // Set(0) {}
```

**遍历Set实例的方法：**

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。不过由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys()和values()返回结果一致。
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

```js
let set = new Set(['aaa', 'bbb', 'ccc']);

for (let item of set.keys()) {
  console.log(item);
}
// aaa
// bbb
// ccc

for (let item of set.values()) {
  console.log(item);
}
// aaa
// bbb
// ccc

for (let item of set.entries()) {
  console.log(item);
}
// ["aaa", "aaa"]
// ["bbb", "bbb"]
// ["ccc", "ccc"]

set.forEach((value, key) => console.log(key + ' : ' + value))
// aaa : aaa
// bbb : bbb
// ccc : ccc 
```
## Map
>Map 的用法和普通对象基本一致，先看一下它能用非字符串或者数字作为 key 的特性

```js
const map = new Map();
const obj = {p: 'Hello World'};

map.set(obj, 'OK')
map.get(obj) // "OK"

map.has(obj) // true
map.delete(obj) // true
map.has(obj) // false

```
**Map 实例的属性和方法如下：**

- size：获取成员的数量
- set：设置成员 key 和 value
- get：获取成员属性值
- has：判断成员是否存在
- delete：删除成员
- clear：清空所有

```js
const map = new Map();
map.set('aaa', 100);
map.set('bbb', 200);

map.size // 2

map.get('aaa') // 100

map.has('aaa') // true

map.delete('aaa')
map.has('aaa') // false

map.clear()
```
Map 实例的遍历方法有：

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。

```js
const map = new Map();
map.set('aaa', 100);
map.set('bbb', 200);

for (let key of map.keys()) {
  console.log(key);
}
// "aaa"
// "bbb"

for (let value of map.values()) {
  console.log(value);
}
// 100
// 200

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// aaa 100
// bbb 200

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// aaa 100
// bbb 200
```

## 数组去重方法总结

**方法一、利用ES6 Set去重（ES6中最常用）**
```js
function unique (arr) {
  return Array.from(new Set(arr))
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr))
 //[1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```
**方法二、利用Map数据结构去重**
```js
function arrayNonRepeatfy(arr) {
	let map = new Map();
		let array = new Array();  // 数组用于返回结果
		for (let i = 0; i < arr.length; i++) {
			if(map.has(arr[i])) {  // 如果有该key值
			map.set(arr[i], true);
		} else {
			map.set(arr[i], false);   // 如果没有该key值
			array.push(arr[i]);
		}
	}
	return array ;
}
 var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
    console.log(unique(arr))
//[1, "a", "true", true, 15, false, 1, {…}, null, NaN, NaN, "NaN", 0, "a", {…}, undefined]
```
**方法三利用Arrary.reduce()+includes**
```js
function unique(arr){
    return arr.reduce((prev,cur) => prev.includes(cur) ? prev : [...prev,cur],[]);
}
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique(arr));
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}]
```