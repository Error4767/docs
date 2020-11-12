
## Webpack Loader, Plugin
### loader  
#### thread-loader  
将此loader加在其他loader前面(指代码中的前面),启用多进程打包  
多进程启动需要600ms，进程之间通信也需要成本，确保只在代码量较大时候使用，只给耗时的loader启用，比如babel-loader  
### plugins  
#### workbox-webpack-plugin
PWA  