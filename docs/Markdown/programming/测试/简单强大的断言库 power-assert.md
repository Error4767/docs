## power-assert
### 什么是 power-assert 
用官方的话回答  
- 是 JavaScript 中“Power Assert”概念的实现。  
- 通过标准断言接口提供描述性断言消息。  
- 没有 API 就是最好的 API。使用 power-assert，您无需学习许多断言库 API（在大多数情况下，您需要记住的只是一个assert(any_expression)函数）  
- 停止记忆大量的断言 API。只需创建返回或不返回真实值的表达式， power-assert 将在屏幕上将其作为失败消息的一部分显示给您，而您根本无需输入消息。  
- power-assert 的核心价值是绝对的简单和稳定。特别是， power-assert 坚持最简单的测试形式  
>github 地址: [power-assert](https://github.com/power-assert-js/power-assert)
### 前言
>这个库在 github 最后一次更新是在6个月前，npm上最后一次更新在3年前，所以不是很推在荐企业级项目中使用，建议只在个人或小型项目中使用，如果您需要足够稳定，完全可用于生产的测试库的话，不妨去看看 [Jest](https://jestjs.io/zh-Hans/)  
  
power-assert 相较于许多常见的断言库最大的特点是简单强大，并未提供很多api，上手非常简单，且易于迁移      
这篇文章会涉及 power-assert 基本的浏览器和 nodejs 示例，不会涉及复杂的示例  
### 基本示例
调用 assert() 传入 一个表达式 和 一个错误信息（可选） ，如果表达式值为真，则没有动作，如果值为假，则显示第二个参数传入的错误信息以及一些有用的表达式的信息  
我们随便写一个失败的测试  
````javascript
const assert = require("assert");

const obj = { a: {c: 4} };
const arr = [1,2,34,6,7, {a: [5,7]}]

assert(obj.a.c === arr[5].a[1], "断言错误");
````
power-assert 只需要直接导入 assert 模块  
在运行之前需要经过一些处理(会自动转换为power-assert)，下文会详细讲解，这里我们先看一下输出结果  
````
/root/RemoteWorking/powerAssert_/node_modules/empower/index.js:80
            throw e;
            ^

AssertionError [ERR_ASSERTION]: 断言错误   # ./test/index.js:7
  
  assert(obj.a.c === arr[5].a[1], "断言错误")
         |   | | |   |  |   ||               
         |   | | |   |  |   |7               
         |   | | |   |  |   [5,7]            
         |   | | |   |  Object{a:#Array#}    
         |   | | |   [1,2,34,6,7,#Object#]   
         |   | 4 false                       
         |   Object{c:4}                     
         Object{a:#Object#}                  
  
  [number] arr[5].a[1]
  => 7
  [number] obj.a.c
  => 4
  
    at Decorator._callFunc (/root/RemoteWorking/powerAssert_/node_modules/empower-core/lib/decorator.js:114:29)
    at Decorator.concreteAssert (/root/RemoteWorking/powerAssert_/node_modules/empower-core/lib/decorator.js:103:17)
    at decoratedAssert (/root/RemoteWorking/powerAssert_/node_modules/empower-core/lib/decorate.js:49:30)
    at powerAssert (/root/RemoteWorking/powerAssert_/node_modules/empower-core/index.js:63:32)
    at Object.<anonymous> (/root/RemoteWorking/powerAssert_/test/assert.js:41:1)
    at Module._compile (node:internal/modules/cjs/loader:1103:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1155:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  powerAssertContext: {
    source: {
      content: 'assert(obj.a.c === arr[5].a[1], "断言错误")',
      filepath: './test/index.js',
      line: 7
    },
    args: [
      {
        value: false,
        events: [
          { value: [Object], espath: 'arguments/0/left/object/object' },
          { value: [Object], espath: 'arguments/0/left/object' },
          { value: 4, espath: 'arguments/0/left' },
          {
            value: [Array],
            espath: 'arguments/0/right/object/object/object'
          },
          {
            value: [Object],
            espath: 'arguments/0/right/object/object'
          },
          { value: [Array], espath: 'arguments/0/right/object' },
          { value: 7, espath: 'arguments/0/right' },
          { value: false, espath: 'arguments/0' }
        ]
      }
    ]
  }
}
````
可以看出，power-assert 会输出表达式每个部分的值，下方还输出了该表达式更加详细的上下文信息，提供了极具参考价值的信息，在很多情况下，我们不再需要像其它测试库一样手动打印信息  

### 快速上手
#### 快速体验
可以使用官方示例快速体验 power-assert  
nodejs 示例: [power-assert-node-seed](https://github.com/azu/power-assert-node-seed)  
浏览器示例：[power-assert-karma-seed](https://github.com/azu/power-assert-karma-seed)  
### 推荐用法
#### nodejs
nodejs 如果需要测试的文件很少，可以使用 [espower-cli](https://github.com/power-assert-js/espower-cli) 直接转换代码  
仅需先安装 espower-cli  
然后: espower 源文件 > 输出目标文件  
之后运行已转换的代码即可  
像下面一样  
````
npm install espower-cli
espower ./test/some_test.js > ./build/test/some_test.js
node ./build/test/some_test.js
````
也可以配置一些工具做简单的自动化  
对于项目中使用，还是建议使用 [babel-preset-power-assert](https://github.com/power-assert-js/babel-preset-power-assert) 转换代码，然后再运行测试，可以使用专门的测试工具，比如官方示例中的mocha，也可以自行配置测试  
#### 浏览器使用
因为 power-assert 本身是 nodejs 模块，不支持浏览器  
所以官方提供了 [espowerify](https://github.com/power-assert-js/espowerify) 来支持在浏览器中使用 power-assert  
浏览器中断言错误，错误反馈会打印在浏览器的控制台，相比 nodejs 查看与调试更加方便  
##### 推荐做法
>推荐做法在前期稍微繁琐，但适用于许多官方示例之外情况  
  
由于大多数情况下我们不会使用 browserify，所以我们可以根据官方的示例，稍作处理，制作一个浏览器通用的 power-assert 模块，这样可以在任何地方导入使用，剩下配置 babel  [babel-preset-power-assert](https://github.com/power-assert-js/babel-preset-power-assert) 转换代码即可使用  
下面是详细的浏览器 power-assert 模块制作步骤（如果您不想自己制作，可以移至文章末尾下载已制作完毕的模块）
````
power-assert 官方文档提到了通过 espowerify 支持浏览器
我们可以将其打包为一个浏览器可直接导入的模块，以供我们在不同的项目中使用
对于assert方法我们直接导入自行打包好了的支持浏览器的power-assert模块就好
而我们只需要转换对应测试代码即可使用 power-assert

打包步骤
	1. 通过 browserify + espowerify 将power-assert打包为浏览器可用的模块 (需要安装browserify, espowerify, power-assert)
		1.模块直接这么写 // power-assert.js
			const assert = require("assert");
			module.exports = assert;
		2. 用browserify打包该模块，即打包包含 power-assert 的模块,browserify 会转换某些node内置模块到,使用polyfill在浏览器中(power-assert用到了 util, buffer, assert 三个node内置模块)
			运行命令转换: 
				browserify -t espowerify 上面的文件地址 > 导出地址
			这一步结束之后得到了打包完毕的文件，但brwoserify没有将模块导出，所以下面需要手动导出
	2. 手动添加esm格式的模块导出(修改上一步打包完毕的文件)
		1.在顶部添加：
			let assert;
			底部找到 require('power-assert'),这里的require并不是node的原生函数，而是一个自定义函数,可以得到可用的power-assert模块
		2.将: 
				const assert = require("assert");
				module.exports = assert;
			这两行替换为: 
				assert = require("assert");
			从而将模块赋值给上方定义的 assert 变量
		3. 在底部添加：
				export default assert;
			从而导出了我们需要的模块，至此，打包已经完成，该模块已经在浏览器可用（可自由导入导出使用）
	3. 压缩处理 【推荐】（可选）,使用你喜欢的工具压缩代码
		因为后续频繁使用该文件，故使用 rollup + terser 压缩代码使其更小
			参考 rollup 配置:
				// 压缩代码
				import { terser } from 'rollup-plugin-terser';

				// rollup.config.js
				export default {
				    input: '文件地址',
				    output: {
				        file: '导出地址',
				        format: 'esm'
				    },
				    plugins: [
				        terser(),
				    ]
				};
			你也可以使用其他工具，这里推荐可以用esbuild快速压缩
			执行： 
				esbuild 文件路径 --minify --outfile=导出路径
			即可生成文件
		亲测 rollup 压缩出来的文件 273KB,但esbuild压缩出来的是280KB，如要频繁使用，建议rollup + terser压缩代码

````
通过以上步骤，我们就制作了一个浏览器通用的 power-assert 模块  
后面，我们就可以在自己的项目中导入使用  
就像下面一样  
````
import assert from "模块地址";
assert("表达式");
````
与上面代码的区别只是顶部的导入  
而对于代码转换的部分，我们则是配置 babel 来完成  
这样，无论是在 webpack，rollup，parcel 亦或是其它工具，我们也可以使用 power-assert 了  
### 最后
上面的例子在浏览器中使用比较繁琐  
您可以 [直接下载](https://api.ecuder.cn/assets/powerAssertBrowser.js) 已制作完毕的模块用于浏览器  
由于 power-assert 相关工具较少，所以使用起来可能有些麻烦，做好前期处理，在后面就可以愉快地使用了  