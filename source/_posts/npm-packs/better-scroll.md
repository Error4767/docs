---
title: better-scroll
categories: npm-packs
---
### Better-Scroll
###### 安装：
````javascript
npm install better-scroll --save
````  
[官网](http://ustbhuangyi.github.io/better-scroll/)  

使用：  
````javascript
import 'BScroll' from 'better-scroll';  
new BScroll(el, options)
````
## 选项 / 基础  

##### startX
````
类型：Number,
默认值：0
作用：横轴方向初始化位置。
````
#####  startY
````
类型：Number,
默认值：0
作用：纵轴方向初始化位置
````

#####  click
类型：Boolean  
默认值：false  
作用：better-scroll 默认会阻止浏览器的原生 click事件 。
当设置为 true，better-scroll 会派发一个 click事件，我们会给派发的 event 参数加一个私有属性_constructed，值为 true。但是自定义的 click 事件会阻止一些原生组件的行为，如 checkbox 的选中等，所以一旦滚动列表中有一些原生表单组件，推荐的做法是监听 tap 事件，如下

##### probeType
类型：Number  
默认值：0  
可选值：1、2、3  
作用：有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。

## 选项 / 高级
##### mouseWheel(v1.8.0+)  
类型：Boolean | Object  
默认值：false  
作用：这个配置用于 PC 端的鼠标滚轮，默认为 false，。当设置为 true 或者是一个 Object 的时候，可以开启鼠标滚轮，例如：
````javascript
mouseWheel: {
 speed: 20,
 invert: false,
 easeTime: 300
}
````
speed 表示鼠标滚轮滚动的速度，invert 为 true 表示滚轮滚动和时机滚动方向相反，easeTime 表示滚动动画的缓动时长，见Demo。

## 方法 / 通用
better-scroll 提供了很多灵活的 API，当我们基于 better-scroll 去实现一些 feature 的时候，会用到这些 API，了解他们会有助于开发更加复杂的需求。

##### refresh()  
````
参数：无
返回值：无
作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
````
##### scrollTo(x, y, time, easing)
````
参数：
{Number} x 横轴坐标（单位 px）
{Number} y 纵轴坐标（单位 px）
{Number} time 滚动动画执行的时长（单位 ms）
{Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
返回值：无
作用：滚动到指定的位置，见 Demo 。
````

