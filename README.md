# gobang
算法battle程序

# 本地开发方法
electron服务和客户端服务是分开的需要分别安装对应的依赖
```sh
npm i
```
然后
```sh
cd client-dev && npm i
```
启动调试
```sh
npm start
```
单独启动客户端调试
```sh
cd client-dev && npm start
```
打包应用程序
```sh
npm run build
```
单独打包客户端
```sh
cd client-dev && npm run build
```

# 算法脚本说明
在player目录下会加载前两个js文件，并读取其中的run方法当作对战的脚本。
打包之后player目录在resource目录下，直接替换player下的脚本即可。
目前没有增加热更新功能，每次都需要重启exe程序重新加载脚本。
run方法入参为当前对战的局势0表示空位，-1表示对方棋子的位置，1表示己方棋子所在位置。
需要计算并返回[number,number]类型的数据表示下一次己方下棋的位置。