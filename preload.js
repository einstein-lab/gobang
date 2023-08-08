const { contextBridge, ipcRenderer } = require('electron');

// 将需要暴露给渲染进程的方法定义在 bridge 对象中
const bridge = {
  // 在执行脚本时向主进程发送请求
  player1Run: (board) => {
    return new Promise((res) => {
      // 监听主进程回复的事件
      ipcRenderer.once('custom-event-player1-reply', (_, arg) => {
        console.log(arg);
        res(arg);
      });
      ipcRenderer.send('custom-event-player1', board);
    });
  },
  player2Run: (board) => {
    return new Promise((res) => {
      // 监听主进程回复的事件
      ipcRenderer.once('custom-event-player2-reply', (_, arg) => {
        console.log(arg);
        res(arg);
      });
      ipcRenderer.send('custom-event-player2', board);
    });
  },
};

// 使用 contextBridge 将方法暴露给渲染进程
contextBridge.exposeInMainWorld('gobang', bridge);
