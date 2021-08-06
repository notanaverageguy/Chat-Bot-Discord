/* global webkitAudioContext */

function AudioContextSingleton() {
  var audioContext;
  var resolvedPromise = Promise.resolve();

  return {
    getCurrentContext,
    getNewContext
  };

  function getCurrentContext(done) {
    if (audioContext) {
      resolvedPromise.then(() => done(null, audioContext));
    } else {
      getNewContext(done);
    }
  }

  function getNewContext(firstParam, secondParam) {
    var opts;
    var done;

    if (typeof firstParam === 'function') {
      done = firstParam;
    } else if (typeof secondParam === 'function') {
      done = secondParam;
      if (typeof firstParam === 'object') {
        opts = firstParam;
      }
    }

    if (audioContext) {
      audioContext.close().then(passNewContext);
    } else {
      passNewContext();
    }

    function passNewContext() {
      var acOpts;
      if (opts && opts.sampleRate) {
        acOpts = { sampleRate: opts.sampleRate };
      }
      if (typeof AudioContext === 'function') {
        audioContext = new AudioContext(acOpts);
      } else {
        audioContext = new webkitAudioContext(acOpts);
      }
      done(null, audioContext);
    }
  }
}

module.exports = AudioContextSingleton;
