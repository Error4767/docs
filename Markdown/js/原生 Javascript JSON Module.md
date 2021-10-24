## JSON Module
>JSON Module 在开发中已经被我们大量使用，导入 json 在开发中就如同喝水一般常见  
### 目前的现状
得益于构建工具的支持，我们可以随意导入任意 json，并任意使用，但 js 本身并不支持 JSON Module，这只不过是打包工具给予我们的能力罢了，webpack 自 2.x 开始直接支持 JSON Module，rollup 也可以通过 @rollup/plugin-json 支持 JSON Module 直接导入，这些这给我们带来了极大的便利，在此之前，我们需要在 js 文件中导出 json。而现在，借助工具，我们能够直接导入 json，导入的 json 会自动解析为一个对象，供我们直接使用
### 提案
根据 tc39 最新的 ECMAScript 提案 [JSON Modules](https://github.com/tc39/proposal-json-modules)，以后 js 可以直接原生支持 JSON Module 了，目前该提案位于 stage 3 阶段，预计不久之后就会进入 stage 4 阶段，从而进入标准，在这之后我们就可以使用原生 JSON Module 了，JSON Modules 提案建立在 [Import Assertions](https://github.com/tc39/proposal-import-assertions/) 提案的基础之上，Import Assertions 提案规定了导入模块时断言其类型，其还会支持 WebAssembly 类型
### 语法
JSON Modules 语法非常简单  
````javascript
import json from "./data.json" assert { type: "json" };
````
只需要在导入之后加上 assert { type: "json" }  
对于动态导入则是  
````javascript
import("./data.json", { assert: { type: "json" } })
````
### 使用
目前没有浏览器支持该语法，但可以通过 babel 插件 [@babel/plugin-syntax-import-assertions](https://www.npmjs.com/package/@babel/plugin-syntax-import-assertions) 来支持该语法  
````javascript
// babel.config.js
module.exports = {
  plugins: ["@babel/plugin-syntax-import-assertions"]
}
````
如果您不想手动配置环境，本人也准备了一个示例项目，在该项目中你可以直接使用 JSON Modules 语法，[项目地址](https://github.com/Error4767/vite-template-next-standard)  

### 参考
本文参考 [JSON Modules](https://github.com/tc39/proposal-json-modules) 提案和 [Import Assertions](https://github.com/tc39/proposal-import-assertions/) 提案。  
更多提案信息参考 tc39 的 [ECMAScript proposals](https://github.com/tc39/proposals)