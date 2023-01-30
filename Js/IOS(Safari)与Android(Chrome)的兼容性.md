**navigator.connection**
背景：需要获取用户的网络状态来统计不同网络下页面的性能情况
```js
const networkType = navigator.connection.effectiveType
// 类型：
// '2g'
// '3g'
// '4g'
// 'slow-2'
```
Chorome可以获得该属性，但是在Safari中**effectiveType**无法获得（导致了线上出现短暂的页面白屏），兼容性差，后续方案使用Native端提供的方法获取
总结：使用全局属性没有查看兼容性问题导致白屏，后续查明后无影响在使用

**Event接口**
背景：实现红包雨的动画需求时，由于整个动画实质是添加DOM，并在动画完成或者用户点击时删除对应的DOM元素在删除元素的逻辑中使用事件委托addEventListener

HTML结构：
```html
<!-- 在外层 整个动画的下降区域 -->
<div class="down-area">
    <!-- 父 控制红包雨下降 -->
    <div class='red-down'>
        <!-- 子 控制红包旋转 -->
        <img src="xxx.png" class="red-envelop-rotate" />
    </div>
</div>
```
JS逻辑：
```js
const handerPacketClick = () => {
  rainAreaRef.value.addEventListener('click', e => {
    const targetClassName = e.target.className
    if (targetClassName === 'red-envelop-rotate') {
      // Safari 的点击事件中不存在 event.path 可以通过event.composedPath()
      const el = event.path || (event.composedPath && event.composedPath());
      const id = el.id
      if (!hitedPacketIdList.value.includes(id)) {
        hitedPacketIdList.value.push(id)
        rainAreaRef.value.removeChild(el)
      }
    }
  })
}
```
Safari 的点击事件中不存在 event.path 可以通过event.composedPath()获取事件路径

**日期字符串转为时间戳**
创建 Date 对象时没有使用new Date('2023-01-30')这样的写法，iOS 不支持以中划线分隔的日期格式，正确写法是new Date('2023/01/30')。
