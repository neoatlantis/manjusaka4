#!/bin/sh

browserify  src/compile.js  -s manjusaka4_compile  -o dist/manjusaka4.compile.umd.js
browserify  src/runtime.js  -s manjusaka4_runtime  -o dist/manjusaka4.runtime.umd.js

browserify  src/main.js  -o dist/manjusaka4.js
cp src/manjusaka.html  dist/manjusaka.html

cp dist/manjusaka.html ../docs/demo.html
cp dist/manjusaka4.js  ../docs/manjusaka4.js
