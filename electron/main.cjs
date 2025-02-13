const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const fs = require('fs')

// Cookie存储路径
const COOKIE_PATH = path.join(app.getPath('userData'), 'cook.json')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // 获取当前session
  const ses = win.webContents.session

  // 监听Cookie变化
  ses.cookies.on('changed', async (event) => {
    await saveCookies(ses)
  })

  // 加载抖音创作平台
  win.loadURL('https://creator.xiaohongshu.com')

  // 窗口关闭时保存最后状态
  win.on('closed', async () => {
    await saveCookies(ses)
  })
}


// 保存Cookie到文件的函数
async function saveCookies(ses) {
  try {
    // 获取所有抖音相关的Cookie
    const cookies = await ses.cookies.get({
      url: 'https://creator.xiaohongshu.com'
    })

    // 转换为JSON格式并保存
    const cookieJson = JSON.stringify(cookies, null, 2)
    fs.writeFileSync(COOKIE_PATH, cookieJson)

    console.log('Cookies saved successfully');
  } catch (error) {
    console.error('Failed to save cookies:', error)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})