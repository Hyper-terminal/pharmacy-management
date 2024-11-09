/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { createInitialData } from '@/src/main/schema/seed';
import dbService from './database';
import Papa from 'papaparse';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    await createInitialData();
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

let db = dbService.db;
// Handle importing CSV file
ipcMain.handle('import-csv', async (event, file) => {
  try {
    const csvData = await parseCSV(file);
    await insertDataIntoDB(csvData); // Insert parsed data into the database
    return 'Data import complete!';
  } catch (error) {
    console.error('Error in CSV import:', error);
    throw new Error('Failed to import CSV');
  }
});

// Parse the CSV file (from the file object in the renderer)
function parseCSV(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      Papa.parse(reader.result, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          resolve(result.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    };

    reader.onerror = (err) => {
      reject(err);
    };

    // Read file as text (this works with FileReader in the renderer process)
    reader.readAsText(file);
  });
}

// Insert parsed data into the SQLite database
function insertDataIntoDB(data) {
  const stmt = db.prepare(`
      INSERT INTO medicinal_data (supplier, bill_no, date, company_code, barcode, item_name, pack, batch, expiry, qty, fq_qty, halfp, ftrate, srate, mrp, dis, excise, vat, adnl_vat, amount, localcent, scm1, scm2, scmp_per, hsn_code, cgst, sgst, igst, psr_lno, tcs_per, tcs_amt, alter_code, po_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  db.transaction(() => {
    data.forEach((row) => {
      stmt.run(
        row.supplier,
        row.bill_no,
        row.date,
        row.company_code,
        row.barcode,
        row.item_name,
        row.pack,
        row.batch,
        row.expiry,
        row.qty,
        row.fq_qty,
        row.halfp,
        row.ftrate,
        row.srate,
        row.mrp,
        row.dis,
        row.excise,
        row.vat,
        row.adnl_vat,
        row.amount,
        row.localcent,
        row.scm1,
        row.scm2,
        row.scmp_per,
        row.hsn_code,
        row.cgst,
        row.sgst,
        row.igst,
        row.psr_lno,
        row.tcs_per,
        row.tcs_amt,
        row.alter_code,
        row.po_number,
      );
    });
  })();

  console.log(`Inserted ${data.length} rows into the database.`);
}
