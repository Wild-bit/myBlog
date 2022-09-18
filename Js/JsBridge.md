## JsBridge是什么
JsBridge作为 **Hybrid** 应用的一个利器，H5页面其实运行在**Navtive**的webView中，webView是移动端提供的JavaScript的环境，他是一种嵌入式浏览器原生应用可以用它来展示网络内容。可与页面JavaScript交互，实现混合开发。所以jsBridge自然也运行在webView中的**JS Content**中，这与原生有运行环境的隔离，所以需要有一种机制实现Native端和Web端的双向通信，这就是JsBridg。

**以JavaScript引擎或Webview容器作为媒介，通过协定协议进行通信，实现Native端和Web端双向通信的一种机制。**
## JsBridge用途
JSBridge 是一种 JS 实现的 Bridge，连接着桥两端的 Native 和 H5。它在 APP 内方便地让 Native 调用 JS，JS 调用 Native ，是双向通信的通道。JSBridge 主要提供了 JS 调用 Native 代码的能力，实现原生功能如查看本地相册、打开摄像头、指纹支付等。

## JsBridge与Native通信的原理

jsBridge就像它的名字的意义一样，是作为Native端（Ios端， Android端等）与非 Native 之间（这里指H5页面）的桥梁，它的核心作用是构建两端之间相互通信的通道。

在H5中JavaScript调用Native的方式有两种：
- **注入API**：注入一个全局对象到JavaScript的window对象中（可以类比于RPC调用）
- **拦截URL Schema**：客户端拦截WebView的请求并做相应的操作（可类比为JSONP）
### 注入API
注入 API 方式的主要原理是，通过 WebView 提供的接口，向 JavaScript 的 Context（window）中注入对象或者方法，让 JavaScript 调用时，直接执行相应的 Native 代码逻辑，达到 JavaScript 调用 Native 的目的，使用该方式时，JS 需要等到 Native 执行完对应的逻辑后才能进行回调里面的操作。
Android 的 Webview 提供了 addJavascriptInterface 方法，支持 Android 4.2 及以上系统：
```java
gpcWebView.addJavascriptInterface(new JavaScriptInterface(), 'nativeApiBridge'); 
public class JavaScriptInterface {
    Context mContext;

  JavaScriptInterface(Context c) {
    mContext = c;
  }

  public void share(String webMessage){            
    // Native 逻辑
  }
}
```
上面代码的作用就是webView中绑定一个全局的对象(桥对象)，然后将nativeApiBridge对象中的方法映射到Javascript中的nativeApiBridge的方法。
前端调用方式：
```js
window.nativeBridge.postMessage(message);
```
### 拦截URL Scheme
先简单的了解一下什么是URL Scheme？URL Scheme是一种类似url的链接，是为了方便app直接互相调用设计的，形式和普通的url近似 ，主要区别是schemel和host一般是自定义的：
如普通的url：
![url结构](https://raw.githubusercontent.com/Wild-bit/myBlog/main/img/Bowser/TCP%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B%E7%9A%84%E8%BF%87%E7%A8%8B.png)
而url scheme类似这样：
```js
kcnative://go/url?query
```
拦截 URL SCHEME 的主要流程是：Web 端通过某种方式（例如 iframe.src）发送 URL Scheme 请求，之后 Native 通过（ **shouldOverrideUrlLoading()** 方法）拦截到请求并根据 URL SCHEME（包括所带的参数）进行相关操作。

**那么调用 Native 功能时 Callback 怎么实现的？**

对于 JSBridge 的 Callbac，可以用JSONP的机制实现：
> 当发送 JSONP 请求时，url 参数里会有 callback 参数，其值是 当前页面唯一  的，而同时以此参 数值为 key 将回调函数存到 window 上，随后，服务器返回 script 中，也会以此参数值作为句柄，调>用相应的回调函数。

1.在H5中注入一个callback方法，放在window对象或者与Native端相绑定的对象中
```TypeScript
/**
 * 
 * @param callbackId 
 * @param obj 
 * 客户端通知webviw的callback
 */
const onCallback = function (callbackId: number, obj: any) {
    if (ApiBridge.callbackCache[callbackId]) {
        console.log('onCallback调用',callbackId);
        console.log(ApiBridge.callbackCache[callbackId]);
        ApiBridge.callbackCache[callbackId](obj)
    }
}
//预先把callback存到一个callbackCache数组或者对象中，通过自增的方式确定callbackId
```
2.然后把callback对应的id通过Url Schema传到Native端
```TypeScript
const callNative = function (clz: string, method: string, args: any, callback?: any) {
    let msgJson = {
        clz,
        method,
        args,
    }
    if (args != undefined) msgJson.args = args
    if (callback) {
        const callbackId = getCallbackId()
        ApiBridge.callbackCache[callbackId] = callback
        if (msgJson.args) {
            msgJson.args.callbackId = callbackId.toString()
        } else {
            msgJson.args = {
                callbackId: callbackId.toString(),
            }
        }
    }

    if (browser.versions.ios) {

        if (ApiBridge.bridgeIframe == undefined) {
            bridgeCreate()
        }
        ApiBridge.msgQueue.push(msgJson)
        if (!ApiBridge.processingMsg) ApiBridge.bridgeIframe!.src = 'native://go'

        window.initJSBridge = true
    } else if (browser.versions.android) {

        var ua = window.navigator.userAgent.toLowerCase()
        window.initJSBridge = true
        // android 
        // prompt传参给Native
        return prompt(JSON.stringify(msgJson))
    }
}
```
Native通过shouldOverrideUrlLoading()，拦截到WebView的请求，并通过与前端约定好的Url Schema判断是否是JSBridge调用。
3.Native解析出前端带上的callback，并使用下面方式调用callback
```js
webView.loadUrl(String.format("javascript:callback_1(%s)", isChecked)); // 可以带上相应的参数
```
通过上面几步就可以实现JavaScript到Native的通信

核心代码的实现
```js

(function (window) {
    let global = window
    let kerkee:jsBridgeClient = {
        getNativeData,
        setNativeData,
        doAction,
    }
    global.jsBridgeClient = kerkee
    onBridgeInitComplete(function (aConfigs: any) {
      // do something
    })
})(window)
```

## JsBridge接口的抽象
```TypeScript
getNativeData(method:string,params:{},callback) 从客户端获取数据
setNativeData(method:string,params:{key:value})H5告诉客户端一些数据 ,客户端执行相应操作
doAction(method:string,params:{},calllback:any)H5调用客户端组件或方法
```
使用示例：
```TypeScript
jsBridge.getNativeData('getUserInfo', (data: any) => {
    console.log(data)
})
jsBridge.setNativeData('setWebBackColor', { back_color: 'red' })
jsBridge.doAction('buyGoods', { goods_info: state.goodsInfo, buy_num: 1 })
jsBridge.doAction('showShareDialog', {
is_share: 1,
share_type: 1,
share_url: '分享链接',
thumb: '项目链接'
content: '分享内容',
share_title: '分享标题！',
})
```
总结：
![url结构](https://raw.githubusercontent.com/Wild-bit/myBlog/main/img/Bowser/TCP%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B%E7%9A%84%E8%BF%87%E7%A8%8B.png)

