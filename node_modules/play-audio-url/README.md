play-audio-url
==================

An abstraction for playing audio via an HTMLAudioElement.

[Here's a demo.](https://jimkang.com/play-audio-url/)

Why
---

[It's mostly due to a misunderstanding.](https://jimkang.com/weblog/articles/weasley-debugging/) It's still a nice, if inessential, convenient way to play through an HTMLAudioElement.


Installation
------------

    npm install play-audio-url

Usage
-----

    var playAudioURL = require('play-audio-url');

    playAudioURL({ url: 'https://whatever.com/some-sound.ogg' }, onPlay);
    // You can also pass sampleRate here.
    // e.g.: { url: 'https://o.k/guy.mp3', sampleRate: 22050 } 

    // playAudioURL passes back an htmlPlayer if it was able to play
    // via an HTMLAudioElement, otherwise passes an AudioContext-based player.
    function onPlay(error, { htmlPlayer, bufferPlayer }) {
      if (error) {
        console.log(error);
      } else if (htmlPlayer) {
        setTimeout(player.pause, 10000);
      } else if (bufferPlayer) {
        setTimeout(bufferPlayer.stop, 10000);
      }
    }

License
-------

The MIT License (MIT)

Copyright (c) 2019 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
