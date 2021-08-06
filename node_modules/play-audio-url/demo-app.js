var playAudioURL = require('./index');
var handleError = require('handle-error-web');
var sb = require('standard-bail')();

document.getElementById('activate-button').addEventListener('click', play);

function play() {
  playAudioURL({ url: 'audio/npsRec.mp3' }, sb(setUpStop, handleError));
}

function setUpStop({ htmlPlayer, bufferPlayer }) {
  document.getElementById('stop-button').removeEventListener('click', stop);
  document.getElementById('stop-button').addEventListener('click', stop);

  function stop() {
    if (htmlPlayer) {
      htmlPlayer.pause();
    } else {
      bufferPlayer.stop();
    }
  }
}
