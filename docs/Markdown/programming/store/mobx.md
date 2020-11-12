# Mobx  
简单、可扩展的状态管理
>[官网](https://mobx.js.org/README.html)  
>[中文网](https://cn.mobx.js.org/)  

注意： 本文中的store都指的是mobx可观察对象  
## 使用
````javascript
import { observable, autorun, computed, decorate, action, configure, runInAction } from 'mobx';
configure({
  enforceActions: 'always'//严格模式(可选)，不允许在action之外进行状态修改
});
````

### 方法  
#### obserable  
obserable(object)  
使得该对象成为可观察对象  
obserable.box(value)  
使得该值成为可观察的值  
  
##### 可观察值的方法
obserableObject.get()  
获取值  
obserableObject.set(value) 
设置值  
//obserableObject为可观察对象实例  
#### action  
action(function)  
设置该function为action  
#### computed  
computed(function);  
定义一个计算属性  
#### decorate  
装饰器方法,用于装饰一个类  
````javascript
decorate(myClass, {
  attr_name: decorator//在mobx中一般为 observable,action 等
  //...
})
````
#### autorun  
autorun(function)  
响应式函数，该方法会收函数集参数中使用到的可观察依赖，任意依赖更新则会触发函数的执行  
````javascript
//例子
const store = observable({
  count: 1
});
autorun(()=> {
  console.log(store.count);//这句将store.count收集为依赖
});//每当任意依赖改变时，就会执行这个函数
````
#### when  
when(predicate, effect)  
predicate是一个条件函数，只有当该函数返回true时，effect函数才会被执行，并且只会运行一次  
(effect是一个函数, 通常是一个副作用函数)  
初始化的时候会执行一次检测，每当依赖改变会检测，只运行一次，之后不再运行
#### runInAction  
runInAction(name?, function)  
name是一个可选项，作为名称  
function函数将会作为action执行  
直接在action中用异步操作更新状态在严格模式下不可以， 因为异步操作实际上并不是函数内部进行，参考EventLoop(事件循环模型)，需要该工具函数完成，将修改状态才做包裹在该函数中就可以以一个action修改状态，完成异步操作，不过还是推荐以flow函数去管理异步的状态修改  
#### flow  
flow(generatorFunction)  
generatorFunction是一个生成器函数，内部的yield需要返回promise，用法和async函数一样， 只不过不是await， 而是使用yield，mobx会自动将内部动作包装成action， 并像async函数一样自动执行  
通常用于异步action  
例子:  
````javascript
const store = observable({
  count: 0
});
flow(function* () {
  const result = yield new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    });
  });
  store.count += result;
}),
````
  
## Mobx-react 
### 使用  
使用observer方法包裹react组件,store更新的时候，recat组件就会重新render  
#### 例子
````javascript
import { observable } from 'mobx';
import { observer } from 'mobx-react';
//此时store为mobx的可观察对象
const store = observable({
  count: 0
});

//每秒更新状态，react组件随之更新
setTimeout(()=> {
  //此处为了通俗说明没有使用action，实际开发中建议使用action更新状态
  store.count++;
}, 1000)

function reactComponent() {
  return (
    <div>{store.count}</div>
  )
}

//使用observer包裹react组件，在store更新的时候reactComponent这个组件会重新render
export observer(reactComponent);
````