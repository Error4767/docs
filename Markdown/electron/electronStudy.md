# Electron安装  
````javascript
npm install electron --save
````
>如果安装卡在node   install则为网络问题，需要科学上网  
  
>或者也可以选择去下载 [Electron](https://npm.taobao.org/mirrors/electron/)(淘宝镜像,国内可访问)  
下载完成后解压并将里面的文件放置到项目的node_modules/electron/dist目录下，如果没有目录就新建一个  
另外查看node_modules/electron目录下是否有path.txt文件,如果没有就新建一个，内容为  
electron.exe //在windows系统下
# Electron模块化  
Electron中可以使用ESModule  
使用：  
## ESModule  
页面中引入  
````html
<!-- 加上type='module'表示这个引入的文件是模块 以ES6模块化标准加载 -->
<script type='module' src='url'></script>
````
模块内部导入其他模块才用ESM的常规写法  
路径： 以文件所在目录为基础
  
  
## node Module(CommonJs)  
>注意 ： 需要窗口启用node 
````javascript
//页面中引入是常规引用script标签
const xxx = require('url');
````
路径： 以运行目录为基础  
>详细:  
script标签导入的时候是html文件所在目录  
被require导入的模块运行目录就是被导入模块文件所在目录  
  
  
# Electron模块
## BrowserWindow  
用于创建窗口  
使用方法:   
````javascript
let mainWindow = new BrowserWindow({  
  width: '800px',//窗口宽度
  height: '500px',//窗口高度
  //frame: false,//值为false代表为无边框窗口隐藏按钮和菜单栏，只显示页面本身
  show: false,//是否显示窗口
  parent: ,//设置该窗口的父窗口
  //modal: true,//模态窗口，禁用父窗口的窗口，必须和父窗口一起使用
  webPreferences: {
    nodeIntegration: true//设置新窗口启用node
  }
});
//窗口关闭事件
mainWindow.addEventListener('closed', ()=> {
  mainWindow = null;//窗口关闭后解除引用， 释放内存
})
//首次完成渲染事件，必须创建的窗口的属性show: false才可用
mainWindow.once('ready-to-show', ()=> {
  console.log('renderd');
  mainWindow.show();
})
````
## remote
remote用于在渲染进程中使用某些方法等  
使用方法：
````javascript
const {remote} = require('electron');//导入
remote['方法名称']();
````

## BrowserView  
用于创建嵌入窗口
使用方法：
````javascript
let view = new BrowserView();
mainWindow.setBrowserView(view);//在窗口中设置嵌入窗口
view.setBounds({//设置属性
  x: 100,//窗口相对于主窗口顶部距离
  y: 100,//窗口对于主窗口左侧距离
  width: 300,//窗口宽度，数字
  height: 150//窗口高度，数字
});
view.webContents.loadURL('url');//在窗口中加载指定url
````

## Menu  
用于设置菜单栏  
使用方法:  
````javascript
let template = [
  {//菜单栏项目
    label: 'xxx',//菜单栏标题
    accelerator: 'ctrl+c',//设置快捷键
    click: ()=> {},//点击时的动作
    submenu: [//子菜单
      {}//子菜单项目，对象，格式同上
    ]
  }
  //菜单栏项目,格式同上
]
let menu = Menu.buildFromTemplate(template);//创建菜单
Menu.setApplicationMenu(menu);//设置当前菜单为刚刚创建的菜单
````
## dialog  
用于弹出提示框  
### 方法  
#### dialog.showMessageBox  
弹出对话框  
使用方法:  
````javascript
dialog.showMessageBox({
  type: 'warning',//对话框类型
  title: '选择',//对话框标题
  message: '你打球像蔡徐坤',//对话框内容
  buttons: ['是', '否', '你打球才像蔡徐坤']//对话框选项
}).then(r=> {
  // r是一个对象,结构如下
  // {
  //   response: 0,//选择的选项的下标,对应上方的buttons数组项下标,没选则为0
  //   checkboxChecked: false//默认为false
  // }
})
````
#### dialog.showOpenDialog  
打开选择文件窗口  
使用方法：
````javascript
dialog.showOpenDialog({
  title: '选择图片',
  defaultPath: 'index.js',//默认选择
  filters: [{//过滤器，筛选类型
    name: 'img',
    extensions: ['jpg', 'png']
  }],
  buttonLabel: '选择这个图片'//选择按钮文本
}).then(r=> {
  // r是一个对象,结构如下
  // {
  //   canceld: false,//是否取消操作，也就是直接关闭操作窗口
  //   filePaths: [
  //     path//选择的文件完整路径，可以是多个，因而这里是数组
  //   ]
  // }
})
````
#### dialog.showSaveDialog  
打开保存文件窗口  
使用方法：
````javascript
dialog.showSaveDialog({
  title: '选择图片'
}).then(r=> {
  // r是一个对象,结构如下
  // {
  //   canceld: false,//是否取消操作，也就是直接关闭操作窗口
  //   filePaths: //保存文件的完整路径
  // }
})
````  
## shell  
方法:  
>shell.openExternal(url) ：用于吊起浏览器打开一个页面

## globalShortcut  
用于设置全局快捷键  
方法:  
````javascript
//register(accelerator, callback): 定义一个全局快捷键
globalShortcut.register('ctrl+shift+i', ()=> {
  //动作
});
//isRegister(accelerator): 判断是否成功注册了快捷键，返回一个布尔值
globalShortcut.isRegister('ctrl+shif+i');
//unregister(accelerator): 移除指定快捷键
globalShortcut.unregister('ctrl+shift+i');
//unregisterAll(): 移除所有快捷键
globalShortcut.unregisterAll();
````
  
  
# Electron操作
## 打开子窗口
````javascript
window.open('url');
````
## 右键点击菜单
````javascript
//首先创建一个菜单，见上面创建菜单的步骤,现在假设已经创建了菜单menu
window.addEventListener('contextmenu', (e)=> {
  e.preventDefault();//先阻止默认事件
  menu.popup({
    window: remote.getCurrentWindow()
  });
})
````
## 子窗口向父窗口传递值
````javascript
//父窗口
window.open('url');//必须用window.open打开子窗口
window.addEventListener('message', (message)=> {
  //message.data为传递过来的值
  console.log(message, message.data);
})
````
````javascript
//子窗口
window.opener.postMessage('被传递的值，可以是任意类型');
````