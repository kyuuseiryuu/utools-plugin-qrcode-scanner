const { clipboard } = require('electron');

window.utils = {
  setText: (text) => clipboard.writeText(text),
};

