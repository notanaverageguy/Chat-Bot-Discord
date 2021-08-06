var callNextTick = require('call-next-tick');

// TODO: Put it in its own package.
function AudioBufferPlayer({ audioCtx }) {
  var sourceNode;

  return {
    play,
    stop
  };

  function play({ buffer, decodedBuffer, loop = false }, done) {
    if (decodedBuffer) {
      callNextTick(playDecodedBuffer, decodedBuffer);
    } else {
      audioCtx.decodeAudioData(buffer, playDecodedBuffer, done);
    }

    function playDecodedBuffer(decodedAudioBuffer) {
      stop();

      sourceNode = audioCtx.createBufferSource();
      sourceNode.connect(audioCtx.destination);

      sourceNode.buffer = decodedAudioBuffer;
      sourceNode.loop = loop;

      sourceNode.start();
      callNextTick(done);
    }
  }

  function stop() {
    if (sourceNode) {
      sourceNode.stop();
    }
  }
}

module.exports = AudioBufferPlayer;
