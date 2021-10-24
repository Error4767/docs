## Solid-js
>用于构建用户界面的声明式、高效且灵活的 JavaScript 库  
您可以在 [官方教程](https://www.solidjs.com/tutorial/introduction_basics) 中尝试下面提到的部分例子，本文引用并简化了官方教程中的部分例子  

>本文讲述部分 solid 主要内容，更多详细内容，移步 [Solid API 文档](https://www.solidjs.com/docs/latest/api)

Solid 使用了和 React 相似的语法和类似 Svelte 的预编译  
Solid 使用上类似于 React，使用 JSX 语法，但不同于 React， 组件只会初始化一次，并不是 state 改变就重新运行渲染整个组件，这类似于 Vue3 的 setup

### 为什么选择 Solid
[Solid 官网](https://www.solidjs.com/) 给出了以下理由
* 高性能 - 始终在公认的 UI 速度和内存利用率基准测试中名列前茅
* 强大 - 可组合的反应式原语与 JSX 的灵活性相结合
* 务实 - 合理且量身定制的 API 使开发变得有趣而简单
* 生产力 - 人体工程学和熟悉程度使构建简单或复杂的东西变得轻而易举  

### 主要优势
高性能 - 接近原生的性能，在 [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/index.html) 排名中名列前茅  
极小的打包体积 - 编译为直接的DOM操作，无虚拟DOM，极小的运行时（类似于 Svelte），适合打为独立的 webComponent 在其它应用中嵌入  
易于使用 - 近似 React 的使用体验，便于快速上手

### 快速开始
#### 新建项目
````
npx degit solidjs/templates/js my-app
cd my-app
npm i
npm run dev
````
#### 基本示例
这里将 App 组件渲染到 body 容器中  
>这里修改默认示例， 从零开始尝试
````javascript
// App.JSX
import { render } from "solid-js/web";

function App() {
  return (
    <div>Solid My App</div>
  );
}
// 组件声明也可以直接用箭头函数
/*
const App = ()=> (<div>Solid My App</div>);
*/

render(() => <App />, document.querySelector("body"));

````

是不是看起来非常熟悉，就和 React 一样，非常舒服

#### 导入组件，传递组件，props
与 React 类似的使用方法, 但不能解构 props，否则将失去反应性  
````javascript
// App.JSX
import { render } from "solid-js/web";

import Component1 from "./Component1.jsx";

function App() {
  return (
    <div>
      Solid My App
      <Component1 text={"component1"}>
        <div>children</div>
      </Component1>
    </div>
  );
}

render(() => <App />, document.querySelector("body"));

// Component1.jsx
export default function Component1(props) {
  return (
    <div>
      {props.text}
      {props.children}
    </div>
  )
}
````

#### 反应性
##### createSignal
signal 是 Solid 中最基本的反应性单元，此函数类似于 React 的 useState，但返回函数用于获取调用它获取值，而不是像 React 一样直接取得值，下列是一个基本的 Counter 示例
````javascript
import { createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <button onClick={()=> setCount(count() + 1)}>
      {count()}
    </button>
  )
}
````

##### createMemo
createMemo 用于生成只读的派生值，类似于 Vue 中的 computed，与上面的相同，也需要通过调用来获取值  

````javascript
import { createSignal, createMemo } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  // count 的平方派生自 count，在依赖改变的时候自动更新
  const countPow2 = createMemo(()=> count() ** 2);
  return (
    <button onClick={()=> setCount(count() + 1)}>
      {count()} | {countPow2()}
    </button>
  )
}
````

##### createEffect
createEffect 一般用于副作用，在状态改变的时候运行副作用  
它类似于 React 中的 useEffect 但其自动收集依赖，无需显式声明依赖，这和 Vue 中的 watchEffect 作用相同  
````javascript
import { createSignal, createEffect } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  // 每当依赖改变就会重新运行该副作用
  createEffect(()=> console.log(count()));
  return (
    <button onClick={()=> setCount(count() + 1)}>
      {count()}
    </button>
  )
}
````
如果需要显式声明依赖，参考 [Solid createEffect 显式声明依赖](https://www.solidjs.com/tutorial/reactivity_on)

##### batch
Solid 的反应性是同步的，这意味着在任何更改后的下一行 DOM 都会更新。在大多数情况下，这完全没问题，因为 Solid 的粒度渲染只是反应式系统中更新的传播。“渲染”两次无关的更改实际上并不意味着浪费工作。  
如果更改是相关的怎么办？Solid 的batch助手允许将多个更改排队，然后在通知观察者之前同时应用它们。在批处理中更新的信号值直到完成才会提交。  
参考以下不使用 batch 的例子  
````javascript
import { render } from "solid-js/web";
import { createSignal, batch } from "solid-js";

const App = () => {
  const [firstName, setFirstName] = createSignal("John");
  const [lastName, setLastName] = createSignal("Smith");
  const fullName = () => {
    console.log("Running FullName");
    return `${firstName()} ${lastName()}`
  } 
  const updateNames = () => {
    console.log("Button Clicked");
    setFirstName(firstName() + "n");
    setLastName(lastName() + "!");
  }
  
  return <button onClick={updateNames}>My name is {fullName()}</button>
};

render(App, document.getElementById("app"));
````
在这个例子中，我们在按钮点击时更新了两个状态，它触发了两次更新，您可以在控制台中看到日志，因此，让我们修改 updateNames 将 set 调用打包成一个批处理。
````javascript
 const updateNames = () => {
    console.log("Button Clicked");
    batch(() => {
      setFirstName(firstName() + "n");
      setLastName(lastName() + "!");
    })
  }
````
现在，对于同一个元素只会触发一次更新

#### 样式

先创建一个样式文件以便下面使用
````css
/* main.module.css */
.container {
  width: 100px;
  height: 100px;
  background-color: green;
}
.text {
  font-size: 20px;
  color: red;
}
````

##### 基本使用
样式使用也与 React 非常类似，只是使用 class 而不是 className
````javascript
import style from "./main.module.css";

export default function Container() {
  return (
    <div class={style.container}>
      <span class={style.text}>text</span>
    </div>
  )
}
````
##### classList
用于设置给定的 class 是否存在, 也可以绑定响应式  
下列是一个点击切换 class 的示例
````javascript
import style from "./main.css";
import { createSignal } from "solid-js";

export default function Container() {
  const [hasTextClassName, setHasTextClassName] = createSignal(false);
  return (
    <div 
      classList={
        {
          [style.container]: true,
          [style.text]: hasTextClassName()
        }
      } 
      onClick={
        ()=> setHasTextClassName(!hasTextClassName())
      }
    >
    text
    </div>
  )
}
````

#### 基本的控制流
>控制流大多可以用 JSX 实现相同功能，但是使用其则具有高于 JSX 的性能，Solid 可以对其进行更多优化  
fallback 是在失败后的显示

##### For
简单的引用键控循环控制流程。

````javascript
export default function Container() {
  return (
    <div>
      <For 
        each={[1,2,3,4,5,6,7,8,9,10]} 
        fallback={<div>Failed</div>}
      >
        {(item) => <div>{item}</div>}
      </For>
    </div>
  )
}
````

##### Show
Show 控制流用于有条件地渲染视图的一部分。它类似于三元运算符 (a ? b : c)，但非常适合模板化 JSX。
````javascript
import { createSignal } from "solid-js";

export default function Container() {
  const [count, setCount] = createSignal(10);
  return (
    <div>
      {/* 在 count 大于 5 的时候渲染*/}
      <Show 
        when={count() > 5} 
        fallback={<div>Failed</div>}
      >
        <div>content</div>
      </Show>
    </div>
  )
}
````

##### Switch
Switch 在有 2 个以上的互斥条件时很有用。可以用来做一些简单的路由之类的事情。  
````javascript
import { createSignal } from "solid-js";

export default function Container() {
  const [count, setCount] = createSignal(10);
  return (
    <div>
      <Switch fallback={<div>Failed</div>}>
        <Match when={count() > 5}>
          <div>count > 5</div>
        </Match>
        <Match when={count() < 5}>
          <div>count < 5</div>
        </Match>
      </Switch>
    </div>
  )
}
````

##### Index
非索引迭代循环控制流程，如果要迭代的不是数组，而是类似对象这类，使用 Index

````javascript
export default function Container() {
  return (
    <div>
      <Index 
        each={{
          name: "name",
          gender: "male",
          age: 100,
          address: "address",
        }} 
        fallback={<div>Failed</div>}
      >
        {(item) => <div>{item}</div>}
      </Index>
    </div>
  )
}
````

##### ErrorBoundary 
错误边界
````javascript

function ErrorComponent() {
  // 抛出错误
  throw new Error("component error");
  return (
    <div>content</div>
  )
}

export default function Container() {
  return (
    <ErrorBoundary fallback={<div>Failed</div>}>
      <ErrorComponent></ErrorComponent>
    </ErrorBoundary>
  )
}
````

##### Portal
和 React Portal 作用相同  
用于将元素渲染到组件之外的地方，这对于模态窗，信息提示等是刚需  
示例：将元素直接渲染到 body 下

````javascript
export default function Container() {
  return (
    <Portal mount={document.querySelector("body")}>
      <div>content</div>
    </Portal>
  )
}
````

##### 其他控制流
参考 [API 文档](https://www.solidjs.com/docs/latest/api#control-flow)

#### 生命周期
挂载时：onMount
卸载时：onCleanup

````javascript
import { onMount, onCleanup } from "solid-js";
export default function Container() {
  onMount(()=> {
    console.log("onMount");
  });
  onCleanup(()=> {
    console.log("onCleanup");
  });
  return (
    <div>content</div>
  )
}
````

#### 绑定

##### ref
>ref 用于获取 DOM 节点本身

````javascript
export default function Container() {
  let $container;
  return (
    <div ref={$container}>
      container
    </div>
  )
}
````
传递 ref 则直接在元素上绑定，如 
\<div ref={props.ref}\>\</div\>

##### spread
有时您的组件和元素接受可变数量的属性，将它们作为对象而不是单独传递是有意义的。在组件中包装 DOM 元素时尤其如此，这是制作设计系统时的常见做法  
为此，我们使用扩展运算符...。  
我们可以传递一个具有可变数量属性的对象：  

````javascript
function Info(props) {
  return (
    <div>
      <div>{props.name}</div>
      <div>{props.speed}</div>
      <div>{props.version}</div>
      <div>{props.website}</div>
    </div>
  );
}

const pkg = {
  name: "solid-js",
  version: 1,
  speed: "⚡",
  website: "https://solidjs.com",
};

function Main() {
  return (
    <Info 
      name={pkg.name}
      version={pkg.version}
      speed={pkg.speed}
      website={pkg.website}
    >
    </Info>
  )
}
// 等同于
function Main() {
  return (
    <Info 
      {...pkg}
    >
    </Info>
  )
}

````

#### store/嵌套反应
Solid 中细粒度反应性的原因之一是它可以独立处理嵌套更新。你可以有一个用户列表，当我们更新一个名字时，我们只更新 DOM 中的一个位置，而不会对列表本身进行差异化。很少（甚至是反应式）UI 框架可以做到这一点。

##### createStore
>用于创建一个 store，store 可用于精确地嵌套反应  
此函数将创建一个信号树作为代理，允许独立跟踪嵌套数据结构中的各个值。create 函数返回一个只读代理对象和一个 setter 函数  

>前面所说的 For 标签在这里会很有用，因为直接使用 JSX 则会直接刷新整个表达式，从而无法细粒度更新

先看一个没有使用 store 的例子  
这里使用一些示例数据并使用 For 标签迭代渲染  
点击复选框可以切换其选择状态，这里先简单的映射原始数据生成新数据在 set 过去  
复制代码运行，并尝试点击复选框，查看控制台输出
````javascript
import { render } from "solid-js/web";
import { For, createSignal } from "solid-js";

const App = () => {
  const [state, setState] = createSignal(
    {
      // 初始化一个具有 id, text, completed 属性的对象组成的数组
      todos: [
        {id: 1, text: 1, completed: false},
        {id: 2, text: 2, completed: false},
        {id: 3, text: 3, completed: false},
        {id: 4, text: 4, completed: false}
      ]
    }
  );

  // 修改点击的复选框的选择状态
  const toggleTodo = (id) => {
    setState({
      todos: state().todos.map((todo) => (
        todo.id !== id 
        ? todo 
        : { ...todo, completed: !todo.completed }
      ))
    });
  }

  return (
    <>
      <For each={state().todos}>
        {(todo) => {
          const { id, text } = todo;
          console.log(`Creating ${text}`)
          return <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onchange={[toggleTodo, id]}
            />
            <span
              style={{ "text-decoration": todo.completed ? "line-through" : "none"}}
            >{text}</span>
          </div>
        }}
      </For>
    </>
  );
};

render(App, document.getElementById("app"));
````
会发现控制台随点击每次输出，这是因为每次都销毁重建了元素，我们只是修改了一个属性，却要重建元素，这是一种浪费  
如果我们使用 store 可以有更精确的反应，而不需要重建元素，只会在原有的位置更新  
把上面的代码修改为以下代码，再次运行并且点击，会发现，元素不再被销毁重建，这保证了高性能  
> store 的具体使用在下文具体解释  
````javascript
import { render } from "solid-js/web";
import { For } from "solid-js";
import { createStore } from "solid-js/store";

const App = () => {
  const [store, setStore] = createStore(
    {
      // 初始化一个具有 id, text, completed 属性的对象组成的数组
      todos: [
        {id: 1, text: 1, completed: false},
        {id: 2, text: 2, completed: false},
        {id: 3, text: 3, completed: false},
        {id: 4, text: 4, completed: false}
      ]
    }
  );

  // 修改点击的复选框的选择状态
  const toggleTodo = (id) => {
    setStore(
      "todos", 
      (t) => t.id === id, 
      'completed', 
      (completed) => !completed
    );
  };

  return (
    <>
      <For each={store.todos}>
        {(todo) => {
          const { id, text } = todo;
          console.log(`Creating ${text}`)
          return <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onchange={[toggleTodo, id]}
            />
            <span
              style={{ "text-decoration": todo.completed ? "line-through" : "none"}}
            >{text}</span>
          </div>
        }}
      </For>
    </>
  );
};

render(App, document.getElementById("app"));
````
仔细对比上面两个例子，我们会发现主要修改与区别如下  
createSignal 修改为了 createStore  
由于 createStore 直接返回只读代理，而不是 Getter，所以无需调用，直接使用  
signal 设置值只是简单的遍历原始数据，改变并产生新数据，在大多数应用中都是如此，但 Solid 对于这种情况有一定的优化策略  
设置 store 的值可以像类似 react setState 一样，让对象浅合并  
但是此处我们使用了 solid 所支持的另外一种方式，这可以让 solid 知晓我们详细变化了哪些东西，从而细粒度地更新
在上面的例子中  
我们将 toggleTodo 修改为了这种样子  
````javascript
  (id) => {
    setStore(
      "todos", 
      (t) => t.id === id, 
      'completed', 
      (completed) => !completed
    );
  };
````
这种是 Solid 中的路径语法，参考 [官方 API 文档](https://www.solidjs.com/docs/latest/api#updating-stores)  
路径可以是字符串键、键数组、迭代对象（{from、to、by}）或过滤器函数。这为描述状态变化提供了令人难以置信的表达能力。
````javascript
const [state, setState] = createStore({
  todos: [
    { task: 'Finish work', completed: false }
    { task: 'Go grocery shopping', completed: false }
    { task: 'Make dinner', completed: false }
  ]
});

setState('todos', [0, 2], 'completed', true);
// {
//   todos: [
//     { task: 'Finish work', completed: true }
//     { task: 'Go grocery shopping', completed: false }
//     { task: 'Make dinner', completed: true }
//   ]
// }

setState('todos', { from: 0, to: 1 }, 'completed', c => !c);
// {
//   todos: [
//     { task: 'Finish work', completed: false }
//     { task: 'Go grocery shopping', completed: true }
//     { task: 'Make dinner', completed: true }
//   ]
// }

setState('todos', todo => todo.completed, 'task', t => t + '!')
// {
//   todos: [
//     { task: 'Finish work', completed: false }
//     { task: 'Go grocery shopping!', completed: true }
//     { task: 'Make dinner!', completed: true }
//   ]
// }

setState('todos', {}, todo => ({ marked: true, completed: !todo.completed }))
// {
//   todos: [
//     { task: 'Finish work', completed: true, marked: true }
//     { task: 'Go grocery shopping!', completed: false, marked: true }
//     { task: 'Make dinner!', completed: false, marked: true }
//   ]
// }
````

##### produce
Solid 强烈建议使用浅层不可变模式来更新状态。通过分离读取和写入，我们可以更好地控制系统的反应性，而不会在通过组件层时丢失对代理更改的跟踪的风险  
然而，有时候突变更容易理解  
为此，受 Immer 启发的 Solid 提供了一个 produce，用于让 store 可变
沿用上面的例子，修改 toggleTodo 为  
````javascript
  const toggleTodo = (id) => {
    setStore(
      "todos", 
      produce((todos) => {
        todos.push({ id: ++todoId, text, completed: false });
      }),
    );
  };
````

##### [更多 store 相关内容](https://www.solidjs.com/docs/latest/api#stores)

#### 异步

##### lazy
在应用中，某些组件只在使用时加载，这些组件会被单独打包，在某个时间被按需加载，solid 也提供了方法  
使用 lazy 替换普通的静态 import 语句  
将
````javascript
import Component1 from "./Component1.jsx";
````
替换为
````javascript
const Component1 = lazy(() => import("./Component1"));
````
>由于 lazy 接接收的参数只是返回 Solid 组件的 Promise，因此，还可以在加载的时候附加一些行为

##### createResource
创建一个可以管理异步请求的信号。fetcher 是一个异步函数，它接受sourceif 提供的返回值并返回一个 Promise，其解析值设置在资源中。fetcher 不是响应式的，因此如果您希望它运行多次，请使用可选的第一个参数。如果源解析为 false、null 或 undefined，则不会获取。  
[官网在线尝试](https://www.solidjs.com/tutorial/async_resources)
````javascript
const [data, { mutate, refetch }] = createResource(getQuery, fetchData);
// 获取值
data();
// 检查其是否加载中
data.loading;
// 检查是否出错
data.error;
// 直接设置值
mutate(optimisticValue);
// 刷新，重新请求
refetch();
````

##### Suspense
Suspense 配合异步组件使用  
在尚未加载完毕时显示 fallback 中给定的内容
````javascript
const Component1 = lazy(() => import("./Component1"));

export default function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Component1></Component1>
    </Suspense>
  )
}
````

##### [更多异步内容](https://www.solidjs.com/tutorial/async_lazy)

### 总结
* Solid 具有高性能，并且具有极小的打包体积，适合打包为独立的模块嵌入其它项目  
* Solid 上手简单，贴合 React 或是 Vue3 开发者的使用习惯
* Solid 中 JSX 直接返回 DOM 元素，符合直觉，并且很纯净
* Solid 某些地方需要使用其指定的东西才能达到高性能，高性能并不是毫无代价的
* Solid 目前使用并不多，生态有待完善