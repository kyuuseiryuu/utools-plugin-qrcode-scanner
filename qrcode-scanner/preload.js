const { clipboard } = require('electron');

window.setText = (text) => clipboard.writeText(text);

