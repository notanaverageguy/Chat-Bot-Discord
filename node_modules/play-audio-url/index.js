var waterfall = require('async-waterfall');
var CollectCtor = require('collect-in-channel');
var request = require('basic-browser-request');
var bodyMover = require('request-body-mover');
var AudioBufferPlayer = require('./audio-buffer-player');
var curry = require('lodash.curry');

var acSingleton = require('audio-context-singleton')();
var bufferPlayer;
var htmlPlayer;

function playAudioURL({ url, sampleRate }, playCb) {
  if (htmlPlayer) {
    htmlPlayer.src = url;
  } else {
    htmlPlayer = new Audio(url);
  }
  htmlPlayer.play().then(passPlayer, playMediaFileWithBuffer);
  //playMediaFileWithBuffer();

  function passPlayer() {
    playCb(null, { htmlPlayer });
  }

  function playMediaFileWithBuffer() {
    var channel = { url };
    var Collect = CollectCtor({ channel });
    var tasks = [];
    if (!bufferPlayer) {
      tasks = [
        curry(acSingleton.getNewContext)({ sampleRate }),
        Collect({ props: [[createBufferPlayer, 'bufferPlayer']] }),
        downloadFile
      ];
    } else {
      tasks = [curry(downloadFile)(channel)];
    }
    tasks = tasks.concat([
      Collect({ props: [[x => x, 'buffer']] }),
      playBuffer
    ]);

    waterfall(tasks, passBufferPlayer);
  }

  function downloadFile({ url }, done) {
    request({ method: 'GET', url, binary: true }, bodyMover(done));
  }

  function passBufferPlayer(error) {
    if (error) {
      playCb(error);
    } else {
      playCb(null, { bufferPlayer });
    }
  }

  function playBuffer({ buffer }, done) {
    bufferPlayer.play({ buffer }, done);
  }
}

function createBufferPlayer(audioCtx) {
  return (bufferPlayer = AudioBufferPlayer({ audioCtx }));
}

module.exports = playAudioURL;
