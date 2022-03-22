# knowledgepoint

大家好，我是lzh，现在是一名在小厂担任前端工程师，这里是我总结的前端知识点，觉得有趣的话点个**star**,交流前端知识请添加微信：lai_1397119416

# HTML 篇

[HTML5 语义化标签](https://rainylog.com/post/ife-note-1/)

> 百度 ife 的 h5 语义化文章，讲得很好，推荐阅读

# CSS 篇

> 总结工作中常用的 CSS 如三角形，图形结合，阴影效果，一行省略，多行省略

## CSS 三角形

```CSS
.triangle{
    width: 0;
    border-width: 10px 20px;
    border-style: solid;
    border-color: #000 transparent transparent transparent; /*倒三角*/
}
.triangle{
    width: 0;
    border-width: 10px 20px;
    border-style: solid;
    border-color: transparent #000 transparent transparent; /*右三角*/
}
.triangle{
    width: 0;
    border-width: 10px 20px;
    border-style: solid;
    border-color: transparent transparent #000 transparent; /*正三角*/
}
.triangle{
    width: 0;
    border-width: 10px 20px;
    border-style: solid;
    border-color: transparent transparent transparent #000; /*左三角*/
}
```
## 用CSS的clip-path实现不规则矩形
**利用clip-path**
```CSS
.discount-btn{
    width:129px;
    height:48px;
    background: linear-gradient(90deg, #ffa25e 0%, #fd6930 100%);
    clip-path: polygon(0 0,100% 0%,75% 100%,0% 100%); // 上 x,y 右 x,y 下 x,y 左 x,y
}
```
[clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)
> polygon
> 每一对在列表中的参数都代表了多边形顶点的坐标， xi 与 yi ，i代表顶点的编号，即，第i个顶点

**实现效果：**

![斜角矩形](./img/CSS/clip-path-rect.jpg "rect")

**利用border属性**
```CSS
div {
  width:0;
  border-top:100px solid green;
  border-left:150px solid blue;
  border-right:100px solid transparent;
}
```
**实现效果：**

![斜角矩形](./img/CSS/border-rect.PNG "rect")

> 缺点：颜色无法渐变

## CSS实现立体圆柱

```CSS
.yuanzhu {
    position: relative;
    height: 54px;
    width: 230px;
    margin-top: 30px;
    background: linear-gradient(180deg, #ffeab4 0%, #fff1d1 27%, #f8bb58 100%);
    margin: 30px auto;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  .yuanzhu::after {
    position: absolute;
    right: -10px;
    content: '';
    display: block;
    width: 20px;
    height: 54px;
    border-radius: 50%;
    background: linear-gradient(180deg, #fcc35c 0%, #ab710e 100%);
  }
```
**实现效果：**

![立体圆柱](https://cdn.nlark.com/yuque/0/2021/png/1762737/1628495412978-93e8eac9-b542-413c-86d5-e100e861c210.png "圆柱")

## 重绘和回流（重排）

- 重绘：当渲染树的元素外观（如颜色）发生改变，不影响布局时，产生重绘
- 回流：当渲染树的元素的布局（如位置，尺寸，隐藏/显示）发生改变时，产生回流
- 注意：JS获取Layout属性值（如：offsetLeft、scrollTop、getComputedStyle等）也会引起回流。因为浏览器需要通过回流计算最新值
- 回流必定产生重绘，但重绘不一定引起回流

**如何最小化重绘(repaint)和回流(reflow)**：

- 需要要对元素进行复杂的操作时，可以先隐藏(display:"none")，操作完成后再显示
- 需要创建多个DOM节点时，使用DocumentFragment创建完后一次性的加入document
- 缓存Layout属性值，如：var left = elem.offsetLeft; 这样，多次使用 left 只产生一次回流
- 尽量避免用table布局（table元素一旦触发回流就会导致table里所有的其它元素回流）
- 避免使用css表达式(expression)，因为每次调用都会重新计算值（包括加载页面）
- 尽量使用 css 属性简写，如：用 border 代替 border-width, border-style, border-color
- 批量修改元素样式：elem.className 和 elem.style.cssText 代替 elem.style.xxx

# JavaScript基础篇

- [闭包](./Js/closure/index.md)
- [作用域链](./Js/scopeChain/index.md)
- [原型链](./Js/prototypeChain/index.md)
- [你真的了解事件冒泡和事件捕获吗？](https://juejin.cn/post/6844904115428917255)
- [关于Map和Set](./Js/mapAndset/index.md)

