#!/bin/sh

browserify  src/compile.js  -s manjusaka4_compile  -o dist/manjusaka4.compile.umd.js
browserify  src/runtime.js  -s manjusaka4_runtime  -o dist/manjusaka4.runtime.umd.js
