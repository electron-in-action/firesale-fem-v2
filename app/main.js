const fs = require('fs');

const { app, BrowserWindow, dialog } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });

  mainWindow.loadFile(`${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
});

exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog({
    properties: ['openFile'],
    buttonLabel: 'Unveil',
    title: 'Open Fire Sale Document',
    filters: [
      {
        name: 'Markdown Files',
        extensions: ['md', 'mdown', 'markdown', 'marcdown'],
      },
      { name: 'Text Files', extensions: ['txt', 'text'] },
    ],
  });

  if (!files) return;

  const file = files[0];

  openFile(file);
};

exports.saveMarkdown = (file, content) => {
  if (!file) {
    file = dialog.showSaveDialog({
      title: 'Save Markdown',
      defaultPath: app.getPath('desktop'),
      filters: [
        {
          name: 'Markdown Files',
          extenstions: ['md', 'markdown', 'mdown', 'marcdown'],
        },
      ],
    });
  }

  if (!file) return;

  fs.writeFileSync(file, content);
  openFile(file);
};

const openFile = file => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  mainWindow.webContents.send('file-opened', file, content);
};
