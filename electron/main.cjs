const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const fs = require('fs')

// Cookie存储路径
const COOKIE_PATH = path.join(__dirname, 'cookie.json')

function mapSameSite(sameSite) {
  switch (sameSite) {
    case 'no_restriction':
      return 'None';
    case 'lax':
      return 'Lax';
    case 'strict':
      return 'Strict';
    default:
      return 'Lax'; // 默认值为 'Lax'
  }
}

async function saveCookies() {
  try {
    const cookies = await session.defaultSession.cookies.get({ url: 'https://creator.xiaohongshu.com' });
    const transformedCookies = cookies.map(o => ({ ...o, sameSite: mapSameSite(o.sameSite) }))
    const cookieJson = JSON.stringify(transformedCookies, null, 2)
    fs.writeFileSync(COOKIE_PATH, cookieJson)
    console.log('Cookies saved successfully');
  } catch (error) {
    console.error('Failed to save cookies:', error)
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  saveCookies()
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