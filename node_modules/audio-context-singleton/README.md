audio-context-singleton
==================

When you want to have an audioContext singleton but don't want to rewrite [this small bit of code](index.js), use this. Deals with browser differences in AudioContext and maintains the singleton.

Very little code in the implementation; here for the sake of DRY.

Installation
------------

    npm install audio-context-singleton

Usage
-----

    var ACSingleton = require('audio-context-singleton');

    var acSingleton = ACSingleton();
    acSingleton.getNewContext(useContext);
    // Can also use getCurrentContext here, which will
    // pass a context if it was already created or call
    // getNewContext for you if it hasn't.

    function useContext(error, audioCtx) {
      if (error) {
        console.log(error);
      } else {
        // Do audio stuff here! Then:
        acSingleton.getNewContext(useContext2);
        // Closes the current audio context and creates a new one.
      }
    }

    function useContext2(error, audioCtx) {
      if (error) {
        console.log(error);
      } else {
        // Do audio stuff here! Then:
        audioCtx.stop();
      }
    }

Sample rates can be specified in getNewContext by passing an option.

    acSingleton.getNewContext({ sampleRate: 44100 }, callback);

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
