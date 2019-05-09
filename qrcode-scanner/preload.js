const { clipboard } = require('electron');
const player = require('play-sound')();
const path = require('path');

window.utils = {
  playSound: () => player.play(path.resolve(__dirname, './qrcode_completed.mp3'), err => {
    console.log(err);
  }),
  setText: (text) => clipboard.writeText(text),
};

