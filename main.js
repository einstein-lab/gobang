const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const escodegen = require('escodegen');
const { dialog } = require('electron');

const getPlayerPath = () => {
  if (process.env.NODE_ENV === 'production') {
    return path.join(__dirname, '../player');
  }
  return path.join(__dirname, 'player');
};

const getPlayerFileName = (directoryPath) => {
  try {
    const files = fs.readdirSync(directoryPath);
    const jsFiles = files.filter((file) => path.extname(file) === '.js');
    return jsFiles
      .map((item) => {
        return path.join(directoryPath, item);
      })
      .slice(0, 2);
  } catch (err) {
    console.error('Error reading directory:', err);
  }
};

const getRun = (filePath) => {
  const scriptContent = fs.readFileSync(filePath, 'utf-8');
  const ast = acorn.parse(scriptContent, { sourceType: 'module' });
  const runAstNode = ast?.body?.find((node) => {
    if (node.type === 'FunctionDeclaration' && node.id.name === 'run') {
      return true;
    }
  });
  if (!runAstNode) {
    dialog.showErrorBox('错误的脚本', `未在路径${filePath}下找到run方法`);
  }
  const script = new Function(`return ${escodegen.generate(runAstNode)}`)();
  return script;
};

const getScipts = () => {
  // 读取 JavaScript 脚本文件
  const playerDir = getPlayerPath();
  const players = getPlayerFileName(playerDir);

  if (players?.length < 2) {
    dialog.showErrorBox('目标目录下需要两个可执行脚本', `${playerDir}`);
  }

  const script1 = getRun(players?.[0]);
  const script2 = getRun(players?.[1]);

  return { script1, script2 };
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 950,
    height: 900,
    minimizable: true, // 允许最小化
    maximizable: true, // 允许最大化
    closable: true, // 允许关闭
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // 加载预加载脚本
    },
  });

  const { script1, script2 } = getScipts();
  
  /* 注册监听事件 */
  ipcMain.on('custom-event-player1', (event, board) => {
    const result = script1(board);
    event.reply('custom-event-player1-reply', result);
  });

  ipcMain.on('custom-event-player2', (event, board) => {
    const result = script2(board);
    event.reply('custom-event-player2-reply', result);
  });

  /* 加载首页信息 */
  win.loadFile('./client/index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
