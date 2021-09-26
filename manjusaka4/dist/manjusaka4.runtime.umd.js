(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.manjusaka4_runtime = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.21';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * Used to validate the `validate` option in `_.template` variable.
   *
   * Forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // Combining several predicates using `_.overEvery` or `_.overSome`.
     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/\s/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }

      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return baseTrim(string);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     *
     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
/*! OpenPGP.js v5.0.0 - 2021-09-02 - this is LGPL licensed code, see LICENSE/our website https://openpgpjs.org/ for more information. */
var openpgp=function(e){"use strict";const t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},r=Symbol("doneWritingPromise"),i=Symbol("doneWritingResolve"),n=Symbol("doneWritingReject");class a extends Array{constructor(){super(),this[r]=new Promise(((e,t)=>{this[i]=e,this[n]=t})),this[r].catch((()=>{}))}}function s(e){return e&&e.getReader&&Array.isArray(e)}function o(e){if(!s(e)){const t=e.getWriter(),r=t.releaseLock;return t.releaseLock=()=>{t.closed.catch((function(){})),r.call(t)},t}this.stream=e}a.prototype.getReader=function(){return{read:async()=>(await this[r],this.length?{value:this.shift(),done:!1}:{value:void 0,done:!0})}},o.prototype.write=async function(e){this.stream.push(e)},o.prototype.close=async function(){this.stream[i]()},o.prototype.abort=async function(e){return this.stream[n](e),e},o.prototype.releaseLock=function(){};const c="object"==typeof t.process&&"object"==typeof t.process.versions,u=c&&void 0;function h(e){return s(e)?"array":t.ReadableStream&&t.ReadableStream.prototype.isPrototypeOf(e)?"web":k&&k.prototype.isPrototypeOf(e)?"ponyfill":u&&u.prototype.isPrototypeOf(e)?"node":!(!e||!e.getReader)&&"web-like"}function d(e){return Uint8Array.prototype.isPrototypeOf(e)}function f(e){if(1===e.length)return e[0];let t=0;for(let r=0;r<e.length;r++){if(!d(e[r]))throw Error("concatUint8Array: Data must be in the form of a Uint8Array");t+=e[r].length}const r=new Uint8Array(t);let i=0;return e.forEach((function(e){r.set(e,i),i+=e.length})),r}const l=c&&void 0,p=c&&void 0;let y,b;if(p){y=function(e){let t=!1;return new k({start(r){e.pause(),e.on("data",(i=>{t||(l.isBuffer(i)&&(i=new Uint8Array(i.buffer,i.byteOffset,i.byteLength)),r.enqueue(i),e.pause())})),e.on("end",(()=>{t||r.close()})),e.on("error",(e=>r.error(e)))},pull(){e.resume()},cancel(r){t=!0,e.destroy(r)}})};class e extends p{constructor(e,t){super(t),this._reader=K(e)}async _read(e){try{for(;;){const{done:e,value:t}=await this._reader.read();if(e){this.push(null);break}if(!this.push(t)||this._cancelling){this._reading=!1;break}}}catch(e){this.emit("error",e)}}_destroy(e){this._reader.cancel(e)}}b=function(t,r){return new e(t,r)}}const m=new WeakSet,g=Symbol("externalBuffer");function w(e){if(this.stream=e,e[g]&&(this[g]=e[g].slice()),s(e)){const t=e.getReader();return this._read=t.read.bind(t),this._releaseLock=()=>{},void(this._cancel=()=>{})}let t=h(e);if("node"===t&&(e=y(e)),t){const t=e.getReader();return this._read=t.read.bind(t),this._releaseLock=()=>{t.closed.catch((function(){})),t.releaseLock()},void(this._cancel=t.cancel.bind(t))}let r=!1;this._read=async()=>r||m.has(e)?{value:void 0,done:!0}:(r=!0,{value:e,done:!1}),this._releaseLock=()=>{if(r)try{m.add(e)}catch(e){}}}w.prototype.read=async function(){if(this[g]&&this[g].length){return{done:!1,value:this[g].shift()}}return this._read()},w.prototype.releaseLock=function(){this[g]&&(this.stream[g]=this[g]),this._releaseLock()},w.prototype.cancel=function(e){return this._cancel(e)},w.prototype.readLine=async function(){let e,t=[];for(;!e;){let{done:r,value:i}=await this.read();if(i+="",r)return t.length?C(t):void 0;const n=i.indexOf("\n")+1;n&&(e=C(t.concat(i.substr(0,n))),t=[]),n!==i.length&&t.push(i.substr(n))}return this.unshift(...t),e},w.prototype.readByte=async function(){const{done:e,value:t}=await this.read();if(e)return;const r=t[0];return this.unshift(N(t,1)),r},w.prototype.readBytes=async function(e){const t=[];let r=0;for(;;){const{done:i,value:n}=await this.read();if(i)return t.length?C(t):void 0;if(t.push(n),r+=n.length,r>=e){const r=C(t);return this.unshift(N(r,e)),N(r,0,e)}}},w.prototype.peekBytes=async function(e){const t=await this.readBytes(e);return this.unshift(t),t},w.prototype.unshift=function(...e){this[g]||(this[g]=[]),1===e.length&&d(e[0])&&this[g].length&&e[0].length&&this[g][0].byteOffset>=e[0].length?this[g][0]=new Uint8Array(this[g][0].buffer,this[g][0].byteOffset-e[0].length,this[g][0].byteLength+e[0].length):this[g].unshift(...e.filter((e=>e&&e.length)))},w.prototype.readToEnd=async function(e=C){const t=[];for(;;){const{done:e,value:r}=await this.read();if(e)break;t.push(r)}return e(t)};let v,_,{ReadableStream:k,WritableStream:A,TransformStream:S}=t;async function E(){if(S)return;const[e,r]=await Promise.all([Promise.resolve().then((function(){return uf})),Promise.resolve().then((function(){return Kf}))]);({ReadableStream:k,WritableStream:A,TransformStream:S}=e);const{createReadableStreamWrapper:i}=r;t.ReadableStream&&k!==t.ReadableStream&&(v=i(k),_=i(t.ReadableStream))}const P=c&&void 0;function x(e){let t=h(e);return"node"===t?y(e):"web"===t&&v?v(e):t?e:new k({start(t){t.enqueue(e),t.close()}})}function M(e){if(h(e))return e;const t=new a;return(async()=>{const r=D(t);await r.write(e),await r.close()})(),t}function C(e){return e.some((e=>h(e)&&!s(e)))?function(e){e=e.map(x);const t=U((async function(e){await Promise.all(i.map((t=>j(t,e))))}));let r=Promise.resolve();const i=e.map(((i,n)=>T(i,((i,a)=>(r=r.then((()=>R(i,t.writable,{preventClose:n!==e.length-1}))),r)))));return t.readable}(e):e.some((e=>s(e)))?function(e){const t=new a;let r=Promise.resolve();return e.forEach(((i,n)=>(r=r.then((()=>R(i,t,{preventClose:n!==e.length-1}))),r))),t}(e):"string"==typeof e[0]?e.join(""):P&&P.isBuffer(e[0])?P.concat(e):f(e)}function K(e){return new w(e)}function D(e){return new o(e)}async function R(e,t,{preventClose:r=!1,preventAbort:i=!1,preventCancel:n=!1}={}){if(h(e)&&!s(e)){e=x(e);try{if(e[g]){const r=D(t);for(let t=0;t<e[g].length;t++)await r.ready,await r.write(e[g][t]);r.releaseLock()}await e.pipeTo(t,{preventClose:r,preventAbort:i,preventCancel:n})}catch(e){}return}const a=K(e=M(e)),o=D(t);try{for(;;){await o.ready;const{done:e,value:t}=await a.read();if(e){r||await o.close();break}await o.write(t)}}catch(e){i||await o.abort(e)}finally{a.releaseLock(),o.releaseLock()}}function I(e,t){const r=new S(t);return R(e,r.writable),r.readable}function U(e){let t,r,i=!1;return{readable:new k({start(e){r=e},pull(){t?t():i=!0},cancel:e},{highWaterMark:0}),writable:new A({write:async function(e){r.enqueue(e),i?i=!1:(await new Promise((e=>{t=e})),t=null)},close:r.close.bind(r),abort:r.error.bind(r)})}}function B(e,t=(()=>{}),r=(()=>{})){if(s(e)){const i=new a;return(async()=>{const n=await L(e),a=t(n),s=r();let o;o=void 0!==a&&void 0!==s?C([a,s]):void 0!==a?a:s;const c=D(i);await c.write(o),await c.close()})(),i}if(h(e))return I(e,{async transform(e,r){try{const i=await t(e);void 0!==i&&r.enqueue(i)}catch(e){r.error(e)}},async flush(e){try{const t=await r();void 0!==t&&e.enqueue(t)}catch(t){e.error(t)}}});const i=t(e),n=r();return void 0!==i&&void 0!==n?C([i,n]):void 0!==i?i:n}function T(e,t){if(h(e)&&!s(e)){let r;const i=new S({start(e){r=e}}),n=R(e,i.writable),a=U((async function(){r.error(Error("Readable side was canceled.")),await n,await new Promise(setTimeout)}));return t(i.readable,a.writable),a.readable}e=M(e);const r=new a;return t(e,r),r}function z(e,t){let r;const i=T(e,((e,n)=>{const a=K(e);a.remainder=()=>(a.releaseLock(),R(e,n),i),r=t(a)}));return r}function q(e){if(h(e)){const t=function(e){if(s(e)){const t=new a,r=new a;return(async()=>{const i=K(e),n=D(t),a=D(r);try{for(;;){await n.ready,await a.ready;const{done:e,value:t}=await i.read();if(e){await n.close(),await a.close();break}await n.write(t),await a.write(t)}}catch(e){await n.abort(e),await a.abort(e)}finally{i.releaseLock(),n.releaseLock(),a.releaseLock()}})(),[t,r]}if(h(e)){const t=x(e).tee();return t[0][g]=t[1][g]=e[g],t}return[N(e),N(e)]}(e);return F(e,t[0]),t[1]}return N(e)}function O(e){return s(e)?q(e):h(e)?new k({start(t){const r=T(e,(async(e,r)=>{const i=K(e),n=D(r);try{for(;;){await n.ready;const{done:e,value:r}=await i.read();if(e){try{t.close()}catch(e){}return void await n.close()}try{t.enqueue(r)}catch(e){}await n.write(r)}}catch(e){t.error(e),await n.abort(e)}}));F(e,r)}}):N(e)}function F(e,t){Object.entries(Object.getOwnPropertyDescriptors(e.constructor.prototype)).forEach((([r,i])=>{"constructor"!==r&&(i.value?i.value=i.value.bind(t):i.get=i.get.bind(t),Object.defineProperty(e,r,i))}))}function N(e,t=0,r=1/0){if(s(e))throw Error("Not implemented");if(h(e)){if(t>=0&&r>=0){let i=0;return I(e,{transform(e,n){i<r?(i+e.length>=t&&n.enqueue(N(e,Math.max(t-i,0),r-i)),i+=e.length):n.terminate()}})}if(t<0&&(r<0||r===1/0)){let i=[];return B(e,(e=>{e.length>=-t?i=[e]:i.push(e)}),(()=>N(C(i),t,r)))}if(0===t&&r<0){let i;return B(e,(e=>{const n=i?C([i,e]):e;if(n.length>=-r)return i=N(n,r),N(n,t,r);i=n}))}return console.warn(`stream.slice(input, ${t}, ${r}) not implemented efficiently.`),W((async()=>N(await L(e),t,r)))}return e[g]&&(e=C(e[g].concat([e]))),!d(e)||P&&P.isBuffer(e)?e.slice(t,r):(r===1/0&&(r=e.length),e.subarray(t,r))}async function L(e,t=C){return h(e)?K(e).readToEnd(t):e}async function j(e,t){if(h(e)){if(e.cancel)return e.cancel(t);if(e.destroy)return e.destroy(t),await new Promise(setTimeout),t}}function W(e){const t=new a;return(async()=>{const r=D(t);try{await r.write(await e()),await r.close()}catch(e){await r.abort(e)}})(),t}class H{constructor(e){if(void 0===e)throw Error("Invalid BigInteger input");if(e instanceof Uint8Array){const t=e,r=Array(t.length);for(let e=0;e<t.length;e++){const i=t[e].toString(16);r[e]=t[e]<=15?"0"+i:i}this.value=BigInt("0x0"+r.join(""))}else this.value=BigInt(e)}clone(){return new H(this.value)}iinc(){return this.value++,this}inc(){return this.clone().iinc()}idec(){return this.value--,this}dec(){return this.clone().idec()}iadd(e){return this.value+=e.value,this}add(e){return this.clone().iadd(e)}isub(e){return this.value-=e.value,this}sub(e){return this.clone().isub(e)}imul(e){return this.value*=e.value,this}mul(e){return this.clone().imul(e)}imod(e){return this.value%=e.value,this.isNegative()&&this.iadd(e),this}mod(e){return this.clone().imod(e)}modExp(e,t){if(t.isZero())throw Error("Modulo cannot be zero");if(t.isOne())return new H(0);if(e.isNegative())throw Error("Unsopported negative exponent");let r=e.value,i=this.value;i%=t.value;let n=BigInt(1);for(;r>BigInt(0);){const e=r&BigInt(1);r>>=BigInt(1);const a=n*i%t.value;n=e?a:n,i=i*i%t.value}return new H(n)}modInv(e){const{gcd:t,x:r}=this._egcd(e);if(!t.isOne())throw Error("Inverse does not exist");return r.add(e).mod(e)}_egcd(e){let t=BigInt(0),r=BigInt(1),i=BigInt(1),n=BigInt(0),a=this.value;for(e=e.value;e!==BigInt(0);){const s=a/e;let o=t;t=i-s*t,i=o,o=r,r=n-s*r,n=o,o=e,e=a%e,a=o}return{x:new H(i),y:new H(n),gcd:new H(a)}}gcd(e){let t=this.value;for(e=e.value;e!==BigInt(0);){const r=e;e=t%e,t=r}return new H(t)}ileftShift(e){return this.value<<=e.value,this}leftShift(e){return this.clone().ileftShift(e)}irightShift(e){return this.value>>=e.value,this}rightShift(e){return this.clone().irightShift(e)}equal(e){return this.value===e.value}lt(e){return this.value<e.value}lte(e){return this.value<=e.value}gt(e){return this.value>e.value}gte(e){return this.value>=e.value}isZero(){return this.value===BigInt(0)}isOne(){return this.value===BigInt(1)}isNegative(){return this.value<BigInt(0)}isEven(){return!(this.value&BigInt(1))}abs(){const e=this.clone();return this.isNegative()&&(e.value=-e.value),e}toString(){return this.value.toString()}toNumber(){const e=Number(this.value);if(e>Number.MAX_SAFE_INTEGER)throw Error("Number can only safely store up to 53 bits");return e}getBit(e){return(this.value>>BigInt(e)&BigInt(1))===BigInt(0)?0:1}bitLength(){const e=new H(0),t=new H(1),r=new H(-1),i=this.isNegative()?r:e;let n=1;const a=this.clone();for(;!a.irightShift(t).equal(i);)n++;return n}byteLength(){const e=new H(0),t=new H(-1),r=this.isNegative()?t:e,i=new H(8);let n=1;const a=this.clone();for(;!a.irightShift(i).equal(r);)n++;return n}toUint8Array(e="be",t){let r=this.value.toString(16);r.length%2==1&&(r="0"+r);const i=r.length/2,n=new Uint8Array(t||i),a=t?t-i:0;let s=0;for(;s<i;)n[s+a]=parseInt(r.slice(2*s,2*s+2),16),s++;return"be"!==e&&n.reverse(),n}}const G=t.process&&"development"===t.process.env.NODE_ENV,V={isString:function(e){return"string"==typeof e||String.prototype.isPrototypeOf(e)},isArray:function(e){return Array.prototype.isPrototypeOf(e)},isUint8Array:d,isStream:h,readNumber:function(e){let t=0;for(let r=0;r<e.length;r++)t+=256**r*e[e.length-1-r];return t},writeNumber:function(e,t){const r=new Uint8Array(t);for(let i=0;i<t;i++)r[i]=e>>8*(t-i-1)&255;return r},readDate:function(e){const t=V.readNumber(e);return new Date(1e3*t)},writeDate:function(e){const t=Math.floor(e.getTime()/1e3);return V.writeNumber(t,4)},normalizeDate:function(e=Date.now()){return null===e||e===1/0?e:new Date(1e3*Math.floor(+e/1e3))},readMPI:function(e){const t=(e[0]<<8|e[1])+7>>>3;return e.subarray(2,2+t)},leftPad(e,t){const r=new Uint8Array(t),i=t-e.length;return r.set(e,i),r},uint8ArrayToMPI:function(e){const t=V.uint8ArrayBitLength(e);if(0===t)throw Error("Zero MPI");const r=e.subarray(e.length-Math.ceil(t/8)),i=new Uint8Array([(65280&t)>>8,255&t]);return V.concatUint8Array([i,r])},uint8ArrayBitLength:function(e){let t;for(t=0;t<e.length&&0===e[t];t++);if(t===e.length)return 0;const r=e.subarray(t);return 8*(r.length-1)+V.nbits(r[0])},hexToUint8Array:function(e){const t=new Uint8Array(e.length>>1);for(let r=0;r<e.length>>1;r++)t[r]=parseInt(e.substr(r<<1,2),16);return t},uint8ArrayToHex:function(e){const t=[],r=e.length;let i,n=0;for(;n<r;){for(i=e[n++].toString(16);i.length<2;)i="0"+i;t.push(""+i)}return t.join("")},stringToUint8Array:function(e){return B(e,(e=>{if(!V.isString(e))throw Error("stringToUint8Array: Data must be in the form of a string");const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}))},uint8ArrayToString:function(e){const t=[],r=16384,i=(e=new Uint8Array(e)).length;for(let n=0;n<i;n+=r)t.push(String.fromCharCode.apply(String,e.subarray(n,n+r<i?n+r:i)));return t.join("")},encodeUTF8:function(e){const t=new TextEncoder("utf-8");function r(e,r=!1){return t.encode(e,{stream:!r})}return B(e,r,(()=>r("",!0)))},decodeUTF8:function(e){const t=new TextDecoder("utf-8");function r(e,r=!1){return t.decode(e,{stream:!r})}return B(e,r,(()=>r(new Uint8Array,!0)))},concat:C,concatUint8Array:f,equalsUint8Array:function(e,t){if(!V.isUint8Array(e)||!V.isUint8Array(t))throw Error("Data must be in the form of a Uint8Array");if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0},writeChecksum:function(e){let t=0;for(let r=0;r<e.length;r++)t=t+e[r]&65535;return V.writeNumber(t,2)},printDebug:function(e){G&&console.log(e)},printDebugError:function(e){G&&console.error(e)},nbits:function(e){let t=1,r=e>>>16;return 0!==r&&(e=r,t+=16),r=e>>8,0!==r&&(e=r,t+=8),r=e>>4,0!==r&&(e=r,t+=4),r=e>>2,0!==r&&(e=r,t+=2),r=e>>1,0!==r&&(e=r,t+=1),t},double:function(e){const t=new Uint8Array(e.length),r=e.length-1;for(let i=0;i<r;i++)t[i]=e[i]<<1^e[i+1]>>7;return t[r]=e[r]<<1^135*(e[0]>>7),t},shiftRight:function(e,t){if(t)for(let r=e.length-1;r>=0;r--)e[r]>>=t,r>0&&(e[r]|=e[r-1]<<8-t);return e},getWebCrypto:function(){return void 0!==t&&t.crypto&&t.crypto.subtle},detectNode:function(){return"object"==typeof t.process&&"object"==typeof t.process.versions},detectBigInt:()=>"undefined"!=typeof BigInt,getBigInteger:async function(){if(V.detectBigInt())return H;{const{default:e}=await Promise.resolve().then((function(){return Bf}));return e}},getNodeCrypto:function(){},getNodeZlib:function(){},getNodeBuffer:function(){return{}.Buffer},getHardwareConcurrency:function(){if(V.detectNode()){return(void 0).cpus().length}return navigator.hardwareConcurrency||1},isEmailAddress:function(e){if(!V.isString(e))return!1;return/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+([a-zA-Z]{2,}|xn--[a-zA-Z\-0-9]+)))$/.test(e)},canonicalizeEOL:function(e){let t=!1;return B(e,(e=>{let r;t&&(e=V.concatUint8Array([new Uint8Array([13]),e])),13===e[e.length-1]?(t=!0,e=e.subarray(0,-1)):t=!1;const i=[];for(let t=0;r=e.indexOf(10,t)+1,r;t=r)13!==e[r-2]&&i.push(r);if(!i.length)return e;const n=new Uint8Array(e.length+i.length);let a=0;for(let t=0;t<i.length;t++){const r=e.subarray(i[t-1]||0,i[t]);n.set(r,a),a+=r.length,n[a-1]=13,n[a]=10,a++}return n.set(e.subarray(i[i.length-1]||0),a),n}),(()=>t?new Uint8Array([13]):void 0))},nativeEOL:function(e){let t=!1;return B(e,(e=>{let r;13===(e=t&&10!==e[0]?V.concatUint8Array([new Uint8Array([13]),e]):new Uint8Array(e))[e.length-1]?(t=!0,e=e.subarray(0,-1)):t=!1;let i=0;for(let t=0;t!==e.length;t=r){r=e.indexOf(13,t)+1,r||(r=e.length);const n=r-(10===e[r]?1:0);t&&e.copyWithin(i,t,n),i+=n-t}return e.subarray(0,i)}),(()=>t?new Uint8Array([13]):void 0))},removeTrailingSpaces:function(e){return e.split("\n").map((e=>{let t=e.length-1;for(;t>=0&&(" "===e[t]||"\t"===e[t]);t--);return e.substr(0,t+1)})).join("\n")},wrapError:function(e,t){if(!t)return Error(e);try{t.message=e+": "+t.message}catch(e){}return t},constructAllowedPackets:function(e){const t={};return e.forEach((e=>{if(!e.tag)throw Error("Invalid input: expected a packet class");t[e.tag]=e})),t},anyPromise:function(e){return new Promise((async(t,r)=>{let i;await Promise.all(e.map((async e=>{try{t(await e)}catch(e){i=e}}))),r(i)}))}},$=V.getNodeBuffer();let Z,Y;function X(e){let t=new Uint8Array;return B(e,(e=>{t=V.concatUint8Array([t,e]);const r=[],i=Math.floor(t.length/45),n=45*i,a=Z(t.subarray(0,n));for(let e=0;e<i;e++)r.push(a.substr(60*e,60)),r.push("\n");return t=t.subarray(n),r.join("")}),(()=>t.length?Z(t)+"\n":""))}function Q(e){let t="";return B(e,(e=>{t+=e;let r=0;const i=[" ","\t","\r","\n"];for(let e=0;e<i.length;e++){const n=i[e];for(let e=t.indexOf(n);-1!==e;e=t.indexOf(n,e+1))r++}let n=t.length;for(;n>0&&(n-r)%4!=0;n--)i.includes(t[n])&&r--;const a=Y(t.substr(0,n));return t=t.substr(n),a}),(()=>Y(t)))}function J(e){return Q(e.replace(/-/g,"+").replace(/_/g,"/"))}function ee(e,t){let r=X(e).replace(/[\r\n]/g,"");return t&&(r=r.replace(/[+]/g,"-").replace(/[/]/g,"_").replace(/[=]/g,"")),r}$?(Z=e=>$.from(e).toString("base64"),Y=e=>{const t=$.from(e,"base64");return new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}):(Z=e=>btoa(V.uint8ArrayToString(e)),Y=e=>V.stringToUint8Array(atob(e)));const te=Symbol("byValue");var re={curve:{p256:"p256","P-256":"p256",secp256r1:"p256",prime256v1:"p256","1.2.840.10045.3.1.7":"p256","2a8648ce3d030107":"p256","2A8648CE3D030107":"p256",p384:"p384","P-384":"p384",secp384r1:"p384","1.3.132.0.34":"p384","2b81040022":"p384","2B81040022":"p384",p521:"p521","P-521":"p521",secp521r1:"p521","1.3.132.0.35":"p521","2b81040023":"p521","2B81040023":"p521",secp256k1:"secp256k1","1.3.132.0.10":"secp256k1","2b8104000a":"secp256k1","2B8104000A":"secp256k1",ED25519:"ed25519",ed25519:"ed25519",Ed25519:"ed25519","1.3.6.1.4.1.11591.15.1":"ed25519","2b06010401da470f01":"ed25519","2B06010401DA470F01":"ed25519",X25519:"curve25519",cv25519:"curve25519",curve25519:"curve25519",Curve25519:"curve25519","1.3.6.1.4.1.3029.1.5.1":"curve25519","2b060104019755010501":"curve25519","2B060104019755010501":"curve25519",brainpoolP256r1:"brainpoolP256r1","1.3.36.3.3.2.8.1.1.7":"brainpoolP256r1","2b2403030208010107":"brainpoolP256r1","2B2403030208010107":"brainpoolP256r1",brainpoolP384r1:"brainpoolP384r1","1.3.36.3.3.2.8.1.1.11":"brainpoolP384r1","2b240303020801010b":"brainpoolP384r1","2B240303020801010B":"brainpoolP384r1",brainpoolP512r1:"brainpoolP512r1","1.3.36.3.3.2.8.1.1.13":"brainpoolP512r1","2b240303020801010d":"brainpoolP512r1","2B240303020801010D":"brainpoolP512r1"},s2k:{simple:0,salted:1,iterated:3,gnu:101},publicKey:{rsaEncryptSign:1,rsaEncrypt:2,rsaSign:3,elgamal:16,dsa:17,ecdh:18,ecdsa:19,eddsa:22,aedh:23,aedsa:24},symmetric:{plaintext:0,idea:1,tripledes:2,cast5:3,blowfish:4,aes128:7,aes192:8,aes256:9,twofish:10},compression:{uncompressed:0,zip:1,zlib:2,bzip2:3},hash:{md5:1,sha1:2,ripemd:3,sha256:8,sha384:9,sha512:10,sha224:11},webHash:{"SHA-1":2,"SHA-256":8,"SHA-384":9,"SHA-512":10},aead:{eax:1,ocb:2,experimentalGCM:100},packet:{publicKeyEncryptedSessionKey:1,signature:2,symEncryptedSessionKey:3,onePassSignature:4,secretKey:5,publicKey:6,secretSubkey:7,compressedData:8,symmetricallyEncryptedData:9,marker:10,literalData:11,trust:12,userID:13,publicSubkey:14,userAttribute:17,symEncryptedIntegrityProtectedData:18,modificationDetectionCode:19,aeadEncryptedData:20},literal:{binary:98,text:116,utf8:117,mime:109},signature:{binary:0,text:1,standalone:2,certGeneric:16,certPersona:17,certCasual:18,certPositive:19,certRevocation:48,subkeyBinding:24,keyBinding:25,key:31,keyRevocation:32,subkeyRevocation:40,timestamp:64,thirdParty:80},signatureSubpacket:{signatureCreationTime:2,signatureExpirationTime:3,exportableCertification:4,trustSignature:5,regularExpression:6,revocable:7,keyExpirationTime:9,placeholderBackwardsCompatibility:10,preferredSymmetricAlgorithms:11,revocationKey:12,issuer:16,notationData:20,preferredHashAlgorithms:21,preferredCompressionAlgorithms:22,keyServerPreferences:23,preferredKeyServer:24,primaryUserID:25,policyURI:26,keyFlags:27,signersUserID:28,reasonForRevocation:29,features:30,signatureTarget:31,embeddedSignature:32,issuerFingerprint:33,preferredAEADAlgorithms:34},keyFlags:{certifyKeys:1,signData:2,encryptCommunication:4,encryptStorage:8,splitPrivateKey:16,authentication:32,sharedPrivateKey:128},armor:{multipartSection:0,multipartLast:1,signed:2,message:3,publicKey:4,privateKey:5,signature:6},reasonForRevocation:{noReason:0,keySuperseded:1,keyCompromised:2,keyRetired:3,userIDInvalid:32},features:{modificationDetection:1,aead:2,v5Keys:4},write:function(e,t){if("number"==typeof t&&(t=this.read(e,t)),void 0!==e[t])return e[t];throw Error("Invalid enum value.")},read:function(e,t){if(e[te]||(e[te]=[],Object.entries(e).forEach((([t,r])=>{e[te][r]=t}))),void 0!==e[te][t])return e[te][t];throw Error("Invalid enum value.")}},ie={preferredHashAlgorithm:re.hash.sha256,preferredSymmetricAlgorithm:re.symmetric.aes256,preferredCompressionAlgorithm:re.compression.uncompressed,deflateLevel:6,aeadProtect:!1,preferredAEADAlgorithm:re.aead.eax,aeadChunkSizeByte:12,v5Keys:!1,s2kIterationCountByte:224,allowUnauthenticatedMessages:!1,allowUnauthenticatedStream:!1,checksumRequired:!1,minRSABits:2047,passwordCollisionCheck:!1,revocationsExpire:!1,allowInsecureDecryptionWithSigningKeys:!1,minBytesForWebCrypto:1e3,ignoreUnsupportedPackets:!0,ignoreMalformedPackets:!1,showVersion:!1,showComment:!1,versionString:"OpenPGP.js 5.0.0",commentString:"https://openpgpjs.org",maxUserIDLength:5120,knownNotations:["preferred-email-encoding@pgp.com","pka-address@gnupg.org"],useIndutnyElliptic:!0,rejectHashAlgorithms:new Set([re.hash.md5,re.hash.ripemd]),rejectMessageHashAlgorithms:new Set([re.hash.md5,re.hash.ripemd,re.hash.sha1]),rejectPublicKeyAlgorithms:new Set([re.publicKey.elgamal,re.publicKey.dsa]),rejectCurves:new Set([re.curve.brainpoolP256r1,re.curve.brainpoolP384r1,re.curve.brainpoolP512r1,re.curve.secp256k1])};function ne(e){const t=e.match(/^-----BEGIN PGP (MESSAGE, PART \d+\/\d+|MESSAGE, PART \d+|SIGNED MESSAGE|MESSAGE|PUBLIC KEY BLOCK|PRIVATE KEY BLOCK|SIGNATURE)-----$/m);if(!t)throw Error("Unknown ASCII armor type");return/MESSAGE, PART \d+\/\d+/.test(t[1])?re.armor.multipartSection:/MESSAGE, PART \d+/.test(t[1])?re.armor.multipartLast:/SIGNED MESSAGE/.test(t[1])?re.armor.signed:/MESSAGE/.test(t[1])?re.armor.message:/PUBLIC KEY BLOCK/.test(t[1])?re.armor.publicKey:/PRIVATE KEY BLOCK/.test(t[1])?re.armor.privateKey:/SIGNATURE/.test(t[1])?re.armor.signature:void 0}function ae(e,t){let r="";return t.showVersion&&(r+="Version: "+t.versionString+"\n"),t.showComment&&(r+="Comment: "+t.commentString+"\n"),e&&(r+="Comment: "+e+"\n"),r+="\n",r}function se(e){return X(function(e){let t=13501623;return B(e,(e=>{const r=ce?Math.floor(e.length/4):0,i=new Uint32Array(e.buffer,e.byteOffset,r);for(let e=0;e<r;e++)t^=i[e],t=oe[0][t>>24&255]^oe[1][t>>16&255]^oe[2][t>>8&255]^oe[3][t>>0&255];for(let i=4*r;i<e.length;i++)t=t>>8^oe[0][255&t^e[i]]}),(()=>new Uint8Array([t,t>>8,t>>16])))}(e))}const oe=[Array(255),Array(255),Array(255),Array(255)];for(let e=0;e<=255;e++){let t=e<<16;for(let e=0;e<8;e++)t=t<<1^(0!=(8388608&t)?8801531:0);oe[0][e]=(16711680&t)>>16|65280&t|(255&t)<<16}for(let e=0;e<=255;e++)oe[1][e]=oe[0][e]>>8^oe[0][255&oe[0][e]];for(let e=0;e<=255;e++)oe[2][e]=oe[1][e]>>8^oe[0][255&oe[1][e]];for(let e=0;e<=255;e++)oe[3][e]=oe[2][e]>>8^oe[0][255&oe[2][e]];const ce=function(){const e=new ArrayBuffer(2);return new DataView(e).setInt16(0,255,!0),255===new Int16Array(e)[0]}();function ue(e){for(let t=0;t<e.length;t++){if(!/^([^\s:]|[^\s:][^:]*[^\s:]): .+$/.test(e[t]))throw Error("Improperly formatted armor header: "+e[t]);/^(Version|Comment|MessageID|Hash|Charset): .+$/.test(e[t])||V.printDebugError(Error("Unknown header: "+e[t]))}}function he(e){let t=e,r="";const i=e.lastIndexOf("=");return i>=0&&i!==e.length-1&&(t=e.slice(0,i),r=e.slice(i+1).substr(0,4)),{body:t,checksum:r}}function de(e,t=ie){return new Promise((async(r,i)=>{try{const n=/^-----[^-]+-----$/m,a=/^[ \f\r\t\u00a0\u2000-\u200a\u202f\u205f\u3000]*$/;let s;const o=[];let c,u,h,d=o,f=[],l=Q(T(e,(async(e,t)=>{const p=K(e);try{for(;;){let e=await p.readLine();if(void 0===e)throw Error("Misformed armored text");if(e=V.removeTrailingSpaces(e.replace(/[\r\n]/g,"")),s)if(c)u||2!==s||(n.test(e)?(f=f.join("\r\n"),u=!0,ue(d),d=[],c=!1):f.push(e.replace(/^- /,"")));else if(n.test(e)&&i(Error("Mandatory blank line missing between armor headers and armor data")),a.test(e)){if(ue(d),c=!0,u||2!==s){r({text:f,data:l,headers:o,type:s});break}}else d.push(e);else n.test(e)&&(s=ne(e))}}catch(e){return void i(e)}const y=D(t);try{for(;;){await y.ready;const{done:e,value:t}=await p.read();if(e)throw Error("Misformed armored text");const r=t+"";if(-1!==r.indexOf("=")||-1!==r.indexOf("-")){let e=await p.readToEnd();e.length||(e=""),e=r+e,e=V.removeTrailingSpaces(e.replace(/\r/g,""));const t=e.split(n);if(1===t.length)throw Error("Misformed armored text");const i=he(t[0].slice(0,-1));h=i.checksum,await y.write(i.body);break}await y.write(r)}await y.ready,await y.close()}catch(e){await y.abort(e)}})));l=T(l,(async(e,r)=>{const i=L(se(O(e)));i.catch((()=>{})),await R(e,r,{preventClose:!0});const n=D(r);try{const e=(await i).replace("\n","");if(h!==e&&(h||t.checksumRequired))throw Error("Ascii armor integrity check on message failed: '"+h+"' should be '"+e+"'");await n.ready,await n.close()}catch(e){await n.abort(e)}}))}catch(e){i(e)}})).then((async e=>(s(e.data)&&(e.data=await L(e.data)),e)))}function fe(e,t,r,i,n,a=ie){let s,o;e===re.armor.signed&&(s=t.text,o=t.hash,t=t.data);const c=O(t),u=[];switch(e){case re.armor.multipartSection:u.push("-----BEGIN PGP MESSAGE, PART "+r+"/"+i+"-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP MESSAGE, PART "+r+"/"+i+"-----\n");break;case re.armor.multipartLast:u.push("-----BEGIN PGP MESSAGE, PART "+r+"-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP MESSAGE, PART "+r+"-----\n");break;case re.armor.signed:u.push("\n-----BEGIN PGP SIGNED MESSAGE-----\n"),u.push("Hash: "+o+"\n\n"),u.push(s.replace(/^-/gm,"- -")),u.push("\n-----BEGIN PGP SIGNATURE-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP SIGNATURE-----\n");break;case re.armor.message:u.push("-----BEGIN PGP MESSAGE-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP MESSAGE-----\n");break;case re.armor.publicKey:u.push("-----BEGIN PGP PUBLIC KEY BLOCK-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP PUBLIC KEY BLOCK-----\n");break;case re.armor.privateKey:u.push("-----BEGIN PGP PRIVATE KEY BLOCK-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP PRIVATE KEY BLOCK-----\n");break;case re.armor.signature:u.push("-----BEGIN PGP SIGNATURE-----\n"),u.push(ae(n,a)),u.push(X(t)),u.push("=",se(c)),u.push("-----END PGP SIGNATURE-----\n")}return V.concat(u)}class le{constructor(){this.bytes=""}read(e){this.bytes=V.uint8ArrayToString(e.subarray(0,8))}write(){return V.stringToUint8Array(this.bytes)}toHex(){return V.uint8ArrayToHex(V.stringToUint8Array(this.bytes))}equals(e,t=!1){return t&&(e.isWildcard()||this.isWildcard())||this.bytes===e.bytes}isNull(){return""===this.bytes}isWildcard(){return/^0+$/.test(this.toHex())}static mapToHex(e){return e.toHex()}static fromID(e){const t=new le;return t.read(V.hexToUint8Array(e)),t}static wildcard(){const e=new le;return e.read(new Uint8Array(8)),e}}var pe=function(){var e,t,r=!1;function i(r,i){var n=e[(t[r]+t[i])%255];return 0!==r&&0!==i||(n=0),n}var n,a,s,o,c=!1;function u(){function u(r){var i,n,a;for(n=a=function(r){var i=e[255-t[r]];return 0===r&&(i=0),i}(r),i=0;i<4;i++)a^=n=255&(n<<1|n>>>7);return a^=99}r||function(){e=[],t=[];var i,n,a=1;for(i=0;i<255;i++)e[i]=a,n=128&a,a<<=1,a&=255,128===n&&(a^=27),a^=e[i],t[e[i]]=i;e[255]=e[0],t[0]=0,r=!0}(),n=[],a=[],s=[[],[],[],[]],o=[[],[],[],[]];for(var h=0;h<256;h++){var d=u(h);n[h]=d,a[d]=h,s[0][h]=i(2,d)<<24|d<<16|d<<8|i(3,d),o[0][d]=i(14,h)<<24|i(9,h)<<16|i(13,h)<<8|i(11,h);for(var f=1;f<4;f++)s[f][h]=s[f-1][h]>>>8|s[f-1][h]<<24,o[f][d]=o[f-1][d]>>>8|o[f-1][d]<<24}c=!0}var h=function(e,t){c||u();var r=new Uint32Array(t);r.set(n,512),r.set(a,768);for(var i=0;i<4;i++)r.set(s[i],4096+1024*i>>2),r.set(o[i],8192+1024*i>>2);var h=function(e,t,r){"use asm";var i=0,n=0,a=0,s=0,o=0,c=0,u=0,h=0,d=0,f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0,v=0,_=0,k=0,A=0;var S=new e.Uint32Array(r),E=new e.Uint8Array(r);function P(e,t,r,o,c,u,h,d){e=e|0;t=t|0;r=r|0;o=o|0;c=c|0;u=u|0;h=h|0;d=d|0;var f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0;f=r|0x400,l=r|0x800,p=r|0xc00;c=c^S[(e|0)>>2],u=u^S[(e|4)>>2],h=h^S[(e|8)>>2],d=d^S[(e|12)>>2];for(w=16;(w|0)<=o<<4;w=w+16|0){y=S[(r|c>>22&1020)>>2]^S[(f|u>>14&1020)>>2]^S[(l|h>>6&1020)>>2]^S[(p|d<<2&1020)>>2]^S[(e|w|0)>>2],b=S[(r|u>>22&1020)>>2]^S[(f|h>>14&1020)>>2]^S[(l|d>>6&1020)>>2]^S[(p|c<<2&1020)>>2]^S[(e|w|4)>>2],m=S[(r|h>>22&1020)>>2]^S[(f|d>>14&1020)>>2]^S[(l|c>>6&1020)>>2]^S[(p|u<<2&1020)>>2]^S[(e|w|8)>>2],g=S[(r|d>>22&1020)>>2]^S[(f|c>>14&1020)>>2]^S[(l|u>>6&1020)>>2]^S[(p|h<<2&1020)>>2]^S[(e|w|12)>>2];c=y,u=b,h=m,d=g}i=S[(t|c>>22&1020)>>2]<<24^S[(t|u>>14&1020)>>2]<<16^S[(t|h>>6&1020)>>2]<<8^S[(t|d<<2&1020)>>2]^S[(e|w|0)>>2],n=S[(t|u>>22&1020)>>2]<<24^S[(t|h>>14&1020)>>2]<<16^S[(t|d>>6&1020)>>2]<<8^S[(t|c<<2&1020)>>2]^S[(e|w|4)>>2],a=S[(t|h>>22&1020)>>2]<<24^S[(t|d>>14&1020)>>2]<<16^S[(t|c>>6&1020)>>2]<<8^S[(t|u<<2&1020)>>2]^S[(e|w|8)>>2],s=S[(t|d>>22&1020)>>2]<<24^S[(t|c>>14&1020)>>2]<<16^S[(t|u>>6&1020)>>2]<<8^S[(t|h<<2&1020)>>2]^S[(e|w|12)>>2]}function x(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;P(0x0000,0x0800,0x1000,A,e,t,r,i)}function M(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;var a=0;P(0x0400,0x0c00,0x2000,A,e,i,r,t);a=n,n=s,s=a}function C(e,t,r,d){e=e|0;t=t|0;r=r|0;d=d|0;P(0x0000,0x0800,0x1000,A,o^e,c^t,u^r,h^d);o=i,c=n,u=a,h=s}function K(e,t,r,d){e=e|0;t=t|0;r=r|0;d=d|0;var f=0;P(0x0400,0x0c00,0x2000,A,e,d,r,t);f=n,n=s,s=f;i=i^o,n=n^c,a=a^u,s=s^h;o=e,c=t,u=r,h=d}function D(e,t,r,d){e=e|0;t=t|0;r=r|0;d=d|0;P(0x0000,0x0800,0x1000,A,o,c,u,h);o=i=i^e,c=n=n^t,u=a=a^r,h=s=s^d}function R(e,t,r,d){e=e|0;t=t|0;r=r|0;d=d|0;P(0x0000,0x0800,0x1000,A,o,c,u,h);i=i^e,n=n^t,a=a^r,s=s^d;o=e,c=t,u=r,h=d}function I(e,t,r,d){e=e|0;t=t|0;r=r|0;d=d|0;P(0x0000,0x0800,0x1000,A,o,c,u,h);o=i,c=n,u=a,h=s;i=i^e,n=n^t,a=a^r,s=s^d}function U(e,t,r,o){e=e|0;t=t|0;r=r|0;o=o|0;P(0x0000,0x0800,0x1000,A,d,f,l,p);p=~g&p|g&p+1;l=~m&l|m&l+((p|0)==0);f=~b&f|b&f+((l|0)==0);d=~y&d|y&d+((f|0)==0);i=i^e;n=n^t;a=a^r;s=s^o}function B(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;var n=0,a=0,s=0,d=0,f=0,l=0,p=0,y=0,b=0,m=0;e=e^o,t=t^c,r=r^u,i=i^h;n=w|0,a=v|0,s=_|0,d=k|0;for(;(b|0)<128;b=b+1|0){if(n>>>31){f=f^e,l=l^t,p=p^r,y=y^i}n=n<<1|a>>>31,a=a<<1|s>>>31,s=s<<1|d>>>31,d=d<<1;m=i&1;i=i>>>1|r<<31,r=r>>>1|t<<31,t=t>>>1|e<<31,e=e>>>1;if(m)e=e^0xe1000000}o=f,c=l,u=p,h=y}function T(e){e=e|0;A=e}function z(e,t,r,o){e=e|0;t=t|0;r=r|0;o=o|0;i=e,n=t,a=r,s=o}function q(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;o=e,c=t,u=r,h=i}function O(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;d=e,f=t,l=r,p=i}function F(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;y=e,b=t,m=r,g=i}function N(e,t,r,i){e=e|0;t=t|0;r=r|0;i=i|0;p=~g&p|g&i,l=~m&l|m&r,f=~b&f|b&t,d=~y&d|y&e}function L(e){e=e|0;if(e&15)return-1;E[e|0]=i>>>24,E[e|1]=i>>>16&255,E[e|2]=i>>>8&255,E[e|3]=i&255,E[e|4]=n>>>24,E[e|5]=n>>>16&255,E[e|6]=n>>>8&255,E[e|7]=n&255,E[e|8]=a>>>24,E[e|9]=a>>>16&255,E[e|10]=a>>>8&255,E[e|11]=a&255,E[e|12]=s>>>24,E[e|13]=s>>>16&255,E[e|14]=s>>>8&255,E[e|15]=s&255;return 16}function j(e){e=e|0;if(e&15)return-1;E[e|0]=o>>>24,E[e|1]=o>>>16&255,E[e|2]=o>>>8&255,E[e|3]=o&255,E[e|4]=c>>>24,E[e|5]=c>>>16&255,E[e|6]=c>>>8&255,E[e|7]=c&255,E[e|8]=u>>>24,E[e|9]=u>>>16&255,E[e|10]=u>>>8&255,E[e|11]=u&255,E[e|12]=h>>>24,E[e|13]=h>>>16&255,E[e|14]=h>>>8&255,E[e|15]=h&255;return 16}function W(){x(0,0,0,0);w=i,v=n,_=a,k=s}function H(e,t,r){e=e|0;t=t|0;r=r|0;var o=0;if(t&15)return-1;while((r|0)>=16){V[e&7](E[t|0]<<24|E[t|1]<<16|E[t|2]<<8|E[t|3],E[t|4]<<24|E[t|5]<<16|E[t|6]<<8|E[t|7],E[t|8]<<24|E[t|9]<<16|E[t|10]<<8|E[t|11],E[t|12]<<24|E[t|13]<<16|E[t|14]<<8|E[t|15]);E[t|0]=i>>>24,E[t|1]=i>>>16&255,E[t|2]=i>>>8&255,E[t|3]=i&255,E[t|4]=n>>>24,E[t|5]=n>>>16&255,E[t|6]=n>>>8&255,E[t|7]=n&255,E[t|8]=a>>>24,E[t|9]=a>>>16&255,E[t|10]=a>>>8&255,E[t|11]=a&255,E[t|12]=s>>>24,E[t|13]=s>>>16&255,E[t|14]=s>>>8&255,E[t|15]=s&255;o=o+16|0,t=t+16|0,r=r-16|0}return o|0}function G(e,t,r){e=e|0;t=t|0;r=r|0;var i=0;if(t&15)return-1;while((r|0)>=16){$[e&1](E[t|0]<<24|E[t|1]<<16|E[t|2]<<8|E[t|3],E[t|4]<<24|E[t|5]<<16|E[t|6]<<8|E[t|7],E[t|8]<<24|E[t|9]<<16|E[t|10]<<8|E[t|11],E[t|12]<<24|E[t|13]<<16|E[t|14]<<8|E[t|15]);i=i+16|0,t=t+16|0,r=r-16|0}return i|0}var V=[x,M,C,K,D,R,I,U];var $=[C,B];return{set_rounds:T,set_state:z,set_iv:q,set_nonce:O,set_mask:F,set_counter:N,get_state:L,get_iv:j,gcm_init:W,cipher:H,mac:G}}({Uint8Array,Uint32Array},e,t);return h.set_key=function(e,t,i,a,s,c,u,d,f){var l=r.subarray(0,60),p=r.subarray(256,316);l.set([t,i,a,s,c,u,d,f]);for(var y=e,b=1;y<4*e+28;y++){var m=l[y-1];(y%e==0||8===e&&y%e==4)&&(m=n[m>>>24]<<24^n[m>>>16&255]<<16^n[m>>>8&255]<<8^n[255&m]),y%e==0&&(m=m<<8^m>>>24^b<<24,b=b<<1^(128&b?27:0)),l[y]=l[y-e]^m}for(var g=0;g<y;g+=4)for(var w=0;w<4;w++){m=l[y-(4+g)+(4-w)%4];p[g+w]=g<4||g>=y-4?m:o[0][n[m>>>24]]^o[1][n[m>>>16&255]]^o[2][n[m>>>8&255]]^o[3][n[255&m]]}h.set_rounds(e+5)},h};return h.ENC={ECB:0,CBC:2,CFB:4,OFB:6,CTR:7},h.DEC={ECB:1,CBC:3,CFB:5,OFB:6,CTR:7},h.MAC={CBC:0,GCM:1},h.HEAP_DATA=16384,h}();function ye(e){return e instanceof Uint8Array}function be(e,t){const r=e?e.byteLength:t||65536;if(4095&r||r<=0)throw Error("heap size must be a positive integer and a multiple of 4096");return e=e||new Uint8Array(new ArrayBuffer(r))}function me(e,t,r,i,n){const a=e.length-t,s=a<n?a:n;return e.set(r.subarray(i,i+s),t),s}function ge(...e){const t=e.reduce(((e,t)=>e+t.length),0),r=new Uint8Array(t);let i=0;for(let t=0;t<e.length;t++)r.set(e[t],i),i+=e[t].length;return r}class we extends Error{constructor(...e){super(...e)}}class ve extends Error{constructor(...e){super(...e)}}class _e extends Error{constructor(...e){super(...e)}}const ke=[],Ae=[];class Se{constructor(e,t,r=!0,i,n,a){this.pos=0,this.len=0,this.mode=i,this.pos=0,this.len=0,this.key=e,this.iv=t,this.padding=r,this.acquire_asm(n,a)}acquire_asm(e,t){return void 0!==this.heap&&void 0!==this.asm||(this.heap=e||ke.pop()||be().subarray(pe.HEAP_DATA),this.asm=t||Ae.pop()||new pe(null,this.heap.buffer),this.reset(this.key,this.iv)),{heap:this.heap,asm:this.asm}}release_asm(){void 0!==this.heap&&void 0!==this.asm&&(ke.push(this.heap),Ae.push(this.asm)),this.heap=void 0,this.asm=void 0}reset(e,t){const{asm:r}=this.acquire_asm(),i=e.length;if(16!==i&&24!==i&&32!==i)throw new ve("illegal key size");const n=new DataView(e.buffer,e.byteOffset,e.byteLength);if(r.set_key(i>>2,n.getUint32(0),n.getUint32(4),n.getUint32(8),n.getUint32(12),i>16?n.getUint32(16):0,i>16?n.getUint32(20):0,i>24?n.getUint32(24):0,i>24?n.getUint32(28):0),void 0!==t){if(16!==t.length)throw new ve("illegal iv size");let e=new DataView(t.buffer,t.byteOffset,t.byteLength);r.set_iv(e.getUint32(0),e.getUint32(4),e.getUint32(8),e.getUint32(12))}else r.set_iv(0,0,0,0)}AES_Encrypt_process(e){if(!ye(e))throw new TypeError("data isn't of expected type");let{heap:t,asm:r}=this.acquire_asm(),i=pe.ENC[this.mode],n=pe.HEAP_DATA,a=this.pos,s=this.len,o=0,c=e.length||0,u=0,h=0,d=new Uint8Array(s+c&-16);for(;c>0;)h=me(t,a+s,e,o,c),s+=h,o+=h,c-=h,h=r.cipher(i,n+a,s),h&&d.set(t.subarray(a,a+h),u),u+=h,h<s?(a+=h,s-=h):(a=0,s=0);return this.pos=a,this.len=s,d}AES_Encrypt_finish(){let{heap:e,asm:t}=this.acquire_asm(),r=pe.ENC[this.mode],i=pe.HEAP_DATA,n=this.pos,a=this.len,s=16-a%16,o=a;if(this.hasOwnProperty("padding")){if(this.padding){for(let t=0;t<s;++t)e[n+a+t]=s;a+=s,o=a}else if(a%16)throw new ve("data length must be a multiple of the block size")}else a+=s;const c=new Uint8Array(o);return a&&t.cipher(r,i+n,a),o&&c.set(e.subarray(n,n+o)),this.pos=0,this.len=0,this.release_asm(),c}AES_Decrypt_process(e){if(!ye(e))throw new TypeError("data isn't of expected type");let{heap:t,asm:r}=this.acquire_asm(),i=pe.DEC[this.mode],n=pe.HEAP_DATA,a=this.pos,s=this.len,o=0,c=e.length||0,u=0,h=s+c&-16,d=0,f=0;this.padding&&(d=s+c-h||16,h-=d);const l=new Uint8Array(h);for(;c>0;)f=me(t,a+s,e,o,c),s+=f,o+=f,c-=f,f=r.cipher(i,n+a,s-(c?0:d)),f&&l.set(t.subarray(a,a+f),u),u+=f,f<s?(a+=f,s-=f):(a=0,s=0);return this.pos=a,this.len=s,l}AES_Decrypt_finish(){let{heap:e,asm:t}=this.acquire_asm(),r=pe.DEC[this.mode],i=pe.HEAP_DATA,n=this.pos,a=this.len,s=a;if(a>0){if(a%16){if(this.hasOwnProperty("padding"))throw new ve("data length must be a multiple of the block size");a+=16-a%16}if(t.cipher(r,i+n,a),this.hasOwnProperty("padding")&&this.padding){let t=e[n+s-1];if(t<1||t>16||t>s)throw new _e("bad padding");let r=0;for(let i=t;i>1;i--)r|=t^e[n+s-i];if(r)throw new _e("bad padding");s-=t}}const o=new Uint8Array(s);return s>0&&o.set(e.subarray(n,n+s)),this.pos=0,this.len=0,this.release_asm(),o}}class Ee{static encrypt(e,t,r=!1){return new Ee(t,r).encrypt(e)}static decrypt(e,t,r=!1){return new Ee(t,r).decrypt(e)}constructor(e,t=!1,r){this.aes=r||new Se(e,void 0,t,"ECB")}encrypt(e){return ge(this.aes.AES_Encrypt_process(e),this.aes.AES_Encrypt_finish())}decrypt(e){return ge(this.aes.AES_Decrypt_process(e),this.aes.AES_Decrypt_finish())}}function Pe(e){const t=function(e){const t=new Ee(e);this.encrypt=function(e){return t.encrypt(e)},this.decrypt=function(e){return t.decrypt(e)}};return t.blockSize=t.prototype.blockSize=16,t.keySize=t.prototype.keySize=e/8,t}function xe(e,t,r,i,n,a){const s=[16843776,0,65536,16843780,16842756,66564,4,65536,1024,16843776,16843780,1024,16778244,16842756,16777216,4,1028,16778240,16778240,66560,66560,16842752,16842752,16778244,65540,16777220,16777220,65540,0,1028,66564,16777216,65536,16843780,4,16842752,16843776,16777216,16777216,1024,16842756,65536,66560,16777220,1024,4,16778244,66564,16843780,65540,16842752,16778244,16777220,1028,66564,16843776,1028,16778240,16778240,0,65540,66560,0,16842756],o=[-2146402272,-2147450880,32768,1081376,1048576,32,-2146435040,-2147450848,-2147483616,-2146402272,-2146402304,-2147483648,-2147450880,1048576,32,-2146435040,1081344,1048608,-2147450848,0,-2147483648,32768,1081376,-2146435072,1048608,-2147483616,0,1081344,32800,-2146402304,-2146435072,32800,0,1081376,-2146435040,1048576,-2147450848,-2146435072,-2146402304,32768,-2146435072,-2147450880,32,-2146402272,1081376,32,32768,-2147483648,32800,-2146402304,1048576,-2147483616,1048608,-2147450848,-2147483616,1048608,1081344,0,-2147450880,32800,-2147483648,-2146435040,-2146402272,1081344],c=[520,134349312,0,134348808,134218240,0,131592,134218240,131080,134217736,134217736,131072,134349320,131080,134348800,520,134217728,8,134349312,512,131584,134348800,134348808,131592,134218248,131584,131072,134218248,8,134349320,512,134217728,134349312,134217728,131080,520,131072,134349312,134218240,0,512,131080,134349320,134218240,134217736,512,0,134348808,134218248,131072,134217728,134349320,8,131592,131584,134217736,134348800,134218248,520,134348800,131592,8,134348808,131584],u=[8396801,8321,8321,128,8396928,8388737,8388609,8193,0,8396800,8396800,8396929,129,0,8388736,8388609,1,8192,8388608,8396801,128,8388608,8193,8320,8388737,1,8320,8388736,8192,8396928,8396929,129,8388736,8388609,8396800,8396929,129,0,0,8396800,8320,8388736,8388737,1,8396801,8321,8321,128,8396929,129,1,8192,8388609,8193,8396928,8388737,8193,8320,8388608,8396801,128,8388608,8192,8396928],h=[256,34078976,34078720,1107296512,524288,256,1073741824,34078720,1074266368,524288,33554688,1074266368,1107296512,1107820544,524544,1073741824,33554432,1074266112,1074266112,0,1073742080,1107820800,1107820800,33554688,1107820544,1073742080,0,1107296256,34078976,33554432,1107296256,524544,524288,1107296512,256,33554432,1073741824,34078720,1107296512,1074266368,33554688,1073741824,1107820544,34078976,1074266368,256,33554432,1107820544,1107820800,524544,1107296256,1107820800,34078720,0,1074266112,1107296256,524544,33554688,1073742080,524288,0,1074266112,34078976,1073742080],d=[536870928,541065216,16384,541081616,541065216,16,541081616,4194304,536887296,4210704,4194304,536870928,4194320,536887296,536870912,16400,0,4194320,536887312,16384,4210688,536887312,16,541065232,541065232,0,4210704,541081600,16400,4210688,541081600,536870912,536887296,16,541065232,4210688,541081616,4194304,16400,536870928,4194304,536887296,536870912,16400,536870928,541081616,4210688,541065216,4210704,541081600,0,541065232,16,16384,541065216,4210704,16384,4194320,536887312,0,541081600,536870912,4194320,536887312],f=[2097152,69206018,67110914,0,2048,67110914,2099202,69208064,69208066,2097152,0,67108866,2,67108864,69206018,2050,67110912,2099202,2097154,67110912,67108866,69206016,69208064,2097154,69206016,2048,2050,69208066,2099200,2,67108864,2099200,67108864,2099200,2097152,67110914,67110914,69206018,69206018,2,2097154,67108864,67110912,2097152,69208064,2050,2099202,69208064,2050,67108866,69208066,69206016,2099200,0,2,69208066,0,2099202,69206016,2048,67108866,67110912,2048,2097154],l=[268439616,4096,262144,268701760,268435456,268439616,64,268435456,262208,268697600,268701760,266240,268701696,266304,4096,64,268697600,268435520,268439552,4160,266240,262208,268697664,268701696,4160,0,0,268697664,268435520,268439552,266304,262144,266304,262144,268701696,4096,64,268697664,4096,266304,268439552,64,268435520,268697600,268697664,268435456,262144,268439616,0,268701760,262208,268435520,268697600,268439552,268439616,0,268701760,266240,266240,4160,4160,262208,268435456,268701696];let p,y,b,m,g,w,v,_,k,A,S,E,P,x,M=0,C=t.length;const K=32===e.length?3:9;_=3===K?r?[0,32,2]:[30,-2,-2]:r?[0,32,2,62,30,-2,64,96,2]:[94,62,-2,32,64,2,30,-2,-2],r&&(C=(t=function(e,t){const r=8-e.length%8;let i;if(2===t&&r<8)i=32;else if(1===t)i=r;else{if(t||!(r<8)){if(8===r)return e;throw Error("des: invalid padding")}i=0}const n=new Uint8Array(e.length+r);for(let t=0;t<e.length;t++)n[t]=e[t];for(let t=0;t<r;t++)n[e.length+t]=i;return n}(t,a)).length);let D=new Uint8Array(C),R=0;for(1===i&&(k=n[M++]<<24|n[M++]<<16|n[M++]<<8|n[M++],S=n[M++]<<24|n[M++]<<16|n[M++]<<8|n[M++],M=0);M<C;){for(w=t[M++]<<24|t[M++]<<16|t[M++]<<8|t[M++],v=t[M++]<<24|t[M++]<<16|t[M++]<<8|t[M++],1===i&&(r?(w^=k,v^=S):(A=k,E=S,k=w,S=v)),b=252645135&(w>>>4^v),v^=b,w^=b<<4,b=65535&(w>>>16^v),v^=b,w^=b<<16,b=858993459&(v>>>2^w),w^=b,v^=b<<2,b=16711935&(v>>>8^w),w^=b,v^=b<<8,b=1431655765&(w>>>1^v),v^=b,w^=b<<1,w=w<<1|w>>>31,v=v<<1|v>>>31,y=0;y<K;y+=3){for(P=_[y+1],x=_[y+2],p=_[y];p!==P;p+=x)m=v^e[p],g=(v>>>4|v<<28)^e[p+1],b=w,w=v,v=b^(o[m>>>24&63]|u[m>>>16&63]|d[m>>>8&63]|l[63&m]|s[g>>>24&63]|c[g>>>16&63]|h[g>>>8&63]|f[63&g]);b=w,w=v,v=b}w=w>>>1|w<<31,v=v>>>1|v<<31,b=1431655765&(w>>>1^v),v^=b,w^=b<<1,b=16711935&(v>>>8^w),w^=b,v^=b<<8,b=858993459&(v>>>2^w),w^=b,v^=b<<2,b=65535&(w>>>16^v),v^=b,w^=b<<16,b=252645135&(w>>>4^v),v^=b,w^=b<<4,1===i&&(r?(k=w,S=v):(w^=A,v^=E)),D[R++]=w>>>24,D[R++]=w>>>16&255,D[R++]=w>>>8&255,D[R++]=255&w,D[R++]=v>>>24,D[R++]=v>>>16&255,D[R++]=v>>>8&255,D[R++]=255&v}return r||(D=function(e,t){let r,i=null;if(2===t)r=32;else if(1===t)i=e[e.length-1];else{if(t)throw Error("des: invalid padding");r=0}if(!i){for(i=1;e[e.length-i]===r;)i++;i--}return e.subarray(0,e.length-i)}(D,a)),D}function Me(e){const t=[0,4,536870912,536870916,65536,65540,536936448,536936452,512,516,536871424,536871428,66048,66052,536936960,536936964],r=[0,1,1048576,1048577,67108864,67108865,68157440,68157441,256,257,1048832,1048833,67109120,67109121,68157696,68157697],i=[0,8,2048,2056,16777216,16777224,16779264,16779272,0,8,2048,2056,16777216,16777224,16779264,16779272],n=[0,2097152,134217728,136314880,8192,2105344,134225920,136323072,131072,2228224,134348800,136445952,139264,2236416,134356992,136454144],a=[0,262144,16,262160,0,262144,16,262160,4096,266240,4112,266256,4096,266240,4112,266256],s=[0,1024,32,1056,0,1024,32,1056,33554432,33555456,33554464,33555488,33554432,33555456,33554464,33555488],o=[0,268435456,524288,268959744,2,268435458,524290,268959746,0,268435456,524288,268959744,2,268435458,524290,268959746],c=[0,65536,2048,67584,536870912,536936448,536872960,536938496,131072,196608,133120,198656,537001984,537067520,537004032,537069568],u=[0,262144,0,262144,2,262146,2,262146,33554432,33816576,33554432,33816576,33554434,33816578,33554434,33816578],h=[0,268435456,8,268435464,0,268435456,8,268435464,1024,268436480,1032,268436488,1024,268436480,1032,268436488],d=[0,32,0,32,1048576,1048608,1048576,1048608,8192,8224,8192,8224,1056768,1056800,1056768,1056800],f=[0,16777216,512,16777728,2097152,18874368,2097664,18874880,67108864,83886080,67109376,83886592,69206016,85983232,69206528,85983744],l=[0,4096,134217728,134221824,524288,528384,134742016,134746112,16,4112,134217744,134221840,524304,528400,134742032,134746128],p=[0,4,256,260,0,4,256,260,1,5,257,261,1,5,257,261],y=e.length>8?3:1,b=Array(32*y),m=[0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0];let g,w,v,_=0,k=0;for(let A=0;A<y;A++){let y=e[_++]<<24|e[_++]<<16|e[_++]<<8|e[_++],A=e[_++]<<24|e[_++]<<16|e[_++]<<8|e[_++];v=252645135&(y>>>4^A),A^=v,y^=v<<4,v=65535&(A>>>-16^y),y^=v,A^=v<<-16,v=858993459&(y>>>2^A),A^=v,y^=v<<2,v=65535&(A>>>-16^y),y^=v,A^=v<<-16,v=1431655765&(y>>>1^A),A^=v,y^=v<<1,v=16711935&(A>>>8^y),y^=v,A^=v<<8,v=1431655765&(y>>>1^A),A^=v,y^=v<<1,v=y<<8|A>>>20&240,y=A<<24|A<<8&16711680|A>>>8&65280|A>>>24&240,A=v;for(let e=0;e<16;e++)m[e]?(y=y<<2|y>>>26,A=A<<2|A>>>26):(y=y<<1|y>>>27,A=A<<1|A>>>27),y&=-15,A&=-15,g=t[y>>>28]|r[y>>>24&15]|i[y>>>20&15]|n[y>>>16&15]|a[y>>>12&15]|s[y>>>8&15]|o[y>>>4&15],w=c[A>>>28]|u[A>>>24&15]|h[A>>>20&15]|d[A>>>16&15]|f[A>>>12&15]|l[A>>>8&15]|p[A>>>4&15],v=65535&(w>>>16^g),b[k++]=g^v,b[k++]=w^v<<16}return b}function Ce(e){this.key=[];for(let t=0;t<3;t++)this.key.push(new Uint8Array(e.subarray(8*t,8*t+8)));this.encrypt=function(e){return xe(Me(this.key[2]),xe(Me(this.key[1]),xe(Me(this.key[0]),e,!0,0,null,null),!1,0,null,null),!0,0,null,null)}}function Ke(){this.BlockSize=8,this.KeySize=16,this.setKey=function(e){if(this.masking=Array(16),this.rotate=Array(16),this.reset(),e.length!==this.KeySize)throw Error("CAST-128: keys must be 16 bytes");return this.keySchedule(e),!0},this.reset=function(){for(let e=0;e<16;e++)this.masking[e]=0,this.rotate[e]=0},this.getBlockSize=function(){return this.BlockSize},this.encrypt=function(e){const t=Array(e.length);for(let a=0;a<e.length;a+=8){let s,o=e[a]<<24|e[a+1]<<16|e[a+2]<<8|e[a+3],c=e[a+4]<<24|e[a+5]<<16|e[a+6]<<8|e[a+7];s=c,c=o^r(c,this.masking[0],this.rotate[0]),o=s,s=c,c=o^i(c,this.masking[1],this.rotate[1]),o=s,s=c,c=o^n(c,this.masking[2],this.rotate[2]),o=s,s=c,c=o^r(c,this.masking[3],this.rotate[3]),o=s,s=c,c=o^i(c,this.masking[4],this.rotate[4]),o=s,s=c,c=o^n(c,this.masking[5],this.rotate[5]),o=s,s=c,c=o^r(c,this.masking[6],this.rotate[6]),o=s,s=c,c=o^i(c,this.masking[7],this.rotate[7]),o=s,s=c,c=o^n(c,this.masking[8],this.rotate[8]),o=s,s=c,c=o^r(c,this.masking[9],this.rotate[9]),o=s,s=c,c=o^i(c,this.masking[10],this.rotate[10]),o=s,s=c,c=o^n(c,this.masking[11],this.rotate[11]),o=s,s=c,c=o^r(c,this.masking[12],this.rotate[12]),o=s,s=c,c=o^i(c,this.masking[13],this.rotate[13]),o=s,s=c,c=o^n(c,this.masking[14],this.rotate[14]),o=s,s=c,c=o^r(c,this.masking[15],this.rotate[15]),o=s,t[a]=c>>>24&255,t[a+1]=c>>>16&255,t[a+2]=c>>>8&255,t[a+3]=255&c,t[a+4]=o>>>24&255,t[a+5]=o>>>16&255,t[a+6]=o>>>8&255,t[a+7]=255&o}return t},this.decrypt=function(e){const t=Array(e.length);for(let a=0;a<e.length;a+=8){let s,o=e[a]<<24|e[a+1]<<16|e[a+2]<<8|e[a+3],c=e[a+4]<<24|e[a+5]<<16|e[a+6]<<8|e[a+7];s=c,c=o^r(c,this.masking[15],this.rotate[15]),o=s,s=c,c=o^n(c,this.masking[14],this.rotate[14]),o=s,s=c,c=o^i(c,this.masking[13],this.rotate[13]),o=s,s=c,c=o^r(c,this.masking[12],this.rotate[12]),o=s,s=c,c=o^n(c,this.masking[11],this.rotate[11]),o=s,s=c,c=o^i(c,this.masking[10],this.rotate[10]),o=s,s=c,c=o^r(c,this.masking[9],this.rotate[9]),o=s,s=c,c=o^n(c,this.masking[8],this.rotate[8]),o=s,s=c,c=o^i(c,this.masking[7],this.rotate[7]),o=s,s=c,c=o^r(c,this.masking[6],this.rotate[6]),o=s,s=c,c=o^n(c,this.masking[5],this.rotate[5]),o=s,s=c,c=o^i(c,this.masking[4],this.rotate[4]),o=s,s=c,c=o^r(c,this.masking[3],this.rotate[3]),o=s,s=c,c=o^n(c,this.masking[2],this.rotate[2]),o=s,s=c,c=o^i(c,this.masking[1],this.rotate[1]),o=s,s=c,c=o^r(c,this.masking[0],this.rotate[0]),o=s,t[a]=c>>>24&255,t[a+1]=c>>>16&255,t[a+2]=c>>>8&255,t[a+3]=255&c,t[a+4]=o>>>24&255,t[a+5]=o>>16&255,t[a+6]=o>>8&255,t[a+7]=255&o}return t};const e=[,,,,];e[0]=[,,,,],e[0][0]=[4,0,13,15,12,14,8],e[0][1]=[5,2,16,18,17,19,10],e[0][2]=[6,3,23,22,21,20,9],e[0][3]=[7,1,26,25,27,24,11],e[1]=[,,,,],e[1][0]=[0,6,21,23,20,22,16],e[1][1]=[1,4,0,2,1,3,18],e[1][2]=[2,5,7,6,5,4,17],e[1][3]=[3,7,10,9,11,8,19],e[2]=[,,,,],e[2][0]=[4,0,13,15,12,14,8],e[2][1]=[5,2,16,18,17,19,10],e[2][2]=[6,3,23,22,21,20,9],e[2][3]=[7,1,26,25,27,24,11],e[3]=[,,,,],e[3][0]=[0,6,21,23,20,22,16],e[3][1]=[1,4,0,2,1,3,18],e[3][2]=[2,5,7,6,5,4,17],e[3][3]=[3,7,10,9,11,8,19];const t=[,,,,];function r(e,t,r){const i=t+e,n=i<<r|i>>>32-r;return(a[0][n>>>24]^a[1][n>>>16&255])-a[2][n>>>8&255]+a[3][255&n]}function i(e,t,r){const i=t^e,n=i<<r|i>>>32-r;return a[0][n>>>24]-a[1][n>>>16&255]+a[2][n>>>8&255]^a[3][255&n]}function n(e,t,r){const i=t-e,n=i<<r|i>>>32-r;return(a[0][n>>>24]+a[1][n>>>16&255]^a[2][n>>>8&255])-a[3][255&n]}t[0]=[,,,,],t[0][0]=[24,25,23,22,18],t[0][1]=[26,27,21,20,22],t[0][2]=[28,29,19,18,25],t[0][3]=[30,31,17,16,28],t[1]=[,,,,],t[1][0]=[3,2,12,13,8],t[1][1]=[1,0,14,15,13],t[1][2]=[7,6,8,9,3],t[1][3]=[5,4,10,11,7],t[2]=[,,,,],t[2][0]=[19,18,28,29,25],t[2][1]=[17,16,30,31,28],t[2][2]=[23,22,24,25,18],t[2][3]=[21,20,26,27,22],t[3]=[,,,,],t[3][0]=[8,9,7,6,3],t[3][1]=[10,11,5,4,7],t[3][2]=[12,13,3,2,8],t[3][3]=[14,15,1,0,13],this.keySchedule=function(r){const i=[,,,,,,,,],n=Array(32);let s;for(let e=0;e<4;e++)s=4*e,i[e]=r[s]<<24|r[s+1]<<16|r[s+2]<<8|r[s+3];const o=[6,7,4,5];let c,u=0;for(let r=0;r<2;r++)for(let r=0;r<4;r++){for(s=0;s<4;s++){const t=e[r][s];c=i[t[1]],c^=a[4][i[t[2]>>>2]>>>24-8*(3&t[2])&255],c^=a[5][i[t[3]>>>2]>>>24-8*(3&t[3])&255],c^=a[6][i[t[4]>>>2]>>>24-8*(3&t[4])&255],c^=a[7][i[t[5]>>>2]>>>24-8*(3&t[5])&255],c^=a[o[s]][i[t[6]>>>2]>>>24-8*(3&t[6])&255],i[t[0]]=c}for(s=0;s<4;s++){const e=t[r][s];c=a[4][i[e[0]>>>2]>>>24-8*(3&e[0])&255],c^=a[5][i[e[1]>>>2]>>>24-8*(3&e[1])&255],c^=a[6][i[e[2]>>>2]>>>24-8*(3&e[2])&255],c^=a[7][i[e[3]>>>2]>>>24-8*(3&e[3])&255],c^=a[4+s][i[e[4]>>>2]>>>24-8*(3&e[4])&255],n[u]=c,u++}}for(let e=0;e<16;e++)this.masking[e]=n[e],this.rotate[e]=31&n[16+e]};const a=[,,,,,,,,];a[0]=[821772500,2678128395,1810681135,1059425402,505495343,2617265619,1610868032,3483355465,3218386727,2294005173,3791863952,2563806837,1852023008,365126098,3269944861,584384398,677919599,3229601881,4280515016,2002735330,1136869587,3744433750,2289869850,2731719981,2714362070,879511577,1639411079,575934255,717107937,2857637483,576097850,2731753936,1725645e3,2810460463,5111599,767152862,2543075244,1251459544,1383482551,3052681127,3089939183,3612463449,1878520045,1510570527,2189125840,2431448366,582008916,3163445557,1265446783,1354458274,3529918736,3202711853,3073581712,3912963487,3029263377,1275016285,4249207360,2905708351,3304509486,1442611557,3585198765,2712415662,2731849581,3248163920,2283946226,208555832,2766454743,1331405426,1447828783,3315356441,3108627284,2957404670,2981538698,3339933917,1669711173,286233437,1465092821,1782121619,3862771680,710211251,980974943,1651941557,430374111,2051154026,704238805,4128970897,3144820574,2857402727,948965521,3333752299,2227686284,718756367,2269778983,2731643755,718440111,2857816721,3616097120,1113355533,2478022182,410092745,1811985197,1944238868,2696854588,1415722873,1682284203,1060277122,1998114690,1503841958,82706478,2315155686,1068173648,845149890,2167947013,1768146376,1993038550,3566826697,3390574031,940016341,3355073782,2328040721,904371731,1205506512,4094660742,2816623006,825647681,85914773,2857843460,1249926541,1417871568,3287612,3211054559,3126306446,1975924523,1353700161,2814456437,2438597621,1800716203,722146342,2873936343,1151126914,4160483941,2877670899,458611604,2866078500,3483680063,770352098,2652916994,3367839148,3940505011,3585973912,3809620402,718646636,2504206814,2914927912,3631288169,2857486607,2860018678,575749918,2857478043,718488780,2069512688,3548183469,453416197,1106044049,3032691430,52586708,3378514636,3459808877,3211506028,1785789304,218356169,3571399134,3759170522,1194783844,1523787992,3007827094,1975193539,2555452411,1341901877,3045838698,3776907964,3217423946,2802510864,2889438986,1057244207,1636348243,3761863214,1462225785,2632663439,481089165,718503062,24497053,3332243209,3344655856,3655024856,3960371065,1195698900,2971415156,3710176158,2115785917,4027663609,3525578417,2524296189,2745972565,3564906415,1372086093,1452307862,2780501478,1476592880,3389271281,18495466,2378148571,901398090,891748256,3279637769,3157290713,2560960102,1447622437,4284372637,216884176,2086908623,1879786977,3588903153,2242455666,2938092967,3559082096,2810645491,758861177,1121993112,215018983,642190776,4169236812,1196255959,2081185372,3508738393,941322904,4124243163,2877523539,1848581667,2205260958,3180453958,2589345134,3694731276,550028657,2519456284,3789985535,2973870856,2093648313,443148163,46942275,2734146937,1117713533,1115362972,1523183689,3717140224,1551984063],a[1]=[522195092,4010518363,1776537470,960447360,4267822970,4005896314,1435016340,1929119313,2913464185,1310552629,3579470798,3724818106,2579771631,1594623892,417127293,2715217907,2696228731,1508390405,3994398868,3925858569,3695444102,4019471449,3129199795,3770928635,3520741761,990456497,4187484609,2783367035,21106139,3840405339,631373633,3783325702,532942976,396095098,3548038825,4267192484,2564721535,2011709262,2039648873,620404603,3776170075,2898526339,3612357925,4159332703,1645490516,223693667,1567101217,3362177881,1029951347,3470931136,3570957959,1550265121,119497089,972513919,907948164,3840628539,1613718692,3594177948,465323573,2659255085,654439692,2575596212,2699288441,3127702412,277098644,624404830,4100943870,2717858591,546110314,2403699828,3655377447,1321679412,4236791657,1045293279,4010672264,895050893,2319792268,494945126,1914543101,2777056443,3894764339,2219737618,311263384,4275257268,3458730721,669096869,3584475730,3835122877,3319158237,3949359204,2005142349,2713102337,2228954793,3769984788,569394103,3855636576,1425027204,108000370,2736431443,3671869269,3043122623,1750473702,2211081108,762237499,3972989403,2798899386,3061857628,2943854345,867476300,964413654,1591880597,1594774276,2179821409,552026980,3026064248,3726140315,2283577634,3110545105,2152310760,582474363,1582640421,1383256631,2043843868,3322775884,1217180674,463797851,2763038571,480777679,2718707717,2289164131,3118346187,214354409,200212307,3810608407,3025414197,2674075964,3997296425,1847405948,1342460550,510035443,4080271814,815934613,833030224,1620250387,1945732119,2703661145,3966000196,1388869545,3456054182,2687178561,2092620194,562037615,1356438536,3409922145,3261847397,1688467115,2150901366,631725691,3840332284,549916902,3455104640,394546491,837744717,2114462948,751520235,2221554606,2415360136,3999097078,2063029875,803036379,2702586305,821456707,3019566164,360699898,4018502092,3511869016,3677355358,2402471449,812317050,49299192,2570164949,3259169295,2816732080,3331213574,3101303564,2156015656,3705598920,3546263921,143268808,3200304480,1638124008,3165189453,3341807610,578956953,2193977524,3638120073,2333881532,807278310,658237817,2969561766,1641658566,11683945,3086995007,148645947,1138423386,4158756760,1981396783,2401016740,3699783584,380097457,2680394679,2803068651,3334260286,441530178,4016580796,1375954390,761952171,891809099,2183123478,157052462,3683840763,1592404427,341349109,2438483839,1417898363,644327628,2233032776,2353769706,2201510100,220455161,1815641738,182899273,2995019788,3627381533,3702638151,2890684138,1052606899,588164016,1681439879,4038439418,2405343923,4229449282,167996282,1336969661,1688053129,2739224926,1543734051,1046297529,1138201970,2121126012,115334942,1819067631,1902159161,1941945968,2206692869,1159982321],a[2]=[2381300288,637164959,3952098751,3893414151,1197506559,916448331,2350892612,2932787856,3199334847,4009478890,3905886544,1373570990,2450425862,4037870920,3778841987,2456817877,286293407,124026297,3001279700,1028597854,3115296800,4208886496,2691114635,2188540206,1430237888,1218109995,3572471700,308166588,570424558,2187009021,2455094765,307733056,1310360322,3135275007,1384269543,2388071438,863238079,2359263624,2801553128,3380786597,2831162807,1470087780,1728663345,4072488799,1090516929,532123132,2389430977,1132193179,2578464191,3051079243,1670234342,1434557849,2711078940,1241591150,3314043432,3435360113,3091448339,1812415473,2198440252,267246943,796911696,3619716990,38830015,1526438404,2806502096,374413614,2943401790,1489179520,1603809326,1920779204,168801282,260042626,2358705581,1563175598,2397674057,1356499128,2217211040,514611088,2037363785,2186468373,4022173083,2792511869,2913485016,1173701892,4200428547,3896427269,1334932762,2455136706,602925377,2835607854,1613172210,41346230,2499634548,2457437618,2188827595,41386358,4172255629,1313404830,2405527007,3801973774,2217704835,873260488,2528884354,2478092616,4012915883,2555359016,2006953883,2463913485,575479328,2218240648,2099895446,660001756,2341502190,3038761536,3888151779,3848713377,3286851934,1022894237,1620365795,3449594689,1551255054,15374395,3570825345,4249311020,4151111129,3181912732,310226346,1133119310,530038928,136043402,2476768958,3107506709,2544909567,1036173560,2367337196,1681395281,1758231547,3641649032,306774401,1575354324,3716085866,1990386196,3114533736,2455606671,1262092282,3124342505,2768229131,4210529083,1833535011,423410938,660763973,2187129978,1639812e3,3508421329,3467445492,310289298,272797111,2188552562,2456863912,310240523,677093832,1013118031,901835429,3892695601,1116285435,3036471170,1337354835,243122523,520626091,277223598,4244441197,4194248841,1766575121,594173102,316590669,742362309,3536858622,4176435350,3838792410,2501204839,1229605004,3115755532,1552908988,2312334149,979407927,3959474601,1148277331,176638793,3614686272,2083809052,40992502,1340822838,2731552767,3535757508,3560899520,1354035053,122129617,7215240,2732932949,3118912700,2718203926,2539075635,3609230695,3725561661,1928887091,2882293555,1988674909,2063640240,2491088897,1459647954,4189817080,2302804382,1113892351,2237858528,1927010603,4002880361,1856122846,1594404395,2944033133,3855189863,3474975698,1643104450,4054590833,3431086530,1730235576,2984608721,3084664418,2131803598,4178205752,267404349,1617849798,1616132681,1462223176,736725533,2327058232,551665188,2945899023,1749386277,2575514597,1611482493,674206544,2201269090,3642560800,728599968,1680547377,2620414464,1388111496,453204106,4156223445,1094905244,2754698257,2201108165,3757000246,2704524545,3922940700,3996465027],a[3]=[2645754912,532081118,2814278639,3530793624,1246723035,1689095255,2236679235,4194438865,2116582143,3859789411,157234593,2045505824,4245003587,1687664561,4083425123,605965023,672431967,1336064205,3376611392,214114848,4258466608,3232053071,489488601,605322005,3998028058,264917351,1912574028,756637694,436560991,202637054,135989450,85393697,2152923392,3896401662,2895836408,2145855233,3535335007,115294817,3147733898,1922296357,3464822751,4117858305,1037454084,2725193275,2127856640,1417604070,1148013728,1827919605,642362335,2929772533,909348033,1346338451,3547799649,297154785,1917849091,4161712827,2883604526,3968694238,1469521537,3780077382,3375584256,1763717519,136166297,4290970789,1295325189,2134727907,2798151366,1566297257,3672928234,2677174161,2672173615,965822077,2780786062,289653839,1133871874,3491843819,35685304,1068898316,418943774,672553190,642281022,2346158704,1954014401,3037126780,4079815205,2030668546,3840588673,672283427,1776201016,359975446,3750173538,555499703,2769985273,1324923,69110472,152125443,3176785106,3822147285,1340634837,798073664,1434183902,15393959,216384236,1303690150,3881221631,3711134124,3960975413,106373927,2578434224,1455997841,1801814300,1578393881,1854262133,3188178946,3258078583,2302670060,1539295533,3505142565,3078625975,2372746020,549938159,3278284284,2620926080,181285381,2865321098,3970029511,68876850,488006234,1728155692,2608167508,836007927,2435231793,919367643,3339422534,3655756360,1457871481,40520939,1380155135,797931188,234455205,2255801827,3990488299,397000196,739833055,3077865373,2871719860,4022553888,772369276,390177364,3853951029,557662966,740064294,1640166671,1699928825,3535942136,622006121,3625353122,68743880,1742502,219489963,1664179233,1577743084,1236991741,410585305,2366487942,823226535,1050371084,3426619607,3586839478,212779912,4147118561,1819446015,1911218849,530248558,3486241071,3252585495,2886188651,3410272728,2342195030,20547779,2982490058,3032363469,3631753222,312714466,1870521650,1493008054,3491686656,615382978,4103671749,2534517445,1932181,2196105170,278426614,6369430,3274544417,2913018367,697336853,2143000447,2946413531,701099306,1558357093,2805003052,3500818408,2321334417,3567135975,216290473,3591032198,23009561,1996984579,3735042806,2024298078,3739440863,569400510,2339758983,3016033873,3097871343,3639523026,3844324983,3256173865,795471839,2951117563,4101031090,4091603803,3603732598,971261452,534414648,428311343,3389027175,2844869880,694888862,1227866773,2456207019,3043454569,2614353370,3749578031,3676663836,459166190,4132644070,1794958188,51825668,2252611902,3084671440,2036672799,3436641603,1099053433,2469121526,3059204941,1323291266,2061838604,1018778475,2233344254,2553501054,334295216,3556750194,1065731521,183467730],a[4]=[2127105028,745436345,2601412319,2788391185,3093987327,500390133,1155374404,389092991,150729210,3891597772,3523549952,1935325696,716645080,946045387,2901812282,1774124410,3869435775,4039581901,3293136918,3438657920,948246080,363898952,3867875531,1286266623,1598556673,68334250,630723836,1104211938,1312863373,613332731,2377784574,1101634306,441780740,3129959883,1917973735,2510624549,3238456535,2544211978,3308894634,1299840618,4076074851,1756332096,3977027158,297047435,3790297736,2265573040,3621810518,1311375015,1667687725,47300608,3299642885,2474112369,201668394,1468347890,576830978,3594690761,3742605952,1958042578,1747032512,3558991340,1408974056,3366841779,682131401,1033214337,1545599232,4265137049,206503691,103024618,2855227313,1337551222,2428998917,2963842932,4015366655,3852247746,2796956967,3865723491,3747938335,247794022,3755824572,702416469,2434691994,397379957,851939612,2314769512,218229120,1380406772,62274761,214451378,3170103466,2276210409,3845813286,28563499,446592073,1693330814,3453727194,29968656,3093872512,220656637,2470637031,77972100,1667708854,1358280214,4064765667,2395616961,325977563,4277240721,4220025399,3605526484,3355147721,811859167,3069544926,3962126810,652502677,3075892249,4132761541,3498924215,1217549313,3250244479,3858715919,3053989961,1538642152,2279026266,2875879137,574252750,3324769229,2651358713,1758150215,141295887,2719868960,3515574750,4093007735,4194485238,1082055363,3417560400,395511885,2966884026,179534037,3646028556,3738688086,1092926436,2496269142,257381841,3772900718,1636087230,1477059743,2499234752,3811018894,2675660129,3285975680,90732309,1684827095,1150307763,1723134115,3237045386,1769919919,1240018934,815675215,750138730,2239792499,1234303040,1995484674,138143821,675421338,1145607174,1936608440,3238603024,2345230278,2105974004,323969391,779555213,3004902369,2861610098,1017501463,2098600890,2628620304,2940611490,2682542546,1171473753,3656571411,3687208071,4091869518,393037935,159126506,1662887367,1147106178,391545844,3452332695,1891500680,3016609650,1851642611,546529401,1167818917,3194020571,2848076033,3953471836,575554290,475796850,4134673196,450035699,2351251534,844027695,1080539133,86184846,1554234488,3692025454,1972511363,2018339607,1491841390,1141460869,1061690759,4244549243,2008416118,2351104703,2868147542,1598468138,722020353,1027143159,212344630,1387219594,1725294528,3745187956,2500153616,458938280,4129215917,1828119673,544571780,3503225445,2297937496,1241802790,267843827,2694610800,1397140384,1558801448,3782667683,1806446719,929573330,2234912681,400817706,616011623,4121520928,3603768725,1761550015,1968522284,4053731006,4192232858,4005120285,872482584,3140537016,3894607381,2287405443,1963876937,3663887957,1584857e3,2975024454,1833426440,4025083860],a[5]=[4143615901,749497569,1285769319,3795025788,2514159847,23610292,3974978748,844452780,3214870880,3751928557,2213566365,1676510905,448177848,3730751033,4086298418,2307502392,871450977,3222878141,4110862042,3831651966,2735270553,1310974780,2043402188,1218528103,2736035353,4274605013,2702448458,3936360550,2693061421,162023535,2827510090,687910808,23484817,3784910947,3371371616,779677500,3503626546,3473927188,4157212626,3500679282,4248902014,2466621104,3899384794,1958663117,925738300,1283408968,3669349440,1840910019,137959847,2679828185,1239142320,1315376211,1547541505,1690155329,739140458,3128809933,3933172616,3876308834,905091803,1548541325,4040461708,3095483362,144808038,451078856,676114313,2861728291,2469707347,993665471,373509091,2599041286,4025009006,4170239449,2149739950,3275793571,3749616649,2794760199,1534877388,572371878,2590613551,1753320020,3467782511,1405125690,4270405205,633333386,3026356924,3475123903,632057672,2846462855,1404951397,3882875879,3915906424,195638627,2385783745,3902872553,1233155085,3355999740,2380578713,2702246304,2144565621,3663341248,3894384975,2502479241,4248018925,3094885567,1594115437,572884632,3385116731,767645374,1331858858,1475698373,3793881790,3532746431,1321687957,619889600,1121017241,3440213920,2070816767,2833025776,1933951238,4095615791,890643334,3874130214,859025556,360630002,925594799,1764062180,3920222280,4078305929,979562269,2810700344,4087740022,1949714515,546639971,1165388173,3069891591,1495988560,922170659,1291546247,2107952832,1813327274,3406010024,3306028637,4241950635,153207855,2313154747,1608695416,1150242611,1967526857,721801357,1220138373,3691287617,3356069787,2112743302,3281662835,1111556101,1778980689,250857638,2298507990,673216130,2846488510,3207751581,3562756981,3008625920,3417367384,2198807050,529510932,3547516680,3426503187,2364944742,102533054,2294910856,1617093527,1204784762,3066581635,1019391227,1069574518,1317995090,1691889997,3661132003,510022745,3238594800,1362108837,1817929911,2184153760,805817662,1953603311,3699844737,120799444,2118332377,207536705,2282301548,4120041617,145305846,2508124933,3086745533,3261524335,1877257368,2977164480,3160454186,2503252186,4221677074,759945014,254147243,2767453419,3801518371,629083197,2471014217,907280572,3900796746,940896768,2751021123,2625262786,3161476951,3661752313,3260732218,1425318020,2977912069,1496677566,3988592072,2140652971,3126511541,3069632175,977771578,1392695845,1698528874,1411812681,1369733098,1343739227,3620887944,1142123638,67414216,3102056737,3088749194,1626167401,2546293654,3941374235,697522451,33404913,143560186,2595682037,994885535,1247667115,3859094837,2699155541,3547024625,4114935275,2968073508,3199963069,2732024527,1237921620,951448369,1898488916,1211705605,2790989240,2233243581,3598044975],a[6]=[2246066201,858518887,1714274303,3485882003,713916271,2879113490,3730835617,539548191,36158695,1298409750,419087104,1358007170,749914897,2989680476,1261868530,2995193822,2690628854,3443622377,3780124940,3796824509,2976433025,4259637129,1551479e3,512490819,1296650241,951993153,2436689437,2460458047,144139966,3136204276,310820559,3068840729,643875328,1969602020,1680088954,2185813161,3283332454,672358534,198762408,896343282,276269502,3014846926,84060815,197145886,376173866,3943890818,3813173521,3545068822,1316698879,1598252827,2633424951,1233235075,859989710,2358460855,3503838400,3409603720,1203513385,1193654839,2792018475,2060853022,207403770,1144516871,3068631394,1121114134,177607304,3785736302,326409831,1929119770,2983279095,4183308101,3474579288,3200513878,3228482096,119610148,1170376745,3378393471,3163473169,951863017,3337026068,3135789130,2907618374,1183797387,2015970143,4045674555,2182986399,2952138740,3928772205,384012900,2454997643,10178499,2879818989,2596892536,111523738,2995089006,451689641,3196290696,235406569,1441906262,3890558523,3013735005,4158569349,1644036924,376726067,1006849064,3664579700,2041234796,1021632941,1374734338,2566452058,371631263,4007144233,490221539,206551450,3140638584,1053219195,1853335209,3412429660,3562156231,735133835,1623211703,3104214392,2738312436,4096837757,3366392578,3110964274,3956598718,3196820781,2038037254,3877786376,2339753847,300912036,3766732888,2372630639,1516443558,4200396704,1574567987,4069441456,4122592016,2699739776,146372218,2748961456,2043888151,35287437,2596680554,655490400,1132482787,110692520,1031794116,2188192751,1324057718,1217253157,919197030,686247489,3261139658,1028237775,3135486431,3059715558,2460921700,986174950,2661811465,4062904701,2752986992,3709736643,367056889,1353824391,731860949,1650113154,1778481506,784341916,357075625,3608602432,1074092588,2480052770,3811426202,92751289,877911070,3600361838,1231880047,480201094,3756190983,3094495953,434011822,87971354,363687820,1717726236,1901380172,3926403882,2481662265,400339184,1490350766,2661455099,1389319756,2558787174,784598401,1983468483,30828846,3550527752,2716276238,3841122214,1765724805,1955612312,1277890269,1333098070,1564029816,2704417615,1026694237,3287671188,1260819201,3349086767,1016692350,1582273796,1073413053,1995943182,694588404,1025494639,3323872702,3551898420,4146854327,453260480,1316140391,1435673405,3038941953,3486689407,1622062951,403978347,817677117,950059133,4246079218,3278066075,1486738320,1417279718,481875527,2549965225,3933690356,760697757,1452955855,3897451437,1177426808,1702951038,4085348628,2447005172,1084371187,3516436277,3068336338,1073369276,1027665953,3284188590,1230553676,1368340146,2226246512,267243139,2274220762,4070734279,2497715176,2423353163,2504755875],a[7]=[3793104909,3151888380,2817252029,895778965,2005530807,3871412763,237245952,86829237,296341424,3851759377,3974600970,2475086196,709006108,1994621201,2972577594,937287164,3734691505,168608556,3189338153,2225080640,3139713551,3033610191,3025041904,77524477,185966941,1208824168,2344345178,1721625922,3354191921,1066374631,1927223579,1971335949,2483503697,1551748602,2881383779,2856329572,3003241482,48746954,1398218158,2050065058,313056748,4255789917,393167848,1912293076,940740642,3465845460,3091687853,2522601570,2197016661,1727764327,364383054,492521376,1291706479,3264136376,1474851438,1685747964,2575719748,1619776915,1814040067,970743798,1561002147,2925768690,2123093554,1880132620,3151188041,697884420,2550985770,2607674513,2659114323,110200136,1489731079,997519150,1378877361,3527870668,478029773,2766872923,1022481122,431258168,1112503832,897933369,2635587303,669726182,3383752315,918222264,163866573,3246985393,3776823163,114105080,1903216136,761148244,3571337562,1690750982,3166750252,1037045171,1888456500,2010454850,642736655,616092351,365016990,1185228132,4174898510,1043824992,2023083429,2241598885,3863320456,3279669087,3674716684,108438443,2132974366,830746235,606445527,4173263986,2204105912,1844756978,2532684181,4245352700,2969441100,3796921661,1335562986,4061524517,2720232303,2679424040,634407289,885462008,3294724487,3933892248,2094100220,339117932,4048830727,3202280980,1458155303,2689246273,1022871705,2464987878,3714515309,353796843,2822958815,4256850100,4052777845,551748367,618185374,3778635579,4020649912,1904685140,3069366075,2670879810,3407193292,2954511620,4058283405,2219449317,3135758300,1120655984,3447565834,1474845562,3577699062,550456716,3466908712,2043752612,881257467,869518812,2005220179,938474677,3305539448,3850417126,1315485940,3318264702,226533026,965733244,321539988,1136104718,804158748,573969341,3708209826,937399083,3290727049,2901666755,1461057207,4013193437,4066861423,3242773476,2421326174,1581322155,3028952165,786071460,3900391652,3918438532,1485433313,4023619836,3708277595,3678951060,953673138,1467089153,1930354364,1533292819,2492563023,1346121658,1685000834,1965281866,3765933717,4190206607,2052792609,3515332758,690371149,3125873887,2180283551,2903598061,3933952357,436236910,289419410,14314871,1242357089,2904507907,1616633776,2666382180,585885352,3471299210,2699507360,1432659641,277164553,3354103607,770115018,2303809295,3741942315,3177781868,2853364978,2269453327,3774259834,987383833,1290892879,225909803,1741533526,890078084,1496906255,1111072499,916028167,243534141,1252605537,2204162171,531204876,290011180,3916834213,102027703,237315147,209093447,1486785922,220223953,2758195998,4175039106,82940208,3127791296,2569425252,518464269,1353887104,3941492737,2377294467,3935040926]}function De(e){this.cast5=new Ke,this.cast5.setKey(e),this.encrypt=function(e){return this.cast5.encrypt(e)}}Ce.keySize=Ce.prototype.keySize=24,Ce.blockSize=Ce.prototype.blockSize=8,De.blockSize=De.prototype.blockSize=8,De.keySize=De.prototype.keySize=16;const Re=4294967295;function Ie(e,t){return(e<<t|e>>>32-t)&Re}function Ue(e,t){return e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24}function Be(e,t,r){e.splice(t,4,255&r,r>>>8&255,r>>>16&255,r>>>24&255)}function Te(e,t){return e>>>8*t&255}function ze(e){this.tf=function(){let e=null,t=null,r=-1,i=[],n=[[],[],[],[]];function a(e){return n[0][Te(e,0)]^n[1][Te(e,1)]^n[2][Te(e,2)]^n[3][Te(e,3)]}function s(e){return n[0][Te(e,3)]^n[1][Te(e,0)]^n[2][Te(e,1)]^n[3][Te(e,2)]}function o(e,t){let r=a(t[0]),n=s(t[1]);t[2]=Ie(t[2]^r+n+i[4*e+8]&Re,31),t[3]=Ie(t[3],1)^r+2*n+i[4*e+9]&Re,r=a(t[2]),n=s(t[3]),t[0]=Ie(t[0]^r+n+i[4*e+10]&Re,31),t[1]=Ie(t[1],1)^r+2*n+i[4*e+11]&Re}function c(e,t){let r=a(t[0]),n=s(t[1]);t[2]=Ie(t[2],1)^r+n+i[4*e+10]&Re,t[3]=Ie(t[3]^r+2*n+i[4*e+11]&Re,31),r=a(t[2]),n=s(t[3]),t[0]=Ie(t[0],1)^r+n+i[4*e+8]&Re,t[1]=Ie(t[1]^r+2*n+i[4*e+9]&Re,31)}return{name:"twofish",blocksize:16,open:function(t){let r,a,s,o,c;e=t;const u=[],h=[],d=[];let f;const l=[];let p,y,b;const m=[[8,1,7,13,6,15,3,2,0,11,5,9,14,12,10,4],[2,8,11,13,15,7,6,14,3,1,9,4,0,10,12,5]],g=[[14,12,11,8,1,2,3,5,15,4,10,6,7,0,9,13],[1,14,2,11,4,12,3,7,6,13,10,5,15,9,0,8]],w=[[11,10,5,14,6,13,9,0,12,8,15,3,2,4,7,1],[4,12,7,5,1,6,9,10,0,14,13,8,2,11,3,15]],v=[[13,7,15,4,1,2,6,14,9,11,3,0,8,5,12,10],[11,9,5,1,12,3,13,14,6,4,7,15,2,0,8,10]],_=[0,8,1,9,2,10,3,11,4,12,5,13,6,14,7,15],k=[0,9,2,11,4,13,6,15,8,1,10,3,12,5,14,7],A=[[],[]],S=[[],[],[],[]];function E(e){return e^e>>2^[0,90,180,238][3&e]}function P(e){return e^e>>1^e>>2^[0,238,180,90][3&e]}function x(e,t){let r,i,n;for(r=0;r<8;r++)i=t>>>24,t=t<<8&Re|e>>>24,e=e<<8&Re,n=i<<1,128&i&&(n^=333),t^=i^n<<16,n^=i>>>1,1&i&&(n^=166),t^=n<<24|n<<8;return t}function M(e,t){const r=t>>4,i=15&t,n=m[e][r^i],a=g[e][_[i]^k[r]];return v[e][_[a]^k[n]]<<4|w[e][n^a]}function C(e,t){let r=Te(e,0),i=Te(e,1),n=Te(e,2),a=Te(e,3);switch(f){case 4:r=A[1][r]^Te(t[3],0),i=A[0][i]^Te(t[3],1),n=A[0][n]^Te(t[3],2),a=A[1][a]^Te(t[3],3);case 3:r=A[1][r]^Te(t[2],0),i=A[1][i]^Te(t[2],1),n=A[0][n]^Te(t[2],2),a=A[0][a]^Te(t[2],3);case 2:r=A[0][A[0][r]^Te(t[1],0)]^Te(t[0],0),i=A[0][A[1][i]^Te(t[1],1)]^Te(t[0],1),n=A[1][A[0][n]^Te(t[1],2)]^Te(t[0],2),a=A[1][A[1][a]^Te(t[1],3)]^Te(t[0],3)}return S[0][r]^S[1][i]^S[2][n]^S[3][a]}for(e=e.slice(0,32),r=e.length;16!==r&&24!==r&&32!==r;)e[r++]=0;for(r=0;r<e.length;r+=4)d[r>>2]=Ue(e,r);for(r=0;r<256;r++)A[0][r]=M(0,r),A[1][r]=M(1,r);for(r=0;r<256;r++)p=A[1][r],y=E(p),b=P(p),S[0][r]=p+(y<<8)+(b<<16)+(b<<24),S[2][r]=y+(b<<8)+(p<<16)+(b<<24),p=A[0][r],y=E(p),b=P(p),S[1][r]=b+(b<<8)+(y<<16)+(p<<24),S[3][r]=y+(p<<8)+(b<<16)+(y<<24);for(f=d.length/2,r=0;r<f;r++)a=d[r+r],u[r]=a,s=d[r+r+1],h[r]=s,l[f-r-1]=x(a,s);for(r=0;r<40;r+=2)a=16843009*r,s=a+16843009,a=C(a,u),s=Ie(C(s,h),8),i[r]=a+s&Re,i[r+1]=Ie(a+2*s,9);for(r=0;r<256;r++)switch(a=s=o=c=r,f){case 4:a=A[1][a]^Te(l[3],0),s=A[0][s]^Te(l[3],1),o=A[0][o]^Te(l[3],2),c=A[1][c]^Te(l[3],3);case 3:a=A[1][a]^Te(l[2],0),s=A[1][s]^Te(l[2],1),o=A[0][o]^Te(l[2],2),c=A[0][c]^Te(l[2],3);case 2:n[0][r]=S[0][A[0][A[0][a]^Te(l[1],0)]^Te(l[0],0)],n[1][r]=S[1][A[0][A[1][s]^Te(l[1],1)]^Te(l[0],1)],n[2][r]=S[2][A[1][A[0][o]^Te(l[1],2)]^Te(l[0],2)],n[3][r]=S[3][A[1][A[1][c]^Te(l[1],3)]^Te(l[0],3)]}},close:function(){i=[],n=[[],[],[],[]]},encrypt:function(e,n){t=e,r=n;const a=[Ue(t,r)^i[0],Ue(t,r+4)^i[1],Ue(t,r+8)^i[2],Ue(t,r+12)^i[3]];for(let e=0;e<8;e++)o(e,a);return Be(t,r,a[2]^i[4]),Be(t,r+4,a[3]^i[5]),Be(t,r+8,a[0]^i[6]),Be(t,r+12,a[1]^i[7]),r+=16,t},decrypt:function(e,n){t=e,r=n;const a=[Ue(t,r)^i[4],Ue(t,r+4)^i[5],Ue(t,r+8)^i[6],Ue(t,r+12)^i[7]];for(let e=7;e>=0;e--)c(e,a);Be(t,r,a[2]^i[0]),Be(t,r+4,a[3]^i[1]),Be(t,r+8,a[0]^i[2]),Be(t,r+12,a[1]^i[3]),r+=16},finalize:function(){return t}}}(),this.tf.open(Array.from(e),0),this.encrypt=function(e){return this.tf.encrypt(Array.from(e),0)}}function qe(){}function Oe(e){this.bf=new qe,this.bf.init(e),this.encrypt=function(e){return this.bf.encryptBlock(e)}}ze.keySize=ze.prototype.keySize=32,ze.blockSize=ze.prototype.blockSize=16,qe.prototype.BLOCKSIZE=8,qe.prototype.SBOXES=[[3509652390,2564797868,805139163,3491422135,3101798381,1780907670,3128725573,4046225305,614570311,3012652279,134345442,2240740374,1667834072,1901547113,2757295779,4103290238,227898511,1921955416,1904987480,2182433518,2069144605,3260701109,2620446009,720527379,3318853667,677414384,3393288472,3101374703,2390351024,1614419982,1822297739,2954791486,3608508353,3174124327,2024746970,1432378464,3864339955,2857741204,1464375394,1676153920,1439316330,715854006,3033291828,289532110,2706671279,2087905683,3018724369,1668267050,732546397,1947742710,3462151702,2609353502,2950085171,1814351708,2050118529,680887927,999245976,1800124847,3300911131,1713906067,1641548236,4213287313,1216130144,1575780402,4018429277,3917837745,3693486850,3949271944,596196993,3549867205,258830323,2213823033,772490370,2760122372,1774776394,2652871518,566650946,4142492826,1728879713,2882767088,1783734482,3629395816,2517608232,2874225571,1861159788,326777828,3124490320,2130389656,2716951837,967770486,1724537150,2185432712,2364442137,1164943284,2105845187,998989502,3765401048,2244026483,1075463327,1455516326,1322494562,910128902,469688178,1117454909,936433444,3490320968,3675253459,1240580251,122909385,2157517691,634681816,4142456567,3825094682,3061402683,2540495037,79693498,3249098678,1084186820,1583128258,426386531,1761308591,1047286709,322548459,995290223,1845252383,2603652396,3431023940,2942221577,3202600964,3727903485,1712269319,422464435,3234572375,1170764815,3523960633,3117677531,1434042557,442511882,3600875718,1076654713,1738483198,4213154764,2393238008,3677496056,1014306527,4251020053,793779912,2902807211,842905082,4246964064,1395751752,1040244610,2656851899,3396308128,445077038,3742853595,3577915638,679411651,2892444358,2354009459,1767581616,3150600392,3791627101,3102740896,284835224,4246832056,1258075500,768725851,2589189241,3069724005,3532540348,1274779536,3789419226,2764799539,1660621633,3471099624,4011903706,913787905,3497959166,737222580,2514213453,2928710040,3937242737,1804850592,3499020752,2949064160,2386320175,2390070455,2415321851,4061277028,2290661394,2416832540,1336762016,1754252060,3520065937,3014181293,791618072,3188594551,3933548030,2332172193,3852520463,3043980520,413987798,3465142937,3030929376,4245938359,2093235073,3534596313,375366246,2157278981,2479649556,555357303,3870105701,2008414854,3344188149,4221384143,3956125452,2067696032,3594591187,2921233993,2428461,544322398,577241275,1471733935,610547355,4027169054,1432588573,1507829418,2025931657,3646575487,545086370,48609733,2200306550,1653985193,298326376,1316178497,3007786442,2064951626,458293330,2589141269,3591329599,3164325604,727753846,2179363840,146436021,1461446943,4069977195,705550613,3059967265,3887724982,4281599278,3313849956,1404054877,2845806497,146425753,1854211946],[1266315497,3048417604,3681880366,3289982499,290971e4,1235738493,2632868024,2414719590,3970600049,1771706367,1449415276,3266420449,422970021,1963543593,2690192192,3826793022,1062508698,1531092325,1804592342,2583117782,2714934279,4024971509,1294809318,4028980673,1289560198,2221992742,1669523910,35572830,157838143,1052438473,1016535060,1802137761,1753167236,1386275462,3080475397,2857371447,1040679964,2145300060,2390574316,1461121720,2956646967,4031777805,4028374788,33600511,2920084762,1018524850,629373528,3691585981,3515945977,2091462646,2486323059,586499841,988145025,935516892,3367335476,2599673255,2839830854,265290510,3972581182,2759138881,3795373465,1005194799,847297441,406762289,1314163512,1332590856,1866599683,4127851711,750260880,613907577,1450815602,3165620655,3734664991,3650291728,3012275730,3704569646,1427272223,778793252,1343938022,2676280711,2052605720,1946737175,3164576444,3914038668,3967478842,3682934266,1661551462,3294938066,4011595847,840292616,3712170807,616741398,312560963,711312465,1351876610,322626781,1910503582,271666773,2175563734,1594956187,70604529,3617834859,1007753275,1495573769,4069517037,2549218298,2663038764,504708206,2263041392,3941167025,2249088522,1514023603,1998579484,1312622330,694541497,2582060303,2151582166,1382467621,776784248,2618340202,3323268794,2497899128,2784771155,503983604,4076293799,907881277,423175695,432175456,1378068232,4145222326,3954048622,3938656102,3820766613,2793130115,2977904593,26017576,3274890735,3194772133,1700274565,1756076034,4006520079,3677328699,720338349,1533947780,354530856,688349552,3973924725,1637815568,332179504,3949051286,53804574,2852348879,3044236432,1282449977,3583942155,3416972820,4006381244,1617046695,2628476075,3002303598,1686838959,431878346,2686675385,1700445008,1080580658,1009431731,832498133,3223435511,2605976345,2271191193,2516031870,1648197032,4164389018,2548247927,300782431,375919233,238389289,3353747414,2531188641,2019080857,1475708069,455242339,2609103871,448939670,3451063019,1395535956,2413381860,1841049896,1491858159,885456874,4264095073,4001119347,1565136089,3898914787,1108368660,540939232,1173283510,2745871338,3681308437,4207628240,3343053890,4016749493,1699691293,1103962373,3625875870,2256883143,3830138730,1031889488,3479347698,1535977030,4236805024,3251091107,2132092099,1774941330,1199868427,1452454533,157007616,2904115357,342012276,595725824,1480756522,206960106,497939518,591360097,863170706,2375253569,3596610801,1814182875,2094937945,3421402208,1082520231,3463918190,2785509508,435703966,3908032597,1641649973,2842273706,3305899714,1510255612,2148256476,2655287854,3276092548,4258621189,236887753,3681803219,274041037,1734335097,3815195456,3317970021,1899903192,1026095262,4050517792,356393447,2410691914,3873677099,3682840055],[3913112168,2491498743,4132185628,2489919796,1091903735,1979897079,3170134830,3567386728,3557303409,857797738,1136121015,1342202287,507115054,2535736646,337727348,3213592640,1301675037,2528481711,1895095763,1721773893,3216771564,62756741,2142006736,835421444,2531993523,1442658625,3659876326,2882144922,676362277,1392781812,170690266,3921047035,1759253602,3611846912,1745797284,664899054,1329594018,3901205900,3045908486,2062866102,2865634940,3543621612,3464012697,1080764994,553557557,3656615353,3996768171,991055499,499776247,1265440854,648242737,3940784050,980351604,3713745714,1749149687,3396870395,4211799374,3640570775,1161844396,3125318951,1431517754,545492359,4268468663,3499529547,1437099964,2702547544,3433638243,2581715763,2787789398,1060185593,1593081372,2418618748,4260947970,69676912,2159744348,86519011,2512459080,3838209314,1220612927,3339683548,133810670,1090789135,1078426020,1569222167,845107691,3583754449,4072456591,1091646820,628848692,1613405280,3757631651,526609435,236106946,48312990,2942717905,3402727701,1797494240,859738849,992217954,4005476642,2243076622,3870952857,3732016268,765654824,3490871365,2511836413,1685915746,3888969200,1414112111,2273134842,3281911079,4080962846,172450625,2569994100,980381355,4109958455,2819808352,2716589560,2568741196,3681446669,3329971472,1835478071,660984891,3704678404,4045999559,3422617507,3040415634,1762651403,1719377915,3470491036,2693910283,3642056355,3138596744,1364962596,2073328063,1983633131,926494387,3423689081,2150032023,4096667949,1749200295,3328846651,309677260,2016342300,1779581495,3079819751,111262694,1274766160,443224088,298511866,1025883608,3806446537,1145181785,168956806,3641502830,3584813610,1689216846,3666258015,3200248200,1692713982,2646376535,4042768518,1618508792,1610833997,3523052358,4130873264,2001055236,3610705100,2202168115,4028541809,2961195399,1006657119,2006996926,3186142756,1430667929,3210227297,1314452623,4074634658,4101304120,2273951170,1399257539,3367210612,3027628629,1190975929,2062231137,2333990788,2221543033,2438960610,1181637006,548689776,2362791313,3372408396,3104550113,3145860560,296247880,1970579870,3078560182,3769228297,1714227617,3291629107,3898220290,166772364,1251581989,493813264,448347421,195405023,2709975567,677966185,3703036547,1463355134,2715995803,1338867538,1343315457,2802222074,2684532164,233230375,2599980071,2000651841,3277868038,1638401717,4028070440,3237316320,6314154,819756386,300326615,590932579,1405279636,3267499572,3150704214,2428286686,3959192993,3461946742,1862657033,1266418056,963775037,2089974820,2263052895,1917689273,448879540,3550394620,3981727096,150775221,3627908307,1303187396,508620638,2975983352,2726630617,1817252668,1876281319,1457606340,908771278,3720792119,3617206836,2455994898,1729034894,1080033504],[976866871,3556439503,2881648439,1522871579,1555064734,1336096578,3548522304,2579274686,3574697629,3205460757,3593280638,3338716283,3079412587,564236357,2993598910,1781952180,1464380207,3163844217,3332601554,1699332808,1393555694,1183702653,3581086237,1288719814,691649499,2847557200,2895455976,3193889540,2717570544,1781354906,1676643554,2592534050,3230253752,1126444790,2770207658,2633158820,2210423226,2615765581,2414155088,3127139286,673620729,2805611233,1269405062,4015350505,3341807571,4149409754,1057255273,2012875353,2162469141,2276492801,2601117357,993977747,3918593370,2654263191,753973209,36408145,2530585658,25011837,3520020182,2088578344,530523599,2918365339,1524020338,1518925132,3760827505,3759777254,1202760957,3985898139,3906192525,674977740,4174734889,2031300136,2019492241,3983892565,4153806404,3822280332,352677332,2297720250,60907813,90501309,3286998549,1016092578,2535922412,2839152426,457141659,509813237,4120667899,652014361,1966332200,2975202805,55981186,2327461051,676427537,3255491064,2882294119,3433927263,1307055953,942726286,933058658,2468411793,3933900994,4215176142,1361170020,2001714738,2830558078,3274259782,1222529897,1679025792,2729314320,3714953764,1770335741,151462246,3013232138,1682292957,1483529935,471910574,1539241949,458788160,3436315007,1807016891,3718408830,978976581,1043663428,3165965781,1927990952,4200891579,2372276910,3208408903,3533431907,1412390302,2931980059,4132332400,1947078029,3881505623,4168226417,2941484381,1077988104,1320477388,886195818,18198404,3786409e3,2509781533,112762804,3463356488,1866414978,891333506,18488651,661792760,1628790961,3885187036,3141171499,876946877,2693282273,1372485963,791857591,2686433993,3759982718,3167212022,3472953795,2716379847,445679433,3561995674,3504004811,3574258232,54117162,3331405415,2381918588,3769707343,4154350007,1140177722,4074052095,668550556,3214352940,367459370,261225585,2610173221,4209349473,3468074219,3265815641,314222801,3066103646,3808782860,282218597,3406013506,3773591054,379116347,1285071038,846784868,2669647154,3771962079,3550491691,2305946142,453669953,1268987020,3317592352,3279303384,3744833421,2610507566,3859509063,266596637,3847019092,517658769,3462560207,3443424879,370717030,4247526661,2224018117,4143653529,4112773975,2788324899,2477274417,1456262402,2901442914,1517677493,1846949527,2295493580,3734397586,2176403920,1280348187,1908823572,3871786941,846861322,1172426758,3287448474,3383383037,1655181056,3139813346,901632758,1897031941,2986607138,3066810236,3447102507,1393639104,373351379,950779232,625454576,3124240540,4148612726,2007998917,544563296,2244738638,2330496472,2058025392,1291430526,424198748,50039436,29584100,3605783033,2429876329,2791104160,1057563949,3255363231,3075367218,3463963227,1469046755,985887462]],qe.prototype.PARRAY=[608135816,2242054355,320440878,57701188,2752067618,698298832,137296536,3964562569,1160258022,953160567,3193202383,887688300,3232508343,3380367581,1065670069,3041331479,2450970073,2306472731],qe.prototype.NN=16,qe.prototype._clean=function(e){if(e<0){e=(2147483647&e)+2147483648}return e},qe.prototype._F=function(e){let t;const r=255&e,i=255&(e>>>=8),n=255&(e>>>=8),a=255&(e>>>=8);return t=this.sboxes[0][a]+this.sboxes[1][n],t^=this.sboxes[2][i],t+=this.sboxes[3][r],t},qe.prototype._encryptBlock=function(e){let t,r=e[0],i=e[1];for(t=0;t<this.NN;++t){r^=this.parray[t],i=this._F(r)^i;const e=r;r=i,i=e}r^=this.parray[this.NN+0],i^=this.parray[this.NN+1],e[0]=this._clean(i),e[1]=this._clean(r)},qe.prototype.encryptBlock=function(e){let t;const r=[0,0],i=this.BLOCKSIZE/2;for(t=0;t<this.BLOCKSIZE/2;++t)r[0]=r[0]<<8|255&e[t+0],r[1]=r[1]<<8|255&e[t+i];this._encryptBlock(r);const n=[];for(t=0;t<this.BLOCKSIZE/2;++t)n[t+0]=r[0]>>>24-8*t&255,n[t+i]=r[1]>>>24-8*t&255;return n},qe.prototype._decryptBlock=function(e){let t,r=e[0],i=e[1];for(t=this.NN+1;t>1;--t){r^=this.parray[t],i=this._F(r)^i;const e=r;r=i,i=e}r^=this.parray[1],i^=this.parray[0],e[0]=this._clean(i),e[1]=this._clean(r)},qe.prototype.init=function(e){let t,r=0;for(this.parray=[],t=0;t<this.NN+2;++t){let i=0;for(let t=0;t<4;++t)i=i<<8|255&e[r],++r>=e.length&&(r=0);this.parray[t]=this.PARRAY[t]^i}for(this.sboxes=[],t=0;t<4;++t)for(this.sboxes[t]=[],r=0;r<256;++r)this.sboxes[t][r]=this.SBOXES[t][r];const i=[0,0];for(t=0;t<this.NN+2;t+=2)this._encryptBlock(i),this.parray[t+0]=i[0],this.parray[t+1]=i[1];for(t=0;t<4;++t)for(r=0;r<256;r+=2)this._encryptBlock(i),this.sboxes[t][r+0]=i[0],this.sboxes[t][r+1]=i[1]},Oe.keySize=Oe.prototype.keySize=16,Oe.blockSize=Oe.prototype.blockSize=8;const Fe=Pe(128),Ne=Pe(192),Le=Pe(256);var je=/*#__PURE__*/Object.freeze({__proto__:null,aes128:Fe,aes192:Ne,aes256:Le,des:function(e){this.key=e,this.encrypt=function(e,t){return xe(Me(this.key),e,!0,0,null,t)},this.decrypt=function(e,t){return xe(Me(this.key),e,!1,0,null,t)}},tripledes:Ce,cast5:De,twofish:ze,blowfish:Oe,idea:function(){throw Error("IDEA symmetric-key algorithm not implemented")}}),We=function(e,t,r){"use asm";var i=0,n=0,a=0,s=0,o=0,c=0,u=0;var h=0,d=0,f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0;var v=new e.Uint8Array(r);function _(e,t,r,c,u,h,d,f,l,p,y,b,m,g,w,v){e=e|0;t=t|0;r=r|0;c=c|0;u=u|0;h=h|0;d=d|0;f=f|0;l=l|0;p=p|0;y=y|0;b=b|0;m=m|0;g=g|0;w=w|0;v=v|0;var _=0,k=0,A=0,S=0,E=0,P=0,x=0,M=0,C=0,K=0,D=0,R=0,I=0,U=0,B=0,T=0,z=0,q=0,O=0,F=0,N=0,L=0,j=0,W=0,H=0,G=0,V=0,$=0,Z=0,Y=0,X=0,Q=0,J=0,ee=0,te=0,re=0,ie=0,ne=0,ae=0,se=0,oe=0,ce=0,ue=0,he=0,de=0,fe=0,le=0,pe=0,ye=0,be=0,me=0,ge=0,we=0,ve=0,_e=0,ke=0,Ae=0,Se=0,Ee=0,Pe=0,xe=0,Me=0,Ce=0,Ke=0,De=0,Re=0,Ie=0,Ue=0,Be=0,Te=0,ze=0;_=i;k=n;A=a;S=s;E=o;x=e+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=t+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=r+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=c+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=u+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=h+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=d+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=f+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=l+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=p+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=y+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=b+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=m+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=g+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=w+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;x=v+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=g^l^r^e;M=P<<1|P>>>31;x=M+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=w^p^c^t;C=P<<1|P>>>31;x=C+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=v^y^u^r;K=P<<1|P>>>31;x=K+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=M^b^h^c;D=P<<1|P>>>31;x=D+(_<<5|_>>>27)+E+(k&A|~k&S)+0x5a827999|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=C^m^d^u;R=P<<1|P>>>31;x=R+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=K^g^f^h;I=P<<1|P>>>31;x=I+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=D^w^l^d;U=P<<1|P>>>31;x=U+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=R^v^p^f;B=P<<1|P>>>31;x=B+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=I^M^y^l;T=P<<1|P>>>31;x=T+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=U^C^b^p;z=P<<1|P>>>31;x=z+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=B^K^m^y;q=P<<1|P>>>31;x=q+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=T^D^g^b;O=P<<1|P>>>31;x=O+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=z^R^w^m;F=P<<1|P>>>31;x=F+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=q^I^v^g;N=P<<1|P>>>31;x=N+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=O^U^M^w;L=P<<1|P>>>31;x=L+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=F^B^C^v;j=P<<1|P>>>31;x=j+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=N^T^K^M;W=P<<1|P>>>31;x=W+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=L^z^D^C;H=P<<1|P>>>31;x=H+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=j^q^R^K;G=P<<1|P>>>31;x=G+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=W^O^I^D;V=P<<1|P>>>31;x=V+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=H^F^U^R;$=P<<1|P>>>31;x=$+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=G^N^B^I;Z=P<<1|P>>>31;x=Z+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=V^L^T^U;Y=P<<1|P>>>31;x=Y+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=$^j^z^B;X=P<<1|P>>>31;x=X+(_<<5|_>>>27)+E+(k^A^S)+0x6ed9eba1|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Z^W^q^T;Q=P<<1|P>>>31;x=Q+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Y^H^O^z;J=P<<1|P>>>31;x=J+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=X^G^F^q;ee=P<<1|P>>>31;x=ee+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Q^V^N^O;te=P<<1|P>>>31;x=te+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=J^$^L^F;re=P<<1|P>>>31;x=re+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ee^Z^j^N;ie=P<<1|P>>>31;x=ie+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=te^Y^W^L;ne=P<<1|P>>>31;x=ne+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=re^X^H^j;ae=P<<1|P>>>31;x=ae+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ie^Q^G^W;se=P<<1|P>>>31;x=se+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ne^J^V^H;oe=P<<1|P>>>31;x=oe+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ae^ee^$^G;ce=P<<1|P>>>31;x=ce+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=se^te^Z^V;ue=P<<1|P>>>31;x=ue+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=oe^re^Y^$;he=P<<1|P>>>31;x=he+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ce^ie^X^Z;de=P<<1|P>>>31;x=de+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ue^ne^Q^Y;fe=P<<1|P>>>31;x=fe+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=he^ae^J^X;le=P<<1|P>>>31;x=le+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=de^se^ee^Q;pe=P<<1|P>>>31;x=pe+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=fe^oe^te^J;ye=P<<1|P>>>31;x=ye+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=le^ce^re^ee;be=P<<1|P>>>31;x=be+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=pe^ue^ie^te;me=P<<1|P>>>31;x=me+(_<<5|_>>>27)+E+(k&A|k&S|A&S)-0x70e44324|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ye^he^ne^re;ge=P<<1|P>>>31;x=ge+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=be^de^ae^ie;we=P<<1|P>>>31;x=we+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=me^fe^se^ne;ve=P<<1|P>>>31;x=ve+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ge^le^oe^ae;_e=P<<1|P>>>31;x=_e+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=we^pe^ce^se;ke=P<<1|P>>>31;x=ke+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ve^ye^ue^oe;Ae=P<<1|P>>>31;x=Ae+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=_e^be^he^ce;Se=P<<1|P>>>31;x=Se+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=ke^me^de^ue;Ee=P<<1|P>>>31;x=Ee+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Ae^ge^fe^he;Pe=P<<1|P>>>31;x=Pe+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Se^we^le^de;xe=P<<1|P>>>31;x=xe+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Ee^ve^pe^fe;Me=P<<1|P>>>31;x=Me+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Pe^_e^ye^le;Ce=P<<1|P>>>31;x=Ce+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=xe^ke^be^pe;Ke=P<<1|P>>>31;x=Ke+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Me^Ae^me^ye;De=P<<1|P>>>31;x=De+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Ce^Se^ge^be;Re=P<<1|P>>>31;x=Re+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Ke^Ee^we^me;Ie=P<<1|P>>>31;x=Ie+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=De^Pe^ve^ge;Ue=P<<1|P>>>31;x=Ue+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Re^xe^_e^we;Be=P<<1|P>>>31;x=Be+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Ie^Me^ke^ve;Te=P<<1|P>>>31;x=Te+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;P=Ue^Ce^Ae^_e;ze=P<<1|P>>>31;x=ze+(_<<5|_>>>27)+E+(k^A^S)-0x359d3e2a|0;E=S;S=A;A=k<<30|k>>>2;k=_;_=x;i=i+_|0;n=n+k|0;a=a+A|0;s=s+S|0;o=o+E|0}function k(e){e=e|0;_(v[e|0]<<24|v[e|1]<<16|v[e|2]<<8|v[e|3],v[e|4]<<24|v[e|5]<<16|v[e|6]<<8|v[e|7],v[e|8]<<24|v[e|9]<<16|v[e|10]<<8|v[e|11],v[e|12]<<24|v[e|13]<<16|v[e|14]<<8|v[e|15],v[e|16]<<24|v[e|17]<<16|v[e|18]<<8|v[e|19],v[e|20]<<24|v[e|21]<<16|v[e|22]<<8|v[e|23],v[e|24]<<24|v[e|25]<<16|v[e|26]<<8|v[e|27],v[e|28]<<24|v[e|29]<<16|v[e|30]<<8|v[e|31],v[e|32]<<24|v[e|33]<<16|v[e|34]<<8|v[e|35],v[e|36]<<24|v[e|37]<<16|v[e|38]<<8|v[e|39],v[e|40]<<24|v[e|41]<<16|v[e|42]<<8|v[e|43],v[e|44]<<24|v[e|45]<<16|v[e|46]<<8|v[e|47],v[e|48]<<24|v[e|49]<<16|v[e|50]<<8|v[e|51],v[e|52]<<24|v[e|53]<<16|v[e|54]<<8|v[e|55],v[e|56]<<24|v[e|57]<<16|v[e|58]<<8|v[e|59],v[e|60]<<24|v[e|61]<<16|v[e|62]<<8|v[e|63])}function A(e){e=e|0;v[e|0]=i>>>24;v[e|1]=i>>>16&255;v[e|2]=i>>>8&255;v[e|3]=i&255;v[e|4]=n>>>24;v[e|5]=n>>>16&255;v[e|6]=n>>>8&255;v[e|7]=n&255;v[e|8]=a>>>24;v[e|9]=a>>>16&255;v[e|10]=a>>>8&255;v[e|11]=a&255;v[e|12]=s>>>24;v[e|13]=s>>>16&255;v[e|14]=s>>>8&255;v[e|15]=s&255;v[e|16]=o>>>24;v[e|17]=o>>>16&255;v[e|18]=o>>>8&255;v[e|19]=o&255}function S(){i=0x67452301;n=0xefcdab89;a=0x98badcfe;s=0x10325476;o=0xc3d2e1f0;c=u=0}function E(e,t,r,h,d,f,l){e=e|0;t=t|0;r=r|0;h=h|0;d=d|0;f=f|0;l=l|0;i=e;n=t;a=r;s=h;o=d;c=f;u=l}function P(e,t){e=e|0;t=t|0;var r=0;if(e&63)return-1;while((t|0)>=64){k(e);e=e+64|0;t=t-64|0;r=r+64|0}c=c+r|0;if(c>>>0<r>>>0)u=u+1|0;return r|0}function x(e,t,r){e=e|0;t=t|0;r=r|0;var i=0,n=0;if(e&63)return-1;if(~r)if(r&31)return-1;if((t|0)>=64){i=P(e,t)|0;if((i|0)==-1)return-1;e=e+i|0;t=t-i|0}i=i+t|0;c=c+t|0;if(c>>>0<t>>>0)u=u+1|0;v[e|t]=0x80;if((t|0)>=56){for(n=t+1|0;(n|0)<64;n=n+1|0)v[e|n]=0x00;k(e);t=0;v[e|0]=0}for(n=t+1|0;(n|0)<59;n=n+1|0)v[e|n]=0;v[e|56]=u>>>21&255;v[e|57]=u>>>13&255;v[e|58]=u>>>5&255;v[e|59]=u<<3&255|c>>>29;v[e|60]=c>>>21&255;v[e|61]=c>>>13&255;v[e|62]=c>>>5&255;v[e|63]=c<<3&255;k(e);if(~r)A(r);return i|0}function M(){i=h;n=d;a=f;s=l;o=p;c=64;u=0}function C(){i=y;n=b;a=m;s=g;o=w;c=64;u=0}function K(e,t,r,v,k,A,E,P,x,M,C,K,D,R,I,U){e=e|0;t=t|0;r=r|0;v=v|0;k=k|0;A=A|0;E=E|0;P=P|0;x=x|0;M=M|0;C=C|0;K=K|0;D=D|0;R=R|0;I=I|0;U=U|0;S();_(e^0x5c5c5c5c,t^0x5c5c5c5c,r^0x5c5c5c5c,v^0x5c5c5c5c,k^0x5c5c5c5c,A^0x5c5c5c5c,E^0x5c5c5c5c,P^0x5c5c5c5c,x^0x5c5c5c5c,M^0x5c5c5c5c,C^0x5c5c5c5c,K^0x5c5c5c5c,D^0x5c5c5c5c,R^0x5c5c5c5c,I^0x5c5c5c5c,U^0x5c5c5c5c);y=i;b=n;m=a;g=s;w=o;S();_(e^0x36363636,t^0x36363636,r^0x36363636,v^0x36363636,k^0x36363636,A^0x36363636,E^0x36363636,P^0x36363636,x^0x36363636,M^0x36363636,C^0x36363636,K^0x36363636,D^0x36363636,R^0x36363636,I^0x36363636,U^0x36363636);h=i;d=n;f=a;l=s;p=o;c=64;u=0}function D(e,t,r){e=e|0;t=t|0;r=r|0;var c=0,u=0,h=0,d=0,f=0,l=0;if(e&63)return-1;if(~r)if(r&31)return-1;l=x(e,t,-1)|0;c=i,u=n,h=a,d=s,f=o;C();_(c,u,h,d,f,0x80000000,0,0,0,0,0,0,0,0,0,672);if(~r)A(r);return l|0}function R(e,t,r,c,u){e=e|0;t=t|0;r=r|0;c=c|0;u=u|0;var h=0,d=0,f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0;if(e&63)return-1;if(~u)if(u&31)return-1;v[e+t|0]=r>>>24;v[e+t+1|0]=r>>>16&255;v[e+t+2|0]=r>>>8&255;v[e+t+3|0]=r&255;D(e,t+4|0,-1)|0;h=y=i,d=b=n,f=m=a,l=g=s,p=w=o;c=c-1|0;while((c|0)>0){M();_(y,b,m,g,w,0x80000000,0,0,0,0,0,0,0,0,0,672);y=i,b=n,m=a,g=s,w=o;C();_(y,b,m,g,w,0x80000000,0,0,0,0,0,0,0,0,0,672);y=i,b=n,m=a,g=s,w=o;h=h^i;d=d^n;f=f^a;l=l^s;p=p^o;c=c-1|0}i=h;n=d;a=f;s=l;o=p;if(~u)A(u);return 0}return{reset:S,init:E,process:P,finish:x,hmac_reset:M,hmac_init:K,hmac_finish:D,pbkdf2_generate_block:R}};class He{constructor(){this.pos=0,this.len=0}reset(){const{asm:e}=this.acquire_asm();return this.result=null,this.pos=0,this.len=0,e.reset(),this}process(e){if(null!==this.result)throw new we("state must be reset before processing new data");const{asm:t,heap:r}=this.acquire_asm();let i=this.pos,n=this.len,a=0,s=e.length,o=0;for(;s>0;)o=me(r,i+n,e,a,s),n+=o,a+=o,s-=o,o=t.process(i,n),i+=o,n-=o,n||(i=0);return this.pos=i,this.len=n,this}finish(){if(null!==this.result)throw new we("state must be reset before processing new data");const{asm:e,heap:t}=this.acquire_asm();return e.finish(this.pos,this.len,0),this.result=new Uint8Array(this.HASH_SIZE),this.result.set(t.subarray(0,this.HASH_SIZE)),this.pos=0,this.len=0,this.release_asm(),this}}const Ge=[],Ve=[];class $e extends He{constructor(){super(),this.NAME="sha1",this.BLOCK_SIZE=64,this.HASH_SIZE=20,this.acquire_asm()}acquire_asm(){return void 0!==this.heap&&void 0!==this.asm||(this.heap=Ge.pop()||be(),this.asm=Ve.pop()||We({Uint8Array},null,this.heap.buffer),this.reset()),{heap:this.heap,asm:this.asm}}release_asm(){void 0!==this.heap&&void 0!==this.asm&&(Ge.push(this.heap),Ve.push(this.asm)),this.heap=void 0,this.asm=void 0}static bytes(e){return(new $e).process(e).finish().result}}$e.NAME="sha1",$e.heap_pool=[],$e.asm_pool=[],$e.asm_function=We;const Ze=[],Ye=[];class Xe extends He{constructor(){super(),this.NAME="sha256",this.BLOCK_SIZE=64,this.HASH_SIZE=32,this.acquire_asm()}acquire_asm(){return void 0!==this.heap&&void 0!==this.asm||(this.heap=Ze.pop()||be(),this.asm=Ye.pop()||function(e,t,r){"use asm";var i=0,n=0,a=0,s=0,o=0,c=0,u=0,h=0,d=0,f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0,v=0,_=0,k=0,A=0,S=0,E=0,P=0,x=0,M=0,C=new e.Uint8Array(r);function K(e,t,r,d,f,l,p,y,b,m,g,w,v,_,k,A){e=e|0;t=t|0;r=r|0;d=d|0;f=f|0;l=l|0;p=p|0;y=y|0;b=b|0;m=m|0;g=g|0;w=w|0;v=v|0;_=_|0;k=k|0;A=A|0;var S=0,E=0,P=0,x=0,M=0,C=0,K=0,D=0;S=i;E=n;P=a;x=s;M=o;C=c;K=u;D=h;D=e+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0x428a2f98|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;K=t+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0x71374491|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;C=r+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0xb5c0fbcf|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;M=d+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0xe9b5dba5|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;x=f+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0x3956c25b|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;P=l+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0x59f111f1|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;E=p+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0x923f82a4|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;S=y+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0xab1c5ed5|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;D=b+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0xd807aa98|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;K=m+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0x12835b01|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;C=g+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0x243185be|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;M=w+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0x550c7dc3|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;x=v+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0x72be5d74|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;P=_+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0x80deb1fe|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;E=k+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0x9bdc06a7|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;S=A+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0xc19bf174|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;e=(t>>>7^t>>>18^t>>>3^t<<25^t<<14)+(k>>>17^k>>>19^k>>>10^k<<15^k<<13)+e+m|0;D=e+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0xe49b69c1|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;t=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(A>>>17^A>>>19^A>>>10^A<<15^A<<13)+t+g|0;K=t+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0xefbe4786|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;r=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+r+w|0;C=r+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0x0fc19dc6|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;d=(f>>>7^f>>>18^f>>>3^f<<25^f<<14)+(t>>>17^t>>>19^t>>>10^t<<15^t<<13)+d+v|0;M=d+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0x240ca1cc|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;f=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+f+_|0;x=f+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0x2de92c6f|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;l=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+l+k|0;P=l+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0x4a7484aa|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;p=(y>>>7^y>>>18^y>>>3^y<<25^y<<14)+(f>>>17^f>>>19^f>>>10^f<<15^f<<13)+p+A|0;E=p+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0x5cb0a9dc|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;y=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+y+e|0;S=y+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0x76f988da|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;b=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+b+t|0;D=b+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0x983e5152|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;m=(g>>>7^g>>>18^g>>>3^g<<25^g<<14)+(y>>>17^y>>>19^y>>>10^y<<15^y<<13)+m+r|0;K=m+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0xa831c66d|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;g=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+g+d|0;C=g+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0xb00327c8|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;w=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+w+f|0;M=w+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0xbf597fc7|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;v=(_>>>7^_>>>18^_>>>3^_<<25^_<<14)+(g>>>17^g>>>19^g>>>10^g<<15^g<<13)+v+l|0;x=v+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0xc6e00bf3|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;_=(k>>>7^k>>>18^k>>>3^k<<25^k<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+_+p|0;P=_+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0xd5a79147|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;k=(A>>>7^A>>>18^A>>>3^A<<25^A<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+k+y|0;E=k+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0x06ca6351|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;A=(e>>>7^e>>>18^e>>>3^e<<25^e<<14)+(_>>>17^_>>>19^_>>>10^_<<15^_<<13)+A+b|0;S=A+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0x14292967|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;e=(t>>>7^t>>>18^t>>>3^t<<25^t<<14)+(k>>>17^k>>>19^k>>>10^k<<15^k<<13)+e+m|0;D=e+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0x27b70a85|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;t=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(A>>>17^A>>>19^A>>>10^A<<15^A<<13)+t+g|0;K=t+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0x2e1b2138|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;r=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+r+w|0;C=r+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0x4d2c6dfc|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;d=(f>>>7^f>>>18^f>>>3^f<<25^f<<14)+(t>>>17^t>>>19^t>>>10^t<<15^t<<13)+d+v|0;M=d+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0x53380d13|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;f=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+f+_|0;x=f+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0x650a7354|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;l=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+l+k|0;P=l+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0x766a0abb|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;p=(y>>>7^y>>>18^y>>>3^y<<25^y<<14)+(f>>>17^f>>>19^f>>>10^f<<15^f<<13)+p+A|0;E=p+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0x81c2c92e|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;y=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+y+e|0;S=y+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0x92722c85|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;b=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+b+t|0;D=b+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0xa2bfe8a1|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;m=(g>>>7^g>>>18^g>>>3^g<<25^g<<14)+(y>>>17^y>>>19^y>>>10^y<<15^y<<13)+m+r|0;K=m+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0xa81a664b|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;g=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+g+d|0;C=g+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0xc24b8b70|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;w=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+w+f|0;M=w+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0xc76c51a3|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;v=(_>>>7^_>>>18^_>>>3^_<<25^_<<14)+(g>>>17^g>>>19^g>>>10^g<<15^g<<13)+v+l|0;x=v+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0xd192e819|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;_=(k>>>7^k>>>18^k>>>3^k<<25^k<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+_+p|0;P=_+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0xd6990624|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;k=(A>>>7^A>>>18^A>>>3^A<<25^A<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+k+y|0;E=k+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0xf40e3585|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;A=(e>>>7^e>>>18^e>>>3^e<<25^e<<14)+(_>>>17^_>>>19^_>>>10^_<<15^_<<13)+A+b|0;S=A+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0x106aa070|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;e=(t>>>7^t>>>18^t>>>3^t<<25^t<<14)+(k>>>17^k>>>19^k>>>10^k<<15^k<<13)+e+m|0;D=e+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0x19a4c116|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;t=(r>>>7^r>>>18^r>>>3^r<<25^r<<14)+(A>>>17^A>>>19^A>>>10^A<<15^A<<13)+t+g|0;K=t+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0x1e376c08|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;r=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+r+w|0;C=r+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0x2748774c|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;d=(f>>>7^f>>>18^f>>>3^f<<25^f<<14)+(t>>>17^t>>>19^t>>>10^t<<15^t<<13)+d+v|0;M=d+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0x34b0bcb5|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;f=(l>>>7^l>>>18^l>>>3^l<<25^l<<14)+(r>>>17^r>>>19^r>>>10^r<<15^r<<13)+f+_|0;x=f+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0x391c0cb3|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;l=(p>>>7^p>>>18^p>>>3^p<<25^p<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+l+k|0;P=l+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0x4ed8aa4a|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;p=(y>>>7^y>>>18^y>>>3^y<<25^y<<14)+(f>>>17^f>>>19^f>>>10^f<<15^f<<13)+p+A|0;E=p+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0x5b9cca4f|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;y=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(l>>>17^l>>>19^l>>>10^l<<15^l<<13)+y+e|0;S=y+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0x682e6ff3|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;b=(m>>>7^m>>>18^m>>>3^m<<25^m<<14)+(p>>>17^p>>>19^p>>>10^p<<15^p<<13)+b+t|0;D=b+D+(M>>>6^M>>>11^M>>>25^M<<26^M<<21^M<<7)+(K^M&(C^K))+0x748f82ee|0;x=x+D|0;D=D+(S&E^P&(S^E))+(S>>>2^S>>>13^S>>>22^S<<30^S<<19^S<<10)|0;m=(g>>>7^g>>>18^g>>>3^g<<25^g<<14)+(y>>>17^y>>>19^y>>>10^y<<15^y<<13)+m+r|0;K=m+K+(x>>>6^x>>>11^x>>>25^x<<26^x<<21^x<<7)+(C^x&(M^C))+0x78a5636f|0;P=P+K|0;K=K+(D&S^E&(D^S))+(D>>>2^D>>>13^D>>>22^D<<30^D<<19^D<<10)|0;g=(w>>>7^w>>>18^w>>>3^w<<25^w<<14)+(b>>>17^b>>>19^b>>>10^b<<15^b<<13)+g+d|0;C=g+C+(P>>>6^P>>>11^P>>>25^P<<26^P<<21^P<<7)+(M^P&(x^M))+0x84c87814|0;E=E+C|0;C=C+(K&D^S&(K^D))+(K>>>2^K>>>13^K>>>22^K<<30^K<<19^K<<10)|0;w=(v>>>7^v>>>18^v>>>3^v<<25^v<<14)+(m>>>17^m>>>19^m>>>10^m<<15^m<<13)+w+f|0;M=w+M+(E>>>6^E>>>11^E>>>25^E<<26^E<<21^E<<7)+(x^E&(P^x))+0x8cc70208|0;S=S+M|0;M=M+(C&K^D&(C^K))+(C>>>2^C>>>13^C>>>22^C<<30^C<<19^C<<10)|0;v=(_>>>7^_>>>18^_>>>3^_<<25^_<<14)+(g>>>17^g>>>19^g>>>10^g<<15^g<<13)+v+l|0;x=v+x+(S>>>6^S>>>11^S>>>25^S<<26^S<<21^S<<7)+(P^S&(E^P))+0x90befffa|0;D=D+x|0;x=x+(M&C^K&(M^C))+(M>>>2^M>>>13^M>>>22^M<<30^M<<19^M<<10)|0;_=(k>>>7^k>>>18^k>>>3^k<<25^k<<14)+(w>>>17^w>>>19^w>>>10^w<<15^w<<13)+_+p|0;P=_+P+(D>>>6^D>>>11^D>>>25^D<<26^D<<21^D<<7)+(E^D&(S^E))+0xa4506ceb|0;K=K+P|0;P=P+(x&M^C&(x^M))+(x>>>2^x>>>13^x>>>22^x<<30^x<<19^x<<10)|0;k=(A>>>7^A>>>18^A>>>3^A<<25^A<<14)+(v>>>17^v>>>19^v>>>10^v<<15^v<<13)+k+y|0;E=k+E+(K>>>6^K>>>11^K>>>25^K<<26^K<<21^K<<7)+(S^K&(D^S))+0xbef9a3f7|0;C=C+E|0;E=E+(P&x^M&(P^x))+(P>>>2^P>>>13^P>>>22^P<<30^P<<19^P<<10)|0;A=(e>>>7^e>>>18^e>>>3^e<<25^e<<14)+(_>>>17^_>>>19^_>>>10^_<<15^_<<13)+A+b|0;S=A+S+(C>>>6^C>>>11^C>>>25^C<<26^C<<21^C<<7)+(D^C&(K^D))+0xc67178f2|0;M=M+S|0;S=S+(E&P^x&(E^P))+(E>>>2^E>>>13^E>>>22^E<<30^E<<19^E<<10)|0;i=i+S|0;n=n+E|0;a=a+P|0;s=s+x|0;o=o+M|0;c=c+C|0;u=u+K|0;h=h+D|0}function D(e){e=e|0;K(C[e|0]<<24|C[e|1]<<16|C[e|2]<<8|C[e|3],C[e|4]<<24|C[e|5]<<16|C[e|6]<<8|C[e|7],C[e|8]<<24|C[e|9]<<16|C[e|10]<<8|C[e|11],C[e|12]<<24|C[e|13]<<16|C[e|14]<<8|C[e|15],C[e|16]<<24|C[e|17]<<16|C[e|18]<<8|C[e|19],C[e|20]<<24|C[e|21]<<16|C[e|22]<<8|C[e|23],C[e|24]<<24|C[e|25]<<16|C[e|26]<<8|C[e|27],C[e|28]<<24|C[e|29]<<16|C[e|30]<<8|C[e|31],C[e|32]<<24|C[e|33]<<16|C[e|34]<<8|C[e|35],C[e|36]<<24|C[e|37]<<16|C[e|38]<<8|C[e|39],C[e|40]<<24|C[e|41]<<16|C[e|42]<<8|C[e|43],C[e|44]<<24|C[e|45]<<16|C[e|46]<<8|C[e|47],C[e|48]<<24|C[e|49]<<16|C[e|50]<<8|C[e|51],C[e|52]<<24|C[e|53]<<16|C[e|54]<<8|C[e|55],C[e|56]<<24|C[e|57]<<16|C[e|58]<<8|C[e|59],C[e|60]<<24|C[e|61]<<16|C[e|62]<<8|C[e|63])}function R(e){e=e|0;C[e|0]=i>>>24;C[e|1]=i>>>16&255;C[e|2]=i>>>8&255;C[e|3]=i&255;C[e|4]=n>>>24;C[e|5]=n>>>16&255;C[e|6]=n>>>8&255;C[e|7]=n&255;C[e|8]=a>>>24;C[e|9]=a>>>16&255;C[e|10]=a>>>8&255;C[e|11]=a&255;C[e|12]=s>>>24;C[e|13]=s>>>16&255;C[e|14]=s>>>8&255;C[e|15]=s&255;C[e|16]=o>>>24;C[e|17]=o>>>16&255;C[e|18]=o>>>8&255;C[e|19]=o&255;C[e|20]=c>>>24;C[e|21]=c>>>16&255;C[e|22]=c>>>8&255;C[e|23]=c&255;C[e|24]=u>>>24;C[e|25]=u>>>16&255;C[e|26]=u>>>8&255;C[e|27]=u&255;C[e|28]=h>>>24;C[e|29]=h>>>16&255;C[e|30]=h>>>8&255;C[e|31]=h&255}function I(){i=0x6a09e667;n=0xbb67ae85;a=0x3c6ef372;s=0xa54ff53a;o=0x510e527f;c=0x9b05688c;u=0x1f83d9ab;h=0x5be0cd19;d=f=0}function U(e,t,r,l,p,y,b,m,g,w){e=e|0;t=t|0;r=r|0;l=l|0;p=p|0;y=y|0;b=b|0;m=m|0;g=g|0;w=w|0;i=e;n=t;a=r;s=l;o=p;c=y;u=b;h=m;d=g;f=w}function B(e,t){e=e|0;t=t|0;var r=0;if(e&63)return-1;while((t|0)>=64){D(e);e=e+64|0;t=t-64|0;r=r+64|0}d=d+r|0;if(d>>>0<r>>>0)f=f+1|0;return r|0}function T(e,t,r){e=e|0;t=t|0;r=r|0;var i=0,n=0;if(e&63)return-1;if(~r)if(r&31)return-1;if((t|0)>=64){i=B(e,t)|0;if((i|0)==-1)return-1;e=e+i|0;t=t-i|0}i=i+t|0;d=d+t|0;if(d>>>0<t>>>0)f=f+1|0;C[e|t]=0x80;if((t|0)>=56){for(n=t+1|0;(n|0)<64;n=n+1|0)C[e|n]=0x00;D(e);t=0;C[e|0]=0}for(n=t+1|0;(n|0)<59;n=n+1|0)C[e|n]=0;C[e|56]=f>>>21&255;C[e|57]=f>>>13&255;C[e|58]=f>>>5&255;C[e|59]=f<<3&255|d>>>29;C[e|60]=d>>>21&255;C[e|61]=d>>>13&255;C[e|62]=d>>>5&255;C[e|63]=d<<3&255;D(e);if(~r)R(r);return i|0}function z(){i=l;n=p;a=y;s=b;o=m;c=g;u=w;h=v;d=64;f=0}function q(){i=_;n=k;a=A;s=S;o=E;c=P;u=x;h=M;d=64;f=0}function O(e,t,r,C,D,R,U,B,T,z,q,O,F,N,L,j){e=e|0;t=t|0;r=r|0;C=C|0;D=D|0;R=R|0;U=U|0;B=B|0;T=T|0;z=z|0;q=q|0;O=O|0;F=F|0;N=N|0;L=L|0;j=j|0;I();K(e^0x5c5c5c5c,t^0x5c5c5c5c,r^0x5c5c5c5c,C^0x5c5c5c5c,D^0x5c5c5c5c,R^0x5c5c5c5c,U^0x5c5c5c5c,B^0x5c5c5c5c,T^0x5c5c5c5c,z^0x5c5c5c5c,q^0x5c5c5c5c,O^0x5c5c5c5c,F^0x5c5c5c5c,N^0x5c5c5c5c,L^0x5c5c5c5c,j^0x5c5c5c5c);_=i;k=n;A=a;S=s;E=o;P=c;x=u;M=h;I();K(e^0x36363636,t^0x36363636,r^0x36363636,C^0x36363636,D^0x36363636,R^0x36363636,U^0x36363636,B^0x36363636,T^0x36363636,z^0x36363636,q^0x36363636,O^0x36363636,F^0x36363636,N^0x36363636,L^0x36363636,j^0x36363636);l=i;p=n;y=a;b=s;m=o;g=c;w=u;v=h;d=64;f=0}function F(e,t,r){e=e|0;t=t|0;r=r|0;var d=0,f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0;if(e&63)return-1;if(~r)if(r&31)return-1;w=T(e,t,-1)|0;d=i,f=n,l=a,p=s,y=o,b=c,m=u,g=h;q();K(d,f,l,p,y,b,m,g,0x80000000,0,0,0,0,0,0,768);if(~r)R(r);return w|0}function N(e,t,r,d,f){e=e|0;t=t|0;r=r|0;d=d|0;f=f|0;var l=0,p=0,y=0,b=0,m=0,g=0,w=0,v=0,_=0,k=0,A=0,S=0,E=0,P=0,x=0,M=0;if(e&63)return-1;if(~f)if(f&31)return-1;C[e+t|0]=r>>>24;C[e+t+1|0]=r>>>16&255;C[e+t+2|0]=r>>>8&255;C[e+t+3|0]=r&255;F(e,t+4|0,-1)|0;l=_=i,p=k=n,y=A=a,b=S=s,m=E=o,g=P=c,w=x=u,v=M=h;d=d-1|0;while((d|0)>0){z();K(_,k,A,S,E,P,x,M,0x80000000,0,0,0,0,0,0,768);_=i,k=n,A=a,S=s,E=o,P=c,x=u,M=h;q();K(_,k,A,S,E,P,x,M,0x80000000,0,0,0,0,0,0,768);_=i,k=n,A=a,S=s,E=o,P=c,x=u,M=h;l=l^i;p=p^n;y=y^a;b=b^s;m=m^o;g=g^c;w=w^u;v=v^h;d=d-1|0}i=l;n=p;a=y;s=b;o=m;c=g;u=w;h=v;if(~f)R(f);return 0}return{reset:I,init:U,process:B,finish:T,hmac_reset:z,hmac_init:O,hmac_finish:F,pbkdf2_generate_block:N}}({Uint8Array},null,this.heap.buffer),this.reset()),{heap:this.heap,asm:this.asm}}release_asm(){void 0!==this.heap&&void 0!==this.asm&&(Ze.push(this.heap),Ye.push(this.asm)),this.heap=void 0,this.asm=void 0}static bytes(e){return(new Xe).process(e).finish().result}}Xe.NAME="sha256";var Qe=Je;function Je(e,t){if(!e)throw Error(t||"Assertion failed")}Je.equal=function(e,t,r){if(e!=t)throw Error(r||"Assertion failed: "+e+" != "+t)};var et=void 0!==t?t:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function tt(e,t){return e(t={exports:{}},t.exports),t.exports}var rt=tt((function(e){e.exports="function"==typeof Object.create?function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:function(e,t){e.super_=t;var r=function(){};r.prototype=t.prototype,e.prototype=new r,e.prototype.constructor=e}}));function it(e){return(e>>>24|e>>>8&65280|e<<8&16711680|(255&e)<<24)>>>0}function nt(e){return 1===e.length?"0"+e:e}function at(e){return 7===e.length?"0"+e:6===e.length?"00"+e:5===e.length?"000"+e:4===e.length?"0000"+e:3===e.length?"00000"+e:2===e.length?"000000"+e:1===e.length?"0000000"+e:e}var st={inherits:rt,toArray:function(e,t){if(Array.isArray(e))return e.slice();if(!e)return[];var r=[];if("string"==typeof e)if(t){if("hex"===t)for((e=e.replace(/[^a-z0-9]+/gi,"")).length%2!=0&&(e="0"+e),i=0;i<e.length;i+=2)r.push(parseInt(e[i]+e[i+1],16))}else for(var i=0;i<e.length;i++){var n=e.charCodeAt(i),a=n>>8,s=255&n;a?r.push(a,s):r.push(s)}else for(i=0;i<e.length;i++)r[i]=0|e[i];return r},toHex:function(e){for(var t="",r=0;r<e.length;r++)t+=nt(e[r].toString(16));return t},htonl:it,toHex32:function(e,t){for(var r="",i=0;i<e.length;i++){var n=e[i];"little"===t&&(n=it(n)),r+=at(n.toString(16))}return r},zero2:nt,zero8:at,join32:function(e,t,r,i){var n=r-t;Qe(n%4==0);for(var a=Array(n/4),s=0,o=t;s<a.length;s++,o+=4){var c;c="big"===i?e[o]<<24|e[o+1]<<16|e[o+2]<<8|e[o+3]:e[o+3]<<24|e[o+2]<<16|e[o+1]<<8|e[o],a[s]=c>>>0}return a},split32:function(e,t){for(var r=Array(4*e.length),i=0,n=0;i<e.length;i++,n+=4){var a=e[i];"big"===t?(r[n]=a>>>24,r[n+1]=a>>>16&255,r[n+2]=a>>>8&255,r[n+3]=255&a):(r[n+3]=a>>>24,r[n+2]=a>>>16&255,r[n+1]=a>>>8&255,r[n]=255&a)}return r},rotr32:function(e,t){return e>>>t|e<<32-t},rotl32:function(e,t){return e<<t|e>>>32-t},sum32:function(e,t){return e+t>>>0},sum32_3:function(e,t,r){return e+t+r>>>0},sum32_4:function(e,t,r,i){return e+t+r+i>>>0},sum32_5:function(e,t,r,i,n){return e+t+r+i+n>>>0},sum64:function(e,t,r,i){var n=e[t],a=i+e[t+1]>>>0,s=(a<i?1:0)+r+n;e[t]=s>>>0,e[t+1]=a},sum64_hi:function(e,t,r,i){return(t+i>>>0<t?1:0)+e+r>>>0},sum64_lo:function(e,t,r,i){return t+i>>>0},sum64_4_hi:function(e,t,r,i,n,a,s,o){var c=0,u=t;return c+=(u=u+i>>>0)<t?1:0,c+=(u=u+a>>>0)<a?1:0,e+r+n+s+(c+=(u=u+o>>>0)<o?1:0)>>>0},sum64_4_lo:function(e,t,r,i,n,a,s,o){return t+i+a+o>>>0},sum64_5_hi:function(e,t,r,i,n,a,s,o,c,u){var h=0,d=t;return h+=(d=d+i>>>0)<t?1:0,h+=(d=d+a>>>0)<a?1:0,h+=(d=d+o>>>0)<o?1:0,e+r+n+s+c+(h+=(d=d+u>>>0)<u?1:0)>>>0},sum64_5_lo:function(e,t,r,i,n,a,s,o,c,u){return t+i+a+o+u>>>0},rotr64_hi:function(e,t,r){return(t<<32-r|e>>>r)>>>0},rotr64_lo:function(e,t,r){return(e<<32-r|t>>>r)>>>0},shr64_hi:function(e,t,r){return e>>>r},shr64_lo:function(e,t,r){return(e<<32-r|t>>>r)>>>0}};function ot(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian="big",this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}var ct=ot;ot.prototype.update=function(e,t){if(e=st.toArray(e,t),this.pending?this.pending=this.pending.concat(e):this.pending=e,this.pendingTotal+=e.length,this.pending.length>=this._delta8){var r=(e=this.pending).length%this._delta8;this.pending=e.slice(e.length-r,e.length),0===this.pending.length&&(this.pending=null),e=st.join32(e,0,e.length-r,this.endian);for(var i=0;i<e.length;i+=this._delta32)this._update(e,i,i+this._delta32)}return this},ot.prototype.digest=function(e){return this.update(this._pad()),Qe(null===this.pending),this._digest(e)},ot.prototype._pad=function(){var e=this.pendingTotal,t=this._delta8,r=t-(e+this.padLength)%t,i=Array(r+this.padLength);i[0]=128;for(var n=1;n<r;n++)i[n]=0;if(e<<=3,"big"===this.endian){for(var a=8;a<this.padLength;a++)i[n++]=0;i[n++]=0,i[n++]=0,i[n++]=0,i[n++]=0,i[n++]=e>>>24&255,i[n++]=e>>>16&255,i[n++]=e>>>8&255,i[n++]=255&e}else for(i[n++]=255&e,i[n++]=e>>>8&255,i[n++]=e>>>16&255,i[n++]=e>>>24&255,i[n++]=0,i[n++]=0,i[n++]=0,i[n++]=0,a=8;a<this.padLength;a++)i[n++]=0;return i};var ut={BlockHash:ct},ht=st.rotr32;function dt(e,t,r){return e&t^~e&r}function ft(e,t,r){return e&t^e&r^t&r}function lt(e,t,r){return e^t^r}var pt={ft_1:function(e,t,r,i){return 0===e?dt(t,r,i):1===e||3===e?lt(t,r,i):2===e?ft(t,r,i):void 0},ch32:dt,maj32:ft,p32:lt,s0_256:function(e){return ht(e,2)^ht(e,13)^ht(e,22)},s1_256:function(e){return ht(e,6)^ht(e,11)^ht(e,25)},g0_256:function(e){return ht(e,7)^ht(e,18)^e>>>3},g1_256:function(e){return ht(e,17)^ht(e,19)^e>>>10}},yt=st.sum32,bt=st.sum32_4,mt=st.sum32_5,gt=pt.ch32,wt=pt.maj32,vt=pt.s0_256,_t=pt.s1_256,kt=pt.g0_256,At=pt.g1_256,St=ut.BlockHash,Et=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];function Pt(){if(!(this instanceof Pt))return new Pt;St.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=Et,this.W=Array(64)}st.inherits(Pt,St);var xt=Pt;function Mt(){if(!(this instanceof Mt))return new Mt;xt.call(this),this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]}Pt.blockSize=512,Pt.outSize=256,Pt.hmacStrength=192,Pt.padLength=64,Pt.prototype._update=function(e,t){for(var r=this.W,i=0;i<16;i++)r[i]=e[t+i];for(;i<r.length;i++)r[i]=bt(At(r[i-2]),r[i-7],kt(r[i-15]),r[i-16]);var n=this.h[0],a=this.h[1],s=this.h[2],o=this.h[3],c=this.h[4],u=this.h[5],h=this.h[6],d=this.h[7];for(Qe(this.k.length===r.length),i=0;i<r.length;i++){var f=mt(d,_t(c),gt(c,u,h),this.k[i],r[i]),l=yt(vt(n),wt(n,a,s));d=h,h=u,u=c,c=yt(o,f),o=s,s=a,a=n,n=yt(f,l)}this.h[0]=yt(this.h[0],n),this.h[1]=yt(this.h[1],a),this.h[2]=yt(this.h[2],s),this.h[3]=yt(this.h[3],o),this.h[4]=yt(this.h[4],c),this.h[5]=yt(this.h[5],u),this.h[6]=yt(this.h[6],h),this.h[7]=yt(this.h[7],d)},Pt.prototype._digest=function(e){return"hex"===e?st.toHex32(this.h,"big"):st.split32(this.h,"big")},st.inherits(Mt,xt);var Ct=Mt;Mt.blockSize=512,Mt.outSize=224,Mt.hmacStrength=192,Mt.padLength=64,Mt.prototype._digest=function(e){return"hex"===e?st.toHex32(this.h.slice(0,7),"big"):st.split32(this.h.slice(0,7),"big")};var Kt=st.rotr64_hi,Dt=st.rotr64_lo,Rt=st.shr64_hi,It=st.shr64_lo,Ut=st.sum64,Bt=st.sum64_hi,Tt=st.sum64_lo,zt=st.sum64_4_hi,qt=st.sum64_4_lo,Ot=st.sum64_5_hi,Ft=st.sum64_5_lo,Nt=ut.BlockHash,Lt=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function jt(){if(!(this instanceof jt))return new jt;Nt.call(this),this.h=[1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209],this.k=Lt,this.W=Array(160)}st.inherits(jt,Nt);var Wt=jt;function Ht(e,t,r,i,n){var a=e&r^~e&n;return a<0&&(a+=4294967296),a}function Gt(e,t,r,i,n,a){var s=t&i^~t&a;return s<0&&(s+=4294967296),s}function Vt(e,t,r,i,n){var a=e&r^e&n^r&n;return a<0&&(a+=4294967296),a}function $t(e,t,r,i,n,a){var s=t&i^t&a^i&a;return s<0&&(s+=4294967296),s}function Zt(e,t){var r=Kt(e,t,28)^Kt(t,e,2)^Kt(t,e,7);return r<0&&(r+=4294967296),r}function Yt(e,t){var r=Dt(e,t,28)^Dt(t,e,2)^Dt(t,e,7);return r<0&&(r+=4294967296),r}function Xt(e,t){var r=Kt(e,t,14)^Kt(e,t,18)^Kt(t,e,9);return r<0&&(r+=4294967296),r}function Qt(e,t){var r=Dt(e,t,14)^Dt(e,t,18)^Dt(t,e,9);return r<0&&(r+=4294967296),r}function Jt(e,t){var r=Kt(e,t,1)^Kt(e,t,8)^Rt(e,t,7);return r<0&&(r+=4294967296),r}function er(e,t){var r=Dt(e,t,1)^Dt(e,t,8)^It(e,t,7);return r<0&&(r+=4294967296),r}function tr(e,t){var r=Kt(e,t,19)^Kt(t,e,29)^Rt(e,t,6);return r<0&&(r+=4294967296),r}function rr(e,t){var r=Dt(e,t,19)^Dt(t,e,29)^It(e,t,6);return r<0&&(r+=4294967296),r}function ir(){if(!(this instanceof ir))return new ir;Wt.call(this),this.h=[3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]}jt.blockSize=1024,jt.outSize=512,jt.hmacStrength=192,jt.padLength=128,jt.prototype._prepareBlock=function(e,t){for(var r=this.W,i=0;i<32;i++)r[i]=e[t+i];for(;i<r.length;i+=2){var n=tr(r[i-4],r[i-3]),a=rr(r[i-4],r[i-3]),s=r[i-14],o=r[i-13],c=Jt(r[i-30],r[i-29]),u=er(r[i-30],r[i-29]),h=r[i-32],d=r[i-31];r[i]=zt(n,a,s,o,c,u,h,d),r[i+1]=qt(n,a,s,o,c,u,h,d)}},jt.prototype._update=function(e,t){this._prepareBlock(e,t);var r=this.W,i=this.h[0],n=this.h[1],a=this.h[2],s=this.h[3],o=this.h[4],c=this.h[5],u=this.h[6],h=this.h[7],d=this.h[8],f=this.h[9],l=this.h[10],p=this.h[11],y=this.h[12],b=this.h[13],m=this.h[14],g=this.h[15];Qe(this.k.length===r.length);for(var w=0;w<r.length;w+=2){var v=m,_=g,k=Xt(d,f),A=Qt(d,f),S=Ht(d,f,l,p,y),E=Gt(d,f,l,p,y,b),P=this.k[w],x=this.k[w+1],M=r[w],C=r[w+1],K=Ot(v,_,k,A,S,E,P,x,M,C),D=Ft(v,_,k,A,S,E,P,x,M,C);v=Zt(i,n),_=Yt(i,n),k=Vt(i,n,a,s,o),A=$t(i,n,a,s,o,c);var R=Bt(v,_,k,A),I=Tt(v,_,k,A);m=y,g=b,y=l,b=p,l=d,p=f,d=Bt(u,h,K,D),f=Tt(h,h,K,D),u=o,h=c,o=a,c=s,a=i,s=n,i=Bt(K,D,R,I),n=Tt(K,D,R,I)}Ut(this.h,0,i,n),Ut(this.h,2,a,s),Ut(this.h,4,o,c),Ut(this.h,6,u,h),Ut(this.h,8,d,f),Ut(this.h,10,l,p),Ut(this.h,12,y,b),Ut(this.h,14,m,g)},jt.prototype._digest=function(e){return"hex"===e?st.toHex32(this.h,"big"):st.split32(this.h,"big")},st.inherits(ir,Wt);var nr=ir;ir.blockSize=1024,ir.outSize=384,ir.hmacStrength=192,ir.padLength=128,ir.prototype._digest=function(e){return"hex"===e?st.toHex32(this.h.slice(0,12),"big"):st.split32(this.h.slice(0,12),"big")};var ar=st.rotl32,sr=st.sum32,or=st.sum32_3,cr=st.sum32_4,ur=ut.BlockHash;function hr(){if(!(this instanceof hr))return new hr;ur.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.endian="little"}st.inherits(hr,ur);var dr=hr;function fr(e,t,r,i){return e<=15?t^r^i:e<=31?t&r|~t&i:e<=47?(t|~r)^i:e<=63?t&i|r&~i:t^(r|~i)}function lr(e){return e<=15?0:e<=31?1518500249:e<=47?1859775393:e<=63?2400959708:2840853838}function pr(e){return e<=15?1352829926:e<=31?1548603684:e<=47?1836072691:e<=63?2053994217:0}hr.blockSize=512,hr.outSize=160,hr.hmacStrength=192,hr.padLength=64,hr.prototype._update=function(e,t){for(var r=this.h[0],i=this.h[1],n=this.h[2],a=this.h[3],s=this.h[4],o=r,c=i,u=n,h=a,d=s,f=0;f<80;f++){var l=sr(ar(cr(r,fr(f,i,n,a),e[yr[f]+t],lr(f)),mr[f]),s);r=s,s=a,a=ar(n,10),n=i,i=l,l=sr(ar(cr(o,fr(79-f,c,u,h),e[br[f]+t],pr(f)),gr[f]),d),o=d,d=h,h=ar(u,10),u=c,c=l}l=or(this.h[1],n,h),this.h[1]=or(this.h[2],a,d),this.h[2]=or(this.h[3],s,o),this.h[3]=or(this.h[4],r,c),this.h[4]=or(this.h[0],i,u),this.h[0]=l},hr.prototype._digest=function(e){return"hex"===e?st.toHex32(this.h,"little"):st.split32(this.h,"little")};var yr=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],br=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],mr=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],gr=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],wr={ripemd160:dr};function vr(e,t){let r=e[0],i=e[1],n=e[2],a=e[3];r=kr(r,i,n,a,t[0],7,-680876936),a=kr(a,r,i,n,t[1],12,-389564586),n=kr(n,a,r,i,t[2],17,606105819),i=kr(i,n,a,r,t[3],22,-1044525330),r=kr(r,i,n,a,t[4],7,-176418897),a=kr(a,r,i,n,t[5],12,1200080426),n=kr(n,a,r,i,t[6],17,-1473231341),i=kr(i,n,a,r,t[7],22,-45705983),r=kr(r,i,n,a,t[8],7,1770035416),a=kr(a,r,i,n,t[9],12,-1958414417),n=kr(n,a,r,i,t[10],17,-42063),i=kr(i,n,a,r,t[11],22,-1990404162),r=kr(r,i,n,a,t[12],7,1804603682),a=kr(a,r,i,n,t[13],12,-40341101),n=kr(n,a,r,i,t[14],17,-1502002290),i=kr(i,n,a,r,t[15],22,1236535329),r=Ar(r,i,n,a,t[1],5,-165796510),a=Ar(a,r,i,n,t[6],9,-1069501632),n=Ar(n,a,r,i,t[11],14,643717713),i=Ar(i,n,a,r,t[0],20,-373897302),r=Ar(r,i,n,a,t[5],5,-701558691),a=Ar(a,r,i,n,t[10],9,38016083),n=Ar(n,a,r,i,t[15],14,-660478335),i=Ar(i,n,a,r,t[4],20,-405537848),r=Ar(r,i,n,a,t[9],5,568446438),a=Ar(a,r,i,n,t[14],9,-1019803690),n=Ar(n,a,r,i,t[3],14,-187363961),i=Ar(i,n,a,r,t[8],20,1163531501),r=Ar(r,i,n,a,t[13],5,-1444681467),a=Ar(a,r,i,n,t[2],9,-51403784),n=Ar(n,a,r,i,t[7],14,1735328473),i=Ar(i,n,a,r,t[12],20,-1926607734),r=Sr(r,i,n,a,t[5],4,-378558),a=Sr(a,r,i,n,t[8],11,-2022574463),n=Sr(n,a,r,i,t[11],16,1839030562),i=Sr(i,n,a,r,t[14],23,-35309556),r=Sr(r,i,n,a,t[1],4,-1530992060),a=Sr(a,r,i,n,t[4],11,1272893353),n=Sr(n,a,r,i,t[7],16,-155497632),i=Sr(i,n,a,r,t[10],23,-1094730640),r=Sr(r,i,n,a,t[13],4,681279174),a=Sr(a,r,i,n,t[0],11,-358537222),n=Sr(n,a,r,i,t[3],16,-722521979),i=Sr(i,n,a,r,t[6],23,76029189),r=Sr(r,i,n,a,t[9],4,-640364487),a=Sr(a,r,i,n,t[12],11,-421815835),n=Sr(n,a,r,i,t[15],16,530742520),i=Sr(i,n,a,r,t[2],23,-995338651),r=Er(r,i,n,a,t[0],6,-198630844),a=Er(a,r,i,n,t[7],10,1126891415),n=Er(n,a,r,i,t[14],15,-1416354905),i=Er(i,n,a,r,t[5],21,-57434055),r=Er(r,i,n,a,t[12],6,1700485571),a=Er(a,r,i,n,t[3],10,-1894986606),n=Er(n,a,r,i,t[10],15,-1051523),i=Er(i,n,a,r,t[1],21,-2054922799),r=Er(r,i,n,a,t[8],6,1873313359),a=Er(a,r,i,n,t[15],10,-30611744),n=Er(n,a,r,i,t[6],15,-1560198380),i=Er(i,n,a,r,t[13],21,1309151649),r=Er(r,i,n,a,t[4],6,-145523070),a=Er(a,r,i,n,t[11],10,-1120210379),n=Er(n,a,r,i,t[2],15,718787259),i=Er(i,n,a,r,t[9],21,-343485551),e[0]=Cr(r,e[0]),e[1]=Cr(i,e[1]),e[2]=Cr(n,e[2]),e[3]=Cr(a,e[3])}function _r(e,t,r,i,n,a){return t=Cr(Cr(t,e),Cr(i,a)),Cr(t<<n|t>>>32-n,r)}function kr(e,t,r,i,n,a,s){return _r(t&r|~t&i,e,t,n,a,s)}function Ar(e,t,r,i,n,a,s){return _r(t&i|r&~i,e,t,n,a,s)}function Sr(e,t,r,i,n,a,s){return _r(t^r^i,e,t,n,a,s)}function Er(e,t,r,i,n,a,s){return _r(r^(t|~i),e,t,n,a,s)}function Pr(e){const t=[];let r;for(r=0;r<64;r+=4)t[r>>2]=e.charCodeAt(r)+(e.charCodeAt(r+1)<<8)+(e.charCodeAt(r+2)<<16)+(e.charCodeAt(r+3)<<24);return t}const xr="0123456789abcdef".split("");function Mr(e){let t="",r=0;for(;r<4;r++)t+=xr[e>>8*r+4&15]+xr[e>>8*r&15];return t}function Cr(e,t){return e+t&4294967295}const Kr=V.getWebCrypto(),Dr=V.getNodeCrypto();function Rr(e){return async function(t){const r=Dr.createHash(e);return B(t,(e=>{r.update(e)}),(()=>new Uint8Array(r.digest())))}}function Ir(e,t){return async function(r,i=ie){if(s(r)&&(r=await L(r)),!V.isStream(r)&&Kr&&t&&r.length>=i.minBytesForWebCrypto)return new Uint8Array(await Kr.digest(t,r));const n=e();return B(r,(e=>{n.update(e)}),(()=>new Uint8Array(n.digest())))}}function Ur(e,t){return async function(r,i=ie){if(s(r)&&(r=await L(r)),V.isStream(r)){const t=new e;return B(r,(e=>{t.process(e)}),(()=>t.finish().result))}return Kr&&t&&r.length>=i.minBytesForWebCrypto?new Uint8Array(await Kr.digest(t,r)):e.bytes(r)}}let Br;Br=Dr?{md5:Rr("md5"),sha1:Rr("sha1"),sha224:Rr("sha224"),sha256:Rr("sha256"),sha384:Rr("sha384"),sha512:Rr("sha512"),ripemd:Rr("ripemd160")}:{md5:async function(e){const t=function(e){const t=e.length,r=[1732584193,-271733879,-1732584194,271733878];let i;for(i=64;i<=e.length;i+=64)vr(r,Pr(e.substring(i-64,i)));e=e.substring(i-64);const n=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(i=0;i<e.length;i++)n[i>>2]|=e.charCodeAt(i)<<(i%4<<3);if(n[i>>2]|=128<<(i%4<<3),i>55)for(vr(r,n),i=0;i<16;i++)n[i]=0;return n[14]=8*t,vr(r,n),r}(V.uint8ArrayToString(e));return V.hexToUint8Array(function(e){for(let t=0;t<e.length;t++)e[t]=Mr(e[t]);return e.join("")}(t))},sha1:Ur($e,-1===navigator.userAgent.indexOf("Edge")&&"SHA-1"),sha224:Ir(Ct),sha256:Ur(Xe,"SHA-256"),sha384:Ir(nr,"SHA-384"),sha512:Ir(Wt,"SHA-512"),ripemd:Ir(dr)};var Tr={md5:Br.md5,sha1:Br.sha1,sha224:Br.sha224,sha256:Br.sha256,sha384:Br.sha384,sha512:Br.sha512,ripemd:Br.ripemd,digest:function(e,t){switch(e){case 1:return this.md5(t);case 2:return this.sha1(t);case 3:return this.ripemd(t);case 8:return this.sha256(t);case 9:return this.sha384(t);case 10:return this.sha512(t);case 11:return this.sha224(t);default:throw Error("Invalid hash function.")}},getHashByteLength:function(e){switch(e){case 1:return 16;case 2:case 3:return 20;case 8:return 32;case 9:return 48;case 10:return 64;case 11:return 28;default:throw Error("Invalid hash algorithm.")}}};class zr{static encrypt(e,t,r){return new zr(t,r).encrypt(e)}static decrypt(e,t,r){return new zr(t,r).decrypt(e)}constructor(e,t,r){this.aes=r||new Se(e,t,!0,"CFB"),delete this.aes.padding}encrypt(e){return ge(this.aes.AES_Encrypt_process(e),this.aes.AES_Encrypt_finish())}decrypt(e){return ge(this.aes.AES_Decrypt_process(e),this.aes.AES_Decrypt_finish())}}const qr=V.getWebCrypto(),Or=V.getNodeCrypto(),Fr=Or?Or.getCiphers():[],Nr={idea:Fr.includes("idea-cfb")?"idea-cfb":void 0,tripledes:Fr.includes("des-ede3-cfb")?"des-ede3-cfb":void 0,cast5:Fr.includes("cast5-cfb")?"cast5-cfb":void 0,blowfish:Fr.includes("bf-cfb")?"bf-cfb":void 0,aes128:Fr.includes("aes-128-cfb")?"aes-128-cfb":void 0,aes192:Fr.includes("aes-192-cfb")?"aes-192-cfb":void 0,aes256:Fr.includes("aes-256-cfb")?"aes-256-cfb":void 0};var Lr=/*#__PURE__*/Object.freeze({__proto__:null,encrypt:async function(e,t,r,i,n){if(V.getNodeCrypto()&&Nr[e])return function(e,t,r,i){const n=new Or.createCipheriv(Nr[e],t,i);return B(r,(e=>new Uint8Array(n.update(e))))}(e,t,r,i);if("aes"===e.substr(0,3))return function(e,t,r,i,n){if(V.getWebCrypto()&&24!==t.length&&!V.isStream(r)&&r.length>=3e3*n.minBytesForWebCrypto)return async function(e,t,r,i){const n="AES-CBC",a=await qr.importKey("raw",t,{name:n},!1,["encrypt"]),{blockSize:s}=je[e],o=V.concatUint8Array([new Uint8Array(s),r]),c=new Uint8Array(await qr.encrypt({name:n,iv:i},a,o)).subarray(0,r.length);return function(e,t){for(let r=0;r<e.length;r++)e[r]=e[r]^t[r]}(c,r),c}(e,t,r,i);const a=new zr(t,i);return B(r,(e=>a.aes.AES_Encrypt_process(e)),(()=>a.aes.AES_Encrypt_finish()))}(e,t,r,i,n);const a=new je[e](t),s=a.blockSize,o=i.slice();let c=new Uint8Array;const u=e=>{e&&(c=V.concatUint8Array([c,e]));const t=new Uint8Array(c.length);let r,i=0;for(;e?c.length>=s:c.length;){const e=a.encrypt(o);for(r=0;r<s;r++)o[r]=c[r]^e[r],t[i++]=o[r];c=c.subarray(s)}return t.subarray(0,i)};return B(r,u,u)},decrypt:async function(e,t,r,i){if(V.getNodeCrypto()&&Nr[e])return function(e,t,r,i){const n=new Or.createDecipheriv(Nr[e],t,i);return B(r,(e=>new Uint8Array(n.update(e))))}(e,t,r,i);if("aes"===e.substr(0,3))return function(e,t,r,i){if(V.isStream(r)){const e=new zr(t,i);return B(r,(t=>e.aes.AES_Decrypt_process(t)),(()=>e.aes.AES_Decrypt_finish()))}return zr.decrypt(r,t,i)}(0,t,r,i);const n=new je[e](t),a=n.blockSize;let s=i,o=new Uint8Array;const c=e=>{e&&(o=V.concatUint8Array([o,e]));const t=new Uint8Array(o.length);let r,i=0;for(;e?o.length>=a:o.length;){const e=n.encrypt(s);for(s=o,r=0;r<a;r++)t[i++]=s[r]^e[r];o=o.subarray(a)}return t.subarray(0,i)};return B(r,c,c)}});class jr{static encrypt(e,t,r){return new jr(t,r).encrypt(e)}static decrypt(e,t,r){return new jr(t,r).encrypt(e)}constructor(e,t,r){this.aes=r||new Se(e,void 0,!1,"CTR"),delete this.aes.padding,this.AES_CTR_set_options(t)}encrypt(e){return ge(this.aes.AES_Encrypt_process(e),this.aes.AES_Encrypt_finish())}decrypt(e){return ge(this.aes.AES_Encrypt_process(e),this.aes.AES_Encrypt_finish())}AES_CTR_set_options(e,t,r){let{asm:i}=this.aes.acquire_asm();if(void 0!==r){if(r<8||r>48)throw new ve("illegal counter size");let e=Math.pow(2,r)-1;i.set_mask(0,0,e/4294967296|0,0|e)}else r=48,i.set_mask(0,0,65535,4294967295);if(void 0===e)throw Error("nonce is required");{let t=e.length;if(!t||t>16)throw new ve("illegal nonce size");let r=new DataView(new ArrayBuffer(16));new Uint8Array(r.buffer).set(e),i.set_nonce(r.getUint32(0),r.getUint32(4),r.getUint32(8),r.getUint32(12))}if(void 0!==t){if(t<0||t>=Math.pow(2,r))throw new ve("illegal counter value");i.set_counter(0,0,t/4294967296|0,0|t)}}}class Wr{static encrypt(e,t,r=!0,i){return new Wr(t,i,r).encrypt(e)}static decrypt(e,t,r=!0,i){return new Wr(t,i,r).decrypt(e)}constructor(e,t,r=!0,i){this.aes=i||new Se(e,t,r,"CBC")}encrypt(e){return ge(this.aes.AES_Encrypt_process(e),this.aes.AES_Encrypt_finish())}decrypt(e){return ge(this.aes.AES_Decrypt_process(e),this.aes.AES_Decrypt_finish())}}const Hr=V.getWebCrypto(),Gr=V.getNodeCrypto(),Vr=16;function $r(e,t){const r=e.length-Vr;for(let i=0;i<Vr;i++)e[i+r]^=t[i];return e}const Zr=new Uint8Array(Vr);async function Yr(e){const t=await async function(e){if(V.getWebCrypto()&&24!==e.length)return e=await Hr.importKey("raw",e,{name:"AES-CBC",length:8*e.length},!1,["encrypt"]),async function(t){const r=await Hr.encrypt({name:"AES-CBC",iv:Zr,length:128},e,t);return new Uint8Array(r).subarray(0,r.byteLength-Vr)};if(V.getNodeCrypto())return async function(t){const r=new Gr.createCipheriv("aes-"+8*e.length+"-cbc",e,Zr).update(t);return new Uint8Array(r)};return async function(t){return Wr.encrypt(t,e,!1,Zr)}}(e),r=V.double(await t(Zr)),i=V.double(r);return async function(e){return(await t(function(e,t,r){if(e.length&&e.length%Vr==0)return $r(e,t);const i=new Uint8Array(e.length+(Vr-e.length%Vr));return i.set(e),i[e.length]=128,$r(i,r)}(e,r,i))).subarray(-16)}}const Xr=V.getWebCrypto(),Qr=V.getNodeCrypto(),Jr=V.getNodeBuffer(),ei=16,ti=ei,ri=new Uint8Array(ei),ii=new Uint8Array(ei);ii[15]=1;const ni=new Uint8Array(ei);async function ai(e){const t=await Yr(e);return function(e,r){return t(V.concatUint8Array([e,r]))}}async function si(e){return V.getWebCrypto()&&24!==e.length&&-1===navigator.userAgent.indexOf("Edge")?(e=await Xr.importKey("raw",e,{name:"AES-CTR",length:8*e.length},!1,["encrypt"]),async function(t,r){const i=await Xr.encrypt({name:"AES-CTR",counter:r,length:128},e,t);return new Uint8Array(i)}):V.getNodeCrypto()?async function(t,r){const i=new Qr.createCipheriv("aes-"+8*e.length+"-ctr",e,r),n=Jr.concat([i.update(t),i.final()]);return new Uint8Array(n)}:async function(t,r){return jr.encrypt(t,e,r)}}async function oi(e,t){if("aes"!==e.substr(0,3))throw Error("EAX mode supports only AES cipher");const[r,i]=await Promise.all([ai(t),si(t)]);return{encrypt:async function(e,t,n){const[a,s]=await Promise.all([r(ri,t),r(ii,n)]),o=await i(e,a),c=await r(ni,o);for(let e=0;e<ti;e++)c[e]^=s[e]^a[e];return V.concatUint8Array([o,c])},decrypt:async function(e,t,n){if(e.length<ti)throw Error("Invalid EAX ciphertext");const a=e.subarray(0,-16),s=e.subarray(-16),[o,c,u]=await Promise.all([r(ri,t),r(ii,n),r(ni,a)]),h=u;for(let e=0;e<ti;e++)h[e]^=c[e]^o[e];if(!V.equalsUint8Array(s,h))throw Error("Authentication tag mismatch");return await i(a,o)}}}ni[15]=2,oi.getNonce=function(e,t){const r=e.slice();for(let e=0;e<t.length;e++)r[8+e]^=t[e];return r},oi.blockLength=ei,oi.ivLength=16,oi.tagLength=ti;const ci=16,ui=16;function hi(e){let t=0;for(let r=1;0==(e&r);r<<=1)t++;return t}function di(e,t){for(let r=0;r<e.length;r++)e[r]^=t[r];return e}function fi(e,t){return di(e.slice(),t)}const li=new Uint8Array(ci),pi=new Uint8Array([1]);async function yi(e,t){let r,i,n,a=0;function s(e,t,i,s){const o=t.length/ci|0;!function(e,t){const r=V.nbits(Math.max(e.length,t.length)/ci|0)-1;for(let e=a+1;e<=r;e++)n[e]=V.double(n[e-1]);a=r}(t,s);const c=V.concatUint8Array([li.subarray(0,15-i.length),pi,i]),u=63&c[15];c[15]&=192;const h=r(c),d=V.concatUint8Array([h,fi(h.subarray(0,8),h.subarray(1,9))]),f=V.shiftRight(d.subarray(0+(u>>3),17+(u>>3)),8-(7&u)).subarray(1),l=new Uint8Array(ci),p=new Uint8Array(t.length+ui);let y,b=0;for(y=0;y<o;y++)di(f,n[hi(y+1)]),p.set(di(e(fi(f,t)),f),b),di(l,e===r?t:p.subarray(b)),t=t.subarray(ci),b+=ci;if(t.length){di(f,n.x);const i=r(f);p.set(fi(t,i),b);const a=new Uint8Array(ci);a.set(e===r?t:p.subarray(b,-16),0),a[t.length]=128,di(l,a),b+=t.length}const m=di(r(di(di(l,f),n.$)),function(e){if(!e.length)return li;const t=e.length/ci|0,i=new Uint8Array(ci),a=new Uint8Array(ci);for(let s=0;s<t;s++)di(i,n[hi(s+1)]),di(a,r(fi(i,e))),e=e.subarray(ci);if(e.length){di(i,n.x);const t=new Uint8Array(ci);t.set(e,0),t[e.length]=128,di(t,i),di(a,r(t))}return a}(s));return p.set(m,b),p}return function(e,t){const a=new je[e](t);r=a.encrypt.bind(a),i=a.decrypt.bind(a);const s=r(li),o=V.double(s);n=[],n[0]=V.double(o),n.x=s,n.$=o}(e,t),{encrypt:async function(e,t,i){return s(r,e,t,i)},decrypt:async function(e,t,r){if(e.length<ui)throw Error("Invalid OCB ciphertext");const n=e.subarray(-16);e=e.subarray(0,-16);const a=s(i,e,t,r);if(V.equalsUint8Array(n,a.subarray(-16)))return a.subarray(0,-16);throw Error("Authentication tag mismatch")}}}yi.getNonce=function(e,t){const r=e.slice();for(let e=0;e<t.length;e++)r[7+e]^=t[e];return r},yi.blockLength=ci,yi.ivLength=15,yi.tagLength=ui;const bi=68719476704;class mi{constructor(e,t,r,i=16,n){this.tagSize=i,this.gamma0=0,this.counter=1,this.aes=n||new Se(e,void 0,!1,"CTR");let{asm:a,heap:s}=this.aes.acquire_asm();if(a.gcm_init(),this.tagSize<4||this.tagSize>16)throw new ve("illegal tagSize value");const o=t.length||0,c=new Uint8Array(16);12!==o?(this._gcm_mac_process(t),s[0]=0,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=0,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=0,s[11]=o>>>29,s[12]=o>>>21&255,s[13]=o>>>13&255,s[14]=o>>>5&255,s[15]=o<<3&255,a.mac(pe.MAC.GCM,pe.HEAP_DATA,16),a.get_iv(pe.HEAP_DATA),a.set_iv(0,0,0,0),c.set(s.subarray(0,16))):(c.set(t),c[15]=1);const u=new DataView(c.buffer);if(this.gamma0=u.getUint32(12),a.set_nonce(u.getUint32(0),u.getUint32(4),u.getUint32(8),0),a.set_mask(0,0,0,4294967295),void 0!==r){if(r.length>bi)throw new ve("illegal adata length");r.length?(this.adata=r,this._gcm_mac_process(r)):this.adata=void 0}else this.adata=void 0;if(this.counter<1||this.counter>4294967295)throw new RangeError("counter must be a positive 32-bit integer");a.set_counter(0,0,0,this.gamma0+this.counter|0)}static encrypt(e,t,r,i,n){return new mi(t,r,i,n).encrypt(e)}static decrypt(e,t,r,i,n){return new mi(t,r,i,n).decrypt(e)}encrypt(e){return this.AES_GCM_encrypt(e)}decrypt(e){return this.AES_GCM_decrypt(e)}AES_GCM_Encrypt_process(e){let t=0,r=e.length||0,{asm:i,heap:n}=this.aes.acquire_asm(),a=this.counter,s=this.aes.pos,o=this.aes.len,c=0,u=o+r&-16,h=0;if((a-1<<4)+o+r>bi)throw new RangeError("counter overflow");const d=new Uint8Array(u);for(;r>0;)h=me(n,s+o,e,t,r),o+=h,t+=h,r-=h,h=i.cipher(pe.ENC.CTR,pe.HEAP_DATA+s,o),h=i.mac(pe.MAC.GCM,pe.HEAP_DATA+s,h),h&&d.set(n.subarray(s,s+h),c),a+=h>>>4,c+=h,h<o?(s+=h,o-=h):(s=0,o=0);return this.counter=a,this.aes.pos=s,this.aes.len=o,d}AES_GCM_Encrypt_finish(){let{asm:e,heap:t}=this.aes.acquire_asm(),r=this.counter,i=this.tagSize,n=this.adata,a=this.aes.pos,s=this.aes.len;const o=new Uint8Array(s+i);e.cipher(pe.ENC.CTR,pe.HEAP_DATA+a,s+15&-16),s&&o.set(t.subarray(a,a+s));let c=s;for(;15&c;c++)t[a+c]=0;e.mac(pe.MAC.GCM,pe.HEAP_DATA+a,c);const u=void 0!==n?n.length:0,h=(r-1<<4)+s;return t[0]=0,t[1]=0,t[2]=0,t[3]=u>>>29,t[4]=u>>>21,t[5]=u>>>13&255,t[6]=u>>>5&255,t[7]=u<<3&255,t[8]=t[9]=t[10]=0,t[11]=h>>>29,t[12]=h>>>21&255,t[13]=h>>>13&255,t[14]=h>>>5&255,t[15]=h<<3&255,e.mac(pe.MAC.GCM,pe.HEAP_DATA,16),e.get_iv(pe.HEAP_DATA),e.set_counter(0,0,0,this.gamma0),e.cipher(pe.ENC.CTR,pe.HEAP_DATA,16),o.set(t.subarray(0,i),s),this.counter=1,this.aes.pos=0,this.aes.len=0,o}AES_GCM_Decrypt_process(e){let t=0,r=e.length||0,{asm:i,heap:n}=this.aes.acquire_asm(),a=this.counter,s=this.tagSize,o=this.aes.pos,c=this.aes.len,u=0,h=c+r>s?c+r-s&-16:0,d=c+r-h,f=0;if((a-1<<4)+c+r>bi)throw new RangeError("counter overflow");const l=new Uint8Array(h);for(;r>d;)f=me(n,o+c,e,t,r-d),c+=f,t+=f,r-=f,f=i.mac(pe.MAC.GCM,pe.HEAP_DATA+o,f),f=i.cipher(pe.DEC.CTR,pe.HEAP_DATA+o,f),f&&l.set(n.subarray(o,o+f),u),a+=f>>>4,u+=f,o=0,c=0;return r>0&&(c+=me(n,0,e,t,r)),this.counter=a,this.aes.pos=o,this.aes.len=c,l}AES_GCM_Decrypt_finish(){let{asm:e,heap:t}=this.aes.acquire_asm(),r=this.tagSize,i=this.adata,n=this.counter,a=this.aes.pos,s=this.aes.len,o=s-r;if(s<r)throw new we("authentication tag not found");const c=new Uint8Array(o),u=new Uint8Array(t.subarray(a+o,a+s));let h=o;for(;15&h;h++)t[a+h]=0;e.mac(pe.MAC.GCM,pe.HEAP_DATA+a,h),e.cipher(pe.DEC.CTR,pe.HEAP_DATA+a,h),o&&c.set(t.subarray(a,a+o));const d=void 0!==i?i.length:0,f=(n-1<<4)+s-r;t[0]=0,t[1]=0,t[2]=0,t[3]=d>>>29,t[4]=d>>>21,t[5]=d>>>13&255,t[6]=d>>>5&255,t[7]=d<<3&255,t[8]=t[9]=t[10]=0,t[11]=f>>>29,t[12]=f>>>21&255,t[13]=f>>>13&255,t[14]=f>>>5&255,t[15]=f<<3&255,e.mac(pe.MAC.GCM,pe.HEAP_DATA,16),e.get_iv(pe.HEAP_DATA),e.set_counter(0,0,0,this.gamma0),e.cipher(pe.ENC.CTR,pe.HEAP_DATA,16);let l=0;for(let e=0;e<r;++e)l|=u[e]^t[e];if(l)throw new _e("data integrity check failed");return this.counter=1,this.aes.pos=0,this.aes.len=0,c}AES_GCM_decrypt(e){const t=this.AES_GCM_Decrypt_process(e),r=this.AES_GCM_Decrypt_finish(),i=new Uint8Array(t.length+r.length);return t.length&&i.set(t),r.length&&i.set(r,t.length),i}AES_GCM_encrypt(e){const t=this.AES_GCM_Encrypt_process(e),r=this.AES_GCM_Encrypt_finish(),i=new Uint8Array(t.length+r.length);return t.length&&i.set(t),r.length&&i.set(r,t.length),i}_gcm_mac_process(e){let{asm:t,heap:r}=this.aes.acquire_asm(),i=0,n=e.length||0,a=0;for(;n>0;){for(a=me(r,0,e,i,n),i+=a,n-=a;15&a;)r[a++]=0;t.mac(pe.MAC.GCM,pe.HEAP_DATA,a)}}}const gi=V.getWebCrypto(),wi=V.getNodeCrypto(),vi=V.getNodeBuffer(),_i=16,ki="AES-GCM";async function Ai(e,t){if("aes"!==e.substr(0,3))throw Error("GCM mode supports only AES cipher");if(V.getWebCrypto()&&24!==t.length){const e=await gi.importKey("raw",t,{name:ki},!1,["encrypt","decrypt"]);return{encrypt:async function(r,i,n=new Uint8Array){if(!r.length||!n.length&&-1!==navigator.userAgent.indexOf("Edge"))return mi.encrypt(r,t,i,n);const a=await gi.encrypt({name:ki,iv:i,additionalData:n,tagLength:128},e,r);return new Uint8Array(a)},decrypt:async function(r,i,n=new Uint8Array){if(r.length===_i||!n.length&&-1!==navigator.userAgent.indexOf("Edge"))return mi.decrypt(r,t,i,n);const a=await gi.decrypt({name:ki,iv:i,additionalData:n,tagLength:128},e,r);return new Uint8Array(a)}}}return V.getNodeCrypto()?{encrypt:async function(e,r,i=new Uint8Array){const n=new wi.createCipheriv("aes-"+8*t.length+"-gcm",t,r);n.setAAD(i);const a=vi.concat([n.update(e),n.final(),n.getAuthTag()]);return new Uint8Array(a)},decrypt:async function(e,r,i=new Uint8Array){const n=new wi.createDecipheriv("aes-"+8*t.length+"-gcm",t,r);n.setAAD(i),n.setAuthTag(e.slice(e.length-_i,e.length));const a=vi.concat([n.update(e.slice(0,e.length-_i)),n.final()]);return new Uint8Array(a)}}:{encrypt:async function(e,r,i){return mi.encrypt(e,t,r,i)},decrypt:async function(e,r,i){return mi.decrypt(e,t,r,i)}}}Ai.getNonce=function(e,t){const r=e.slice();for(let e=0;e<t.length;e++)r[4+e]^=t[e];return r},Ai.blockLength=16,Ai.ivLength=12,Ai.tagLength=_i;var Si={cfb:Lr,gcm:Ai,experimentalGCM:Ai,eax:oi,ocb:yi},Ei=tt((function(e){!function(e){var t=function(e){var t,r=new Float64Array(16);if(e)for(t=0;t<e.length;t++)r[t]=e[t];return r},r=function(){throw Error("no PRNG")},i=new Uint8Array(32);i[0]=9;var n=t(),a=t([1]),s=t([56129,1]),o=t([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),c=t([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),u=t([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),h=t([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),d=t([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function f(e,t,r,i){return function(e,t,r,i,n){var a,s=0;for(a=0;a<n;a++)s|=e[t+a]^r[i+a];return(1&s-1>>>8)-1}(e,t,r,i,32)}function l(e,t){var r;for(r=0;r<16;r++)e[r]=0|t[r]}function p(e){var t,r,i=1;for(t=0;t<16;t++)r=e[t]+i+65535,i=Math.floor(r/65536),e[t]=r-65536*i;e[0]+=i-1+37*(i-1)}function y(e,t,r){for(var i,n=~(r-1),a=0;a<16;a++)i=n&(e[a]^t[a]),e[a]^=i,t[a]^=i}function b(e,r){var i,n,a,s=t(),o=t();for(i=0;i<16;i++)o[i]=r[i];for(p(o),p(o),p(o),n=0;n<2;n++){for(s[0]=o[0]-65517,i=1;i<15;i++)s[i]=o[i]-65535-(s[i-1]>>16&1),s[i-1]&=65535;s[15]=o[15]-32767-(s[14]>>16&1),a=s[15]>>16&1,s[14]&=65535,y(o,s,1-a)}for(i=0;i<16;i++)e[2*i]=255&o[i],e[2*i+1]=o[i]>>8}function m(e,t){var r=new Uint8Array(32),i=new Uint8Array(32);return b(r,e),b(i,t),f(r,0,i,0)}function g(e){var t=new Uint8Array(32);return b(t,e),1&t[0]}function w(e,t){var r;for(r=0;r<16;r++)e[r]=t[2*r]+(t[2*r+1]<<8);e[15]&=32767}function v(e,t,r){for(var i=0;i<16;i++)e[i]=t[i]+r[i]}function _(e,t,r){for(var i=0;i<16;i++)e[i]=t[i]-r[i]}function k(e,t,r){var i,n,a=0,s=0,o=0,c=0,u=0,h=0,d=0,f=0,l=0,p=0,y=0,b=0,m=0,g=0,w=0,v=0,_=0,k=0,A=0,S=0,E=0,P=0,x=0,M=0,C=0,K=0,D=0,R=0,I=0,U=0,B=0,T=r[0],z=r[1],q=r[2],O=r[3],F=r[4],N=r[5],L=r[6],j=r[7],W=r[8],H=r[9],G=r[10],V=r[11],$=r[12],Z=r[13],Y=r[14],X=r[15];a+=(i=t[0])*T,s+=i*z,o+=i*q,c+=i*O,u+=i*F,h+=i*N,d+=i*L,f+=i*j,l+=i*W,p+=i*H,y+=i*G,b+=i*V,m+=i*$,g+=i*Z,w+=i*Y,v+=i*X,s+=(i=t[1])*T,o+=i*z,c+=i*q,u+=i*O,h+=i*F,d+=i*N,f+=i*L,l+=i*j,p+=i*W,y+=i*H,b+=i*G,m+=i*V,g+=i*$,w+=i*Z,v+=i*Y,_+=i*X,o+=(i=t[2])*T,c+=i*z,u+=i*q,h+=i*O,d+=i*F,f+=i*N,l+=i*L,p+=i*j,y+=i*W,b+=i*H,m+=i*G,g+=i*V,w+=i*$,v+=i*Z,_+=i*Y,k+=i*X,c+=(i=t[3])*T,u+=i*z,h+=i*q,d+=i*O,f+=i*F,l+=i*N,p+=i*L,y+=i*j,b+=i*W,m+=i*H,g+=i*G,w+=i*V,v+=i*$,_+=i*Z,k+=i*Y,A+=i*X,u+=(i=t[4])*T,h+=i*z,d+=i*q,f+=i*O,l+=i*F,p+=i*N,y+=i*L,b+=i*j,m+=i*W,g+=i*H,w+=i*G,v+=i*V,_+=i*$,k+=i*Z,A+=i*Y,S+=i*X,h+=(i=t[5])*T,d+=i*z,f+=i*q,l+=i*O,p+=i*F,y+=i*N,b+=i*L,m+=i*j,g+=i*W,w+=i*H,v+=i*G,_+=i*V,k+=i*$,A+=i*Z,S+=i*Y,E+=i*X,d+=(i=t[6])*T,f+=i*z,l+=i*q,p+=i*O,y+=i*F,b+=i*N,m+=i*L,g+=i*j,w+=i*W,v+=i*H,_+=i*G,k+=i*V,A+=i*$,S+=i*Z,E+=i*Y,P+=i*X,f+=(i=t[7])*T,l+=i*z,p+=i*q,y+=i*O,b+=i*F,m+=i*N,g+=i*L,w+=i*j,v+=i*W,_+=i*H,k+=i*G,A+=i*V,S+=i*$,E+=i*Z,P+=i*Y,x+=i*X,l+=(i=t[8])*T,p+=i*z,y+=i*q,b+=i*O,m+=i*F,g+=i*N,w+=i*L,v+=i*j,_+=i*W,k+=i*H,A+=i*G,S+=i*V,E+=i*$,P+=i*Z,x+=i*Y,M+=i*X,p+=(i=t[9])*T,y+=i*z,b+=i*q,m+=i*O,g+=i*F,w+=i*N,v+=i*L,_+=i*j,k+=i*W,A+=i*H,S+=i*G,E+=i*V,P+=i*$,x+=i*Z,M+=i*Y,C+=i*X,y+=(i=t[10])*T,b+=i*z,m+=i*q,g+=i*O,w+=i*F,v+=i*N,_+=i*L,k+=i*j,A+=i*W,S+=i*H,E+=i*G,P+=i*V,x+=i*$,M+=i*Z,C+=i*Y,K+=i*X,b+=(i=t[11])*T,m+=i*z,g+=i*q,w+=i*O,v+=i*F,_+=i*N,k+=i*L,A+=i*j,S+=i*W,E+=i*H,P+=i*G,x+=i*V,M+=i*$,C+=i*Z,K+=i*Y,D+=i*X,m+=(i=t[12])*T,g+=i*z,w+=i*q,v+=i*O,_+=i*F,k+=i*N,A+=i*L,S+=i*j,E+=i*W,P+=i*H,x+=i*G,M+=i*V,C+=i*$,K+=i*Z,D+=i*Y,R+=i*X,g+=(i=t[13])*T,w+=i*z,v+=i*q,_+=i*O,k+=i*F,A+=i*N,S+=i*L,E+=i*j,P+=i*W,x+=i*H,M+=i*G,C+=i*V,K+=i*$,D+=i*Z,R+=i*Y,I+=i*X,w+=(i=t[14])*T,v+=i*z,_+=i*q,k+=i*O,A+=i*F,S+=i*N,E+=i*L,P+=i*j,x+=i*W,M+=i*H,C+=i*G,K+=i*V,D+=i*$,R+=i*Z,I+=i*Y,U+=i*X,v+=(i=t[15])*T,s+=38*(k+=i*q),o+=38*(A+=i*O),c+=38*(S+=i*F),u+=38*(E+=i*N),h+=38*(P+=i*L),d+=38*(x+=i*j),f+=38*(M+=i*W),l+=38*(C+=i*H),p+=38*(K+=i*G),y+=38*(D+=i*V),b+=38*(R+=i*$),m+=38*(I+=i*Z),g+=38*(U+=i*Y),w+=38*(B+=i*X),a=(i=(a+=38*(_+=i*z))+(n=1)+65535)-65536*(n=Math.floor(i/65536)),s=(i=s+n+65535)-65536*(n=Math.floor(i/65536)),o=(i=o+n+65535)-65536*(n=Math.floor(i/65536)),c=(i=c+n+65535)-65536*(n=Math.floor(i/65536)),u=(i=u+n+65535)-65536*(n=Math.floor(i/65536)),h=(i=h+n+65535)-65536*(n=Math.floor(i/65536)),d=(i=d+n+65535)-65536*(n=Math.floor(i/65536)),f=(i=f+n+65535)-65536*(n=Math.floor(i/65536)),l=(i=l+n+65535)-65536*(n=Math.floor(i/65536)),p=(i=p+n+65535)-65536*(n=Math.floor(i/65536)),y=(i=y+n+65535)-65536*(n=Math.floor(i/65536)),b=(i=b+n+65535)-65536*(n=Math.floor(i/65536)),m=(i=m+n+65535)-65536*(n=Math.floor(i/65536)),g=(i=g+n+65535)-65536*(n=Math.floor(i/65536)),w=(i=w+n+65535)-65536*(n=Math.floor(i/65536)),v=(i=v+n+65535)-65536*(n=Math.floor(i/65536)),a=(i=(a+=n-1+37*(n-1))+(n=1)+65535)-65536*(n=Math.floor(i/65536)),s=(i=s+n+65535)-65536*(n=Math.floor(i/65536)),o=(i=o+n+65535)-65536*(n=Math.floor(i/65536)),c=(i=c+n+65535)-65536*(n=Math.floor(i/65536)),u=(i=u+n+65535)-65536*(n=Math.floor(i/65536)),h=(i=h+n+65535)-65536*(n=Math.floor(i/65536)),d=(i=d+n+65535)-65536*(n=Math.floor(i/65536)),f=(i=f+n+65535)-65536*(n=Math.floor(i/65536)),l=(i=l+n+65535)-65536*(n=Math.floor(i/65536)),p=(i=p+n+65535)-65536*(n=Math.floor(i/65536)),y=(i=y+n+65535)-65536*(n=Math.floor(i/65536)),b=(i=b+n+65535)-65536*(n=Math.floor(i/65536)),m=(i=m+n+65535)-65536*(n=Math.floor(i/65536)),g=(i=g+n+65535)-65536*(n=Math.floor(i/65536)),w=(i=w+n+65535)-65536*(n=Math.floor(i/65536)),v=(i=v+n+65535)-65536*(n=Math.floor(i/65536)),a+=n-1+37*(n-1),e[0]=a,e[1]=s,e[2]=o,e[3]=c,e[4]=u,e[5]=h,e[6]=d,e[7]=f,e[8]=l,e[9]=p,e[10]=y,e[11]=b,e[12]=m,e[13]=g,e[14]=w,e[15]=v}function A(e,t){k(e,t,t)}function S(e,r){var i,n=t();for(i=0;i<16;i++)n[i]=r[i];for(i=253;i>=0;i--)A(n,n),2!==i&&4!==i&&k(n,n,r);for(i=0;i<16;i++)e[i]=n[i]}function E(e,r,i){var n,a,o=new Uint8Array(32),c=new Float64Array(80),u=t(),h=t(),d=t(),f=t(),l=t(),p=t();for(a=0;a<31;a++)o[a]=r[a];for(o[31]=127&r[31]|64,o[0]&=248,w(c,i),a=0;a<16;a++)h[a]=c[a],f[a]=u[a]=d[a]=0;for(u[0]=f[0]=1,a=254;a>=0;--a)y(u,h,n=o[a>>>3]>>>(7&a)&1),y(d,f,n),v(l,u,d),_(u,u,d),v(d,h,f),_(h,h,f),A(f,l),A(p,u),k(u,d,u),k(d,h,l),v(l,u,d),_(u,u,d),A(h,u),_(d,f,p),k(u,d,s),v(u,u,f),k(d,d,u),k(u,f,p),k(f,h,c),A(h,l),y(u,h,n),y(d,f,n);for(a=0;a<16;a++)c[a+16]=u[a],c[a+32]=d[a],c[a+48]=h[a],c[a+64]=f[a];var m=c.subarray(32),g=c.subarray(16);return S(m,m),k(g,g,m),b(e,g),0}function P(e,t){return E(e,t,i)}function x(e,r){var i=t(),n=t(),a=t(),s=t(),o=t(),u=t(),h=t(),d=t(),f=t();_(i,e[1],e[0]),_(f,r[1],r[0]),k(i,i,f),v(n,e[0],e[1]),v(f,r[0],r[1]),k(n,n,f),k(a,e[3],r[3]),k(a,a,c),k(s,e[2],r[2]),v(s,s,s),_(o,n,i),_(u,s,a),v(h,s,a),v(d,n,i),k(e[0],o,u),k(e[1],d,h),k(e[2],h,u),k(e[3],o,d)}function M(e,t,r){var i;for(i=0;i<4;i++)y(e[i],t[i],r)}function C(e,r){var i=t(),n=t(),a=t();S(a,r[2]),k(i,r[0],a),k(n,r[1],a),b(e,n),e[31]^=g(i)<<7}function K(e,t,r){var i,s;for(l(e[0],n),l(e[1],a),l(e[2],a),l(e[3],n),s=255;s>=0;--s)M(e,t,i=r[s/8|0]>>(7&s)&1),x(t,e),x(e,e),M(e,t,i)}function D(e,r){var i=[t(),t(),t(),t()];l(i[0],u),l(i[1],h),l(i[2],a),k(i[3],u,h),K(e,i,r)}function R(i,n,a){var s,o,c=[t(),t(),t(),t()];for(a||r(n,32),(s=e.hash(n.subarray(0,32)))[0]&=248,s[31]&=127,s[31]|=64,D(c,s),C(i,c),o=0;o<32;o++)n[o+32]=i[o];return 0}var I=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function U(e,t){var r,i,n,a;for(i=63;i>=32;--i){for(r=0,n=i-32,a=i-12;n<a;++n)t[n]+=r-16*t[i]*I[n-(i-32)],r=Math.floor((t[n]+128)/256),t[n]-=256*r;t[n]+=r,t[i]=0}for(r=0,n=0;n<32;n++)t[n]+=r-(t[31]>>4)*I[n],r=t[n]>>8,t[n]&=255;for(n=0;n<32;n++)t[n]-=r*I[n];for(i=0;i<32;i++)t[i+1]+=t[i]>>8,e[i]=255&t[i]}function B(e){var t,r=new Float64Array(64);for(t=0;t<64;t++)r[t]=e[t];for(t=0;t<64;t++)e[t]=0;U(e,r)}function T(e,r){var i=t(),s=t(),c=t(),u=t(),h=t(),f=t(),p=t();return l(e[2],a),w(e[1],r),A(c,e[1]),k(u,c,o),_(c,c,e[2]),v(u,e[2],u),A(h,u),A(f,h),k(p,f,h),k(i,p,c),k(i,i,u),function(e,r){var i,n=t();for(i=0;i<16;i++)n[i]=r[i];for(i=250;i>=0;i--)A(n,n),1!==i&&k(n,n,r);for(i=0;i<16;i++)e[i]=n[i]}(i,i),k(i,i,c),k(i,i,u),k(i,i,u),k(e[0],i,u),A(s,e[0]),k(s,s,u),m(s,c)&&k(e[0],e[0],d),A(s,e[0]),k(s,s,u),m(s,c)?-1:(g(e[0])===r[31]>>7&&_(e[0],n,e[0]),k(e[3],e[0],e[1]),0)}var z=64;function q(){for(var e=0;e<arguments.length;e++)if(!(arguments[e]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function O(e){for(var t=0;t<e.length;t++)e[t]=0}e.scalarMult=function(e,t){if(q(e,t),32!==e.length)throw Error("bad n size");if(32!==t.length)throw Error("bad p size");var r=new Uint8Array(32);return E(r,e,t),r},e.box={},e.box.keyPair=function(){var e,t,i=new Uint8Array(32),n=new Uint8Array(32);return e=i,r(t=n,32),P(e,t),{publicKey:i,secretKey:n}},e.box.keyPair.fromSecretKey=function(e){if(q(e),32!==e.length)throw Error("bad secret key size");var t=new Uint8Array(32);return P(t,e),{publicKey:t,secretKey:new Uint8Array(e)}},e.sign=function(r,i){if(q(r,i),64!==i.length)throw Error("bad secret key size");var n=new Uint8Array(z+r.length);return function(r,i,n,a){var s,o,c,u,h,d=new Float64Array(64),f=[t(),t(),t(),t()];(s=e.hash(a.subarray(0,32)))[0]&=248,s[31]&=127,s[31]|=64;var l=n+64;for(u=0;u<n;u++)r[64+u]=i[u];for(u=0;u<32;u++)r[32+u]=s[32+u];for(B(c=e.hash(r.subarray(32,l))),D(f,c),C(r,f),u=32;u<64;u++)r[u]=a[u];for(B(o=e.hash(r.subarray(0,l))),u=0;u<64;u++)d[u]=0;for(u=0;u<32;u++)d[u]=c[u];for(u=0;u<32;u++)for(h=0;h<32;h++)d[u+h]+=o[u]*s[h];U(r.subarray(32),d)}(n,r,r.length,i),n},e.sign.detached=function(t,r){for(var i=e.sign(t,r),n=new Uint8Array(z),a=0;a<n.length;a++)n[a]=i[a];return n},e.sign.detached.verify=function(r,i,n){if(q(r,i,n),i.length!==z)throw Error("bad signature size");if(32!==n.length)throw Error("bad public key size");var a,s=new Uint8Array(z+r.length),o=new Uint8Array(z+r.length);for(a=0;a<z;a++)s[a]=i[a];for(a=0;a<r.length;a++)s[a+z]=r[a];return function(r,i,n,a){var s,o,c=new Uint8Array(32),u=[t(),t(),t(),t()],h=[t(),t(),t(),t()];if(n<64)return-1;if(T(h,a))return-1;for(s=0;s<n;s++)r[s]=i[s];for(s=0;s<32;s++)r[s+32]=a[s];if(B(o=e.hash(r.subarray(0,n))),K(u,h,o),D(h,i.subarray(32)),x(u,h),C(c,u),n-=64,f(i,0,c,0)){for(s=0;s<n;s++)r[s]=0;return-1}for(s=0;s<n;s++)r[s]=i[s+64];return n}(o,s,s.length,n)>=0},e.sign.keyPair=function(){var e=new Uint8Array(32),t=new Uint8Array(64);return R(e,t),{publicKey:e,secretKey:t}},e.sign.keyPair.fromSecretKey=function(e){if(q(e),64!==e.length)throw Error("bad secret key size");for(var t=new Uint8Array(32),r=0;r<t.length;r++)t[r]=e[32+r];return{publicKey:t,secretKey:new Uint8Array(e)}},e.sign.keyPair.fromSeed=function(e){if(q(e),32!==e.length)throw Error("bad seed size");for(var t=new Uint8Array(32),r=new Uint8Array(64),i=0;i<32;i++)r[i]=e[i];return R(t,r,!0),{publicKey:t,secretKey:r}},e.setPRNG=function(e){r=e},function(){var t="undefined"!=typeof self?self.crypto||self.msCrypto:null;if(t&&t.getRandomValues){e.setPRNG((function(e,r){var i,n=new Uint8Array(r);for(i=0;i<r;i+=65536)t.getRandomValues(n.subarray(i,i+Math.min(r-i,65536)));for(i=0;i<r;i++)e[i]=n[i];O(n)}))}else(t=void 0)&&t.randomBytes&&e.setPRNG((function(e,r){var i,n=t.randomBytes(r);for(i=0;i<r;i++)e[i]=n[i];O(n)}))}()}(e.exports?e.exports:self.nacl=self.nacl||{})}));const Pi=V.getNodeCrypto();async function xi(e){const t=new Uint8Array(e);if("undefined"!=typeof crypto&&crypto.getRandomValues)crypto.getRandomValues(t);else if(Pi){const e=Pi.randomBytes(t.length);t.set(e)}else{if(!Ci.buffer)throw Error("No secure random number generator available.");await Ci.get(t)}return t}async function Mi(e,t){const r=await V.getBigInteger();if(t.lt(e))throw Error("Illegal parameter value: max <= min");const i=t.sub(e),n=i.byteLength();return new r(await xi(n+8)).mod(i).add(e)}const Ci=new class{constructor(){this.buffer=null,this.size=null,this.callback=null}init(e,t){this.buffer=new Uint8Array(e),this.size=0,this.callback=t}set(e){if(!this.buffer)throw Error("RandomBuffer is not initialized");if(!(e instanceof Uint8Array))throw Error("Invalid type: buf not an Uint8Array");const t=this.buffer.length-this.size;e.length>t&&(e=e.subarray(0,t)),this.buffer.set(e,this.size),this.size+=e.length}async get(e){if(!this.buffer)throw Error("RandomBuffer is not initialized");if(!(e instanceof Uint8Array))throw Error("Invalid type: buf not an Uint8Array");if(this.size<e.length){if(!this.callback)throw Error("Random number buffer depleted");return await this.callback(),this.get(e)}for(let t=0;t<e.length;t++)e[t]=this.buffer[--this.size],this.buffer[this.size]=0}};var Ki=/*#__PURE__*/Object.freeze({__proto__:null,getRandomBytes:xi,getRandomBigInteger:Mi,randomBuffer:Ci});async function Di(e,t,r){const i=await V.getBigInteger(),n=new i(1),a=n.leftShift(new i(e-1)),s=new i(30),o=[1,6,5,4,3,2,1,4,3,2,1,2,1,4,3,2,1,2,1,4,3,2,1,6,5,4,3,2,1,2],c=await Mi(a,a.leftShift(n));let u=c.mod(s).toNumber();do{c.iadd(new i(o[u])),u=(u+o[u])%o.length,c.bitLength()>e&&(c.imod(a.leftShift(n)).iadd(a),u=c.mod(s).toNumber())}while(!await Ri(c,t,r));return c}async function Ri(e,t,r){return!(t&&!e.dec().gcd(t).isOne())&&(!!await async function(e){const t=await V.getBigInteger();return Ii.every((r=>0!==e.mod(new t(r))))}(e)&&(!!await async function(e,t){const r=await V.getBigInteger();return(t=t||new r(2)).modExp(e.dec(),e).isOne()}(e)&&!!await async function(e,t,r){const i=await V.getBigInteger(),n=e.bitLength();t||(t=Math.max(1,n/48|0));const a=e.dec();let s=0;for(;!a.getBit(s);)s++;const o=e.rightShift(new i(s));for(;t>0;t--){let t,n=(r?r():await Mi(new i(2),a)).modExp(o,e);if(!n.isOne()&&!n.equal(a)){for(t=1;t<s;t++){if(n=n.mul(n).mod(e),n.isOne())return!1;if(n.equal(a))break}if(t===s)return!1}}return!0}(e,r)))}const Ii=[7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039,1049,1051,1061,1063,1069,1087,1091,1093,1097,1103,1109,1117,1123,1129,1151,1153,1163,1171,1181,1187,1193,1201,1213,1217,1223,1229,1231,1237,1249,1259,1277,1279,1283,1289,1291,1297,1301,1303,1307,1319,1321,1327,1361,1367,1373,1381,1399,1409,1423,1427,1429,1433,1439,1447,1451,1453,1459,1471,1481,1483,1487,1489,1493,1499,1511,1523,1531,1543,1549,1553,1559,1567,1571,1579,1583,1597,1601,1607,1609,1613,1619,1621,1627,1637,1657,1663,1667,1669,1693,1697,1699,1709,1721,1723,1733,1741,1747,1753,1759,1777,1783,1787,1789,1801,1811,1823,1831,1847,1861,1867,1871,1873,1877,1879,1889,1901,1907,1913,1931,1933,1949,1951,1973,1979,1987,1993,1997,1999,2003,2011,2017,2027,2029,2039,2053,2063,2069,2081,2083,2087,2089,2099,2111,2113,2129,2131,2137,2141,2143,2153,2161,2179,2203,2207,2213,2221,2237,2239,2243,2251,2267,2269,2273,2281,2287,2293,2297,2309,2311,2333,2339,2341,2347,2351,2357,2371,2377,2381,2383,2389,2393,2399,2411,2417,2423,2437,2441,2447,2459,2467,2473,2477,2503,2521,2531,2539,2543,2549,2551,2557,2579,2591,2593,2609,2617,2621,2633,2647,2657,2659,2663,2671,2677,2683,2687,2689,2693,2699,2707,2711,2713,2719,2729,2731,2741,2749,2753,2767,2777,2789,2791,2797,2801,2803,2819,2833,2837,2843,2851,2857,2861,2879,2887,2897,2903,2909,2917,2927,2939,2953,2957,2963,2969,2971,2999,3001,3011,3019,3023,3037,3041,3049,3061,3067,3079,3083,3089,3109,3119,3121,3137,3163,3167,3169,3181,3187,3191,3203,3209,3217,3221,3229,3251,3253,3257,3259,3271,3299,3301,3307,3313,3319,3323,3329,3331,3343,3347,3359,3361,3371,3373,3389,3391,3407,3413,3433,3449,3457,3461,3463,3467,3469,3491,3499,3511,3517,3527,3529,3533,3539,3541,3547,3557,3559,3571,3581,3583,3593,3607,3613,3617,3623,3631,3637,3643,3659,3671,3673,3677,3691,3697,3701,3709,3719,3727,3733,3739,3761,3767,3769,3779,3793,3797,3803,3821,3823,3833,3847,3851,3853,3863,3877,3881,3889,3907,3911,3917,3919,3923,3929,3931,3943,3947,3967,3989,4001,4003,4007,4013,4019,4021,4027,4049,4051,4057,4073,4079,4091,4093,4099,4111,4127,4129,4133,4139,4153,4157,4159,4177,4201,4211,4217,4219,4229,4231,4241,4243,4253,4259,4261,4271,4273,4283,4289,4297,4327,4337,4339,4349,4357,4363,4373,4391,4397,4409,4421,4423,4441,4447,4451,4457,4463,4481,4483,4493,4507,4513,4517,4519,4523,4547,4549,4561,4567,4583,4591,4597,4603,4621,4637,4639,4643,4649,4651,4657,4663,4673,4679,4691,4703,4721,4723,4729,4733,4751,4759,4783,4787,4789,4793,4799,4801,4813,4817,4831,4861,4871,4877,4889,4903,4909,4919,4931,4933,4937,4943,4951,4957,4967,4969,4973,4987,4993,4999];const Ui=[];async function Bi(e,t){const r=e.length;if(r>t-11)throw Error("Message too long");const i=await async function(e){const t=new Uint8Array(e);let r=0;for(;r<e;){const i=await xi(e-r);for(let e=0;e<i.length;e++)0!==i[e]&&(t[r++]=i[e])}return t}(t-r-3),n=new Uint8Array(t);return n[1]=2,n.set(i,2),n.set(e,t-r),n}function Ti(e){let t=2;for(;0!==e[t]&&t<e.length;)t++;const r=t-2,i=e[t++];if(0===e[0]&&2===e[1]&&r>=8&&0===i)return e.subarray(t);throw Error("Decryption error")}async function zi(e,t,r){let i;if(t.length!==Tr.getHashByteLength(e))throw Error("Invalid hash length");const n=new Uint8Array(Ui[e].length);for(i=0;i<Ui[e].length;i++)n[i]=Ui[e][i];const a=n.length+t.length;if(r<a+11)throw Error("Intended encoded message length too short");const s=new Uint8Array(r-a-3).fill(255),o=new Uint8Array(r);return o[1]=1,o.set(s,2),o.set(n,r-a),o.set(t,r-t.length),o}Ui[1]=[48,32,48,12,6,8,42,134,72,134,247,13,2,5,5,0,4,16],Ui[2]=[48,33,48,9,6,5,43,14,3,2,26,5,0,4,20],Ui[3]=[48,33,48,9,6,5,43,36,3,2,1,5,0,4,20],Ui[8]=[48,49,48,13,6,9,96,134,72,1,101,3,4,2,1,5,0,4,32],Ui[9]=[48,65,48,13,6,9,96,134,72,1,101,3,4,2,2,5,0,4,48],Ui[10]=[48,81,48,13,6,9,96,134,72,1,101,3,4,2,3,5,0,4,64],Ui[11]=[48,45,48,13,6,9,96,134,72,1,101,3,4,2,4,5,0,4,28];var qi=/*#__PURE__*/Object.freeze({__proto__:null,emeEncode:Bi,emeDecode:Ti,emsaEncode:zi});const Oi=V.getWebCrypto(),Fi=V.getNodeCrypto(),Ni=void 0,Li=V.detectNode()?Ni.define("RSAPrivateKey",(function(){this.seq().obj(this.key("version").int(),this.key("modulus").int(),this.key("publicExponent").int(),this.key("privateExponent").int(),this.key("prime1").int(),this.key("prime2").int(),this.key("exponent1").int(),this.key("exponent2").int(),this.key("coefficient").int())})):void 0,ji=V.detectNode()?Ni.define("RSAPubliceKey",(function(){this.seq().obj(this.key("modulus").int(),this.key("publicExponent").int())})):void 0;var Wi=/*#__PURE__*/Object.freeze({__proto__:null,sign:async function(e,t,r,i,n,a,s,o,c){if(t&&!V.isStream(t))if(V.getWebCrypto())try{return await async function(e,t,r,i,n,a,s,o){const c=await async function(e,t,r,i,n,a){const s=await V.getBigInteger(),o=new s(i),c=new s(n),u=new s(r);let h=u.mod(c.dec()),d=u.mod(o.dec());return d=d.toUint8Array(),h=h.toUint8Array(),{kty:"RSA",n:ee(e,!0),e:ee(t,!0),d:ee(r,!0),p:ee(n,!0),q:ee(i,!0),dp:ee(h,!0),dq:ee(d,!0),qi:ee(a,!0),ext:!0}}(r,i,n,a,s,o),u={name:"RSASSA-PKCS1-v1_5",hash:{name:e}},h=await Oi.importKey("jwk",c,u,!1,["sign"]);return new Uint8Array(await Oi.sign({name:"RSASSA-PKCS1-v1_5",hash:e},h,t))}(re.read(re.webHash,e),t,r,i,n,a,s,o)}catch(e){V.printDebugError(e)}else if(V.getNodeCrypto())return async function(e,t,r,i,n,a,s,o){const{default:c}=await Promise.resolve().then((function(){return Rf})),u=new c(a),h=new c(s),d=new c(n),f=d.mod(h.subn(1)),l=d.mod(u.subn(1)),p=Fi.createSign(re.read(re.hash,e));p.write(t),p.end();const y={version:0,modulus:new c(r),publicExponent:new c(i),privateExponent:new c(n),prime1:new c(s),prime2:new c(a),exponent1:f,exponent2:l,coefficient:new c(o)};if(void 0!==Fi.createPrivateKey){const e=Li.encode(y,"der");return new Uint8Array(p.sign({key:e,format:"der",type:"pkcs1"}))}const b=Li.encode(y,"pem",{label:"RSA PRIVATE KEY"});return new Uint8Array(p.sign(b))}(e,t,r,i,n,a,s,o);return async function(e,t,r,i){const n=await V.getBigInteger();t=new n(t);const a=new n(await zi(e,i,t.byteLength()));if(r=new n(r),a.gte(t))throw Error("Message size cannot exceed modulus size");return a.modExp(r,t).toUint8Array("be",t.byteLength())}(e,r,n,c)},verify:async function(e,t,r,i,n,a){if(t&&!V.isStream(t))if(V.getWebCrypto())try{return await async function(e,t,r,i,n){const a=function(e,t){return{kty:"RSA",n:ee(e,!0),e:ee(t,!0),ext:!0}}(i,n),s=await Oi.importKey("jwk",a,{name:"RSASSA-PKCS1-v1_5",hash:{name:e}},!1,["verify"]);return Oi.verify({name:"RSASSA-PKCS1-v1_5",hash:e},s,r,t)}(re.read(re.webHash,e),t,r,i,n)}catch(e){V.printDebugError(e)}else if(V.getNodeCrypto())return async function(e,t,r,i,n){const{default:a}=await Promise.resolve().then((function(){return Rf})),s=Fi.createVerify(re.read(re.hash,e));s.write(t),s.end();const o={modulus:new a(i),publicExponent:new a(n)};let c;if(void 0!==Fi.createPrivateKey){c={key:ji.encode(o,"der"),format:"der",type:"pkcs1"}}else c=ji.encode(o,"pem",{label:"RSA PUBLIC KEY"});try{return await s.verify(c,r)}catch(e){return!1}}(e,t,r,i,n);return async function(e,t,r,i,n){const a=await V.getBigInteger();if(r=new a(r),t=new a(t),i=new a(i),t.gte(r))throw Error("Signature size cannot exceed modulus size");const s=t.modExp(i,r).toUint8Array("be",r.byteLength()),o=await zi(e,n,r.byteLength());return V.equalsUint8Array(s,o)}(e,r,i,n,a)},encrypt:async function(e,t,r){return V.getNodeCrypto()?async function(e,t,r){const{default:i}=await Promise.resolve().then((function(){return Rf})),n={modulus:new i(t),publicExponent:new i(r)};let a;if(void 0!==Fi.createPrivateKey){a={key:ji.encode(n,"der"),format:"der",type:"pkcs1",padding:Fi.constants.RSA_PKCS1_PADDING}}else{a={key:ji.encode(n,"pem",{label:"RSA PUBLIC KEY"}),padding:Fi.constants.RSA_PKCS1_PADDING}}return new Uint8Array(Fi.publicEncrypt(a,e))}(e,t,r):async function(e,t,r){const i=await V.getBigInteger();if(t=new i(t),e=new i(await Bi(e,t.byteLength())),r=new i(r),e.gte(t))throw Error("Message size cannot exceed modulus size");return e.modExp(r,t).toUint8Array("be",t.byteLength())}(e,t,r)},decrypt:async function(e,t,r,i,n,a,s){return V.getNodeCrypto()?async function(e,t,r,i,n,a,s){const{default:o}=await Promise.resolve().then((function(){return Rf})),c=new o(n),u=new o(a),h=new o(i),d=h.mod(u.subn(1)),f=h.mod(c.subn(1)),l={version:0,modulus:new o(t),publicExponent:new o(r),privateExponent:new o(i),prime1:new o(a),prime2:new o(n),exponent1:d,exponent2:f,coefficient:new o(s)};let p;if(void 0!==Fi.createPrivateKey){p={key:Li.encode(l,"der"),format:"der",type:"pkcs1",padding:Fi.constants.RSA_PKCS1_PADDING}}else{p={key:Li.encode(l,"pem",{label:"RSA PRIVATE KEY"}),padding:Fi.constants.RSA_PKCS1_PADDING}}try{return new Uint8Array(Fi.privateDecrypt(p,e))}catch(e){throw Error("Decryption error")}}(e,t,r,i,n,a,s):async function(e,t,r,i,n,a,s){const o=await V.getBigInteger();if(e=new o(e),t=new o(t),r=new o(r),i=new o(i),n=new o(n),a=new o(a),s=new o(s),e.gte(t))throw Error("Data too large.");const c=i.mod(a.dec()),u=i.mod(n.dec()),h=(await Mi(new o(2),t)).mod(t),d=h.modInv(t).modExp(r,t),f=(e=e.mul(d).mod(t)).modExp(u,n),l=e.modExp(c,a);let p=s.mul(l.sub(f)).mod(a).mul(n).add(f);return p=p.mul(h).mod(t),Ti(p.toUint8Array("be",t.byteLength()))}(e,t,r,i,n,a,s)},generate:async function(e,t){if(t=new(await V.getBigInteger())(t),V.getWebCrypto()){const r={name:"RSASSA-PKCS1-v1_5",modulusLength:e,publicExponent:t.toUint8Array(),hash:{name:"SHA-1"}},i=await Oi.generateKey(r,!0,["sign","verify"]),n=await Oi.exportKey("jwk",i.privateKey);return{n:J(n.n),e:t.toUint8Array(),d:J(n.d),p:J(n.q),q:J(n.p),u:J(n.qi)}}if(V.getNodeCrypto()&&Fi.generateKeyPair&&Li){const r={modulusLength:e,publicExponent:t.toNumber(),publicKeyEncoding:{type:"pkcs1",format:"der"},privateKeyEncoding:{type:"pkcs1",format:"der"}},i=await new Promise(((e,t)=>Fi.generateKeyPair("rsa",r,((r,i,n)=>{r?t(r):e(Li.decode(n,"der"))}))));return{n:i.modulus.toArrayLike(Uint8Array),e:i.publicExponent.toArrayLike(Uint8Array),d:i.privateExponent.toArrayLike(Uint8Array),p:i.prime2.toArrayLike(Uint8Array),q:i.prime1.toArrayLike(Uint8Array),u:i.coefficient.toArrayLike(Uint8Array)}}let r,i,n;do{i=await Di(e-(e>>1),t,40),r=await Di(e>>1,t,40),n=r.mul(i)}while(n.bitLength()!==e);const a=r.dec().imul(i.dec());return i.lt(r)&&([r,i]=[i,r]),{n:n.toUint8Array(),e:t.toUint8Array(),d:t.modInv(a).toUint8Array(),p:r.toUint8Array(),q:i.toUint8Array(),u:r.modInv(i).toUint8Array()}},validateParams:async function(e,t,r,i,n,a){const s=await V.getBigInteger();if(e=new s(e),i=new s(i),n=new s(n),!i.mul(n).equal(e))return!1;const o=new s(2);if(a=new s(a),!i.mul(a).mod(n).isOne())return!1;t=new s(t),r=new s(r);const c=new s(Math.floor(e.bitLength()/3)),u=await Mi(o,o.leftShift(c)),h=u.mul(r).mul(t);return!(!h.mod(i.dec()).equal(u)||!h.mod(n.dec()).equal(u))}});var Hi=/*#__PURE__*/Object.freeze({__proto__:null,encrypt:async function(e,t,r,i){const n=await V.getBigInteger();t=new n(t),r=new n(r),i=new n(i);const a=new n(await Bi(e,t.byteLength())),s=await Mi(new n(1),t.dec());return{c1:r.modExp(s,t).toUint8Array(),c2:i.modExp(s,t).imul(a).imod(t).toUint8Array()}},decrypt:async function(e,t,r,i){const n=await V.getBigInteger();return e=new n(e),t=new n(t),r=new n(r),i=new n(i),Ti(e.modExp(i,r).modInv(r).imul(t).imod(r).toUint8Array("be",r.byteLength()))},validateParams:async function(e,t,r,i){const n=await V.getBigInteger();e=new n(e),t=new n(t),r=new n(r);const a=new n(1);if(t.lte(a)||t.gte(e))return!1;const s=new n(e.bitLength()),o=new n(1023);if(s.lt(o))return!1;if(!t.modExp(e.dec(),e).isOne())return!1;let c=t;const u=new n(1),h=new n(2).leftShift(new n(17));for(;u.lt(h);){if(c=c.mul(t).imod(e),c.isOne())return!1;u.iinc()}i=new n(i);const d=new n(2),f=await Mi(d.leftShift(s.dec()),d.leftShift(s)),l=e.dec().imul(f).iadd(i);return!!r.equal(t.modExp(l,e))}});class Gi{constructor(e){if(e instanceof Gi)this.oid=e.oid;else if(V.isArray(e)||V.isUint8Array(e)){if(6===(e=new Uint8Array(e))[0]){if(e[1]!==e.length-2)throw Error("Length mismatch in DER encoded oid");e=e.subarray(2)}this.oid=e}else this.oid=""}read(e){if(e.length>=1){const t=e[0];if(e.length>=1+t)return this.oid=e.subarray(1,1+t),1+this.oid.length}throw Error("Invalid oid")}write(){return V.concatUint8Array([new Uint8Array([this.oid.length]),this.oid])}toHex(){return V.uint8ArrayToHex(this.oid)}getName(){const e=this.toHex();if(re.curve[e])return re.write(re.curve,e);throw Error("Unknown curve object identifier.")}}function Vi(e,t){return e.keyPair({priv:t})}function $i(e,t){const r=e.keyPair({pub:t});if(!0!==r.validate().result)throw Error("Invalid elliptic public key");return r}async function Zi(e){if(!ie.useIndutnyElliptic)throw Error("This curve is only supported in the full build of OpenPGP.js");const{default:t}=await Promise.resolve().then((function(){return Xl}));return new t.ec(e)}const Yi=V.getWebCrypto(),Xi=V.getNodeCrypto(),Qi={p256:"P-256",p384:"P-384",p521:"P-521"},Ji=Xi?Xi.getCurves():[],en=Xi?{secp256k1:Ji.includes("secp256k1")?"secp256k1":void 0,p256:Ji.includes("prime256v1")?"prime256v1":void 0,p384:Ji.includes("secp384r1")?"secp384r1":void 0,p521:Ji.includes("secp521r1")?"secp521r1":void 0,ed25519:Ji.includes("ED25519")?"ED25519":void 0,curve25519:Ji.includes("X25519")?"X25519":void 0,brainpoolP256r1:Ji.includes("brainpoolP256r1")?"brainpoolP256r1":void 0,brainpoolP384r1:Ji.includes("brainpoolP384r1")?"brainpoolP384r1":void 0,brainpoolP512r1:Ji.includes("brainpoolP512r1")?"brainpoolP512r1":void 0}:{},tn={p256:{oid:[6,8,42,134,72,206,61,3,1,7],keyType:re.publicKey.ecdsa,hash:re.hash.sha256,cipher:re.symmetric.aes128,node:en.p256,web:Qi.p256,payloadSize:32,sharedSize:256},p384:{oid:[6,5,43,129,4,0,34],keyType:re.publicKey.ecdsa,hash:re.hash.sha384,cipher:re.symmetric.aes192,node:en.p384,web:Qi.p384,payloadSize:48,sharedSize:384},p521:{oid:[6,5,43,129,4,0,35],keyType:re.publicKey.ecdsa,hash:re.hash.sha512,cipher:re.symmetric.aes256,node:en.p521,web:Qi.p521,payloadSize:66,sharedSize:528},secp256k1:{oid:[6,5,43,129,4,0,10],keyType:re.publicKey.ecdsa,hash:re.hash.sha256,cipher:re.symmetric.aes128,node:en.secp256k1,payloadSize:32},ed25519:{oid:[6,9,43,6,1,4,1,218,71,15,1],keyType:re.publicKey.eddsa,hash:re.hash.sha512,node:!1,payloadSize:32},curve25519:{oid:[6,10,43,6,1,4,1,151,85,1,5,1],keyType:re.publicKey.ecdh,hash:re.hash.sha256,cipher:re.symmetric.aes128,node:!1,payloadSize:32},brainpoolP256r1:{oid:[6,9,43,36,3,3,2,8,1,1,7],keyType:re.publicKey.ecdsa,hash:re.hash.sha256,cipher:re.symmetric.aes128,node:en.brainpoolP256r1,payloadSize:32},brainpoolP384r1:{oid:[6,9,43,36,3,3,2,8,1,1,11],keyType:re.publicKey.ecdsa,hash:re.hash.sha384,cipher:re.symmetric.aes192,node:en.brainpoolP384r1,payloadSize:48},brainpoolP512r1:{oid:[6,9,43,36,3,3,2,8,1,1,13],keyType:re.publicKey.ecdsa,hash:re.hash.sha512,cipher:re.symmetric.aes256,node:en.brainpoolP512r1,payloadSize:64}};class rn{constructor(e,t){try{(V.isArray(e)||V.isUint8Array(e))&&(e=new Gi(e)),e instanceof Gi&&(e=e.getName()),this.name=re.write(re.curve,e)}catch(e){throw Error("Not valid curve")}t=t||tn[this.name],this.keyType=t.keyType,this.oid=t.oid,this.hash=t.hash,this.cipher=t.cipher,this.node=t.node&&tn[this.name],this.web=t.web&&tn[this.name],this.payloadSize=t.payloadSize,this.web&&V.getWebCrypto()?this.type="web":this.node&&V.getNodeCrypto()?this.type="node":"curve25519"===this.name?this.type="curve25519":"ed25519"===this.name&&(this.type="ed25519")}async genKeyPair(){let e;switch(this.type){case"web":try{return await async function(e){const t=await Yi.generateKey({name:"ECDSA",namedCurve:Qi[e]},!0,["sign","verify"]),r=await Yi.exportKey("jwk",t.privateKey);return{publicKey:an(await Yi.exportKey("jwk",t.publicKey)),privateKey:J(r.d)}}(this.name)}catch(e){V.printDebugError("Browser did not support generating ec key "+e.message);break}case"node":return async function(e){const t=Xi.createECDH(en[e]);return await t.generateKeys(),{publicKey:new Uint8Array(t.getPublicKey()),privateKey:new Uint8Array(t.getPrivateKey())}}(this.name);case"curve25519":{const t=await xi(32);t[0]=127&t[0]|64,t[31]&=248;const r=t.slice().reverse();e=Ei.box.keyPair.fromSecretKey(r);return{publicKey:V.concatUint8Array([new Uint8Array([64]),e.publicKey]),privateKey:t}}case"ed25519":{const e=await xi(32),t=Ei.sign.keyPair.fromSeed(e);return{publicKey:V.concatUint8Array([new Uint8Array([64]),t.publicKey]),privateKey:e}}}const t=await Zi(this.name);return e=await t.genKeyPair({entropy:V.uint8ArrayToString(await xi(32))}),{publicKey:new Uint8Array(e.getPublic("array",!1)),privateKey:e.getPrivate().toArrayLike(Uint8Array)}}}async function nn(e,t,r,i){const n={p256:!0,p384:!0,p521:!0,secp256k1:!0,curve25519:e===re.publicKey.ecdh,brainpoolP256r1:!0,brainpoolP384r1:!0,brainpoolP512r1:!0},a=t.getName();if(!n[a])return!1;if("curve25519"===a){i=i.slice().reverse();const{publicKey:e}=Ei.box.keyPair.fromSecretKey(i);r=new Uint8Array(r);const t=new Uint8Array([64,...e]);return!!V.equalsUint8Array(t,r)}const s=await Zi(a);try{r=$i(s,r).getPublic()}catch(e){return!1}return!!Vi(s,i).getPublic().eq(r)}function an(e){const t=J(e.x),r=J(e.y),i=new Uint8Array(t.length+r.length+1);return i[0]=4,i.set(t,1),i.set(r,t.length+1),i}function sn(e,t,r){const i=e,n=r.slice(1,i+1),a=r.slice(i+1,2*i+1);return{kty:"EC",crv:t,x:ee(n,!0),y:ee(a,!0),ext:!0}}function on(e,t,r,i){const n=sn(e,t,r);return n.d=ee(i,!0),n}const cn=V.getWebCrypto(),un=V.getNodeCrypto();async function hn(e,t,r,i,n,a){const s=new rn(e);if(r&&!V.isStream(r)){const e={publicKey:i,privateKey:n};switch(s.type){case"web":try{return await async function(e,t,r,i){const n=e.payloadSize,a=on(e.payloadSize,Qi[e.name],i.publicKey,i.privateKey),s=await cn.importKey("jwk",a,{name:"ECDSA",namedCurve:Qi[e.name],hash:{name:re.read(re.webHash,e.hash)}},!1,["sign"]),o=new Uint8Array(await cn.sign({name:"ECDSA",namedCurve:Qi[e.name],hash:{name:re.read(re.webHash,t)}},s,r));return{r:o.slice(0,n),s:o.slice(n,n<<1)}}(s,t,r,e)}catch(e){if("p521"!==s.name&&("DataError"===e.name||"OperationError"===e.name))throw e;V.printDebugError("Browser did not support signing: "+e.message)}break;case"node":{const i=await async function(e,t,r,i){const n=un.createSign(re.read(re.hash,t));n.write(r),n.end();const a=pn.encode({version:1,parameters:e.oid,privateKey:Array.from(i.privateKey),publicKey:{unused:0,data:Array.from(i.publicKey)}},"pem",{label:"EC PRIVATE KEY"});return ln.decode(n.sign(a),"der")}(s,t,r,e);return{r:i.r.toArrayLike(Uint8Array),s:i.s.toArrayLike(Uint8Array)}}}}return async function(e,t,r){const i=await Zi(e.name),n=Vi(i,r).sign(t);return{r:n.r.toArrayLike(Uint8Array),s:n.s.toArrayLike(Uint8Array)}}(s,a,n)}async function dn(e,t,r,i,n,a){const s=new rn(e);if(i&&!V.isStream(i))switch(s.type){case"web":try{return await async function(e,t,{r,s:i},n,a){const s=sn(e.payloadSize,Qi[e.name],a),o=await cn.importKey("jwk",s,{name:"ECDSA",namedCurve:Qi[e.name],hash:{name:re.read(re.webHash,e.hash)}},!1,["verify"]),c=V.concatUint8Array([r,i]).buffer;return cn.verify({name:"ECDSA",namedCurve:Qi[e.name],hash:{name:re.read(re.webHash,t)}},o,c,n)}(s,t,r,i,n)}catch(e){if("p521"!==s.name&&("DataError"===e.name||"OperationError"===e.name))throw e;V.printDebugError("Browser did not support verifying: "+e.message)}break;case"node":return async function(e,t,{r,s:i},n,a){const{default:s}=await Promise.resolve().then((function(){return Rf})),o=un.createVerify(re.read(re.hash,t));o.write(n),o.end();const c=bn.encode({algorithm:{algorithm:[1,2,840,10045,2,1],parameters:e.oid},subjectPublicKey:{unused:0,data:Array.from(a)}},"pem",{label:"PUBLIC KEY"}),u=ln.encode({r:new s(r),s:new s(i)},"der");try{return o.verify(c,u)}catch(e){return!1}}(s,t,r,i,n)}return async function(e,t,r,i){const n=await Zi(e.name);return $i(n,i).verify(r,t)}(s,r,void 0===t?i:a,n)}const fn=void 0,ln=un?fn.define("ECDSASignature",(function(){this.seq().obj(this.key("r").int(),this.key("s").int())})):void 0,pn=un?fn.define("ECPrivateKey",(function(){this.seq().obj(this.key("version").int(),this.key("privateKey").octstr(),this.key("parameters").explicit(0).optional().any(),this.key("publicKey").explicit(1).optional().bitstr())})):void 0,yn=un?fn.define("AlgorithmIdentifier",(function(){this.seq().obj(this.key("algorithm").objid(),this.key("parameters").optional().any())})):void 0,bn=un?fn.define("SubjectPublicKeyInfo",(function(){this.seq().obj(this.key("algorithm").use(yn),this.key("subjectPublicKey").bitstr())})):void 0;var mn=/*#__PURE__*/Object.freeze({__proto__:null,sign:hn,verify:dn,validateParams:async function(e,t,r){const i=new rn(e);if(i.keyType!==re.publicKey.ecdsa)return!1;switch(i.type){case"web":case"node":{const i=await xi(8),n=re.hash.sha256,a=await Tr.digest(n,i);try{const s=await hn(e,n,i,t,r,a);return await dn(e,n,s,i,t,a)}catch(e){return!1}}default:return nn(re.publicKey.ecdsa,e,t,r)}}});Ei.hash=e=>new Uint8Array(Wt().update(e).digest());var gn=/*#__PURE__*/Object.freeze({__proto__:null,sign:async function(e,t,r,i,n,a){if(Tr.getHashByteLength(t)<Tr.getHashByteLength(re.hash.sha256))throw Error("Hash algorithm too weak: sha256 or stronger is required for EdDSA.");const s=V.concatUint8Array([n,i.subarray(1)]),o=Ei.sign.detached(a,s);return{r:o.subarray(0,32),s:o.subarray(32)}},verify:async function(e,t,{r,s:i},n,a,s){const o=V.concatUint8Array([r,i]);return Ei.sign.detached.verify(s,o,a.subarray(1))},validateParams:async function(e,t,r){if("ed25519"!==e.getName())return!1;const{publicKey:i}=Ei.sign.keyPair.fromSeed(r),n=new Uint8Array([64,...i]);return V.equalsUint8Array(t,n)}});function wn(e,t){const r=new je["aes"+8*e.length](e),i=new Uint32Array([2795939494,2795939494]),n=_n(t);let a=i;const s=n,o=n.length/2,c=new Uint32Array([0,0]);let u=new Uint32Array(4);for(let e=0;e<=5;++e)for(let t=0;t<o;++t)c[1]=o*e+(1+t),u[0]=a[0],u[1]=a[1],u[2]=s[2*t],u[3]=s[2*t+1],u=_n(r.encrypt(kn(u))),a=u.subarray(0,2),a[0]^=c[0],a[1]^=c[1],s[2*t]=u[2],s[2*t+1]=u[3];return kn(a,s)}function vn(e,t){const r=new je["aes"+8*e.length](e),i=new Uint32Array([2795939494,2795939494]),n=_n(t);let a=n.subarray(0,2);const s=n.subarray(2),o=n.length/2-1,c=new Uint32Array([0,0]);let u=new Uint32Array(4);for(let e=5;e>=0;--e)for(let t=o-1;t>=0;--t)c[1]=o*e+(t+1),u[0]=a[0]^c[0],u[1]=a[1]^c[1],u[2]=s[2*t],u[3]=s[2*t+1],u=_n(r.decrypt(kn(u))),a=u.subarray(0,2),s[2*t]=u[2],s[2*t+1]=u[3];if(a[0]===i[0]&&a[1]===i[1])return kn(s);throw Error("Key Data Integrity failed")}function _n(e){const{length:t}=e,r=function(e){if(V.isString(e)){const{length:t}=e,r=new ArrayBuffer(t),i=new Uint8Array(r);for(let r=0;r<t;++r)i[r]=e.charCodeAt(r);return r}return new Uint8Array(e).buffer}(e),i=new DataView(r),n=new Uint32Array(t/4);for(let e=0;e<t/4;++e)n[e]=i.getUint32(4*e);return n}function kn(){let e=0;for(let t=0;t<arguments.length;++t)e+=4*arguments[t].length;const t=new ArrayBuffer(e),r=new DataView(t);let i=0;for(let e=0;e<arguments.length;++e){for(let t=0;t<arguments[e].length;++t)r.setUint32(i+4*t,arguments[e][t]);i+=4*arguments[e].length}return new Uint8Array(t)}var An=/*#__PURE__*/Object.freeze({__proto__:null,wrap:wn,unwrap:vn});function Sn(e){const t=8-e.length%8,r=new Uint8Array(e.length+t).fill(t);return r.set(e),r}function En(e){const t=e.length;if(t>0){const r=e[t-1];if(r>=1){const i=e.subarray(t-r),n=new Uint8Array(r).fill(r);if(V.equalsUint8Array(i,n))return e.subarray(0,t-r)}}throw Error("Invalid padding")}var Pn=/*#__PURE__*/Object.freeze({__proto__:null,encode:Sn,decode:En});const xn=V.getWebCrypto(),Mn=V.getNodeCrypto();function Cn(e,t,r,i){return V.concatUint8Array([t.write(),new Uint8Array([e]),r.write(),V.stringToUint8Array("Anonymous Sender    "),i.subarray(0,20)])}async function Kn(e,t,r,i,n=!1,a=!1){let s;if(n){for(s=0;s<t.length&&0===t[s];s++);t=t.subarray(s)}if(a){for(s=t.length-1;s>=0&&0===t[s];s--);t=t.subarray(0,s+1)}return(await Tr.digest(e,V.concatUint8Array([new Uint8Array([0,0,0,1]),t,i]))).subarray(0,r)}async function Dn(e,t){switch(e.type){case"curve25519":{const r=await xi(32),{secretKey:i,sharedKey:n}=await Rn(e,t,null,r);let{publicKey:a}=Ei.box.keyPair.fromSecretKey(i);return a=V.concatUint8Array([new Uint8Array([64]),a]),{publicKey:a,sharedKey:n}}case"web":if(e.web&&V.getWebCrypto())try{return await async function(e,t){const r=sn(e.payloadSize,e.web.web,t);let i=xn.generateKey({name:"ECDH",namedCurve:e.web.web},!0,["deriveKey","deriveBits"]),n=xn.importKey("jwk",r,{name:"ECDH",namedCurve:e.web.web},!1,[]);[i,n]=await Promise.all([i,n]);let a=xn.deriveBits({name:"ECDH",namedCurve:e.web.web,public:n},i.privateKey,e.web.sharedSize),s=xn.exportKey("jwk",i.publicKey);[a,s]=await Promise.all([a,s]);const o=new Uint8Array(a);return{publicKey:new Uint8Array(an(s)),sharedKey:o}}(e,t)}catch(e){V.printDebugError(e)}break;case"node":return async function(e,t){const r=Mn.createECDH(e.node.node);r.generateKeys();const i=new Uint8Array(r.computeSecret(t));return{publicKey:new Uint8Array(r.getPublicKey()),sharedKey:i}}(e,t)}return async function(e,t){const r=await Zi(e.name),i=await e.genKeyPair();t=$i(r,t);const n=Vi(r,i.privateKey),a=i.publicKey,s=n.derive(t.getPublic()),o=r.curve.p.byteLength(),c=s.toArrayLike(Uint8Array,"be",o);return{publicKey:a,sharedKey:c}}(e,t)}async function Rn(e,t,r,i){if(i.length!==e.payloadSize){const t=new Uint8Array(e.payloadSize);t.set(i,e.payloadSize-i.length),i=t}switch(e.type){case"curve25519":{const e=i.slice().reverse();return{secretKey:e,sharedKey:Ei.scalarMult(e,t.subarray(1))}}case"web":if(e.web&&V.getWebCrypto())try{return await async function(e,t,r,i){const n=on(e.payloadSize,e.web.web,r,i);let a=xn.importKey("jwk",n,{name:"ECDH",namedCurve:e.web.web},!0,["deriveKey","deriveBits"]);const s=sn(e.payloadSize,e.web.web,t);let o=xn.importKey("jwk",s,{name:"ECDH",namedCurve:e.web.web},!0,[]);[a,o]=await Promise.all([a,o]);let c=xn.deriveBits({name:"ECDH",namedCurve:e.web.web,public:o},a,e.web.sharedSize),u=xn.exportKey("jwk",a);[c,u]=await Promise.all([c,u]);const h=new Uint8Array(c);return{secretKey:J(u.d),sharedKey:h}}(e,t,r,i)}catch(e){V.printDebugError(e)}break;case"node":return async function(e,t,r){const i=Mn.createECDH(e.node.node);i.setPrivateKey(r);const n=new Uint8Array(i.computeSecret(t));return{secretKey:new Uint8Array(i.getPrivateKey()),sharedKey:n}}(e,t,i)}return async function(e,t,r){const i=await Zi(e.name);t=$i(i,t),r=Vi(i,r);const n=new Uint8Array(r.getPrivate()),a=r.derive(t.getPublic()),s=i.curve.p.byteLength(),o=a.toArrayLike(Uint8Array,"be",s);return{secretKey:n,sharedKey:o}}(e,t,i)}var In=/*#__PURE__*/Object.freeze({__proto__:null,validateParams:async function(e,t,r){return nn(re.publicKey.ecdh,e,t,r)},encrypt:async function(e,t,r,i,n){const a=Sn(r),s=new rn(e),{publicKey:o,sharedKey:c}=await Dn(s,i),u=Cn(re.publicKey.ecdh,e,t,n),h=re.read(re.symmetric,t.cipher);return{publicKey:o,wrappedKey:wn(await Kn(t.hash,c,je[h].keySize,u),a)}},decrypt:async function(e,t,r,i,n,a,s){const o=new rn(e),{sharedKey:c}=await Rn(o,r,n,a),u=Cn(re.publicKey.ecdh,e,t,s),h=re.read(re.symmetric,t.cipher);let d;for(let e=0;e<3;e++)try{return En(vn(await Kn(t.hash,c,je[h].keySize,u,1===e,2===e),i))}catch(e){d=e}throw d}});var Un={rsa:Wi,elgamal:Hi,elliptic:/*#__PURE__*/Object.freeze({__proto__:null,Curve:rn,ecdh:In,ecdsa:mn,eddsa:gn,generate:async function(e){const t=await V.getBigInteger();e=new rn(e);const r=await e.genKeyPair(),i=new t(r.publicKey).toUint8Array(),n=new t(r.privateKey).toUint8Array("be",e.payloadSize);return{oid:e.oid,Q:i,secret:n,hash:e.hash,cipher:e.cipher}},getPreferredHashAlgo:function(e){return tn[re.write(re.curve,e.toHex())].hash}}),dsa:/*#__PURE__*/Object.freeze({__proto__:null,sign:async function(e,t,r,i,n,a){const s=await V.getBigInteger(),o=new s(1);let c,u,h,d;i=new s(i),n=new s(n),r=new s(r),a=new s(a),r=r.mod(i),a=a.mod(n);const f=new s(t.subarray(0,n.byteLength())).mod(n);for(;;){if(c=await Mi(o,n),u=r.modExp(c,i).imod(n),u.isZero())continue;const e=a.mul(u).imod(n);if(d=f.add(e).imod(n),h=c.modInv(n).imul(d).imod(n),!h.isZero())break}return{r:u.toUint8Array("be",n.byteLength()),s:h.toUint8Array("be",n.byteLength())}},verify:async function(e,t,r,i,n,a,s,o){const c=await V.getBigInteger(),u=new c(0);if(t=new c(t),r=new c(r),a=new c(a),s=new c(s),n=new c(n),o=new c(o),t.lte(u)||t.gte(s)||r.lte(u)||r.gte(s))return V.printDebug("invalid DSA Signature"),!1;const h=new c(i.subarray(0,s.byteLength())).imod(s),d=r.modInv(s);if(d.isZero())return V.printDebug("invalid DSA Signature"),!1;n=n.mod(a),o=o.mod(a);const f=h.mul(d).imod(s),l=t.mul(d).imod(s),p=n.modExp(f,a),y=o.modExp(l,a);return p.mul(y).imod(a).imod(s).equal(t)},validateParams:async function(e,t,r,i,n){const a=await V.getBigInteger();e=new a(e),t=new a(t),r=new a(r),i=new a(i);const s=new a(1);if(r.lte(s)||r.gte(e))return!1;if(!e.dec().mod(t).isZero())return!1;if(!r.modExp(t,e).isOne())return!1;const o=new a(t.bitLength()),c=new a(150);if(o.lt(c)||!await Ri(t,null,32))return!1;n=new a(n);const u=new a(2),h=await Mi(u.leftShift(o.dec()),u.leftShift(o)),d=t.mul(h).add(n);return!!i.equal(r.modExp(d,e))}}),nacl:Ei};var Bn=/*#__PURE__*/Object.freeze({__proto__:null,parseSignatureParams:function(e,t){let r=0;switch(e){case re.publicKey.rsaEncryptSign:case re.publicKey.rsaEncrypt:case re.publicKey.rsaSign:return{s:V.readMPI(t.subarray(r))};case re.publicKey.dsa:case re.publicKey.ecdsa:{const e=V.readMPI(t.subarray(r));r+=e.length+2;return{r:e,s:V.readMPI(t.subarray(r))}}case re.publicKey.eddsa:{let e=V.readMPI(t.subarray(r));r+=e.length+2,e=V.leftPad(e,32);let i=V.readMPI(t.subarray(r));return i=V.leftPad(i,32),{r:e,s:i}}default:throw Error("Invalid signature algorithm.")}},verify:async function(e,t,r,i,n,a){switch(e){case re.publicKey.rsaEncryptSign:case re.publicKey.rsaEncrypt:case re.publicKey.rsaSign:{const{n:e,e:s}=i,o=V.leftPad(r.s,e.length);return Un.rsa.verify(t,n,o,e,s,a)}case re.publicKey.dsa:{const{g:e,p:n,q:s,y:o}=i,{r:c,s:u}=r;return Un.dsa.verify(t,c,u,a,e,n,s,o)}case re.publicKey.ecdsa:{const{oid:e,Q:s}=i,o=new Un.elliptic.Curve(e).payloadSize,c=V.leftPad(r.r,o),u=V.leftPad(r.s,o);return Un.elliptic.ecdsa.verify(e,t,{r:c,s:u},n,s,a)}case re.publicKey.eddsa:{const{oid:e,Q:s}=i;return Un.elliptic.eddsa.verify(e,t,r,n,s,a)}default:throw Error("Invalid signature algorithm.")}},sign:async function(e,t,r,i,n,a){if(!r||!i)throw Error("Missing key parameters");switch(e){case re.publicKey.rsaEncryptSign:case re.publicKey.rsaEncrypt:case re.publicKey.rsaSign:{const{n:e,e:s}=r,{d:o,p:c,q:u,u:h}=i;return{s:await Un.rsa.sign(t,n,e,s,o,c,u,h,a)}}case re.publicKey.dsa:{const{g:e,p:n,q:s}=r,{x:o}=i;return Un.dsa.sign(t,a,e,n,s,o)}case re.publicKey.elgamal:throw Error("Signing with Elgamal is not defined in the OpenPGP standard.");case re.publicKey.ecdsa:{const{oid:e,Q:s}=r,{d:o}=i;return Un.elliptic.ecdsa.sign(e,t,n,s,o,a)}case re.publicKey.eddsa:{const{oid:e,Q:s}=r,{seed:o}=i;return Un.elliptic.eddsa.sign(e,t,n,s,o,a)}default:throw Error("Invalid signature algorithm.")}}});class Tn{constructor(e){e=void 0===e?new Uint8Array([]):V.isString(e)?V.stringToUint8Array(e):new Uint8Array(e),this.data=e}read(e){if(e.length>=1){const t=e[0];if(e.length>=1+t)return this.data=e.subarray(1,1+t),1+this.data.length}throw Error("Invalid symmetric key")}write(){return V.concatUint8Array([new Uint8Array([this.data.length]),this.data])}}class zn{constructor(e){if(e){const{hash:t,cipher:r}=e;this.hash=t,this.cipher=r}else this.hash=null,this.cipher=null}read(e){if(e.length<4||3!==e[0]||1!==e[1])throw Error("Cannot read KDFParams");return this.hash=e[2],this.cipher=e[3],4}write(){return new Uint8Array([3,1,this.hash,this.cipher])}}var qn=/*#__PURE__*/Object.freeze({__proto__:null,publicKeyEncrypt:async function(e,t,r,i){switch(e){case re.publicKey.rsaEncrypt:case re.publicKey.rsaEncryptSign:{const{n:e,e:i}=t;return{c:await Un.rsa.encrypt(r,e,i)}}case re.publicKey.elgamal:{const{p:e,g:i,y:n}=t;return Un.elgamal.encrypt(r,e,i,n)}case re.publicKey.ecdh:{const{oid:e,Q:n,kdfParams:a}=t,{publicKey:s,wrappedKey:o}=await Un.elliptic.ecdh.encrypt(e,a,r,n,i);return{V:s,C:new Tn(o)}}default:return[]}},publicKeyDecrypt:async function(e,t,r,i,n){switch(e){case re.publicKey.rsaEncryptSign:case re.publicKey.rsaEncrypt:{const{c:e}=i,{n,e:a}=t,{d:s,p:o,q:c,u}=r;return Un.rsa.decrypt(e,n,a,s,o,c,u)}case re.publicKey.elgamal:{const{c1:e,c2:n}=i,a=t.p,s=r.x;return Un.elgamal.decrypt(e,n,a,s)}case re.publicKey.ecdh:{const{oid:e,Q:a,kdfParams:s}=t,{d:o}=r,{V:c,C:u}=i;return Un.elliptic.ecdh.decrypt(e,s,c,u.data,a,o,n)}default:throw Error("Invalid public key encryption algorithm.")}},parsePublicKeyParams:function(e,t){let r=0;switch(e){case re.publicKey.rsaEncrypt:case re.publicKey.rsaEncryptSign:case re.publicKey.rsaSign:{const e=V.readMPI(t.subarray(r));r+=e.length+2;const i=V.readMPI(t.subarray(r));return r+=i.length+2,{read:r,publicParams:{n:e,e:i}}}case re.publicKey.dsa:{const e=V.readMPI(t.subarray(r));r+=e.length+2;const i=V.readMPI(t.subarray(r));r+=i.length+2;const n=V.readMPI(t.subarray(r));r+=n.length+2;const a=V.readMPI(t.subarray(r));return r+=a.length+2,{read:r,publicParams:{p:e,q:i,g:n,y:a}}}case re.publicKey.elgamal:{const e=V.readMPI(t.subarray(r));r+=e.length+2;const i=V.readMPI(t.subarray(r));r+=i.length+2;const n=V.readMPI(t.subarray(r));return r+=n.length+2,{read:r,publicParams:{p:e,g:i,y:n}}}case re.publicKey.ecdsa:{const e=new Gi;r+=e.read(t);const i=V.readMPI(t.subarray(r));return r+=i.length+2,{read:r,publicParams:{oid:e,Q:i}}}case re.publicKey.eddsa:{const e=new Gi;r+=e.read(t);let i=V.readMPI(t.subarray(r));return r+=i.length+2,i=V.leftPad(i,33),{read:r,publicParams:{oid:e,Q:i}}}case re.publicKey.ecdh:{const e=new Gi;r+=e.read(t);const i=V.readMPI(t.subarray(r));r+=i.length+2;const n=new zn;return r+=n.read(t.subarray(r)),{read:r,publicParams:{oid:e,Q:i,kdfParams:n}}}default:throw Error("Invalid public key encryption algorithm.")}},parsePrivateKeyParams:function(e,t,r){let i=0;switch(e){case re.publicKey.rsaEncrypt:case re.publicKey.rsaEncryptSign:case re.publicKey.rsaSign:{const e=V.readMPI(t.subarray(i));i+=e.length+2;const r=V.readMPI(t.subarray(i));i+=r.length+2;const n=V.readMPI(t.subarray(i));i+=n.length+2;const a=V.readMPI(t.subarray(i));return i+=a.length+2,{read:i,privateParams:{d:e,p:r,q:n,u:a}}}case re.publicKey.dsa:case re.publicKey.elgamal:{const e=V.readMPI(t.subarray(i));return i+=e.length+2,{read:i,privateParams:{x:e}}}case re.publicKey.ecdsa:case re.publicKey.ecdh:{const e=new rn(r.oid);let n=V.readMPI(t.subarray(i));return i+=n.length+2,n=V.leftPad(n,e.payloadSize),{read:i,privateParams:{d:n}}}case re.publicKey.eddsa:{let e=V.readMPI(t.subarray(i));return i+=e.length+2,e=V.leftPad(e,32),{read:i,privateParams:{seed:e}}}default:throw Error("Invalid public key encryption algorithm.")}},parseEncSessionKeyParams:function(e,t){let r=0;switch(e){case re.publicKey.rsaEncrypt:case re.publicKey.rsaEncryptSign:return{c:V.readMPI(t.subarray(r))};case re.publicKey.elgamal:{const e=V.readMPI(t.subarray(r));r+=e.length+2;return{c1:e,c2:V.readMPI(t.subarray(r))}}case re.publicKey.ecdh:{const e=V.readMPI(t.subarray(r));r+=e.length+2;const i=new Tn;return i.read(t.subarray(r)),{V:e,C:i}}default:throw Error("Invalid public key encryption algorithm.")}},serializeParams:function(e,t){const r=Object.keys(t).map((e=>{const r=t[e];return V.isUint8Array(r)?V.uint8ArrayToMPI(r):r.write()}));return V.concatUint8Array(r)},generateParams:function(e,t,r){switch(e){case re.publicKey.rsaEncrypt:case re.publicKey.rsaEncryptSign:case re.publicKey.rsaSign:return Un.rsa.generate(t,65537).then((({n:e,e:t,d:r,p:i,q:n,u:a})=>({privateParams:{d:r,p:i,q:n,u:a},publicParams:{n:e,e:t}})));case re.publicKey.ecdsa:return Un.elliptic.generate(r).then((({oid:e,Q:t,secret:r})=>({privateParams:{d:r},publicParams:{oid:new Gi(e),Q:t}})));case re.publicKey.eddsa:return Un.elliptic.generate(r).then((({oid:e,Q:t,secret:r})=>({privateParams:{seed:r},publicParams:{oid:new Gi(e),Q:t}})));case re.publicKey.ecdh:return Un.elliptic.generate(r).then((({oid:e,Q:t,secret:r,hash:i,cipher:n})=>({privateParams:{d:r},publicParams:{oid:new Gi(e),Q:t,kdfParams:new zn({hash:i,cipher:n})}})));case re.publicKey.dsa:case re.publicKey.elgamal:throw Error("Unsupported algorithm for key generation.");default:throw Error("Invalid public key algorithm.")}},validateParams:async function(e,t,r){if(!t||!r)throw Error("Missing key parameters");switch(e){case re.publicKey.rsaEncrypt:case re.publicKey.rsaEncryptSign:case re.publicKey.rsaSign:{const{n:e,e:i}=t,{d:n,p:a,q:s,u:o}=r;return Un.rsa.validateParams(e,i,n,a,s,o)}case re.publicKey.dsa:{const{p:e,q:i,g:n,y:a}=t,{x:s}=r;return Un.dsa.validateParams(e,i,n,a,s)}case re.publicKey.elgamal:{const{p:e,g:i,y:n}=t,{x:a}=r;return Un.elgamal.validateParams(e,i,n,a)}case re.publicKey.ecdsa:case re.publicKey.ecdh:{const i=Un.elliptic[re.read(re.publicKey,e)],{oid:n,Q:a}=t,{d:s}=r;return i.validateParams(n,a,s)}case re.publicKey.eddsa:{const{oid:e,Q:i}=t,{seed:n}=r;return Un.elliptic.eddsa.validateParams(e,i,n)}default:throw Error("Invalid public key algorithm.")}},getPrefixRandom:async function(e){const t=await xi(je[e].blockSize),r=new Uint8Array([t[t.length-2],t[t.length-1]]);return V.concat([t,r])},generateSessionKey:function(e){return xi(je[e].keySize)}});const On={cipher:je,hash:Tr,mode:Si,publicKey:Un,signature:Bn,random:Ki,pkcs1:qi,pkcs5:Pn,aesKW:An};Object.assign(On,qn);var Fn="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;function Nn(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)}const Ln={arraySet:function(e,t,r,i,n){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+i),n);else for(let a=0;a<i;a++)e[n+a]=t[r+a]},flattenChunks:function(e){let t,r,i,n,a;for(i=0,t=0,r=e.length;t<r;t++)i+=e[t].length;const s=new Uint8Array(i);for(n=0,t=0,r=e.length;t<r;t++)a=e[t],s.set(a,n),n+=a.length;return s}},jn={arraySet:function(e,t,r,i,n){for(let a=0;a<i;a++)e[n+a]=t[r+a]},flattenChunks:function(e){return[].concat.apply([],e)}};let Wn=Fn?Uint8Array:Array,Hn=Fn?Uint16Array:Array,Gn=Fn?Int32Array:Array,Vn=Fn?Ln.flattenChunks:jn.flattenChunks,$n=Fn?Ln.arraySet:jn.arraySet;const Zn=-2;function Yn(e){let t=e.length;for(;--t>=0;)e[t]=0}const Xn=256,Qn=286,Jn=30,ea=15,ta=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ra=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],ia=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],na=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],aa=Array(576);Yn(aa);const sa=Array(60);Yn(sa);const oa=Array(512);Yn(oa);const ca=Array(256);Yn(ca);const ua=Array(29);Yn(ua);const ha=Array(Jn);function da(e,t,r,i,n){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=i,this.max_length=n,this.has_stree=e&&e.length}let fa,la,pa;function ya(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function ba(e){return e<256?oa[e]:oa[256+(e>>>7)]}function ma(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function ga(e,t,r){e.bi_valid>16-r?(e.bi_buf|=t<<e.bi_valid&65535,ma(e,e.bi_buf),e.bi_buf=t>>16-e.bi_valid,e.bi_valid+=r-16):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function wa(e,t,r){ga(e,r[2*t],r[2*t+1])}function va(e,t){let r=0;do{r|=1&e,e>>>=1,r<<=1}while(--t>0);return r>>>1}function _a(e,t,r){const i=Array(16);let n,a,s=0;for(n=1;n<=ea;n++)i[n]=s=s+r[n-1]<<1;for(a=0;a<=t;a++){const t=e[2*a+1];0!==t&&(e[2*a]=va(i[t]++,t))}}function ka(e){let t;for(t=0;t<Qn;t++)e.dyn_ltree[2*t]=0;for(t=0;t<Jn;t++)e.dyn_dtree[2*t]=0;for(t=0;t<19;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function Aa(e){e.bi_valid>8?ma(e,e.bi_buf):e.bi_valid>0&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function Sa(e,t,r,i){const n=2*t,a=2*r;return e[n]<e[a]||e[n]===e[a]&&i[t]<=i[r]}function Ea(e,t,r){const i=e.heap[r];let n=r<<1;for(;n<=e.heap_len&&(n<e.heap_len&&Sa(t,e.heap[n+1],e.heap[n],e.depth)&&n++,!Sa(t,i,e.heap[n],e.depth));)e.heap[r]=e.heap[n],r=n,n<<=1;e.heap[r]=i}function Pa(e,t,r){let i,n,a,s,o=0;if(0!==e.last_lit)do{i=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],n=e.pending_buf[e.l_buf+o],o++,0===i?wa(e,n,t):(a=ca[n],wa(e,a+Xn+1,t),s=ta[a],0!==s&&(n-=ua[a],ga(e,n,s)),i--,a=ba(i),wa(e,a,r),s=ra[a],0!==s&&(i-=ha[a],ga(e,i,s)))}while(o<e.last_lit);wa(e,256,t)}function xa(e,t){const r=t.dyn_tree,i=t.stat_desc.static_tree,n=t.stat_desc.has_stree,a=t.stat_desc.elems;let s,o,c,u=-1;for(e.heap_len=0,e.heap_max=573,s=0;s<a;s++)0!==r[2*s]?(e.heap[++e.heap_len]=u=s,e.depth[s]=0):r[2*s+1]=0;for(;e.heap_len<2;)c=e.heap[++e.heap_len]=u<2?++u:0,r[2*c]=1,e.depth[c]=0,e.opt_len--,n&&(e.static_len-=i[2*c+1]);for(t.max_code=u,s=e.heap_len>>1;s>=1;s--)Ea(e,r,s);c=a;do{s=e.heap[1],e.heap[1]=e.heap[e.heap_len--],Ea(e,r,1),o=e.heap[1],e.heap[--e.heap_max]=s,e.heap[--e.heap_max]=o,r[2*c]=r[2*s]+r[2*o],e.depth[c]=(e.depth[s]>=e.depth[o]?e.depth[s]:e.depth[o])+1,r[2*s+1]=r[2*o+1]=c,e.heap[1]=c++,Ea(e,r,1)}while(e.heap_len>=2);e.heap[--e.heap_max]=e.heap[1],function(e,t){const r=t.dyn_tree,i=t.max_code,n=t.stat_desc.static_tree,a=t.stat_desc.has_stree,s=t.stat_desc.extra_bits,o=t.stat_desc.extra_base,c=t.stat_desc.max_length;let u,h,d,f,l,p,y=0;for(f=0;f<=ea;f++)e.bl_count[f]=0;for(r[2*e.heap[e.heap_max]+1]=0,u=e.heap_max+1;u<573;u++)h=e.heap[u],f=r[2*r[2*h+1]+1]+1,f>c&&(f=c,y++),r[2*h+1]=f,h>i||(e.bl_count[f]++,l=0,h>=o&&(l=s[h-o]),p=r[2*h],e.opt_len+=p*(f+l),a&&(e.static_len+=p*(n[2*h+1]+l)));if(0!==y){do{for(f=c-1;0===e.bl_count[f];)f--;e.bl_count[f]--,e.bl_count[f+1]+=2,e.bl_count[c]--,y-=2}while(y>0);for(f=c;0!==f;f--)for(h=e.bl_count[f];0!==h;)d=e.heap[--u],d>i||(r[2*d+1]!==f&&(e.opt_len+=(f-r[2*d+1])*r[2*d],r[2*d+1]=f),h--)}}(e,t),_a(r,u,e.bl_count)}function Ma(e,t,r){let i,n,a=-1,s=t[1],o=0,c=7,u=4;for(0===s&&(c=138,u=3),t[2*(r+1)+1]=65535,i=0;i<=r;i++)n=s,s=t[2*(i+1)+1],++o<c&&n===s||(o<u?e.bl_tree[2*n]+=o:0!==n?(n!==a&&e.bl_tree[2*n]++,e.bl_tree[32]++):o<=10?e.bl_tree[34]++:e.bl_tree[36]++,o=0,a=n,0===s?(c=138,u=3):n===s?(c=6,u=3):(c=7,u=4))}function Ca(e,t,r){let i,n,a=-1,s=t[1],o=0,c=7,u=4;for(0===s&&(c=138,u=3),i=0;i<=r;i++)if(n=s,s=t[2*(i+1)+1],!(++o<c&&n===s)){if(o<u)do{wa(e,n,e.bl_tree)}while(0!=--o);else 0!==n?(n!==a&&(wa(e,n,e.bl_tree),o--),wa(e,16,e.bl_tree),ga(e,o-3,2)):o<=10?(wa(e,17,e.bl_tree),ga(e,o-3,3)):(wa(e,18,e.bl_tree),ga(e,o-11,7));o=0,a=n,0===s?(c=138,u=3):n===s?(c=6,u=3):(c=7,u=4)}}Yn(ha);let Ka=!1;function Da(e){Ka||(!function(){let e,t,r,i,n;const a=Array(16);for(r=0,i=0;i<28;i++)for(ua[i]=r,e=0;e<1<<ta[i];e++)ca[r++]=i;for(ca[r-1]=i,n=0,i=0;i<16;i++)for(ha[i]=n,e=0;e<1<<ra[i];e++)oa[n++]=i;for(n>>=7;i<Jn;i++)for(ha[i]=n<<7,e=0;e<1<<ra[i]-7;e++)oa[256+n++]=i;for(t=0;t<=ea;t++)a[t]=0;for(e=0;e<=143;)aa[2*e+1]=8,e++,a[8]++;for(;e<=255;)aa[2*e+1]=9,e++,a[9]++;for(;e<=279;)aa[2*e+1]=7,e++,a[7]++;for(;e<=287;)aa[2*e+1]=8,e++,a[8]++;for(_a(aa,287,a),e=0;e<Jn;e++)sa[2*e+1]=5,sa[2*e]=va(e,5);fa=new da(aa,ta,257,Qn,ea),la=new da(sa,ra,0,Jn,ea),pa=new da([],ia,0,19,7)}(),Ka=!0),e.l_desc=new ya(e.dyn_ltree,fa),e.d_desc=new ya(e.dyn_dtree,la),e.bl_desc=new ya(e.bl_tree,pa),e.bi_buf=0,e.bi_valid=0,ka(e)}function Ra(e,t,r,i){ga(e,0+(i?1:0),3),function(e,t,r,i){Aa(e),i&&(ma(e,r),ma(e,~r)),$n(e.pending_buf,e.window,t,r,e.pending),e.pending+=r}(e,t,r,!0)}function Ia(e){ga(e,2,3),wa(e,256,aa),function(e){16===e.bi_valid?(ma(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):e.bi_valid>=8&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}function Ua(e,t,r,i){let n,a,s=0;e.level>0?(2===e.strm.data_type&&(e.strm.data_type=function(e){let t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<Xn;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0}(e)),xa(e,e.l_desc),xa(e,e.d_desc),s=function(e){let t;for(Ma(e,e.dyn_ltree,e.l_desc.max_code),Ma(e,e.dyn_dtree,e.d_desc.max_code),xa(e,e.bl_desc),t=18;t>=3&&0===e.bl_tree[2*na[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),n=e.opt_len+3+7>>>3,a=e.static_len+3+7>>>3,a<=n&&(n=a)):n=a=r+5,r+4<=n&&-1!==t?Ra(e,t,r,i):4===e.strategy||a===n?(ga(e,2+(i?1:0),3),Pa(e,aa,sa)):(ga(e,4+(i?1:0),3),function(e,t,r,i){let n;for(ga(e,t-257,5),ga(e,r-1,5),ga(e,i-4,4),n=0;n<i;n++)ga(e,e.bl_tree[2*na[n]+1],3);Ca(e,e.dyn_ltree,t-1),Ca(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,s+1),Pa(e,e.dyn_ltree,e.dyn_dtree)),ka(e),i&&Aa(e)}function Ba(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(ca[r]+Xn+1)]++,e.dyn_dtree[2*ba(t)]++),e.last_lit===e.lit_bufsize-1}function Ta(e,t,r,i){let n=65535&e|0,a=e>>>16&65535|0,s=0;for(;0!==r;){s=r>2e3?2e3:r,r-=s;do{n=n+t[i++]|0,a=a+n|0}while(--s);n%=65521,a%=65521}return n|a<<16|0}const za=function(){let e;const t=[];for(let r=0;r<256;r++){e=r;for(let t=0;t<8;t++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();function qa(e,t,r,i){const n=za,a=i+r;e^=-1;for(let r=i;r<a;r++)e=e>>>8^n[255&(e^t[r])];return-1^e}var Oa={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};const Fa=258,Na=262,La=103,ja=113,Wa=666;function Ha(e,t){return e.msg=Oa[t],t}function Ga(e){return(e<<1)-(e>4?9:0)}function Va(e){let t=e.length;for(;--t>=0;)e[t]=0}function $a(e){const t=e.state;let r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&($n(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function Za(e,t){Ua(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,$a(e.strm)}function Ya(e,t){e.pending_buf[e.pending++]=t}function Xa(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function Qa(e,t,r,i){let n=e.avail_in;return n>i&&(n=i),0===n?0:(e.avail_in-=n,$n(t,e.input,e.next_in,n,r),1===e.state.wrap?e.adler=Ta(e.adler,t,n,r):2===e.state.wrap&&(e.adler=qa(e.adler,t,n,r)),e.next_in+=n,e.total_in+=n,n)}function Ja(e,t){let r,i,n=e.max_chain_length,a=e.strstart,s=e.prev_length,o=e.nice_match;const c=e.strstart>e.w_size-Na?e.strstart-(e.w_size-Na):0,u=e.window,h=e.w_mask,d=e.prev,f=e.strstart+Fa;let l=u[a+s-1],p=u[a+s];e.prev_length>=e.good_match&&(n>>=2),o>e.lookahead&&(o=e.lookahead);do{if(r=t,u[r+s]===p&&u[r+s-1]===l&&u[r]===u[a]&&u[++r]===u[a+1]){a+=2,r++;do{}while(u[++a]===u[++r]&&u[++a]===u[++r]&&u[++a]===u[++r]&&u[++a]===u[++r]&&u[++a]===u[++r]&&u[++a]===u[++r]&&u[++a]===u[++r]&&u[++a]===u[++r]&&a<f);if(i=Fa-(f-a),a=f-Fa,i>s){if(e.match_start=t,s=i,i>=o)break;l=u[a+s-1],p=u[a+s]}}}while((t=d[t&h])>c&&0!=--n);return s<=e.lookahead?s:e.lookahead}function es(e){const t=e.w_size;let r,i,n,a,s;do{if(a=e.window_size-e.lookahead-e.strstart,e.strstart>=t+(t-Na)){$n(e.window,e.window,t,t,0),e.match_start-=t,e.strstart-=t,e.block_start-=t,i=e.hash_size,r=i;do{n=e.head[--r],e.head[r]=n>=t?n-t:0}while(--i);i=t,r=i;do{n=e.prev[--r],e.prev[r]=n>=t?n-t:0}while(--i);a+=t}if(0===e.strm.avail_in)break;if(i=Qa(e.strm,e.window,e.strstart+e.lookahead,a),e.lookahead+=i,e.lookahead+e.insert>=3)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+3-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<3)););}while(e.lookahead<Na&&0!==e.strm.avail_in)}function ts(e,t){let r,i;for(;;){if(e.lookahead<Na){if(es(e),e.lookahead<Na&&0===t)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=3&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-Na&&(e.match_length=Ja(e,r)),e.match_length>=3)if(i=Ba(e,e.strstart-e.match_start,e.match_length-3),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=3){e.match_length--;do{e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart}while(0!=--e.match_length);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else i=Ba(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(i&&(Za(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<2?e.strstart:2,4===t?(Za(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(Za(e,!1),0===e.strm.avail_out)?1:2}function rs(e,t){let r,i,n;for(;;){if(e.lookahead<Na){if(es(e),e.lookahead<Na&&0===t)return 1;if(0===e.lookahead)break}if(r=0,e.lookahead>=3&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=2,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-Na&&(e.match_length=Ja(e,r),e.match_length<=5&&(1===e.strategy||3===e.match_length&&e.strstart-e.match_start>4096)&&(e.match_length=2)),e.prev_length>=3&&e.match_length<=e.prev_length){n=e.strstart+e.lookahead-3,i=Ba(e,e.strstart-1-e.prev_match,e.prev_length-3),e.lookahead-=e.prev_length-1,e.prev_length-=2;do{++e.strstart<=n&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart)}while(0!=--e.prev_length);if(e.match_available=0,e.match_length=2,e.strstart++,i&&(Za(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if(i=Ba(e,0,e.window[e.strstart-1]),i&&Za(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(i=Ba(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<2?e.strstart:2,4===t?(Za(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(Za(e,!1),0===e.strm.avail_out)?1:2}class is{constructor(e,t,r,i,n){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=i,this.func=n}}const ns=[new is(0,0,0,0,(function(e,t){let r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(es(e),0===e.lookahead&&0===t)return 1;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;const i=e.block_start+r;if((0===e.strstart||e.strstart>=i)&&(e.lookahead=e.strstart-i,e.strstart=i,Za(e,!1),0===e.strm.avail_out))return 1;if(e.strstart-e.block_start>=e.w_size-Na&&(Za(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(Za(e,!0),0===e.strm.avail_out?3:4):(e.strstart>e.block_start&&(Za(e,!1),e.strm.avail_out),1)})),new is(4,4,8,4,ts),new is(4,5,16,8,ts),new is(4,6,32,32,ts),new is(4,4,16,16,rs),new is(8,16,32,32,rs),new is(8,16,128,128,rs),new is(8,32,128,256,rs),new is(32,128,258,1024,rs),new is(32,258,258,4096,rs)];class as{constructor(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=8,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new Hn(1146),this.dyn_dtree=new Hn(122),this.bl_tree=new Hn(78),Va(this.dyn_ltree),Va(this.dyn_dtree),Va(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new Hn(16),this.heap=new Hn(573),Va(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new Hn(573),Va(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}}function ss(e){const t=function(e){let t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=2,t=e.state,t.pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?42:ja,e.adler=2===t.wrap?0:1,t.last_flush=0,Da(t),0):Ha(e,Zn)}(e);return 0===t&&function(e){e.window_size=2*e.w_size,Va(e.head),e.max_lazy_match=ns[e.level].max_lazy,e.good_match=ns[e.level].good_length,e.nice_match=ns[e.level].nice_length,e.max_chain_length=ns[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=2,e.match_available=0,e.ins_h=0}(e.state),t}function os(e,t){let r,i,n,a;if(!e||!e.state||t>5||t<0)return e?Ha(e,Zn):Zn;if(i=e.state,!e.output||!e.input&&0!==e.avail_in||i.status===Wa&&4!==t)return Ha(e,0===e.avail_out?-5:Zn);if(i.strm=e,r=i.last_flush,i.last_flush=t,42===i.status)if(2===i.wrap)e.adler=0,Ya(i,31),Ya(i,139),Ya(i,8),i.gzhead?(Ya(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),Ya(i,255&i.gzhead.time),Ya(i,i.gzhead.time>>8&255),Ya(i,i.gzhead.time>>16&255),Ya(i,i.gzhead.time>>24&255),Ya(i,9===i.level?2:i.strategy>=2||i.level<2?4:0),Ya(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(Ya(i,255&i.gzhead.extra.length),Ya(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(e.adler=qa(e.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(Ya(i,0),Ya(i,0),Ya(i,0),Ya(i,0),Ya(i,0),Ya(i,9===i.level?2:i.strategy>=2||i.level<2?4:0),Ya(i,3),i.status=ja);else{let t=8+(i.w_bits-8<<4)<<8,r=-1;r=i.strategy>=2||i.level<2?0:i.level<6?1:6===i.level?2:3,t|=r<<6,0!==i.strstart&&(t|=32),t+=31-t%31,i.status=ja,Xa(i,t),0!==i.strstart&&(Xa(i,e.adler>>>16),Xa(i,65535&e.adler)),e.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(e.adler=qa(e.adler,i.pending_buf,i.pending-n,n)),$a(e),n=i.pending,i.pending!==i.pending_buf_size));)Ya(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(e.adler=qa(e.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(e.adler=qa(e.adler,i.pending_buf,i.pending-n,n)),$a(e),n=i.pending,i.pending===i.pending_buf_size)){a=1;break}a=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,Ya(i,a)}while(0!==a);i.gzhead.hcrc&&i.pending>n&&(e.adler=qa(e.adler,i.pending_buf,i.pending-n,n)),0===a&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(e.adler=qa(e.adler,i.pending_buf,i.pending-n,n)),$a(e),n=i.pending,i.pending===i.pending_buf_size)){a=1;break}a=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,Ya(i,a)}while(0!==a);i.gzhead.hcrc&&i.pending>n&&(e.adler=qa(e.adler,i.pending_buf,i.pending-n,n)),0===a&&(i.status=La)}else i.status=La;if(i.status===La&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&$a(e),i.pending+2<=i.pending_buf_size&&(Ya(i,255&e.adler),Ya(i,e.adler>>8&255),e.adler=0,i.status=ja)):i.status=ja),0!==i.pending){if($a(e),0===e.avail_out)return i.last_flush=-1,0}else if(0===e.avail_in&&Ga(t)<=Ga(r)&&4!==t)return Ha(e,-5);if(i.status===Wa&&0!==e.avail_in)return Ha(e,-5);if(0!==e.avail_in||0!==i.lookahead||0!==t&&i.status!==Wa){var s=2===i.strategy?function(e,t){let r;for(;;){if(0===e.lookahead&&(es(e),0===e.lookahead)){if(0===t)return 1;break}if(e.match_length=0,r=Ba(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(Za(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(Za(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(Za(e,!1),0===e.strm.avail_out)?1:2}(i,t):3===i.strategy?function(e,t){let r,i,n,a;const s=e.window;for(;;){if(e.lookahead<=Fa){if(es(e),e.lookahead<=Fa&&0===t)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=3&&e.strstart>0&&(n=e.strstart-1,i=s[n],i===s[++n]&&i===s[++n]&&i===s[++n])){a=e.strstart+Fa;do{}while(i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&i===s[++n]&&n<a);e.match_length=Fa-(a-n),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=3?(r=Ba(e,1,e.match_length-3),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=Ba(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(Za(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(Za(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(Za(e,!1),0===e.strm.avail_out)?1:2}(i,t):ns[i.level].func(i,t);if(3!==s&&4!==s||(i.status=Wa),1===s||3===s)return 0===e.avail_out&&(i.last_flush=-1),0;if(2===s&&(1===t?Ia(i):5!==t&&(Ra(i,0,0,!1),3===t&&(Va(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),$a(e),0===e.avail_out))return i.last_flush=-1,0}return 4!==t?0:i.wrap<=0?1:(2===i.wrap?(Ya(i,255&e.adler),Ya(i,e.adler>>8&255),Ya(i,e.adler>>16&255),Ya(i,e.adler>>24&255),Ya(i,255&e.total_in),Ya(i,e.total_in>>8&255),Ya(i,e.total_in>>16&255),Ya(i,e.total_in>>24&255)):(Xa(i,e.adler>>>16),Xa(i,65535&e.adler)),$a(e),i.wrap>0&&(i.wrap=-i.wrap),0!==i.pending?0:1)}try{String.fromCharCode.call(null,0)}catch(e){}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){}const cs=new Wn(256);for(let e=0;e<256;e++)cs[e]=e>=252?6:e>=248?5:e>=240?4:e>=224?3:e>=192?2:1;function us(e){let t,r,i,n,a=0;const s=e.length;for(i=0;i<s;i++)t=e.charCodeAt(i),55296==(64512&t)&&i+1<s&&(r=e.charCodeAt(i+1),56320==(64512&r)&&(t=65536+(t-55296<<10)+(r-56320),i++)),a+=t<128?1:t<2048?2:t<65536?3:4;const o=new Wn(a);for(n=0,i=0;n<a;i++)t=e.charCodeAt(i),55296==(64512&t)&&i+1<s&&(r=e.charCodeAt(i+1),56320==(64512&r)&&(t=65536+(t-55296<<10)+(r-56320),i++)),t<128?o[n++]=t:t<2048?(o[n++]=192|t>>>6,o[n++]=128|63&t):t<65536?(o[n++]=224|t>>>12,o[n++]=128|t>>>6&63,o[n++]=128|63&t):(o[n++]=240|t>>>18,o[n++]=128|t>>>12&63,o[n++]=128|t>>>6&63,o[n++]=128|63&t);return o}cs[254]=cs[254]=1;class hs{constructor(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}}class ds{constructor(e){this.options={level:-1,method:8,chunkSize:16384,windowBits:15,memLevel:8,strategy:0,...e||{}};const t=this.options;t.raw&&t.windowBits>0?t.windowBits=-t.windowBits:t.gzip&&t.windowBits>0&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new hs,this.strm.avail_out=0;var r,i,n=function(e,t,r,i,n,a){if(!e)return Zn;let s=1;if(-1===t&&(t=6),i<0?(s=0,i=-i):i>15&&(s=2,i-=16),n<1||n>9||8!==r||i<8||i>15||t<0||t>9||a<0||a>4)return Ha(e,Zn);8===i&&(i=9);const o=new as;return e.state=o,o.strm=e,o.wrap=s,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new Wn(2*o.w_size),o.head=new Hn(o.hash_size),o.prev=new Hn(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new Wn(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=a,o.method=r,ss(e)}(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(0!==n)throw Error(Oa[n]);if(t.header&&(r=this.strm,i=t.header,r&&r.state&&(2!==r.state.wrap||(r.state.gzhead=i))),t.dictionary){let e;if(e="string"==typeof t.dictionary?us(t.dictionary):t.dictionary instanceof ArrayBuffer?new Uint8Array(t.dictionary):t.dictionary,0!==(n=function(e,t){let r,i,n,a,s,o,c,u,h=t.length;if(!e||!e.state)return Zn;if(r=e.state,a=r.wrap,2===a||1===a&&42!==r.status||r.lookahead)return Zn;for(1===a&&(e.adler=Ta(e.adler,t,h,0)),r.wrap=0,h>=r.w_size&&(0===a&&(Va(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new Wn(r.w_size),$n(u,t,h-r.w_size,r.w_size,0),t=u,h=r.w_size),s=e.avail_in,o=e.next_in,c=e.input,e.avail_in=h,e.next_in=0,e.input=t,es(r);r.lookahead>=3;){i=r.strstart,n=r.lookahead-2;do{r.ins_h=(r.ins_h<<r.hash_shift^r.window[i+3-1])&r.hash_mask,r.prev[i&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=i,i++}while(--n);r.strstart=i,r.lookahead=2,es(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=2,r.match_available=0,e.next_in=o,e.input=c,e.avail_in=s,r.wrap=a,0}(this.strm,e)))throw Error(Oa[n]);this._dict_set=!0}}push(e,t){const{strm:r,options:{chunkSize:i}}=this;var n,a;if(this.ended)return!1;a=t===~~t?t:!0===t?4:0,"string"==typeof e?r.input=us(e):e instanceof ArrayBuffer?r.input=new Uint8Array(e):r.input=e,r.next_in=0,r.avail_in=r.input.length;do{if(0===r.avail_out&&(r.output=new Wn(i),r.next_out=0,r.avail_out=i),1!==(n=os(r,a))&&0!==n)return this.onEnd(n),this.ended=!0,!1;0!==r.avail_out&&(0!==r.avail_in||4!==a&&2!==a)||this.onData(Nn(r.output,r.next_out))}while((r.avail_in>0||0===r.avail_out)&&1!==n);return 4===a?(n=function(e){let t;return e&&e.state?(t=e.state.status,42!==t&&69!==t&&73!==t&&91!==t&&t!==La&&t!==ja&&t!==Wa?Ha(e,Zn):(e.state=null,t===ja?Ha(e,-3):0)):Zn}(this.strm),this.onEnd(n),this.ended=!0,0===n):2!==a||(this.onEnd(0),r.avail_out=0,!0)}onData(e){this.chunks.push(e)}onEnd(e){0===e&&(this.result=Vn(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg}}function fs(e,t){let r,i,n,a,s,o,c,u,h,d;const f=e.state;r=e.next_in;const l=e.input,p=r+(e.avail_in-5);i=e.next_out;const y=e.output,b=i-(t-e.avail_out),m=i+(e.avail_out-257),g=f.dmax,w=f.wsize,v=f.whave,_=f.wnext,k=f.window;n=f.hold,a=f.bits;const A=f.lencode,S=f.distcode,E=(1<<f.lenbits)-1,P=(1<<f.distbits)-1;e:do{a<15&&(n+=l[r++]<<a,a+=8,n+=l[r++]<<a,a+=8),s=A[n&E];t:for(;;){if(o=s>>>24,n>>>=o,a-=o,o=s>>>16&255,0===o)y[i++]=65535&s;else{if(!(16&o)){if(0==(64&o)){s=A[(65535&s)+(n&(1<<o)-1)];continue t}if(32&o){f.mode=12;break e}e.msg="invalid literal/length code",f.mode=30;break e}c=65535&s,o&=15,o&&(a<o&&(n+=l[r++]<<a,a+=8),c+=n&(1<<o)-1,n>>>=o,a-=o),a<15&&(n+=l[r++]<<a,a+=8,n+=l[r++]<<a,a+=8),s=S[n&P];r:for(;;){if(o=s>>>24,n>>>=o,a-=o,o=s>>>16&255,!(16&o)){if(0==(64&o)){s=S[(65535&s)+(n&(1<<o)-1)];continue r}e.msg="invalid distance code",f.mode=30;break e}if(u=65535&s,o&=15,a<o&&(n+=l[r++]<<a,a+=8,a<o&&(n+=l[r++]<<a,a+=8)),u+=n&(1<<o)-1,u>g){e.msg="invalid distance too far back",f.mode=30;break e}if(n>>>=o,a-=o,o=i-b,u>o){if(o=u-o,o>v&&f.sane){e.msg="invalid distance too far back",f.mode=30;break e}if(h=0,d=k,0===_){if(h+=w-o,o<c){c-=o;do{y[i++]=k[h++]}while(--o);h=i-u,d=y}}else if(_<o){if(h+=w+_-o,o-=_,o<c){c-=o;do{y[i++]=k[h++]}while(--o);if(h=0,_<c){o=_,c-=o;do{y[i++]=k[h++]}while(--o);h=i-u,d=y}}}else if(h+=_-o,o<c){c-=o;do{y[i++]=k[h++]}while(--o);h=i-u,d=y}for(;c>2;)y[i++]=d[h++],y[i++]=d[h++],y[i++]=d[h++],c-=3;c&&(y[i++]=d[h++],c>1&&(y[i++]=d[h++]))}else{h=i-u;do{y[i++]=y[h++],y[i++]=y[h++],y[i++]=y[h++],c-=3}while(c>2);c&&(y[i++]=y[h++],c>1&&(y[i++]=y[h++]))}break}}break}}while(r<p&&i<m);c=a>>3,r-=c,a-=c<<3,n&=(1<<a)-1,e.next_in=r,e.next_out=i,e.avail_in=r<p?p-r+5:5-(r-p),e.avail_out=i<m?m-i+257:257-(i-m),f.hold=n,f.bits=a}const ls=15,ps=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],ys=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],bs=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],ms=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];function gs(e,t,r,i,n,a,s,o){const c=o.bits;let u,h,d,f,l,p=0,y=0,b=0,m=0,g=0,w=0,v=0,_=0,k=0,A=0,S=null,E=0;const P=new Hn(16),x=new Hn(16);let M,C,K,D=null,R=0;for(p=0;p<=ls;p++)P[p]=0;for(y=0;y<i;y++)P[t[r+y]]++;for(g=c,m=ls;m>=1&&0===P[m];m--);if(g>m&&(g=m),0===m)return n[a++]=20971520,n[a++]=20971520,o.bits=1,0;for(b=1;b<m&&0===P[b];b++);for(g<b&&(g=b),_=1,p=1;p<=ls;p++)if(_<<=1,_-=P[p],_<0)return-1;if(_>0&&(0===e||1!==m))return-1;for(x[1]=0,p=1;p<ls;p++)x[p+1]=x[p]+P[p];for(y=0;y<i;y++)0!==t[r+y]&&(s[x[t[r+y]]++]=y);0===e?(S=D=s,l=19):1===e?(S=ps,E-=257,D=ys,R-=257,l=256):(S=bs,D=ms,l=-1),A=0,y=0,p=b,f=a,w=g,v=0,d=-1,k=1<<g;const I=k-1;if(1===e&&k>852||2===e&&k>592)return 1;for(;;){M=p-v,s[y]<l?(C=0,K=s[y]):s[y]>l?(C=D[R+s[y]],K=S[E+s[y]]):(C=96,K=0),u=1<<p-v,h=1<<w,b=h;do{h-=u,n[f+(A>>v)+h]=M<<24|C<<16|K|0}while(0!==h);for(u=1<<p-1;A&u;)u>>=1;if(0!==u?(A&=u-1,A+=u):A=0,y++,0==--P[p]){if(p===m)break;p=t[r+s[y]]}if(p>g&&(A&I)!==d){for(0===v&&(v=g),f+=b,w=p-v,_=1<<w;w+v<m&&(_-=P[w+v],!(_<=0));)w++,_<<=1;if(k+=1<<w,1===e&&k>852||2===e&&k>592)return 1;d=A&I,n[d]=g<<24|w<<16|f-a|0}}return 0!==A&&(n[f+A]=p-v<<24|64<<16|0),o.bits=g,0}const ws=12,vs=30;function _s(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}class ks{constructor(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Hn(320),this.work=new Hn(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}}function As(e){let t;return e&&e.state?(t=e.state,t.wsize=0,t.whave=0,t.wnext=0,function(e){let t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=1,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new Gn(852),t.distcode=t.distdyn=new Gn(592),t.sane=1,t.back=-1,0):Zn}(e)):Zn}function Ss(e,t){let r,i;return e?(i=new ks,e.state=i,i.window=null,r=function(e,t){let r,i;return e&&e.state?(i=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?Zn:(null!==i.window&&i.wbits!==t&&(i.window=null),i.wrap=r,i.wbits=t,As(e))):Zn}(e,t),0!==r&&(e.state=null),r):Zn}let Es,Ps,xs=!0;function Ms(e){if(xs){let t;for(Es=new Gn(512),Ps=new Gn(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(gs(1,e.lens,0,288,Es,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;gs(2,e.lens,0,32,Ps,0,e.work,{bits:5}),xs=!1}e.lencode=Es,e.lenbits=9,e.distcode=Ps,e.distbits=5}function Cs(e,t,r,i){let n;const a=e.state;return null===a.window&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0,a.window=new Wn(a.wsize)),i>=a.wsize?($n(a.window,t,r-a.wsize,a.wsize,0),a.wnext=0,a.whave=a.wsize):(n=a.wsize-a.wnext,n>i&&(n=i),$n(a.window,t,r-i,n,a.wnext),(i-=n)?($n(a.window,t,r-i,i,0),a.wnext=i,a.whave=a.wsize):(a.wnext+=n,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=n))),0}function Ks(e,t){let r,i,n,a,s,o,c,u,h,d,f,l,p,y,b,m,g,w,v,_,k,A,S,E,P=0,x=new Wn(4);const M=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return Zn;r=e.state,r.mode===ws&&(r.mode=13),s=e.next_out,n=e.output,c=e.avail_out,a=e.next_in,i=e.input,o=e.avail_in,u=r.hold,h=r.bits,d=o,f=c,A=0;e:for(;;)switch(r.mode){case 1:if(0===r.wrap){r.mode=13;break}for(;h<16;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(2&r.wrap&&35615===u){r.check=0,x[0]=255&u,x[1]=u>>>8&255,r.check=qa(r.check,x,2,0),u=0,h=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=vs;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=vs;break}if(u>>>=4,h-=4,k=8+(15&u),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=vs;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:ws,u=0,h=0;break;case 2:for(;h<16;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=vs;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=vs;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(x[0]=255&u,x[1]=u>>>8&255,r.check=qa(r.check,x,2,0)),u=0,h=0,r.mode=3;case 3:for(;h<32;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}r.head&&(r.head.time=u),512&r.flags&&(x[0]=255&u,x[1]=u>>>8&255,x[2]=u>>>16&255,x[3]=u>>>24&255,r.check=qa(r.check,x,4,0)),u=0,h=0,r.mode=4;case 4:for(;h<16;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(x[0]=255&u,x[1]=u>>>8&255,r.check=qa(r.check,x,2,0)),u=0,h=0,r.mode=5;case 5:if(1024&r.flags){for(;h<16;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(x[0]=255&u,x[1]=u>>>8&255,r.check=qa(r.check,x,2,0)),u=0,h=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(l=r.length,l>o&&(l=o),l&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=Array(r.head.extra_len)),$n(r.head.extra,i,a,l,k)),512&r.flags&&(r.check=qa(r.check,i,l,a)),o-=l,a+=l,r.length-=l),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;l=0;do{k=i[a+l++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k))}while(k&&l<o);if(512&r.flags&&(r.check=qa(r.check,i,l,a)),o-=l,a+=l,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;l=0;do{k=i[a+l++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k))}while(k&&l<o);if(512&r.flags&&(r.check=qa(r.check,i,l,a)),o-=l,a+=l,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;h<16;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=vs;break}u=0,h=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=ws;break;case 10:for(;h<32;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}e.adler=r.check=_s(u),u=0,h=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=s,e.avail_out=c,e.next_in=a,e.avail_in=o,r.hold=u,r.bits=h,2;e.adler=r.check=1,r.mode=ws;case ws:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&h,h-=7&h,r.mode=27;break}for(;h<3;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}switch(r.last=1&u,u>>>=1,h-=1,3&u){case 0:r.mode=14;break;case 1:if(Ms(r),r.mode=20,6===t){u>>>=2,h-=2;break e}break;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=vs}u>>>=2,h-=2;break;case 14:for(u>>>=7&h,h-=7&h;h<32;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=vs;break}if(r.length=65535&u,u=0,h=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(l=r.length,l){if(l>o&&(l=o),l>c&&(l=c),0===l)break e;$n(n,i,a,l,s),o-=l,a+=l,c-=l,s+=l,r.length-=l;break}r.mode=ws;break;case 17:for(;h<14;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(r.nlen=257+(31&u),u>>>=5,h-=5,r.ndist=1+(31&u),u>>>=5,h-=5,r.ncode=4+(15&u),u>>>=4,h-=4,r.nlen>286||r.ndist>30){e.msg="too many length or distance symbols",r.mode=vs;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;h<3;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}r.lens[M[r.have++]]=7&u,u>>>=3,h-=3}for(;r.have<19;)r.lens[M[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},A=gs(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,A){e.msg="invalid code lengths set",r.mode=vs;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;P=r.lencode[u&(1<<r.lenbits)-1],b=P>>>24,m=P>>>16&255,g=65535&P,!(b<=h);){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(g<16)u>>>=b,h-=b,r.lens[r.have++]=g;else{if(16===g){for(E=b+2;h<E;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(u>>>=b,h-=b,0===r.have){e.msg="invalid bit length repeat",r.mode=vs;break}k=r.lens[r.have-1],l=3+(3&u),u>>>=2,h-=2}else if(17===g){for(E=b+3;h<E;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}u>>>=b,h-=b,k=0,l=3+(7&u),u>>>=3,h-=3}else{for(E=b+7;h<E;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}u>>>=b,h-=b,k=0,l=11+(127&u),u>>>=7,h-=7}if(r.have+l>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=vs;break}for(;l--;)r.lens[r.have++]=k}}if(r.mode===vs)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=vs;break}if(r.lenbits=9,S={bits:r.lenbits},A=gs(1,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,A){e.msg="invalid literal/lengths set",r.mode=vs;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},A=gs(2,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,A){e.msg="invalid distances set",r.mode=vs;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(o>=6&&c>=258){e.next_out=s,e.avail_out=c,e.next_in=a,e.avail_in=o,r.hold=u,r.bits=h,fs(e,f),s=e.next_out,n=e.output,c=e.avail_out,a=e.next_in,i=e.input,o=e.avail_in,u=r.hold,h=r.bits,r.mode===ws&&(r.back=-1);break}for(r.back=0;P=r.lencode[u&(1<<r.lenbits)-1],b=P>>>24,m=P>>>16&255,g=65535&P,!(b<=h);){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(m&&0==(240&m)){for(w=b,v=m,_=g;P=r.lencode[_+((u&(1<<w+v)-1)>>w)],b=P>>>24,m=P>>>16&255,g=65535&P,!(w+b<=h);){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}u>>>=w,h-=w,r.back+=w}if(u>>>=b,h-=b,r.back+=b,r.length=g,0===m){r.mode=26;break}if(32&m){r.back=-1,r.mode=ws;break}if(64&m){e.msg="invalid literal/length code",r.mode=vs;break}r.extra=15&m,r.mode=22;case 22:if(r.extra){for(E=r.extra;h<E;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,h-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;P=r.distcode[u&(1<<r.distbits)-1],b=P>>>24,m=P>>>16&255,g=65535&P,!(b<=h);){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(0==(240&m)){for(w=b,v=m,_=g;P=r.distcode[_+((u&(1<<w+v)-1)>>w)],b=P>>>24,m=P>>>16&255,g=65535&P,!(w+b<=h);){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}u>>>=w,h-=w,r.back+=w}if(u>>>=b,h-=b,r.back+=b,64&m){e.msg="invalid distance code",r.mode=vs;break}r.offset=g,r.extra=15&m,r.mode=24;case 24:if(r.extra){for(E=r.extra;h<E;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,h-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=vs;break}r.mode=25;case 25:if(0===c)break e;if(l=f-c,r.offset>l){if(l=r.offset-l,l>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=vs;break}l>r.wnext?(l-=r.wnext,p=r.wsize-l):p=r.wnext-l,l>r.length&&(l=r.length),y=r.window}else y=n,p=s-r.offset,l=r.length;l>c&&(l=c),c-=l,r.length-=l;do{n[s++]=y[p++]}while(--l);0===r.length&&(r.mode=21);break;case 26:if(0===c)break e;n[s++]=r.length,c--,r.mode=21;break;case 27:if(r.wrap){for(;h<32;){if(0===o)break e;o--,u|=i[a++]<<h,h+=8}if(f-=c,e.total_out+=f,r.total+=f,f&&(e.adler=r.check=r.flags?qa(r.check,n,f,s-f):Ta(r.check,n,f,s-f)),f=c,(r.flags?u:_s(u))!==r.check){e.msg="incorrect data check",r.mode=vs;break}u=0,h=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;h<32;){if(0===o)break e;o--,u+=i[a++]<<h,h+=8}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=vs;break}u=0,h=0}r.mode=29;case 29:A=1;break e;case vs:A=-3;break e;case 32:default:return Zn}return e.next_out=s,e.avail_out=c,e.next_in=a,e.avail_in=o,r.hold=u,r.bits=h,(r.wsize||f!==e.avail_out&&r.mode<vs&&(r.mode<27||4!==t))&&Cs(e,e.output,e.next_out,f-e.avail_out),d-=e.avail_in,f-=e.avail_out,e.total_in+=d,e.total_out+=f,r.total+=f,r.wrap&&f&&(e.adler=r.check=r.flags?qa(r.check,n,f,e.next_out-f):Ta(r.check,n,f,e.next_out-f)),e.data_type=r.bits+(r.last?64:0)+(r.mode===ws?128:0)+(20===r.mode||15===r.mode?256:0),(0===d&&0===f||4===t)&&0===A&&(A=-5),A}function Ds(e,t){const r=t.length;let i,n;return e&&e.state?(i=e.state,0!==i.wrap&&11!==i.mode?Zn:11===i.mode&&(n=1,n=Ta(n,t,r,0),n!==i.check)?-3:(Cs(e,t,r,r),i.havedict=1,0)):Zn}class Rs{constructor(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}}class Is{constructor(e){this.options={chunkSize:16384,windowBits:0,...e||{}};const t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(t.windowBits>=0&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new hs,this.strm.avail_out=0;let r=Ss(this.strm,t.windowBits);if(0!==r)throw Error(Oa[r]);if(this.header=new Rs,function(e,t){let r;e&&e.state&&(r=e.state,0==(2&r.wrap)||(r.head=t,t.done=!1))}(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=us(t.dictionary):t.dictionary instanceof ArrayBuffer&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(r=Ds(this.strm,t.dictionary),0!==r)))throw Error(Oa[r])}push(e,t){const{strm:r,options:{chunkSize:i,dictionary:n}}=this;let a,s,o=!1;if(this.ended)return!1;s=t===~~t?t:!0===t?4:0,"string"==typeof e?r.input=function(e){const t=new Wn(e.length);for(let r=0,i=t.length;r<i;r++)t[r]=e.charCodeAt(r);return t}(e):e instanceof ArrayBuffer?r.input=new Uint8Array(e):r.input=e,r.next_in=0,r.avail_in=r.input.length;do{if(0===r.avail_out&&(r.output=new Wn(i),r.next_out=0,r.avail_out=i),a=Ks(r,0),2===a&&n&&(a=Ds(this.strm,n)),-5===a&&!0===o&&(a=0,o=!1),1!==a&&0!==a)return this.onEnd(a),this.ended=!0,!1;r.next_out&&(0!==r.avail_out&&1!==a&&(0!==r.avail_in||4!==s&&2!==s)||this.onData(Nn(r.output,r.next_out))),0===r.avail_in&&0===r.avail_out&&(o=!0)}while((r.avail_in>0||0===r.avail_out)&&1!==a);return 1===a&&(s=4),4===s?(a=function(e){if(!e||!e.state)return Zn;const t=e.state;return t.window&&(t.window=null),e.state=null,0}(this.strm),this.onEnd(a),this.ended=!0,0===a):2!==s||(this.onEnd(0),r.avail_out=0,!0)}onData(e){this.chunks.push(e)}onEnd(e){0===e&&(this.result=Vn(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg}}var Us=[0,1,3,7,15,31,63,127,255],Bs=function(e){this.stream=e,this.bitOffset=0,this.curByte=0,this.hasByte=!1};Bs.prototype._ensureByte=function(){this.hasByte||(this.curByte=this.stream.readByte(),this.hasByte=!0)},Bs.prototype.read=function(e){for(var t=0;e>0;){this._ensureByte();var r=8-this.bitOffset;if(e>=r)t<<=r,t|=Us[r]&this.curByte,this.hasByte=!1,this.bitOffset=0,e-=r;else{t<<=e;var i=r-e;t|=(this.curByte&Us[e]<<i)>>i,this.bitOffset+=e,e=0}}return t},Bs.prototype.seek=function(e){var t=e%8,r=(e-t)/8;this.bitOffset=t,this.stream.seek(r),this.hasByte=!1},Bs.prototype.pi=function(){var e,t=new Uint8Array(6);for(e=0;e<t.length;e++)t[e]=this.read(8);return function(e){return Array.prototype.map.call(e,(e=>("00"+e.toString(16)).slice(-2))).join("")}(t)};var Ts=Bs,zs=function(){};zs.prototype.readByte=function(){throw Error("abstract method readByte() not implemented")},zs.prototype.read=function(e,t,r){for(var i=0;i<r;){var n=this.readByte();if(n<0)return 0===i?-1:i;e[t++]=n,i++}return i},zs.prototype.seek=function(e){throw Error("abstract method seek() not implemented")},zs.prototype.writeByte=function(e){throw Error("abstract method readByte() not implemented")},zs.prototype.write=function(e,t,r){var i;for(i=0;i<r;i++)this.writeByte(e[t++]);return r},zs.prototype.flush=function(){};var qs,Os=zs,Fs=(qs=new Uint32Array([0,79764919,159529838,222504665,319059676,398814059,445009330,507990021,638119352,583659535,797628118,726387553,890018660,835552979,1015980042,944750013,1276238704,1221641927,1167319070,1095957929,1595256236,1540665371,1452775106,1381403509,1780037320,1859660671,1671105958,1733955601,2031960084,2111593891,1889500026,1952343757,2552477408,2632100695,2443283854,2506133561,2334638140,2414271883,2191915858,2254759653,3190512472,3135915759,3081330742,3009969537,2905550212,2850959411,2762807018,2691435357,3560074640,3505614887,3719321342,3648080713,3342211916,3287746299,3467911202,3396681109,4063920168,4143685023,4223187782,4286162673,3779000052,3858754371,3904687514,3967668269,881225847,809987520,1023691545,969234094,662832811,591600412,771767749,717299826,311336399,374308984,453813921,533576470,25881363,88864420,134795389,214552010,2023205639,2086057648,1897238633,1976864222,1804852699,1867694188,1645340341,1724971778,1587496639,1516133128,1461550545,1406951526,1302016099,1230646740,1142491917,1087903418,2896545431,2825181984,2770861561,2716262478,3215044683,3143675388,3055782693,3001194130,2326604591,2389456536,2200899649,2280525302,2578013683,2640855108,2418763421,2498394922,3769900519,3832873040,3912640137,3992402750,4088425275,4151408268,4197601365,4277358050,3334271071,3263032808,3476998961,3422541446,3585640067,3514407732,3694837229,3640369242,1762451694,1842216281,1619975040,1682949687,2047383090,2127137669,1938468188,2001449195,1325665622,1271206113,1183200824,1111960463,1543535498,1489069629,1434599652,1363369299,622672798,568075817,748617968,677256519,907627842,853037301,1067152940,995781531,51762726,131386257,177728840,240578815,269590778,349224269,429104020,491947555,4046411278,4126034873,4172115296,4234965207,3794477266,3874110821,3953728444,4016571915,3609705398,3555108353,3735388376,3664026991,3290680682,3236090077,3449943556,3378572211,3174993278,3120533705,3032266256,2961025959,2923101090,2868635157,2813903052,2742672763,2604032198,2683796849,2461293480,2524268063,2284983834,2364738477,2175806836,2238787779,1569362073,1498123566,1409854455,1355396672,1317987909,1246755826,1192025387,1137557660,2072149281,2135122070,1912620623,1992383480,1753615357,1816598090,1627664531,1707420964,295390185,358241886,404320391,483945776,43990325,106832002,186451547,266083308,932423249,861060070,1041341759,986742920,613929101,542559546,756411363,701822548,3316196985,3244833742,3425377559,3370778784,3601682597,3530312978,3744426955,3689838204,3819031489,3881883254,3928223919,4007849240,4037393693,4100235434,4180117107,4259748804,2310601993,2373574846,2151335527,2231098320,2596047829,2659030626,2470359227,2550115596,2947551409,2876312838,2788305887,2733848168,3165939309,3094707162,3040238851,2985771188]),function(){var e=4294967295;this.getCRC=function(){return~e>>>0},this.updateCRC=function(t){e=e<<8^qs[255&(e>>>24^t)]},this.updateCRCRun=function(t,r){for(;r-- >0;)e=e<<8^qs[255&(e>>>24^t)]}}),Ns=function(e,t){var r,i=e[t];for(r=t;r>0;r--)e[r]=e[r-1];return e[0]=i,i},Ls={OK:0,LAST_BLOCK:-1,NOT_BZIP_DATA:-2,UNEXPECTED_INPUT_EOF:-3,UNEXPECTED_OUTPUT_EOF:-4,DATA_ERROR:-5,OUT_OF_MEMORY:-6,OBSOLETE_INPUT:-7,END_OF_BLOCK:-8},js={};js[Ls.LAST_BLOCK]="Bad file checksum",js[Ls.NOT_BZIP_DATA]="Not bzip data",js[Ls.UNEXPECTED_INPUT_EOF]="Unexpected input EOF",js[Ls.UNEXPECTED_OUTPUT_EOF]="Unexpected output EOF",js[Ls.DATA_ERROR]="Data error",js[Ls.OUT_OF_MEMORY]="Out of memory",js[Ls.OBSOLETE_INPUT]="Obsolete (pre 0.9.5) bzip format not supported.";var Ws=function(e,t){var r=js[e]||"unknown error";t&&(r+=": "+t);var i=new TypeError(r);throw i.errorCode=e,i},Hs=function(e,t){this.writePos=this.writeCurrent=this.writeCount=0,this._start_bunzip(e,t)};Hs.prototype._init_block=function(){return this._get_next_block()?(this.blockCRC=new Fs,!0):(this.writeCount=-1,!1)},Hs.prototype._start_bunzip=function(e,t){var r=new Uint8Array(4);4===e.read(r,0,4)&&"BZh"===String.fromCharCode(r[0],r[1],r[2])||Ws(Ls.NOT_BZIP_DATA,"bad magic");var i=r[3]-48;(i<1||i>9)&&Ws(Ls.NOT_BZIP_DATA,"level out of range"),this.reader=new Ts(e),this.dbufSize=1e5*i,this.nextoutput=0,this.outputStream=t,this.streamCRC=0},Hs.prototype._get_next_block=function(){var e,t,r,i=this.reader,n=i.pi();if("177245385090"===n)return!1;"314159265359"!==n&&Ws(Ls.NOT_BZIP_DATA),this.targetBlockCRC=i.read(32)>>>0,this.streamCRC=(this.targetBlockCRC^(this.streamCRC<<1|this.streamCRC>>>31))>>>0,i.read(1)&&Ws(Ls.OBSOLETE_INPUT);var a=i.read(24);a>this.dbufSize&&Ws(Ls.DATA_ERROR,"initial position out of bounds");var s=i.read(16),o=new Uint8Array(256),c=0;for(e=0;e<16;e++)if(s&1<<15-e){var u=16*e;for(r=i.read(16),t=0;t<16;t++)r&1<<15-t&&(o[c++]=u+t)}var h=i.read(3);(h<2||h>6)&&Ws(Ls.DATA_ERROR);var d=i.read(15);0===d&&Ws(Ls.DATA_ERROR);var f=new Uint8Array(256);for(e=0;e<h;e++)f[e]=e;var l=new Uint8Array(d);for(e=0;e<d;e++){for(t=0;i.read(1);t++)t>=h&&Ws(Ls.DATA_ERROR);l[e]=Ns(f,t)}var p,y=c+2,b=[];for(t=0;t<h;t++){var m,g,w=new Uint8Array(y),v=new Uint16Array(21);for(s=i.read(5),e=0;e<y;e++){for(;(s<1||s>20)&&Ws(Ls.DATA_ERROR),i.read(1);)i.read(1)?s--:s++;w[e]=s}for(m=g=w[0],e=1;e<y;e++)w[e]>g?g=w[e]:w[e]<m&&(m=w[e]);p={},b.push(p),p.permute=new Uint16Array(258),p.limit=new Uint32Array(22),p.base=new Uint32Array(21),p.minLen=m,p.maxLen=g;var _=0;for(e=m;e<=g;e++)for(v[e]=p.limit[e]=0,s=0;s<y;s++)w[s]===e&&(p.permute[_++]=s);for(e=0;e<y;e++)v[w[e]]++;for(_=s=0,e=m;e<g;e++)_+=v[e],p.limit[e]=_-1,_<<=1,s+=v[e],p.base[e+1]=_-s;p.limit[g+1]=Number.MAX_VALUE,p.limit[g]=_+v[g]-1,p.base[m]=0}var k=new Uint32Array(256);for(e=0;e<256;e++)f[e]=e;var A,S=0,E=0,P=0,x=this.dbuf=new Uint32Array(this.dbufSize);for(y=0;;){for(y--||(y=49,P>=d&&Ws(Ls.DATA_ERROR),p=b[l[P++]]),e=p.minLen,t=i.read(e);e>p.maxLen&&Ws(Ls.DATA_ERROR),!(t<=p.limit[e]);e++)t=t<<1|i.read(1);((t-=p.base[e])<0||t>=258)&&Ws(Ls.DATA_ERROR);var M=p.permute[t];if(0!==M&&1!==M){if(S)for(S=0,E+s>this.dbufSize&&Ws(Ls.DATA_ERROR),k[A=o[f[0]]]+=s;s--;)x[E++]=A;if(M>c)break;E>=this.dbufSize&&Ws(Ls.DATA_ERROR),k[A=o[A=Ns(f,e=M-1)]]++,x[E++]=A}else S||(S=1,s=0),s+=0===M?S:2*S,S<<=1}for((a<0||a>=E)&&Ws(Ls.DATA_ERROR),t=0,e=0;e<256;e++)r=t+k[e],k[e]=t,t=r;for(e=0;e<E;e++)x[k[A=255&x[e]]]|=e<<8,k[A]++;var C=0,K=0,D=0;return E&&(K=255&(C=x[a]),C>>=8,D=-1),this.writePos=C,this.writeCurrent=K,this.writeCount=E,this.writeRun=D,!0},Hs.prototype._read_bunzip=function(e,t){var r,i,n;if(this.writeCount<0)return 0;var a=this.dbuf,s=this.writePos,o=this.writeCurrent,c=this.writeCount;this.outputsize;for(var u=this.writeRun;c;){for(c--,i=o,o=255&(s=a[s]),s>>=8,3==u++?(r=o,n=i,o=-1):(r=1,n=o),this.blockCRC.updateCRCRun(n,r);r--;)this.outputStream.writeByte(n),this.nextoutput++;o!=i&&(u=0)}return this.writeCount=c,this.blockCRC.getCRC()!==this.targetBlockCRC&&Ws(Ls.DATA_ERROR,"Bad block CRC (got "+this.blockCRC.getCRC().toString(16)+" expected "+this.targetBlockCRC.toString(16)+")"),this.nextoutput};var Gs=function(e){if("readByte"in e)return e;var t=new Os;return t.pos=0,t.readByte=function(){return e[this.pos++]},t.seek=function(e){this.pos=e},t.eof=function(){return this.pos>=e.length},t},Vs=function(e){var t=new Os,r=!0;if(e)if("number"==typeof e)t.buffer=new Uint8Array(e),r=!1;else{if("writeByte"in e)return e;t.buffer=e,r=!1}else t.buffer=new Uint8Array(16384);return t.pos=0,t.writeByte=function(e){if(r&&this.pos>=this.buffer.length){var t=new Uint8Array(2*this.buffer.length);t.set(this.buffer),this.buffer=t}this.buffer[this.pos++]=e},t.getBuffer=function(){if(this.pos!==this.buffer.length){if(!r)throw new TypeError("outputsize does not match decoded input");var e=new Uint8Array(this.pos);e.set(this.buffer.subarray(0,this.pos)),this.buffer=e}return this.buffer},t._coerced=!0,t};var $s=function(e,t,r){for(var i=Gs(e),n=Vs(t),a=new Hs(i,n);!("eof"in i)||!i.eof();)if(a._init_block())a._read_bunzip();else{var s=a.reader.read(32)>>>0;if(s!==a.streamCRC&&Ws(Ls.DATA_ERROR,"Bad stream CRC (got "+a.streamCRC.toString(16)+" expected "+s.toString(16)+")"),!r||!("eof"in i)||i.eof())break;a._start_bunzip(i,n)}if("getBuffer"in n)return n.getBuffer()};class Zs{static get tag(){return re.packet.literalData}constructor(e=new Date){this.format="utf8",this.date=V.normalizeDate(e),this.text=null,this.data=null,this.filename=""}setText(e,t="utf8"){this.format=t,this.text=e,this.data=null}getText(e=!1){return(null===this.text||V.isStream(this.text))&&(this.text=V.decodeUTF8(V.nativeEOL(this.getBytes(e)))),this.text}setBytes(e,t){this.format=t,this.data=e,this.text=null}getBytes(e=!1){return null===this.data&&(this.data=V.canonicalizeEOL(V.encodeUTF8(this.text))),e?O(this.data):this.data}setFilename(e){this.filename=e}getFilename(){return this.filename}async read(e){await z(e,(async e=>{const t=re.read(re.literal,await e.readByte()),r=await e.readByte();this.filename=V.decodeUTF8(await e.readBytes(r)),this.date=V.readDate(await e.readBytes(4));const i=e.remainder();this.setBytes(i,t)}))}writeHeader(){const e=V.encodeUTF8(this.filename),t=new Uint8Array([e.length]),r=new Uint8Array([re.write(re.literal,this.format)]),i=V.writeDate(this.date);return V.concatUint8Array([r,t,e,i])}write(){const e=this.writeHeader(),t=this.getBytes();return V.concat([e,t])}}function Ys(e){let t,r=0;const i=e[0];return i<192?([r]=e,t=1):i<255?(r=(e[0]-192<<8)+e[1]+192,t=2):255===i&&(r=V.readNumber(e.subarray(1,5)),t=5),{len:r,offset:t}}function Xs(e){return e<192?new Uint8Array([e]):e>191&&e<8384?new Uint8Array([192+(e-192>>8),e-192&255]):V.concatUint8Array([new Uint8Array([255]),V.writeNumber(e,4)])}function Qs(e){if(e<0||e>30)throw Error("Partial Length power must be between 1 and 30");return new Uint8Array([224+e])}function Js(e){return new Uint8Array([192|e])}function eo(e,t){return V.concatUint8Array([Js(e),Xs(t)])}function to(e){return[re.packet.literalData,re.packet.compressedData,re.packet.symmetricallyEncryptedData,re.packet.symEncryptedIntegrityProtectedData,re.packet.aeadEncryptedData].includes(e)}async function ro(e,t){const r=K(e);let i,n;try{const s=await r.peekBytes(2);if(!s||s.length<2||0==(128&s[0]))throw Error("Error during parsing. This message / key probably does not conform to a valid OpenPGP format.");const o=await r.readByte();let c,u,h=-1,d=-1;d=0,0!=(64&o)&&(d=1),d?h=63&o:(h=(63&o)>>2,u=3&o);const f=to(h);let l,p=null;if(f){if("array"===V.isStream(e)){const e=new a;i=D(e),p=e}else{const e=new S;i=D(e.writable),p=e.readable}n=t({tag:h,packet:p})}else p=[];do{if(d){const e=await r.readByte();if(l=!1,e<192)c=e;else if(e>=192&&e<224)c=(e-192<<8)+await r.readByte()+192;else if(e>223&&e<255){if(c=1<<(31&e),l=!0,!f)throw new TypeError("This packet type does not support partial lengths.")}else c=await r.readByte()<<24|await r.readByte()<<16|await r.readByte()<<8|await r.readByte()}else switch(u){case 0:c=await r.readByte();break;case 1:c=await r.readByte()<<8|await r.readByte();break;case 2:c=await r.readByte()<<24|await r.readByte()<<16|await r.readByte()<<8|await r.readByte();break;default:c=1/0}if(c>0){let e=0;for(;;){i&&await i.ready;const{done:t,value:n}=await r.read();if(t){if(c===1/0)break;throw Error("Unexpected end of packet")}const a=c===1/0?n:n.subarray(0,c-e);if(i?await i.write(a):p.push(a),e+=n.length,e>=c){r.unshift(n.subarray(c-e+n.length));break}}}}while(l);const y=await r.peekBytes(f?1/0:2);return i?(await i.ready,await i.close()):(p=V.concatUint8Array(p),await t({tag:h,packet:p})),!y||!y.length}catch(e){if(i)return await i.abort(e),!0;throw e}finally{i&&await n,r.releaseLock()}}class io extends Error{constructor(...e){super(...e),Error.captureStackTrace&&Error.captureStackTrace(this,io),this.name="UnsupportedError"}}const no=Symbol("verified"),ao=new Set([re.signatureSubpacket.issuer,re.signatureSubpacket.issuerFingerprint,re.signatureSubpacket.embeddedSignature]);class so{static get tag(){return re.packet.signature}constructor(){this.version=null,this.signatureType=null,this.hashAlgorithm=null,this.publicKeyAlgorithm=null,this.signatureData=null,this.unhashedSubpackets=[],this.signedHashValue=null,this.created=null,this.signatureExpirationTime=null,this.signatureNeverExpires=!0,this.exportable=null,this.trustLevel=null,this.trustAmount=null,this.regularExpression=null,this.revocable=null,this.keyExpirationTime=null,this.keyNeverExpires=null,this.preferredSymmetricAlgorithms=null,this.revocationKeyClass=null,this.revocationKeyAlgorithm=null,this.revocationKeyFingerprint=null,this.issuerKeyID=new le,this.rawNotations=[],this.notations={},this.preferredHashAlgorithms=null,this.preferredCompressionAlgorithms=null,this.keyServerPreferences=null,this.preferredKeyServer=null,this.isPrimaryUserID=null,this.policyURI=null,this.keyFlags=null,this.signersUserID=null,this.reasonForRevocationFlag=null,this.reasonForRevocationString=null,this.features=null,this.signatureTargetPublicKeyAlgorithm=null,this.signatureTargetHashAlgorithm=null,this.signatureTargetHash=null,this.embeddedSignature=null,this.issuerKeyVersion=null,this.issuerFingerprint=null,this.preferredAEADAlgorithms=null,this.revoked=null,this[no]=null}read(e){let t=0;if(this.version=e[t++],4!==this.version&&5!==this.version)throw new io(`Version ${this.version} of the signature packet is unsupported.`);if(this.signatureType=e[t++],this.publicKeyAlgorithm=e[t++],this.hashAlgorithm=e[t++],t+=this.readSubPackets(e.subarray(t,e.length),!0),!this.created)throw Error("Missing signature creation time subpacket.");this.signatureData=e.subarray(0,t),t+=this.readSubPackets(e.subarray(t,e.length),!1),this.signedHashValue=e.subarray(t,t+2),t+=2,this.params=On.signature.parseSignatureParams(this.publicKeyAlgorithm,e.subarray(t,e.length))}writeParams(){return this.params instanceof Promise?W((async()=>On.serializeParams(this.publicKeyAlgorithm,await this.params))):On.serializeParams(this.publicKeyAlgorithm,this.params)}write(){const e=[];return e.push(this.signatureData),e.push(this.writeUnhashedSubPackets()),e.push(this.signedHashValue),e.push(this.writeParams()),V.concat(e)}async sign(e,t,r=new Date,i=!1){const n=re.write(re.signature,this.signatureType),a=re.write(re.publicKey,this.publicKeyAlgorithm),s=re.write(re.hash,this.hashAlgorithm);5===e.version?this.version=5:this.version=4;const o=[new Uint8Array([this.version,n,a,s])];this.created=V.normalizeDate(r),this.issuerKeyVersion=e.version,this.issuerFingerprint=e.getFingerprintBytes(),this.issuerKeyID=e.getKeyID(),o.push(this.writeHashedSubPackets()),this.signatureData=V.concat(o);const c=this.toHash(n,t,i),u=await this.hash(n,t,c,i);this.signedHashValue=N(q(u),0,2);const h=async()=>On.signature.sign(a,s,e.publicParams,e.privateParams,c,await L(u));V.isStream(u)?this.params=h():(this.params=await h(),this[no]=!0)}writeHashedSubPackets(){const e=re.signatureSubpacket,t=[];let r;if(null===this.created)throw Error("Missing signature creation time");t.push(oo(e.signatureCreationTime,V.writeDate(this.created))),null!==this.signatureExpirationTime&&t.push(oo(e.signatureExpirationTime,V.writeNumber(this.signatureExpirationTime,4))),null!==this.exportable&&t.push(oo(e.exportableCertification,new Uint8Array([this.exportable?1:0]))),null!==this.trustLevel&&(r=new Uint8Array([this.trustLevel,this.trustAmount]),t.push(oo(e.trustSignature,r))),null!==this.regularExpression&&t.push(oo(e.regularExpression,this.regularExpression)),null!==this.revocable&&t.push(oo(e.revocable,new Uint8Array([this.revocable?1:0]))),null!==this.keyExpirationTime&&t.push(oo(e.keyExpirationTime,V.writeNumber(this.keyExpirationTime,4))),null!==this.preferredSymmetricAlgorithms&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.preferredSymmetricAlgorithms)),t.push(oo(e.preferredSymmetricAlgorithms,r))),null!==this.revocationKeyClass&&(r=new Uint8Array([this.revocationKeyClass,this.revocationKeyAlgorithm]),r=V.concat([r,this.revocationKeyFingerprint]),t.push(oo(e.revocationKey,r))),this.rawNotations.forEach((([{name:i,value:n,humanReadable:a}])=>{r=[new Uint8Array([a?128:0,0,0,0])],r.push(V.writeNumber(i.length,2)),r.push(V.writeNumber(n.length,2)),r.push(V.stringToUint8Array(i)),r.push(n),r=V.concat(r),t.push(oo(e.notationData,r))})),null!==this.preferredHashAlgorithms&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.preferredHashAlgorithms)),t.push(oo(e.preferredHashAlgorithms,r))),null!==this.preferredCompressionAlgorithms&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.preferredCompressionAlgorithms)),t.push(oo(e.preferredCompressionAlgorithms,r))),null!==this.keyServerPreferences&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.keyServerPreferences)),t.push(oo(e.keyServerPreferences,r))),null!==this.preferredKeyServer&&t.push(oo(e.preferredKeyServer,V.stringToUint8Array(this.preferredKeyServer))),null!==this.isPrimaryUserID&&t.push(oo(e.primaryUserID,new Uint8Array([this.isPrimaryUserID?1:0]))),null!==this.policyURI&&t.push(oo(e.policyURI,V.stringToUint8Array(this.policyURI))),null!==this.keyFlags&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.keyFlags)),t.push(oo(e.keyFlags,r))),null!==this.signersUserID&&t.push(oo(e.signersUserID,V.stringToUint8Array(this.signersUserID))),null!==this.reasonForRevocationFlag&&(r=V.stringToUint8Array(String.fromCharCode(this.reasonForRevocationFlag)+this.reasonForRevocationString),t.push(oo(e.reasonForRevocation,r))),null!==this.features&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.features)),t.push(oo(e.features,r))),null!==this.signatureTargetPublicKeyAlgorithm&&(r=[new Uint8Array([this.signatureTargetPublicKeyAlgorithm,this.signatureTargetHashAlgorithm])],r.push(V.stringToUint8Array(this.signatureTargetHash)),r=V.concat(r),t.push(oo(e.signatureTarget,r))),null!==this.preferredAEADAlgorithms&&(r=V.stringToUint8Array(V.uint8ArrayToString(this.preferredAEADAlgorithms)),t.push(oo(e.preferredAEADAlgorithms,r)));const i=V.concat(t),n=V.writeNumber(i.length,2);return V.concat([n,i])}writeUnhashedSubPackets(){const e=re.signatureSubpacket,t=[];let r;this.issuerKeyID.isNull()||5===this.issuerKeyVersion||t.push(oo(e.issuer,this.issuerKeyID.write())),null!==this.embeddedSignature&&t.push(oo(e.embeddedSignature,this.embeddedSignature.write())),null!==this.issuerFingerprint&&(r=[new Uint8Array([this.issuerKeyVersion]),this.issuerFingerprint],r=V.concat(r),t.push(oo(e.issuerFingerprint,r))),this.unhashedSubpackets.forEach((e=>{t.push(Xs(e.length)),t.push(e)}));const i=V.concat(t),n=V.writeNumber(i.length,2);return V.concat([n,i])}readSubPacket(e,t=!0){let r=0;const i=128&e[r],n=127&e[r];if(t||ao.has(n))switch(r++,n){case re.signatureSubpacket.signatureCreationTime:this.created=V.readDate(e.subarray(r,e.length));break;case re.signatureSubpacket.signatureExpirationTime:{const t=V.readNumber(e.subarray(r,e.length));this.signatureNeverExpires=0===t,this.signatureExpirationTime=t;break}case re.signatureSubpacket.exportableCertification:this.exportable=1===e[r++];break;case re.signatureSubpacket.trustSignature:this.trustLevel=e[r++],this.trustAmount=e[r++];break;case re.signatureSubpacket.regularExpression:this.regularExpression=e[r];break;case re.signatureSubpacket.revocable:this.revocable=1===e[r++];break;case re.signatureSubpacket.keyExpirationTime:{const t=V.readNumber(e.subarray(r,e.length));this.keyExpirationTime=t,this.keyNeverExpires=0===t;break}case re.signatureSubpacket.preferredSymmetricAlgorithms:this.preferredSymmetricAlgorithms=[...e.subarray(r,e.length)];break;case re.signatureSubpacket.revocationKey:this.revocationKeyClass=e[r++],this.revocationKeyAlgorithm=e[r++],this.revocationKeyFingerprint=e.subarray(r,r+20);break;case re.signatureSubpacket.issuer:this.issuerKeyID.read(e.subarray(r,e.length));break;case re.signatureSubpacket.notationData:{const t=!!(128&e[r]);r+=4;const n=V.readNumber(e.subarray(r,r+2));r+=2;const a=V.readNumber(e.subarray(r,r+2));r+=2;const s=V.uint8ArrayToString(e.subarray(r,r+n)),o=e.subarray(r+n,r+n+a);this.rawNotations.push({name:s,humanReadable:t,value:o,critical:i}),t&&(this.notations[s]=V.uint8ArrayToString(o));break}case re.signatureSubpacket.preferredHashAlgorithms:this.preferredHashAlgorithms=[...e.subarray(r,e.length)];break;case re.signatureSubpacket.preferredCompressionAlgorithms:this.preferredCompressionAlgorithms=[...e.subarray(r,e.length)];break;case re.signatureSubpacket.keyServerPreferences:this.keyServerPreferences=[...e.subarray(r,e.length)];break;case re.signatureSubpacket.preferredKeyServer:this.preferredKeyServer=V.uint8ArrayToString(e.subarray(r,e.length));break;case re.signatureSubpacket.primaryUserID:this.isPrimaryUserID=0!==e[r++];break;case re.signatureSubpacket.policyURI:this.policyURI=V.uint8ArrayToString(e.subarray(r,e.length));break;case re.signatureSubpacket.keyFlags:this.keyFlags=[...e.subarray(r,e.length)];break;case re.signatureSubpacket.signersUserID:this.signersUserID=V.uint8ArrayToString(e.subarray(r,e.length));break;case re.signatureSubpacket.reasonForRevocation:this.reasonForRevocationFlag=e[r++],this.reasonForRevocationString=V.uint8ArrayToString(e.subarray(r,e.length));break;case re.signatureSubpacket.features:this.features=[...e.subarray(r,e.length)];break;case re.signatureSubpacket.signatureTarget:{this.signatureTargetPublicKeyAlgorithm=e[r++],this.signatureTargetHashAlgorithm=e[r++];const t=On.getHashByteLength(this.signatureTargetHashAlgorithm);this.signatureTargetHash=V.uint8ArrayToString(e.subarray(r,r+t));break}case re.signatureSubpacket.embeddedSignature:this.embeddedSignature=new so,this.embeddedSignature.read(e.subarray(r,e.length));break;case re.signatureSubpacket.issuerFingerprint:this.issuerKeyVersion=e[r++],this.issuerFingerprint=e.subarray(r,e.length),5===this.issuerKeyVersion?this.issuerKeyID.read(this.issuerFingerprint):this.issuerKeyID.read(this.issuerFingerprint.subarray(-8));break;case re.signatureSubpacket.preferredAEADAlgorithms:this.preferredAEADAlgorithms=[...e.subarray(r,e.length)];break;default:{const e=Error("Unknown signature subpacket type "+n);if(i)throw e;V.printDebug(e)}}else this.unhashedSubpackets.push(e.subarray(r,e.length))}readSubPackets(e,t=!0,r){const i=V.readNumber(e.subarray(0,2));let n=2;for(;n<2+i;){const i=Ys(e.subarray(n,e.length));n+=i.offset,this.readSubPacket(e.subarray(n,n+i.len),t,r),n+=i.len}return n}toSign(e,t){const r=re.signature;switch(e){case r.binary:return null!==t.text?V.encodeUTF8(t.getText(!0)):t.getBytes(!0);case r.text:{const e=t.getBytes(!0);return V.canonicalizeEOL(e)}case r.standalone:return new Uint8Array(0);case r.certGeneric:case r.certPersona:case r.certCasual:case r.certPositive:case r.certRevocation:{let e,i;if(t.userID)i=180,e=t.userID;else{if(!t.userAttribute)throw Error("Either a userID or userAttribute packet needs to be supplied for certification.");i=209,e=t.userAttribute}const n=e.write();return V.concat([this.toSign(r.key,t),new Uint8Array([i]),V.writeNumber(n.length,4),n])}case r.subkeyBinding:case r.subkeyRevocation:case r.keyBinding:return V.concat([this.toSign(r.key,t),this.toSign(r.key,{key:t.bind})]);case r.key:if(void 0===t.key)throw Error("Key packet is required for this signature.");return t.key.writeForHash(this.version);case r.keyRevocation:return this.toSign(r.key,t);case r.timestamp:return new Uint8Array(0);case r.thirdParty:throw Error("Not implemented");default:throw Error("Unknown signature type.")}}calculateTrailer(e,t){let r=0;return B(q(this.signatureData),(e=>{r+=e.length}),(()=>{const i=[];return 5!==this.version||this.signatureType!==re.signature.binary&&this.signatureType!==re.signature.text||(t?i.push(new Uint8Array(6)):i.push(e.writeHeader())),i.push(new Uint8Array([this.version,255])),5===this.version&&i.push(new Uint8Array(4)),i.push(V.writeNumber(r,4)),V.concat(i)}))}toHash(e,t,r=!1){const i=this.toSign(e,t);return V.concat([i,this.signatureData,this.calculateTrailer(t,r)])}async hash(e,t,r,i=!1){const n=re.write(re.hash,this.hashAlgorithm);return r||(r=this.toHash(e,t,i)),On.hash.digest(n,r)}async verify(e,t,r,i=new Date,n=!1,a=ie){const s=re.write(re.publicKey,this.publicKeyAlgorithm),o=re.write(re.hash,this.hashAlgorithm);if(!this.issuerKeyID.equals(e.getKeyID()))throw Error("Signature was not issued by the given public key");if(s!==re.write(re.publicKey,e.algorithm))throw Error("Public key algorithm used to sign signature does not match issuer key algorithm.");const c=t===re.signature.binary||t===re.signature.text;if(!(this[no]&&!c)){let i,a;if(this.hashed?a=await this.hashed:(i=this.toHash(t,r,n),a=await this.hash(t,r,i)),a=await L(a),this.signedHashValue[0]!==a[0]||this.signedHashValue[1]!==a[1])throw Error("Signed digest did not match");if(this.params=await this.params,this[no]=await On.signature.verify(s,o,this.params,e.publicParams,i,a),!this[no])throw Error("Signature verification failed")}const u=V.normalizeDate(i);if(u&&this.created>u)throw Error("Signature creation time is in the future");if(u&&u>=this.getExpirationTime())throw Error("Signature is expired");if(a.rejectHashAlgorithms.has(o))throw Error("Insecure hash algorithm: "+re.read(re.hash,o).toUpperCase());if(a.rejectMessageHashAlgorithms.has(o)&&[re.signature.binary,re.signature.text].includes(this.signatureType))throw Error("Insecure message hash algorithm: "+re.read(re.hash,o).toUpperCase());if(this.rawNotations.forEach((({name:e,critical:t})=>{if(t&&a.knownNotations.indexOf(e)<0)throw Error("Unknown critical notation: "+e)})),null!==this.revocationKeyClass)throw Error("This key is intended to be revoked with an authorized key, which OpenPGP.js does not support.")}isExpired(e=new Date){const t=V.normalizeDate(e);return null!==t&&!(this.created<=t&&t<this.getExpirationTime())}getExpirationTime(){return this.signatureNeverExpires?1/0:new Date(this.created.getTime()+1e3*this.signatureExpirationTime)}}function oo(e,t){const r=[];return r.push(Xs(t.length+1)),r.push(new Uint8Array([e])),r.push(t),V.concat(r)}class co{static get tag(){return re.packet.onePassSignature}constructor(){this.version=null,this.signatureType=null,this.hashAlgorithm=null,this.publicKeyAlgorithm=null,this.issuerKeyID=null,this.flags=null}read(e){let t=0;if(this.version=e[t++],3!==this.version)throw new io(`Version ${this.version} of the one-pass signature packet is unsupported.`);return this.signatureType=e[t++],this.hashAlgorithm=e[t++],this.publicKeyAlgorithm=e[t++],this.issuerKeyID=new le,this.issuerKeyID.read(e.subarray(t,t+8)),t+=8,this.flags=e[t++],this}write(){const e=new Uint8Array([3,re.write(re.signature,this.signatureType),re.write(re.hash,this.hashAlgorithm),re.write(re.publicKey,this.publicKeyAlgorithm)]),t=new Uint8Array([this.flags]);return V.concatUint8Array([e,this.issuerKeyID.write(),t])}calculateTrailer(...e){return W((async()=>so.prototype.calculateTrailer.apply(await this.correspondingSig,e)))}async verify(){const e=await this.correspondingSig;if(!e||e.constructor.tag!==re.packet.signature)throw Error("Corresponding signature packet missing");if(e.signatureType!==this.signatureType||e.hashAlgorithm!==this.hashAlgorithm||e.publicKeyAlgorithm!==this.publicKeyAlgorithm||!e.issuerKeyID.equals(this.issuerKeyID))throw Error("Corresponding signature packet does not match one-pass signature packet");return e.hashed=this.hashed,e.verify.apply(e,arguments)}}function uo(e,t){if(!t[e]){let t;try{t=re.read(re.packet,e)}catch(t){throw new io("Unknown packet type with tag: "+e)}throw Error("Packet not allowed in this context: "+t)}return new t[e]}co.prototype.hash=so.prototype.hash,co.prototype.toHash=so.prototype.toHash,co.prototype.toSign=so.prototype.toSign;class ho extends Array{static async fromBinary(e,t,r=ie){const i=new ho;return await i.read(e,t,r),i}async read(e,t,r=ie){this.stream=T(e,(async(e,i)=>{const n=D(i);try{for(;;){await n.ready;if(await ro(e,(async e=>{try{if(e.tag===re.packet.marker||e.tag===re.packet.trust)return;const i=uo(e.tag,t);i.packets=new ho,i.fromStream=V.isStream(e.packet),await i.read(e.packet,r),await n.write(i)}catch(t){const i=!r.ignoreUnsupportedPackets&&t instanceof io,a=!(r.ignoreMalformedPackets||t instanceof io);(i||a||to(e.tag))&&await n.abort(t),V.printDebugError(t)}})))return await n.ready,void await n.close()}}catch(e){await n.abort(e)}}));const i=K(this.stream);for(;;){const{done:e,value:t}=await i.read();if(e?this.stream=null:this.push(t),e||to(t.constructor.tag))break}i.releaseLock()}write(){const e=[];for(let t=0;t<this.length;t++){const r=this[t].write();if(V.isStream(r)&&to(this[t].constructor.tag)){let i=[],n=0;const a=512;e.push(Js(this[t].constructor.tag)),e.push(B(r,(e=>{if(i.push(e),n+=e.length,n>=a){const e=Math.min(Math.log(n)/Math.LN2|0,30),t=2**e,r=V.concat([Qs(e)].concat(i));return i=[r.subarray(1+t)],n=i[0].length,r.subarray(0,1+t)}}),(()=>V.concat([Xs(n)].concat(i)))))}else{if(V.isStream(r)){let i=0;e.push(B(q(r),(e=>{i+=e.length}),(()=>eo(this[t].constructor.tag,i))))}else e.push(eo(this[t].constructor.tag,r.length));e.push(r)}}return V.concat(e)}filterByTag(...e){const t=new ho,r=e=>t=>e===t;for(let i=0;i<this.length;i++)e.some(r(this[i].constructor.tag))&&t.push(this[i]);return t}findPacket(e){return this.find((t=>t.constructor.tag===e))}indexOfTag(...e){const t=[],r=this,i=e=>t=>e===t;for(let n=0;n<this.length;n++)e.some(i(r[n].constructor.tag))&&t.push(n);return t}}const fo=/*#__PURE__*/V.constructAllowedPackets([Zs,co,so]);class lo{static get tag(){return re.packet.compressedData}constructor(e=ie){this.packets=null,this.algorithm=re.read(re.compression,e.preferredCompressionAlgorithm),this.compressed=null,this.deflateLevel=e.deflateLevel}async read(e,t=ie){await z(e,(async e=>{this.algorithm=re.read(re.compression,await e.readByte()),this.compressed=e.remainder(),await this.decompress(t)}))}write(){return null===this.compressed&&this.compress(),V.concat([new Uint8Array([re.write(re.compression,this.algorithm)]),this.compressed])}async decompress(e=ie){if(!vo[this.algorithm])throw Error(this.algorithm+" decompression not supported");this.packets=await ho.fromBinary(vo[this.algorithm](this.compressed),fo,e)}compress(){if(!wo[this.algorithm])throw Error(this.algorithm+" compression not supported");this.compressed=wo[this.algorithm](this.packets.write(),this.deflateLevel)}}const po=V.getNodeZlib();function yo(e){return e}function bo(e,t,r={}){return function(i){return!V.isStream(i)||s(i)?W((()=>L(i).then((t=>new Promise(((i,n)=>{e(t,r,((e,t)=>{if(e)return n(e);i(t)}))})))))):y(b(i).pipe(t(r)))}}function mo(e,t={}){return function(r){const i=new e(t);return B(r,(e=>{if(e.length)return i.push(e,2),i.result}),(()=>{if(e===ds)return i.push([],4),i.result}))}}function go(e){return function(t){return W((async()=>e(await L(t))))}}const wo=po?{zip:/*#__PURE__*/(e,t)=>bo(po.deflateRaw,po.createDeflateRaw,{level:t})(e),zlib:/*#__PURE__*/(e,t)=>bo(po.deflate,po.createDeflate,{level:t})(e)}:{zip:/*#__PURE__*/(e,t)=>mo(ds,{raw:!0,level:t})(e),zlib:/*#__PURE__*/(e,t)=>mo(ds,{level:t})(e)},vo=po?{uncompressed:yo,zip:/*#__PURE__*/bo(po.inflateRaw,po.createInflateRaw),zlib:/*#__PURE__*/bo(po.inflate,po.createInflate),bzip2:/*#__PURE__*/go($s)}:{uncompressed:yo,zip:/*#__PURE__*/mo(Is,{raw:!0}),zlib:/*#__PURE__*/mo(Is),bzip2:/*#__PURE__*/go($s)},_o=/*#__PURE__*/V.constructAllowedPackets([Zs,lo,co,so]);class ko{static get tag(){return re.packet.symEncryptedIntegrityProtectedData}constructor(){this.version=1,this.encrypted=null,this.packets=null}async read(e){await z(e,(async e=>{const t=await e.readByte();if(1!==t)throw new io(`Version ${t} of the SEIP packet is unsupported.`);this.encrypted=e.remainder()}))}write(){return V.concat([new Uint8Array([1]),this.encrypted])}async encrypt(e,t,r=ie){let i=this.packets.write();s(i)&&(i=await L(i));const n=await On.getPrefixRandom(e),a=new Uint8Array([211,20]),o=V.concat([n,i,a]),c=await On.hash.sha1(O(o)),u=V.concat([o,c]);return this.encrypted=await On.mode.cfb.encrypt(e,t,u,new Uint8Array(On.cipher[e].blockSize),r),!0}async decrypt(e,t,r=ie){let i=q(this.encrypted);s(i)&&(i=await L(i));const n=await On.mode.cfb.decrypt(e,t,i,new Uint8Array(On.cipher[e].blockSize)),a=N(O(n),-20),o=N(n,0,-20),c=Promise.all([L(await On.hash.sha1(O(o))),L(a)]).then((([e,t])=>{if(!V.equalsUint8Array(e,t))throw Error("Modification detected.");return new Uint8Array})),u=N(o,On.cipher[e].blockSize+2);let h=N(u,0,-2);return h=C([h,W((()=>c))]),V.isStream(i)&&r.allowUnauthenticatedStream||(h=await L(h)),this.packets=await ho.fromBinary(h,_o,r),!0}}const Ao=/*#__PURE__*/V.constructAllowedPackets([Zs,lo,co,so]);class So{static get tag(){return re.packet.aeadEncryptedData}constructor(){this.version=1,this.cipherAlgo=null,this.aeadAlgorithm="eax",this.aeadAlgo=null,this.chunkSizeByte=null,this.iv=null,this.encrypted=null,this.packets=null}async read(e){await z(e,(async e=>{const t=await e.readByte();if(1!==t)throw new io(`Version ${t} of the AEAD-encrypted data packet is not supported.`);this.cipherAlgo=await e.readByte(),this.aeadAlgo=await e.readByte(),this.chunkSizeByte=await e.readByte();const r=On.mode[re.read(re.aead,this.aeadAlgo)];this.iv=await e.readBytes(r.ivLength),this.encrypted=e.remainder()}))}write(){return V.concat([new Uint8Array([this.version,this.cipherAlgo,this.aeadAlgo,this.chunkSizeByte]),this.iv,this.encrypted])}async decrypt(e,t,r=ie){this.packets=await ho.fromBinary(await this.crypt("decrypt",t,q(this.encrypted)),Ao,r)}async encrypt(e,t,r=ie){this.cipherAlgo=re.write(re.symmetric,e),this.aeadAlgo=re.write(re.aead,this.aeadAlgorithm);const i=On.mode[re.read(re.aead,this.aeadAlgo)];this.iv=await On.random.getRandomBytes(i.ivLength),this.chunkSizeByte=r.aeadChunkSizeByte;const n=this.packets.write();this.encrypted=await this.crypt("encrypt",t,n)}async crypt(e,t,r){const i=re.read(re.symmetric,this.cipherAlgo),n=On.mode[re.read(re.aead,this.aeadAlgo)],a=await n(i,t),s="decrypt"===e?n.tagLength:0,o="encrypt"===e?n.tagLength:0,c=2**(this.chunkSizeByte+6)+s,u=new ArrayBuffer(21),h=new Uint8Array(u,0,13),d=new Uint8Array(u),f=new DataView(u),l=new Uint8Array(u,5,8);h.set([192|So.tag,this.version,this.cipherAlgo,this.aeadAlgo,this.chunkSizeByte],0);let p=0,y=Promise.resolve(),b=0,m=0;const g=this.iv;return T(r,(async(t,r)=>{if("array"!==V.isStream(t)){const e=new S({},{highWaterMark:V.getHardwareConcurrency()*2**(this.chunkSizeByte+6),size:e=>e.length});R(e.readable,r),r=e.writable}const i=K(t),u=D(r);try{for(;;){let t=await i.readBytes(c+s)||new Uint8Array;const r=t.subarray(t.length-s);let w,v;if(t=t.subarray(0,t.length-s),!p||t.length?(i.unshift(r),w=a[e](t,n.getNonce(g,l),h),m+=t.length-s+o):(f.setInt32(17,b),w=a[e](r,n.getNonce(g,l),d),m+=o,v=!0),b+=t.length-s,y=y.then((()=>w)).then((async e=>{await u.ready,await u.write(e),m-=e.length})).catch((e=>u.abort(e))),(v||m>u.desiredSize)&&await y,v){await u.close();break}f.setInt32(9,++p)}}catch(e){await u.abort(e)}}))}}class Eo{static get tag(){return re.packet.publicKeyEncryptedSessionKey}constructor(){this.version=3,this.publicKeyID=new le,this.publicKeyAlgorithm=null,this.sessionKey=null,this.sessionKeyAlgorithm=null,this.encrypted={}}read(e){if(this.version=e[0],3!==this.version)throw new io(`Version ${this.version} of the PKESK packet is unsupported.`);this.publicKeyID.read(e.subarray(1,e.length)),this.publicKeyAlgorithm=re.read(re.publicKey,e[9]);const t=re.write(re.publicKey,this.publicKeyAlgorithm);this.encrypted=On.parseEncSessionKeyParams(t,e.subarray(10))}write(){const e=re.write(re.publicKey,this.publicKeyAlgorithm),t=[new Uint8Array([this.version]),this.publicKeyID.write(),new Uint8Array([re.write(re.publicKey,this.publicKeyAlgorithm)]),On.serializeParams(e,this.encrypted)];return V.concatUint8Array(t)}async encrypt(e){const t=V.concatUint8Array([new Uint8Array([re.write(re.symmetric,this.sessionKeyAlgorithm)]),this.sessionKey,V.writeChecksum(this.sessionKey)]),r=re.write(re.publicKey,this.publicKeyAlgorithm);this.encrypted=await On.publicKeyEncrypt(r,e.publicParams,t,e.getFingerprintBytes())}async decrypt(e){const t=re.write(re.publicKey,this.publicKeyAlgorithm);if(t!==re.write(re.publicKey,e.algorithm))throw Error("Decryption error");const r=await On.publicKeyDecrypt(t,e.publicParams,e.privateParams,this.encrypted,e.getFingerprintBytes()),i=r.subarray(r.length-2),n=r.subarray(1,r.length-2);if(!V.equalsUint8Array(i,V.writeChecksum(n)))throw Error("Decryption error");this.sessionKey=n,this.sessionKeyAlgorithm=re.read(re.symmetric,r[0])}}class Po{constructor(e=ie){this.algorithm="sha256",this.type="iterated",this.c=e.s2kIterationCountByte,this.salt=null}getCount(){return 16+(15&this.c)<<6+(this.c>>4)}read(e){let t=0;switch(this.type=re.read(re.s2k,e[t++]),this.algorithm=e[t++],"gnu"!==this.type&&(this.algorithm=re.read(re.hash,this.algorithm)),this.type){case"simple":break;case"salted":this.salt=e.subarray(t,t+8),t+=8;break;case"iterated":this.salt=e.subarray(t,t+8),t+=8,this.c=e[t++];break;case"gnu":if("GNU"!==V.uint8ArrayToString(e.subarray(t,t+3)))throw Error("Unknown s2k type.");t+=3;if(1001!==1e3+e[t++])throw Error("Unknown s2k gnu protection mode.");this.type="gnu-dummy";break;default:throw Error("Unknown s2k type.")}return t}write(){if("gnu-dummy"===this.type)return new Uint8Array([101,0,...V.stringToUint8Array("GNU"),1]);const e=[new Uint8Array([re.write(re.s2k,this.type),re.write(re.hash,this.algorithm)])];switch(this.type){case"simple":break;case"salted":e.push(this.salt);break;case"iterated":e.push(this.salt),e.push(new Uint8Array([this.c]));break;case"gnu":throw Error("GNU s2k type not supported.");default:throw Error("Unknown s2k type.")}return V.concatUint8Array(e)}async produceKey(e,t){e=V.encodeUTF8(e);const r=re.write(re.hash,this.algorithm),i=[];let n=0,a=0;for(;n<t;){let t;switch(this.type){case"simple":t=V.concatUint8Array([new Uint8Array(a),e]);break;case"salted":t=V.concatUint8Array([new Uint8Array(a),this.salt,e]);break;case"iterated":{const r=V.concatUint8Array([this.salt,e]);let i=r.length;const n=Math.max(this.getCount(),i);t=new Uint8Array(a+n),t.set(r,a);for(let e=a+i;e<n;e+=i,i*=2)t.copyWithin(e,a,e);break}case"gnu":throw Error("GNU s2k type not supported.");default:throw Error("Unknown s2k type.")}const s=await On.hash.digest(r,t);i.push(s),n+=s.length,a++}return V.concatUint8Array(i).subarray(0,t)}}class xo{static get tag(){return re.packet.symEncryptedSessionKey}constructor(e=ie){this.version=e.aeadProtect?5:4,this.sessionKey=null,this.sessionKeyEncryptionAlgorithm=null,this.sessionKeyAlgorithm="aes256",this.aeadAlgorithm=re.read(re.aead,e.preferredAEADAlgorithm),this.encrypted=null,this.s2k=null,this.iv=null}read(e){let t=0;if(this.version=e[t++],4!==this.version&&5!==this.version)throw new io(`Version ${this.version} of the SKESK packet is unsupported.`);const r=re.read(re.symmetric,e[t++]);if(5===this.version&&(this.aeadAlgorithm=re.read(re.aead,e[t++])),this.s2k=new Po,t+=this.s2k.read(e.subarray(t,e.length)),5===this.version){const r=On.mode[this.aeadAlgorithm];this.iv=e.subarray(t,t+=r.ivLength)}5===this.version||t<e.length?(this.encrypted=e.subarray(t,e.length),this.sessionKeyEncryptionAlgorithm=r):this.sessionKeyAlgorithm=r}write(){const e=null===this.encrypted?this.sessionKeyAlgorithm:this.sessionKeyEncryptionAlgorithm;let t;return 5===this.version?t=V.concatUint8Array([new Uint8Array([this.version,re.write(re.symmetric,e),re.write(re.aead,this.aeadAlgorithm)]),this.s2k.write(),this.iv,this.encrypted]):(t=V.concatUint8Array([new Uint8Array([this.version,re.write(re.symmetric,e)]),this.s2k.write()]),null!==this.encrypted&&(t=V.concatUint8Array([t,this.encrypted]))),t}async decrypt(e){const t=null!==this.sessionKeyEncryptionAlgorithm?this.sessionKeyEncryptionAlgorithm:this.sessionKeyAlgorithm,r=On.cipher[t].keySize,i=await this.s2k.produceKey(e,r);if(5===this.version){const e=On.mode[this.aeadAlgorithm],r=new Uint8Array([192|xo.tag,this.version,re.write(re.symmetric,this.sessionKeyEncryptionAlgorithm),re.write(re.aead,this.aeadAlgorithm)]),n=await e(t,i);this.sessionKey=await n.decrypt(this.encrypted,this.iv,r)}else if(null!==this.encrypted){const e=await On.mode.cfb.decrypt(t,i,this.encrypted,new Uint8Array(On.cipher[t].blockSize));this.sessionKeyAlgorithm=re.read(re.symmetric,e[0]),this.sessionKey=e.subarray(1,e.length)}else this.sessionKey=i}async encrypt(e,t=ie){const r=null!==this.sessionKeyEncryptionAlgorithm?this.sessionKeyEncryptionAlgorithm:this.sessionKeyAlgorithm;this.sessionKeyEncryptionAlgorithm=r,this.s2k=new Po(t),this.s2k.salt=await On.random.getRandomBytes(8);const i=On.cipher[r].keySize,n=await this.s2k.produceKey(e,i);if(null===this.sessionKey&&(this.sessionKey=await On.generateSessionKey(this.sessionKeyAlgorithm)),5===this.version){const e=On.mode[this.aeadAlgorithm];this.iv=await On.random.getRandomBytes(e.ivLength);const t=new Uint8Array([192|xo.tag,this.version,re.write(re.symmetric,this.sessionKeyEncryptionAlgorithm),re.write(re.aead,this.aeadAlgorithm)]),i=await e(r,n);this.encrypted=await i.encrypt(this.sessionKey,this.iv,t)}else{const e=new Uint8Array([re.write(re.symmetric,this.sessionKeyAlgorithm)]),i=V.concatUint8Array([e,this.sessionKey]);this.encrypted=await On.mode.cfb.encrypt(r,n,i,new Uint8Array(On.cipher[r].blockSize),t)}}}class Mo{static get tag(){return re.packet.publicKey}constructor(e=new Date,t=ie){this.version=t.v5Keys?5:4,this.created=V.normalizeDate(e),this.algorithm=null,this.publicParams=null,this.expirationTimeV3=0,this.fingerprint=null,this.keyID=null}static fromSecretKeyPacket(e){const t=new Mo,{version:r,created:i,algorithm:n,publicParams:a,keyID:s,fingerprint:o}=e;return t.version=r,t.created=i,t.algorithm=n,t.publicParams=a,t.keyID=s,t.fingerprint=o,t}async read(e){let t=0;if(this.version=e[t++],4===this.version||5===this.version){this.created=V.readDate(e.subarray(t,t+4)),t+=4,this.algorithm=re.read(re.publicKey,e[t++]);const r=re.write(re.publicKey,this.algorithm);5===this.version&&(t+=4);try{const{read:i,publicParams:n}=On.parsePublicKeyParams(r,e.subarray(t));this.publicParams=n,t+=i}catch(e){throw Error("Error reading MPIs")}return await this.computeFingerprintAndKeyID(),t}throw new io(`Version ${this.version} of the key packet is unsupported.`)}write(){const e=[];e.push(new Uint8Array([this.version])),e.push(V.writeDate(this.created));const t=re.write(re.publicKey,this.algorithm);e.push(new Uint8Array([t]));const r=On.serializeParams(t,this.publicParams);return 5===this.version&&e.push(V.writeNumber(r.length,4)),e.push(r),V.concatUint8Array(e)}writeForHash(e){const t=this.writePublicKey();return 5===e?V.concatUint8Array([new Uint8Array([154]),V.writeNumber(t.length,4),t]):V.concatUint8Array([new Uint8Array([153]),V.writeNumber(t.length,2),t])}isDecrypted(){return null}getCreationTime(){return this.created}getKeyID(){return this.keyID}async computeFingerprintAndKeyID(){if(await this.computeFingerprint(),this.keyID=new le,5===this.version)this.keyID.read(this.fingerprint.subarray(0,8));else{if(4!==this.version)throw Error("Unsupported key version");this.keyID.read(this.fingerprint.subarray(12,20))}}async computeFingerprint(){const e=this.writeForHash(this.version);if(5===this.version)this.fingerprint=await On.hash.sha256(e);else{if(4!==this.version)throw Error("Unsupported key version");this.fingerprint=await On.hash.sha1(e)}}getFingerprintBytes(){return this.fingerprint}getFingerprint(){return V.uint8ArrayToHex(this.getFingerprintBytes())}hasSameFingerprintAs(e){return this.version===e.version&&V.equalsUint8Array(this.writePublicKey(),e.writePublicKey())}getAlgorithmInfo(){const e={};e.algorithm=this.algorithm;const t=this.publicParams.n||this.publicParams.p;return t?e.bits=V.uint8ArrayBitLength(t):e.curve=this.publicParams.oid.getName(),e}}Mo.prototype.readPublicKey=Mo.prototype.read,Mo.prototype.writePublicKey=Mo.prototype.write;const Co=/*#__PURE__*/V.constructAllowedPackets([Zs,lo,co,so]);class Ko{static get tag(){return re.packet.symmetricallyEncryptedData}constructor(){this.encrypted=null,this.packets=null}read(e){this.encrypted=e}write(){return this.encrypted}async decrypt(e,t,r=ie){if(!r.allowUnauthenticatedMessages)throw Error("Message is not authenticated.");const i=await L(q(this.encrypted)),n=await On.mode.cfb.decrypt(e,t,i.subarray(On.cipher[e].blockSize+2),i.subarray(2,On.cipher[e].blockSize+2));this.packets=await ho.fromBinary(n,Co,r)}async encrypt(e,t,r=ie){const i=this.packets.write(),n=await On.getPrefixRandom(e),a=await On.mode.cfb.encrypt(e,t,n,new Uint8Array(On.cipher[e].blockSize),r),s=await On.mode.cfb.encrypt(e,t,i,a.subarray(2),r);this.encrypted=V.concat([a,s])}}class Do extends Mo{static get tag(){return re.packet.publicSubkey}constructor(e,t){super(e,t)}static fromSecretSubkeyPacket(e){const t=new Do,{version:r,created:i,algorithm:n,publicParams:a,keyID:s,fingerprint:o}=e;return t.version=r,t.created=i,t.algorithm=n,t.publicParams=a,t.keyID=s,t.fingerprint=o,t}}class Ro{static get tag(){return re.packet.userAttribute}constructor(){this.attributes=[]}read(e){let t=0;for(;t<e.length;){const r=Ys(e.subarray(t,e.length));t+=r.offset,this.attributes.push(V.uint8ArrayToString(e.subarray(t,t+r.len))),t+=r.len}}write(){const e=[];for(let t=0;t<this.attributes.length;t++)e.push(Xs(this.attributes[t].length)),e.push(V.stringToUint8Array(this.attributes[t]));return V.concatUint8Array(e)}equals(e){return!!(e&&e instanceof Ro)&&this.attributes.every((function(t,r){return t===e.attributes[r]}))}}class Io extends Mo{static get tag(){return re.packet.secretKey}constructor(e=new Date,t=ie){super(e,t),this.keyMaterial=null,this.isEncrypted=null,this.s2kUsage=0,this.s2k=null,this.symmetric=null,this.aead=null,this.privateParams=null}async read(e){let t=await this.readPublicKey(e);if(this.s2kUsage=e[t++],5===this.version&&t++,255===this.s2kUsage||254===this.s2kUsage||253===this.s2kUsage){if(this.symmetric=e[t++],this.symmetric=re.read(re.symmetric,this.symmetric),253===this.s2kUsage&&(this.aead=e[t++],this.aead=re.read(re.aead,this.aead)),this.s2k=new Po,t+=this.s2k.read(e.subarray(t,e.length)),"gnu-dummy"===this.s2k.type)return}else this.s2kUsage&&(this.symmetric=this.s2kUsage,this.symmetric=re.read(re.symmetric,this.symmetric));if(this.s2kUsage&&(this.iv=e.subarray(t,t+On.cipher[this.symmetric].blockSize),t+=this.iv.length),5===this.version&&(t+=4),this.keyMaterial=e.subarray(t),this.isEncrypted=!!this.s2kUsage,!this.isEncrypted){const e=this.keyMaterial.subarray(0,-2);if(!V.equalsUint8Array(V.writeChecksum(e),this.keyMaterial.subarray(-2)))throw Error("Key checksum mismatch");try{const t=re.write(re.publicKey,this.algorithm),{privateParams:r}=On.parsePrivateKeyParams(t,e,this.publicParams);this.privateParams=r}catch(e){throw Error("Error reading MPIs")}}}write(){const e=[this.writePublicKey()];e.push(new Uint8Array([this.s2kUsage]));const t=[];if(255!==this.s2kUsage&&254!==this.s2kUsage&&253!==this.s2kUsage||(t.push(re.write(re.symmetric,this.symmetric)),253===this.s2kUsage&&t.push(re.write(re.aead,this.aead)),t.push(...this.s2k.write())),this.s2kUsage&&"gnu-dummy"!==this.s2k.type&&t.push(...this.iv),5===this.version&&e.push(new Uint8Array([t.length])),e.push(new Uint8Array(t)),!this.isDummy()){if(!this.s2kUsage){const e=re.write(re.publicKey,this.algorithm);this.keyMaterial=On.serializeParams(e,this.privateParams)}5===this.version&&e.push(V.writeNumber(this.keyMaterial.length,4)),e.push(this.keyMaterial),this.s2kUsage||e.push(V.writeChecksum(this.keyMaterial))}return V.concatUint8Array(e)}isDecrypted(){return!1===this.isEncrypted}isDummy(){return!(!this.s2k||"gnu-dummy"!==this.s2k.type)}makeDummy(e=ie){this.isDummy()||(this.isDecrypted()&&this.clearPrivateParams(),this.isEncrypted=null,this.keyMaterial=null,this.s2k=new Po(e),this.s2k.algorithm=0,this.s2k.c=0,this.s2k.type="gnu-dummy",this.s2kUsage=254,this.symmetric="aes256")}async encrypt(e,t=ie){if(this.isDummy())return;if(!this.isDecrypted())throw Error("Key packet is already encrypted");if(this.isDecrypted()&&!e)return void(this.s2kUsage=0);if(!e)throw Error("The key must be decrypted before removing passphrase protection.");this.s2k=new Po(t),this.s2k.salt=await On.random.getRandomBytes(8);const r=re.write(re.publicKey,this.algorithm),i=On.serializeParams(r,this.privateParams);this.symmetric="aes256";const n=await Uo(this.s2k,e,this.symmetric),a=On.cipher[this.symmetric].blockSize;if(this.iv=await On.random.getRandomBytes(a),t.aeadProtect){this.s2kUsage=253,this.aead="eax";const e=On.mode[this.aead],t=await e(this.symmetric,n);this.keyMaterial=await t.encrypt(i,this.iv.subarray(0,e.ivLength),new Uint8Array)}else this.s2kUsage=254,this.keyMaterial=await On.mode.cfb.encrypt(this.symmetric,n,V.concatUint8Array([i,await On.hash.sha1(i,t)]),this.iv,t)}async decrypt(e){if(this.isDummy())return!1;if(this.isDecrypted())throw Error("Key packet is already decrypted.");let t,r;if(254!==this.s2kUsage&&253!==this.s2kUsage)throw 255===this.s2kUsage?Error("Encrypted private key is authenticated using an insecure two-byte hash"):Error("Private key is encrypted using an insecure S2K function: unsalted MD5");if(t=await Uo(this.s2k,e,this.symmetric),253===this.s2kUsage){const e=On.mode[this.aead];try{const i=await e(this.symmetric,t);r=await i.decrypt(this.keyMaterial,this.iv.subarray(0,e.ivLength),new Uint8Array)}catch(e){if("Authentication tag mismatch"===e.message)throw Error("Incorrect key passphrase: "+e.message);throw e}}else{const e=await On.mode.cfb.decrypt(this.symmetric,t,this.keyMaterial,this.iv);r=e.subarray(0,-20);const i=await On.hash.sha1(r);if(!V.equalsUint8Array(i,e.subarray(-20)))throw Error("Incorrect key passphrase")}try{const e=re.write(re.publicKey,this.algorithm),{privateParams:t}=On.parsePrivateKeyParams(e,r,this.publicParams);this.privateParams=t}catch(e){throw Error("Error reading MPIs")}this.isEncrypted=!1,this.keyMaterial=null,this.s2kUsage=0}async validate(){if(this.isDummy())return;if(!this.isDecrypted())throw Error("Key is not decrypted");const e=re.write(re.publicKey,this.algorithm);let t;try{t=await On.validateParams(e,this.publicParams,this.privateParams)}catch(e){t=!1}if(!t)throw Error("Key is invalid")}async generate(e,t){const r=re.write(re.publicKey,this.algorithm),{privateParams:i,publicParams:n}=await On.generateParams(r,e,t);this.privateParams=i,this.publicParams=n,this.isEncrypted=!1}clearPrivateParams(){this.isDummy()||(Object.keys(this.privateParams).forEach((e=>{this.privateParams[e].fill(0),delete this.privateParams[e]})),this.privateParams=null,this.isEncrypted=!0)}}async function Uo(e,t,r){return e.produceKey(t,On.cipher[r].keySize)}var Bo=tt((function(e){!function(t){function r(e){function t(){return Ae<Se}function r(){return Ae}function n(e){Ae=e}function a(){Ae=0,Se=ke.length}function s(e,t){return{name:e,tokens:t||"",semantic:t||"",children:[]}}function o(e,t){var r;return null===t?null:((r=s(e)).tokens=t.tokens,r.semantic=t.semantic,r.children.push(t),r)}function c(e,t){return null!==t&&(e.tokens+=t.tokens,e.semantic+=t.semantic),e.children.push(t),e}function u(e){var r;return t()&&e(r=ke[Ae])?(Ae+=1,s("token",r)):null}function h(e){return function(){return o("literal",u((function(t){return t===e})))}}function d(){var e=arguments;return function(){var t,i,a,o;for(o=r(),i=s("and"),t=0;t<e.length;t+=1){if(null===(a=e[t]()))return n(o),null;c(i,a)}return i}}function f(){var e=arguments;return function(){var t,i,a;for(a=r(),t=0;t<e.length;t+=1){if(null!==(i=e[t]()))return i;n(a)}return null}}function l(e){return function(){var t,i;return i=r(),null!==(t=e())?t:(n(i),s("opt"))}}function p(e){return function(){var t=e();return null!==t&&(t.semantic=""),t}}function y(e){return function(){var t=e();return null!==t&&t.semantic.length>0&&(t.semantic=" "),t}}function b(e,t){return function(){var i,a,o,u,h;for(u=r(),i=s("star"),o=0,h=void 0===t?0:t;null!==(a=e());)o+=1,c(i,a);return o>=h?i:(n(u),null)}}function m(e){return e.charCodeAt(0)>=128}function g(){return o("cr",h("\r")())}function w(){return o("crlf",d(g,k)())}function v(){return o("dquote",h('"')())}function _(){return o("htab",h("\t")())}function k(){return o("lf",h("\n")())}function A(){return o("sp",h(" ")())}function S(){return o("vchar",u((function(t){var r=t.charCodeAt(0),i=33<=r&&r<=126;return e.rfc6532&&(i=i||m(t)),i})))}function E(){return o("wsp",f(A,_)())}function P(){var e=o("quoted-pair",f(d(h("\\"),f(S,E)),ie)());return null===e?null:(e.semantic=e.semantic[1],e)}function x(){return o("fws",f(ae,d(l(d(b(E),p(w))),b(E,1)))())}function M(){return o("ctext",f((function(){return u((function(t){var r=t.charCodeAt(0),i=33<=r&&r<=39||42<=r&&r<=91||93<=r&&r<=126;return e.rfc6532&&(i=i||m(t)),i}))}),te)())}function C(){return o("ccontent",f(M,P,K)())}function K(){return o("comment",d(h("("),b(d(l(x),C)),l(x),h(")"))())}function D(){return o("cfws",f(d(b(d(l(x),K),1),l(x)),x)())}function R(){return o("atext",u((function(t){var r="a"<=t&&t<="z"||"A"<=t&&t<="Z"||"0"<=t&&t<="9"||["!","#","$","%","&","'","*","+","-","/","=","?","^","_","`","{","|","}","~"].indexOf(t)>=0;return e.rfc6532&&(r=r||m(t)),r})))}function I(){return o("atom",d(y(l(D)),b(R,1),y(l(D)))())}function U(){var e,t;return null===(e=o("dot-atom-text",b(R,1)()))||null!==(t=b(d(h("."),b(R,1)))())&&c(e,t),e}function B(){return o("dot-atom",d(p(l(D)),U,p(l(D)))())}function T(){return o("qtext",f((function(){return u((function(t){var r=t.charCodeAt(0),i=33===r||35<=r&&r<=91||93<=r&&r<=126;return e.rfc6532&&(i=i||m(t)),i}))}),re)())}function z(){return o("qcontent",f(T,P)())}function q(){return o("quoted-string",d(p(l(D)),p(v),b(d(l(y(x)),z)),l(p(x)),p(v),p(l(D)))())}function O(){return o("word",f(I,q)())}function F(){return o("address",f(N,W)())}function N(){return o("mailbox",f(L,J)())}function L(){return o("name-addr",d(l(H),j)())}function j(){return o("angle-addr",f(d(p(l(D)),h("<"),J,h(">"),p(l(D))),se)())}function W(){return o("group",d(H,h(":"),l($),h(";"),p(l(D)))())}function H(){return o("display-name",(null!==(e=o("phrase",f(ne,b(O,1))()))&&(e.semantic=function(e){return e.replace(/([ \t]|\r\n)+/g," ").replace(/^\s*/,"").replace(/\s*$/,"")}(e.semantic)),e));var e}function G(){return o("mailbox-list",f(d(N,b(d(h(","),N))),ue)())}function V(){return o("address-list",f(d(F,b(d(h(","),F))),he)())}function $(){return o("group-list",f(G,p(D),de)())}function Z(){return o("local-part",f(fe,B,q)())}function Y(){return o("dtext",f((function(){return u((function(t){var r=t.charCodeAt(0),i=33<=r&&r<=90||94<=r&&r<=126;return e.rfc6532&&(i=i||m(t)),i}))}),pe)())}function X(){return o("domain-literal",d(p(l(D)),h("["),b(d(l(x),Y)),l(x),h("]"),p(l(D)))())}function Q(){return o("domain",(t=f(le,B,X)(),e.rejectTLD&&t&&t.semantic&&t.semantic.indexOf(".")<0?null:(t&&(t.semantic=t.semantic.replace(/\s+/g,"")),t)));var t}function J(){return o("addr-spec",d(Z,h("@"),Q)())}function ee(){return e.strict?null:o("obs-NO-WS-CTL",u((function(e){var t=e.charCodeAt(0);return 1<=t&&t<=8||11===t||12===t||14<=t&&t<=31||127===t})))}function te(){return e.strict?null:o("obs-ctext",ee())}function re(){return e.strict?null:o("obs-qtext",ee())}function ie(){return e.strict?null:o("obs-qp",d(h("\\"),f(h("\0"),ee,k,g))())}function ne(){return e.strict?null:e.atInDisplayName?o("obs-phrase",d(O,b(f(O,h("."),h("@"),y(D))))()):o("obs-phrase",d(O,b(f(O,h("."),y(D))))())}function ae(){return e.strict?null:o("obs-FWS",b(d(p(l(w)),E),1)())}function se(){return e.strict?null:o("obs-angle-addr",d(p(l(D)),h("<"),oe,J,h(">"),p(l(D)))())}function oe(){return e.strict?null:o("obs-route",d(ce,h(":"))())}function ce(){return e.strict?null:o("obs-domain-list",d(b(f(p(D),h(","))),h("@"),Q,b(d(h(","),p(l(D)),l(d(h("@"),Q)))))())}function ue(){return e.strict?null:o("obs-mbox-list",d(b(d(p(l(D)),h(","))),N,b(d(h(","),l(d(N,p(D))))))())}function he(){return e.strict?null:o("obs-addr-list",d(b(d(p(l(D)),h(","))),F,b(d(h(","),l(d(F,p(D))))))())}function de(){return e.strict?null:o("obs-group-list",d(b(d(p(l(D)),h(",")),1),p(l(D)))())}function fe(){return e.strict?null:o("obs-local-part",d(O,b(d(h("."),O)))())}function le(){return e.strict?null:o("obs-domain",d(I,b(d(h("."),I)))())}function pe(){return e.strict?null:o("obs-dtext",f(ee,P)())}function ye(e,t){var r,i,n;if(null==t)return null;for(i=[t];i.length>0;){if((n=i.pop()).name===e)return n;for(r=n.children.length-1;r>=0;r-=1)i.push(n.children[r])}return null}function be(e,t){var r,i,n,a,s;if(null==t)return null;for(i=[t],a=[],s={},r=0;r<e.length;r+=1)s[e[r]]=!0;for(;i.length>0;)if((n=i.pop()).name in s)a.push(n);else for(r=n.children.length-1;r>=0;r-=1)i.push(n.children[r]);return a}function me(t){var r,i,n,a,s;if(null===t)return null;for(r=[],i=be(["group","mailbox"],t),n=0;n<i.length;n+=1)"group"===(a=i[n]).name?r.push(ge(a)):"mailbox"===a.name&&r.push(we(a));return s={ast:t,addresses:r},e.simple&&(s=function(e){var t;if(e&&e.addresses)for(t=0;t<e.addresses.length;t+=1)delete e.addresses[t].node;return e}(s)),e.oneResult?function(t){if(!t)return null;if(!e.partial&&t.addresses.length>1)return null;return t.addresses&&t.addresses[0]}(s):e.simple?s&&s.addresses:s}function ge(e){var t,r=ye("display-name",e),i=[],n=be(["mailbox"],e);for(t=0;t<n.length;t+=1)i.push(we(n[t]));return{node:e,parts:{name:r},type:e.name,name:ve(r),addresses:i}}function we(e){var t=ye("display-name",e),r=ye("addr-spec",e),i=function(e,t){var r,i,n,a;if(null==t)return null;for(i=[t],a=[];i.length>0;)for((n=i.pop()).name===e&&a.push(n),r=n.children.length-1;r>=0;r-=1)i.push(n.children[r]);return a}("cfws",e),n=be(["comment"],e),a=ye("local-part",r),s=ye("domain",r);return{node:e,parts:{name:t,address:r,local:a,domain:s,comments:i},type:e.name,name:ve(t),address:ve(r),local:ve(a),domain:ve(s),comments:_e(n),groupName:ve(e.groupName)}}function ve(e){return null!=e?e.semantic:null}function _e(e){var t="";if(e)for(var r=0;r<e.length;r+=1)t+=ve(e[r]);return t}var ke,Ae,Se,Ee,Pe;if(null===(e=i(e,{})))return null;if(ke=e.input,Pe={address:F,"address-list":V,"angle-addr":j,from:function(){return o("from",f(G,V)())},group:W,mailbox:N,"mailbox-list":G,"reply-to":function(){return o("reply-to",V())},sender:function(){return o("sender",f(N,F)())}}[e.startAt]||V,!e.strict){if(a(),e.strict=!0,Ee=Pe(ke),e.partial||!t())return me(Ee);e.strict=!1}return a(),Ee=Pe(ke),!e.partial&&t()?null:me(Ee)}function i(e,t){function r(e){return"[object String]"===Object.prototype.toString.call(e)}function i(e){return null==e}var n,a;if(r(e))e={input:e};else if(!function(e){return e===Object(e)}(e))return null;if(!r(e.input))return null;if(!t)return null;for(a in n={oneResult:!1,partial:!1,rejectTLD:!1,rfc6532:!1,simple:!1,startAt:"address-list",strict:!1,atInDisplayName:!1})i(e[a])&&(e[a]=i(t[a])?n[a]:t[a]);return e}r.parseOneAddress=function(e){return r(i(e,{oneResult:!0,rfc6532:!0,simple:!0,startAt:"address-list"}))},r.parseAddressList=function(e){return r(i(e,{rfc6532:!0,simple:!0,startAt:"address-list"}))},r.parseFrom=function(e){return r(i(e,{rfc6532:!0,simple:!0,startAt:"from"}))},r.parseSender=function(e){return r(i(e,{oneResult:!0,rfc6532:!0,simple:!0,startAt:"sender"}))},r.parseReplyTo=function(e){return r(i(e,{rfc6532:!0,simple:!0,startAt:"reply-to"}))},e.exports=r}()}));class To{static get tag(){return re.packet.userID}constructor(){this.userID="",this.name="",this.email="",this.comment=""}static fromObject(e){if(V.isString(e)||e.name&&!V.isString(e.name)||e.email&&!V.isEmailAddress(e.email)||e.comment&&!V.isString(e.comment))throw Error("Invalid user ID format");const t=new To;Object.assign(t,e);const r=[];return t.name&&r.push(t.name),t.comment&&r.push(`(${t.comment})`),t.email&&r.push(`<${t.email}>`),t.userID=r.join(" "),t}read(e,t=ie){const r=V.decodeUTF8(e);if(r.length>t.maxUserIDLength)throw Error("User ID string is too long");try{const{name:e,address:t,comments:i}=Bo.parseOneAddress({input:r,atInDisplayName:!0});this.comment=i.replace(/^\(|\)$/g,""),this.name=e,this.email=t}catch(e){}this.userID=r}write(){return V.encodeUTF8(this.userID)}equals(e){return e&&e.userID===this.userID}}class zo extends Io{static get tag(){return re.packet.secretSubkey}constructor(e=new Date,t=ie){super(e,t)}}const qo=/*#__PURE__*/V.constructAllowedPackets([so]);class Oo{constructor(e){this.packets=e||new ho}write(){return this.packets.write()}armor(e=ie){return fe(re.armor.signature,this.write(),void 0,void 0,void 0,e)}getSigningKeyIDs(){return this.packets.map((e=>e.issuerKeyID))}}async function Fo(e,t){const r=new zo(e.date,t);return r.packets=null,r.algorithm=re.read(re.publicKey,e.algorithm),await r.generate(e.rsaBits,e.curve),await r.computeFingerprintAndKeyID(),r}async function No(e,t){const r=new Io(e.date,t);return r.packets=null,r.algorithm=re.read(re.publicKey,e.algorithm),await r.generate(e.rsaBits,e.curve,e.config),await r.computeFingerprintAndKeyID(),r}async function Lo(e,t,r,i,n=new Date,a){let s,o;for(let c=e.length-1;c>=0;c--)try{(!s||e[c].created>=s.created)&&(await e[c].verify(t,r,i,n,void 0,a),s=e[c])}catch(e){o=e}if(!s)throw V.wrapError(`Could not find valid ${re.read(re.signature,r)} signature in key ${t.getKeyID().toHex()}`.replace("certGeneric ","self-").replace(/([a-z])([A-Z])/g,((e,t,r)=>t+" "+r.toLowerCase())),o);return s}function jo(e,t,r=new Date){const i=V.normalizeDate(r);if(null!==i){const r=Yo(e,t);return!(e.created<=i&&i<r)}return!1}async function Wo(e,t,r,i){const n={};n.key=t,n.bind=e;const a=new so;return a.signatureType=re.signature.subkeyBinding,a.publicKeyAlgorithm=t.algorithm,a.hashAlgorithm=await Ho(null,e,void 0,void 0,i),r.sign?(a.keyFlags=[re.keyFlags.signData],a.embeddedSignature=await Vo(n,null,e,{signatureType:re.signature.keyBinding},r.date,void 0,void 0,i)):a.keyFlags=[re.keyFlags.encryptCommunication|re.keyFlags.encryptStorage],r.keyExpirationTime>0&&(a.keyExpirationTime=r.keyExpirationTime,a.keyNeverExpires=!1),await a.sign(t,n,r.date),a}async function Ho(e,t,r=new Date,i={},n){let a=n.preferredHashAlgorithm,s=a;if(e){const t=await e.getPrimaryUser(r,i,n);t.selfCertification.preferredHashAlgorithms&&([s]=t.selfCertification.preferredHashAlgorithms,a=On.hash.getHashByteLength(a)<=On.hash.getHashByteLength(s)?s:a)}switch(Object.getPrototypeOf(t)){case Io.prototype:case Mo.prototype:case zo.prototype:case Do.prototype:switch(t.algorithm){case"ecdh":case"ecdsa":case"eddsa":s=On.publicKey.elliptic.getPreferredHashAlgo(t.publicParams.oid)}}return On.hash.getHashByteLength(a)<=On.hash.getHashByteLength(s)?s:a}async function Go(e,t=[],r=new Date,i=[],n=ie){const a={symmetric:re.symmetric.aes128,aead:re.aead.eax,compression:re.compression.uncompressed}[e],s={symmetric:n.preferredSymmetricAlgorithm,aead:n.preferredAEADAlgorithm,compression:n.preferredCompressionAlgorithm}[e],o={symmetric:"preferredSymmetricAlgorithms",aead:"preferredAEADAlgorithms",compression:"preferredCompressionAlgorithms"}[e];return(await Promise.all(t.map((async function(e,t){const a=(await e.getPrimaryUser(r,i[t],n)).selfCertification[o];return!!a&&a.indexOf(s)>=0})))).every(Boolean)?s:a}async function Vo(e,t,r,i,n,a,s=!1,o){if(r.isDummy())throw Error("Cannot sign with a gnu-dummy key.");if(!r.isDecrypted())throw Error("Signing key is not decrypted.");const c=new so;return Object.assign(c,i),c.publicKeyAlgorithm=r.algorithm,c.hashAlgorithm=await Ho(t,r,n,a,o),await c.sign(r,e,n,s),c}async function $o(e,t,r,i=new Date,n){(e=e[r])&&(t[r].length?await Promise.all(e.map((async function(e){e.isExpired(i)||n&&!await n(e)||t[r].some((function(t){return V.equalsUint8Array(t.writeParams(),e.writeParams())}))||t[r].push(e)}))):t[r]=e)}async function Zo(e,t,r,i,n,a,s=new Date,o){a=a||e;const c=[];return await Promise.all(i.map((async function(e){try{n&&!e.issuerKeyID.equals(n.issuerKeyID)||(await e.verify(a,t,r,o.revocationsExpire?s:null,!1,o),c.push(e.issuerKeyID))}catch(e){}}))),n?(n.revoked=!!c.some((e=>e.equals(n.issuerKeyID)))||(n.revoked||!1),n.revoked):c.length>0}function Yo(e,t){let r;return!1===t.keyNeverExpires&&(r=e.created.getTime()+1e3*t.keyExpirationTime),r?new Date(r):1/0}function Xo(e,t={}){switch(e.type=e.type||t.type,e.curve=e.curve||t.curve,e.rsaBits=e.rsaBits||t.rsaBits,e.keyExpirationTime=void 0!==e.keyExpirationTime?e.keyExpirationTime:t.keyExpirationTime,e.passphrase=V.isString(e.passphrase)?e.passphrase:t.passphrase,e.date=e.date||t.date,e.sign=e.sign||!1,e.type){case"ecc":try{e.curve=re.write(re.curve,e.curve)}catch(e){throw Error("Invalid curve")}e.curve!==re.curve.ed25519&&e.curve!==re.curve.curve25519||(e.curve=e.sign?re.curve.ed25519:re.curve.curve25519),e.sign?e.algorithm=e.curve===re.curve.ed25519?re.publicKey.eddsa:re.publicKey.ecdsa:e.algorithm=re.publicKey.ecdh;break;case"rsa":e.algorithm=re.publicKey.rsaEncryptSign;break;default:throw Error("Unsupported key type "+e.type)}return e}function Qo(e,t){const r=re.write(re.publicKey,e.algorithm);return r!==re.publicKey.rsaEncrypt&&r!==re.publicKey.elgamal&&r!==re.publicKey.ecdh&&(!t.keyFlags||0!=(t.keyFlags[0]&re.keyFlags.signData))}function Jo(e,t){const r=re.write(re.publicKey,e.algorithm);return r!==re.publicKey.dsa&&r!==re.publicKey.rsaSign&&r!==re.publicKey.ecdsa&&r!==re.publicKey.eddsa&&(!t.keyFlags||0!=(t.keyFlags[0]&re.keyFlags.encryptCommunication)||0!=(t.keyFlags[0]&re.keyFlags.encryptStorage))}function ec(e,t){return!!t.allowInsecureDecryptionWithSigningKeys||(!e.keyFlags||0!=(e.keyFlags[0]&re.keyFlags.encryptCommunication)||0!=(e.keyFlags[0]&re.keyFlags.encryptStorage))}function tc(e,t){const r=re.write(re.publicKey,e.algorithm);if(t.rejectPublicKeyAlgorithms.has(r))throw Error(e.algorithm+" keys are considered too weak.");const i=e.getAlgorithmInfo();switch(r){case re.publicKey.rsaEncryptSign:case re.publicKey.rsaSign:case re.publicKey.rsaEncrypt:if(i.bits<t.minRSABits)throw Error(`RSA keys shorter than ${t.minRSABits} bits are considered too weak.`);break;case re.publicKey.ecdsa:case re.publicKey.eddsa:case re.publicKey.ecdh:if(t.rejectCurves.has(i.curve))throw Error(`Support for ${e.algorithm} keys using curve ${i.curve} is disabled.`)}}class rc{constructor(e,t){this.userID=e.constructor.tag===re.packet.userID?e:null,this.userAttribute=e.constructor.tag===re.packet.userAttribute?e:null,this.selfCertifications=[],this.otherCertifications=[],this.revocationSignatures=[],this.mainKey=t}toPacketList(){const e=new ho;return e.push(this.userID||this.userAttribute),e.push(...this.revocationSignatures),e.push(...this.selfCertifications),e.push(...this.otherCertifications),e}clone(){const e=new rc(this.userID||this.userAttribute,this.mainKey);return e.selfCertifications=[...this.selfCertifications],e.otherCertifications=[...this.otherCertifications],e.revocationSignatures=[...this.revocationSignatures],e}async certify(e,t,r){const i=this.mainKey.keyPacket,n={userID:this.userID,userAttribute:this.userAttribute,key:i},a=new rc(n.userID||n.userAttribute,this.mainKey);return a.otherCertifications=await Promise.all(e.map((async function(e){if(!e.isPrivate())throw Error("Need private key for signing");if(e.hasSameFingerprintAs(i))throw Error("The user's own key can only be used for self-certifications");const a=await e.getSigningKey(void 0,t,void 0,r);return Vo(n,e,a.keyPacket,{signatureType:re.signature.certGeneric,keyFlags:[re.keyFlags.certifyKeys|re.keyFlags.signData]},t,void 0,void 0,r)}))),await a.update(this,t,r),a}async isRevoked(e,t,r=new Date,i){const n=this.mainKey.keyPacket;return Zo(n,re.signature.certRevocation,{key:n,userID:this.userID,userAttribute:this.userAttribute},this.revocationSignatures,e,t,r,i)}async verifyCertificate(e,t,r=new Date,i){const n=this,a=this.mainKey.keyPacket,s={userID:this.userID,userAttribute:this.userAttribute,key:a},{issuerKeyID:o}=e,c=t.filter((e=>e.getKeys(o).length>0));return 0===c.length?null:(await Promise.all(c.map((async t=>{const a=await t.getSigningKey(o,e.created,void 0,i);if(e.revoked||await n.isRevoked(e,a.keyPacket,r,i))throw Error("User certificate is revoked");try{await e.verify(a.keyPacket,re.signature.certGeneric,s,r,void 0,i)}catch(e){throw V.wrapError("User certificate is invalid",e)}}))),!0)}async verifyAllCertifications(e,t=new Date,r){const i=this,n=this.selfCertifications.concat(this.otherCertifications);return Promise.all(n.map((async n=>({keyID:n.issuerKeyID,valid:await i.verifyCertificate(n,e,t,r).catch((()=>!1))}))))}async verify(e=new Date,t){if(!this.selfCertifications.length)throw Error("No self-certifications found");const r=this,i=this.mainKey.keyPacket,n={userID:this.userID,userAttribute:this.userAttribute,key:i};let a;for(let s=this.selfCertifications.length-1;s>=0;s--)try{const a=this.selfCertifications[s];if(a.revoked||await r.isRevoked(a,void 0,e,t))throw Error("Self-certification is revoked");try{await a.verify(i,re.signature.certGeneric,n,e,void 0,t)}catch(e){throw V.wrapError("Self-certification is invalid",e)}return!0}catch(e){a=e}throw a}async update(e,t,r){const i=this.mainKey.keyPacket,n={userID:this.userID,userAttribute:this.userAttribute,key:i};await $o(e,this,"selfCertifications",t,(async function(e){try{return await e.verify(i,re.signature.certGeneric,n,t,!1,r),!0}catch(e){return!1}})),await $o(e,this,"otherCertifications",t),await $o(e,this,"revocationSignatures",t,(function(e){return Zo(i,re.signature.certRevocation,n,[e],void 0,void 0,t,r)}))}}class ic{constructor(e,t){this.keyPacket=e,this.bindingSignatures=[],this.revocationSignatures=[],this.mainKey=t}toPacketList(){const e=new ho;return e.push(this.keyPacket),e.push(...this.revocationSignatures),e.push(...this.bindingSignatures),e}clone(){const e=new ic(this.keyPacket,this.mainKey);return e.bindingSignatures=[...this.bindingSignatures],e.revocationSignatures=[...this.revocationSignatures],e}async isRevoked(e,t,r=new Date,i=ie){const n=this.mainKey.keyPacket;return Zo(n,re.signature.subkeyRevocation,{key:n,bind:this.keyPacket},this.revocationSignatures,e,t,r,i)}async verify(e=new Date,t=ie){const r=this.mainKey.keyPacket,i={key:r,bind:this.keyPacket},n=await Lo(this.bindingSignatures,r,re.signature.subkeyBinding,i,e,t);if(n.revoked||await this.isRevoked(n,null,e,t))throw Error("Subkey is revoked");if(jo(this.keyPacket,n,e))throw Error("Subkey is expired");return n}async getExpirationTime(e=new Date,t=ie){const r=this.mainKey.keyPacket,i={key:r,bind:this.keyPacket};let n;try{n=await Lo(this.bindingSignatures,r,re.signature.subkeyBinding,i,e,t)}catch(e){return null}const a=Yo(this.keyPacket,n),s=n.getExpirationTime();return a<s?a:s}async update(e,t=new Date,r=ie){const i=this.mainKey.keyPacket;if(!this.hasSameFingerprintAs(e))throw Error("Subkey update method: fingerprints of subkeys not equal");this.keyPacket.constructor.tag===re.packet.publicSubkey&&e.keyPacket.constructor.tag===re.packet.secretSubkey&&(this.keyPacket=e.keyPacket);const n=this,a={key:i,bind:n.keyPacket};await $o(e,this,"bindingSignatures",t,(async function(e){for(let t=0;t<n.bindingSignatures.length;t++)if(n.bindingSignatures[t].issuerKeyID.equals(e.issuerKeyID))return e.created>n.bindingSignatures[t].created&&(n.bindingSignatures[t]=e),!1;try{return await e.verify(i,re.signature.subkeyBinding,a,t,void 0,r),!0}catch(e){return!1}})),await $o(e,this,"revocationSignatures",t,(function(e){return Zo(i,re.signature.subkeyRevocation,a,[e],void 0,void 0,t,r)}))}async revoke(e,{flag:t=re.reasonForRevocation.noReason,string:r=""}={},i=new Date,n=ie){const a={key:e,bind:this.keyPacket},s=new ic(this.keyPacket,this.mainKey);return s.revocationSignatures.push(await Vo(a,null,e,{signatureType:re.signature.subkeyRevocation,reasonForRevocationFlag:re.write(re.reasonForRevocation,t),reasonForRevocationString:r},i,void 0,!1,n)),await s.update(this),s}hasSameFingerprintAs(e){return this.keyPacket.hasSameFingerprintAs(e.keyPacket||e)}}["getKeyID","getFingerprint","getAlgorithmInfo","getCreationTime","isDecrypted"].forEach((e=>{ic.prototype[e]=function(){return this.keyPacket[e]()}}));const nc=/*#__PURE__*/V.constructAllowedPackets([so]);class ac{packetListToStructure(e,t=new Set){let r,i,n;for(const a of e){const e=a.constructor.tag;if(t.has(e))throw Error("Unexpected packet type: "+e);switch(e){case re.packet.publicKey:case re.packet.secretKey:if(this.keyPacket)throw Error("Key block contains multiple keys");if(this.keyPacket=a,i=this.getKeyID(),!i)throw Error("Missing Key ID");break;case re.packet.userID:case re.packet.userAttribute:r=new rc(a,this),this.users.push(r);break;case re.packet.publicSubkey:case re.packet.secretSubkey:r=null,n=new ic(a,this),this.subkeys.push(n);break;case re.packet.signature:switch(a.signatureType){case re.signature.certGeneric:case re.signature.certPersona:case re.signature.certCasual:case re.signature.certPositive:if(!r){V.printDebug("Dropping certification signatures without preceding user packet");continue}a.issuerKeyID.equals(i)?r.selfCertifications.push(a):r.otherCertifications.push(a);break;case re.signature.certRevocation:r?r.revocationSignatures.push(a):this.directSignatures.push(a);break;case re.signature.key:this.directSignatures.push(a);break;case re.signature.subkeyBinding:if(!n){V.printDebug("Dropping subkey binding signature without preceding subkey packet");continue}n.bindingSignatures.push(a);break;case re.signature.keyRevocation:this.revocationSignatures.push(a);break;case re.signature.subkeyRevocation:if(!n){V.printDebug("Dropping subkey revocation signature without preceding subkey packet");continue}n.revocationSignatures.push(a)}}}}toPacketList(){const e=new ho;return e.push(this.keyPacket),e.push(...this.revocationSignatures),e.push(...this.directSignatures),this.users.map((t=>e.push(...t.toPacketList()))),this.subkeys.map((t=>e.push(...t.toPacketList()))),e}clone(e=!1){const t=new this.constructor(this.toPacketList());return e&&t.getKeys().forEach((e=>{if(e.keyPacket=Object.create(Object.getPrototypeOf(e.keyPacket),Object.getOwnPropertyDescriptors(e.keyPacket)),!e.keyPacket.isDecrypted())return;const t={};Object.keys(e.keyPacket.privateParams).forEach((r=>{t[r]=new Uint8Array(e.keyPacket.privateParams[r])})),e.keyPacket.privateParams=t})),t}getSubkeys(e=null){return this.subkeys.filter((t=>!e||t.getKeyID().equals(e,!0)))}getKeys(e=null){const t=[];return e&&!this.getKeyID().equals(e,!0)||t.push(this),t.concat(this.getSubkeys(e))}getKeyIDs(){return this.getKeys().map((e=>e.getKeyID()))}getUserIDs(){return this.users.map((e=>e.userID?e.userID.userID:null)).filter((e=>null!==e))}write(){return this.toPacketList().write()}async getSigningKey(e=null,t=new Date,r={},i=ie){await this.verifyPrimaryKey(t,r,i);const n=this.keyPacket,a=this.subkeys.slice().sort(((e,t)=>t.keyPacket.created-e.keyPacket.created));let s;for(const r of a)if(!e||r.getKeyID().equals(e))try{await r.verify(t,i);const e={key:n,bind:r.keyPacket},a=await Lo(r.bindingSignatures,n,re.signature.subkeyBinding,e,t,i);if(!Qo(r.keyPacket,a))continue;if(!a.embeddedSignature)throw Error("Missing embedded signature");return await Lo([a.embeddedSignature],r.keyPacket,re.signature.keyBinding,e,t,i),tc(r.keyPacket,i),r}catch(e){s=e}try{const a=await this.getPrimaryUser(t,r,i);if((!e||n.getKeyID().equals(e))&&Qo(n,a.selfCertification))return tc(n,i),this}catch(e){s=e}throw V.wrapError("Could not find valid signing key packet in key "+this.getKeyID().toHex(),s)}async getEncryptionKey(e,t=new Date,r={},i=ie){await this.verifyPrimaryKey(t,r,i);const n=this.keyPacket,a=this.subkeys.slice().sort(((e,t)=>t.keyPacket.created-e.keyPacket.created));let s;for(const r of a)if(!e||r.getKeyID().equals(e))try{await r.verify(t,i);const e={key:n,bind:r.keyPacket},a=await Lo(r.bindingSignatures,n,re.signature.subkeyBinding,e,t,i);if(Jo(r.keyPacket,a))return tc(r.keyPacket,i),r}catch(e){s=e}try{const a=await this.getPrimaryUser(t,r,i);if((!e||n.getKeyID().equals(e))&&Jo(n,a.selfCertification))return tc(n,i),this}catch(e){s=e}throw V.wrapError("Could not find valid encryption key packet in key "+this.getKeyID().toHex(),s)}async isRevoked(e,t,r=new Date,i=ie){return Zo(this.keyPacket,re.signature.keyRevocation,{key:this.keyPacket},this.revocationSignatures,e,t,r,i)}async verifyPrimaryKey(e=new Date,t={},r=ie){const i=this.keyPacket;if(await this.isRevoked(null,null,e,r))throw Error("Primary key is revoked");const{selfCertification:n}=await this.getPrimaryUser(e,t,r);if(jo(i,n,e))throw Error("Primary key is expired");const a=await Lo(this.directSignatures,i,re.signature.key,{key:i},e,r).catch((()=>{}));if(a&&jo(i,a,e))throw Error("Primary key is expired")}async getExpirationTime(e,t=ie){let r;try{const{selfCertification:i}=await this.getPrimaryUser(null,e,t),n=Yo(this.keyPacket,i),a=i.getExpirationTime(),s=await Lo(this.directSignatures,this.keyPacket,re.signature.key,{key:this.keyPacket},null,t).catch((()=>{}));if(s){const e=Yo(this.keyPacket,s);r=Math.min(n,a,e)}else r=n<a?n:a}catch(e){r=null}return V.normalizeDate(r)}async getPrimaryUser(e=new Date,t={},r=ie){const i=this.keyPacket,n=[];let a;for(let s=0;s<this.users.length;s++)try{const a=this.users[s];if(!a.userID)continue;if(void 0!==t.name&&a.userID.name!==t.name||void 0!==t.email&&a.userID.email!==t.email||void 0!==t.comment&&a.userID.comment!==t.comment)throw Error("Could not find user that matches that user ID");const o={userID:a.userID,key:i},c=await Lo(a.selfCertifications,i,re.signature.certGeneric,o,e,r);n.push({index:s,user:a,selfCertification:c})}catch(e){a=e}if(!n.length)throw a||Error("Could not find primary user");await Promise.all(n.map((async function(t){return t.user.revoked||t.user.isRevoked(t.selfCertification,null,e,r)})));const s=n.sort((function(e,t){const r=e.selfCertification,i=t.selfCertification;return i.revoked-r.revoked||r.isPrimaryUserID-i.isPrimaryUserID||r.created-i.created})).pop(),{user:o,selfCertification:c}=s;if(c.revoked||await o.isRevoked(c,null,e,r))throw Error("Primary user is revoked");return s}async update(e,t=new Date,r=ie){if(!this.hasSameFingerprintAs(e))throw Error("Primary key fingerprints must be equal to update the key");if(!this.isPrivate()&&e.isPrivate()){if(!(this.subkeys.length===e.subkeys.length&&this.subkeys.every((t=>e.subkeys.some((e=>t.hasSameFingerprintAs(e)))))))throw Error("Cannot update public key with private key if subkeys mismatch");return e.update(this,r)}const i=this.clone();return await $o(e,i,"revocationSignatures",t,(n=>Zo(i.keyPacket,re.signature.keyRevocation,i,[n],null,e.keyPacket,t,r))),await $o(e,i,"directSignatures",t),await Promise.all(e.users.map((async e=>{const n=i.users.filter((t=>e.userID&&e.userID.equals(t.userID)||e.userAttribute&&e.userAttribute.equals(t.userAttribute)));if(n.length>0)await Promise.all(n.map((i=>i.update(e,t,r))));else{const t=e.clone();t.mainKey=i,i.users.push(t)}}))),await Promise.all(e.subkeys.map((async e=>{const n=i.subkeys.filter((t=>t.hasSameFingerprintAs(e)));if(n.length>0)await Promise.all(n.map((i=>i.update(e,t,r))));else{const t=e.clone();t.mainKey=i,i.subkeys.push(t)}}))),i}async getRevocationCertificate(e=new Date,t=ie){const r={key:this.keyPacket},i=await Lo(this.revocationSignatures,this.keyPacket,re.signature.keyRevocation,r,e,t),n=new ho;return n.push(i),fe(re.armor.publicKey,n.write(),null,null,"This is a revocation certificate")}async applyRevocationCertificate(e,t=new Date,r=ie){const i=await de(e,r),n=(await ho.fromBinary(i.data,nc,r)).findPacket(re.packet.signature);if(!n||n.signatureType!==re.signature.keyRevocation)throw Error("Could not find revocation signature packet");if(!n.issuerKeyID.equals(this.getKeyID()))throw Error("Revocation signature does not match key");try{await n.verify(this.keyPacket,re.signature.keyRevocation,{key:this.keyPacket},t,void 0,r)}catch(e){throw V.wrapError("Could not verify revocation signature",e)}const a=this.clone();return a.revocationSignatures.push(n),a}async signPrimaryUser(e,t,r,i=ie){const{index:n,user:a}=await this.getPrimaryUser(t,r,i),s=await a.certify(e,t,i),o=this.clone();return o.users[n]=s,o}async signAllUsers(e,t=new Date,r=ie){const i=this.clone();return i.users=await Promise.all(this.users.map((function(i){return i.certify(e,t,r)}))),i}async verifyPrimaryUser(e,t=new Date,r,i=ie){const n=this.keyPacket,{user:a}=await this.getPrimaryUser(t,r,i);return e?await a.verifyAllCertifications(e,t,i):[{keyID:n.getKeyID(),valid:await a.verify(t,i).catch((()=>!1))}]}async verifyAllUsers(e,t=new Date,r=ie){const i=this.keyPacket,n=[];return await Promise.all(this.users.map((async a=>{const s=e?await a.verifyAllCertifications(e,t,r):[{keyID:i.getKeyID(),valid:await a.verify(t,r).catch((()=>!1))}];n.push(...s.map((e=>({userID:a.userID.userID,keyID:e.keyID,valid:e.valid}))))}))),n}}function sc(e){for(const t of e)switch(t.constructor.tag){case re.packet.secretKey:return new cc(e);case re.packet.publicKey:return new oc(e)}throw Error("No key packet found")}["getKeyID","getFingerprint","getAlgorithmInfo","getCreationTime","hasSameFingerprintAs"].forEach((e=>{ac.prototype[e]=ic.prototype[e]}));class oc extends ac{constructor(e){if(super(),this.keyPacket=null,this.revocationSignatures=[],this.directSignatures=[],this.users=[],this.subkeys=[],e&&(this.packetListToStructure(e,new Set([re.packet.secretKey,re.packet.secretSubkey])),!this.keyPacket))throw Error("Invalid key: missing public-key packet")}isPrivate(){return!1}toPublic(){return this}armor(e=ie){return fe(re.armor.publicKey,this.toPacketList().write(),void 0,void 0,void 0,e)}}class cc extends oc{constructor(e){if(super(),this.packetListToStructure(e,new Set([re.packet.publicKey,re.packet.publicSubkey])),!this.keyPacket)throw Error("Invalid key: missing private-key packet")}isPrivate(){return!0}toPublic(){const e=new ho,t=this.toPacketList();for(const r of t)switch(r.constructor.tag){case re.packet.secretKey:{const t=Mo.fromSecretKeyPacket(r);e.push(t);break}case re.packet.secretSubkey:{const t=Do.fromSecretSubkeyPacket(r);e.push(t);break}default:e.push(r)}return new oc(e)}armor(e=ie){return fe(re.armor.privateKey,this.toPacketList().write(),void 0,void 0,void 0,e)}async getDecryptionKeys(e,t=new Date,r={},i=ie){const n=this.keyPacket,a=[];for(let r=0;r<this.subkeys.length;r++)if(!e||this.subkeys[r].getKeyID().equals(e,!0))try{const e={key:n,bind:this.subkeys[r].keyPacket};ec(await Lo(this.subkeys[r].bindingSignatures,n,re.signature.subkeyBinding,e,t,i),i)&&a.push(this.subkeys[r])}catch(e){}const s=await this.getPrimaryUser(t,r,i);return e&&!n.getKeyID().equals(e,!0)||!ec(s.selfCertification,i)||a.push(this),a}isDecrypted(){return this.getKeys().some((({keyPacket:e})=>e.isDecrypted()))}async validate(e=ie){if(!this.isPrivate())throw Error("Cannot validate a public key");let t;if(this.keyPacket.isDummy()){const r=await this.getSigningKey(null,null,void 0,{...e,rejectPublicKeyAlgorithms:new Set,minRSABits:0});r&&!r.keyPacket.isDummy()&&(t=r.keyPacket)}else t=this.keyPacket;if(t)return t.validate();{const e=this.getKeys();if(e.map((e=>e.keyPacket.isDummy())).every(Boolean))throw Error("Cannot validate an all-gnu-dummy key");return Promise.all(e.map((async e=>e.keyPacket.validate())))}}clearPrivateParams(){this.getKeys().forEach((({keyPacket:e})=>{e.isDecrypted()&&e.clearPrivateParams()}))}async revoke({flag:e=re.reasonForRevocation.noReason,string:t=""}={},r=new Date,i=ie){if(!this.isPrivate())throw Error("Need private key for revoking");const n={key:this.keyPacket},a=this.clone();return a.revocationSignatures.push(await Vo(n,null,this.keyPacket,{signatureType:re.signature.keyRevocation,reasonForRevocationFlag:re.write(re.reasonForRevocation,e),reasonForRevocationString:t},r,void 0,void 0,i)),a}async addSubkey(e={}){const t={...ie,...e.config};if(e.passphrase)throw Error("Subkey could not be encrypted here, please encrypt whole key");if(e.rsaBits<t.minRSABits)throw Error(`rsaBits should be at least ${t.minRSABits}, got: ${e.rsaBits}`);const r=this.keyPacket;if(r.isDummy())throw Error("Cannot add subkey to gnu-dummy primary key");if(!r.isDecrypted())throw Error("Key is not decrypted");const i=r.getAlgorithmInfo();i.type=i.curve?"ecc":"rsa",i.rsaBits=i.bits||4096,i.curve=i.curve||"curve25519",e=Xo(e,i);const n=await Fo(e),a=await Wo(n,r,e,t),s=this.toPacketList();return s.push(n,a),new cc(s)}}const uc=/*#__PURE__*/V.constructAllowedPackets([Mo,Do,Io,zo,To,Ro,so]);async function hc(e,t,r,i){r.passphrase&&await e.encrypt(r.passphrase,i),await Promise.all(t.map((async function(e,t){const n=r.subkeys[t].passphrase;n&&await e.encrypt(n,i)})));const n=new ho;n.push(e),await Promise.all(r.userIDs.map((async function(t,n){function a(e,t){return[t,...e.filter((e=>e!==t))]}const s=To.fromObject(t),o={};o.userID=s,o.key=e;const c=new so;return c.signatureType=re.signature.certGeneric,c.publicKeyAlgorithm=e.algorithm,c.hashAlgorithm=await Ho(null,e,void 0,void 0,i),c.keyFlags=[re.keyFlags.certifyKeys|re.keyFlags.signData],c.preferredSymmetricAlgorithms=a([re.symmetric.aes256,re.symmetric.aes128,re.symmetric.aes192],i.preferredSymmetricAlgorithm),i.aeadProtect&&(c.preferredAEADAlgorithms=a([re.aead.eax,re.aead.ocb],i.preferredAEADAlgorithm)),c.preferredHashAlgorithms=a([re.hash.sha256,re.hash.sha512],i.preferredHashAlgorithm),c.preferredCompressionAlgorithms=a([re.compression.zlib,re.compression.zip,re.compression.uncompressed],i.preferredCompressionAlgorithm),0===n&&(c.isPrimaryUserID=!0),c.features=[0],c.features[0]|=re.features.modificationDetection,i.aeadProtect&&(c.features[0]|=re.features.aead),i.v5Keys&&(c.features[0]|=re.features.v5Keys),r.keyExpirationTime>0&&(c.keyExpirationTime=r.keyExpirationTime,c.keyNeverExpires=!1),await c.sign(e,o,r.date),{userIDPacket:s,signaturePacket:c}}))).then((e=>{e.forEach((({userIDPacket:e,signaturePacket:t})=>{n.push(e),n.push(t)}))})),await Promise.all(t.map((async function(t,n){const a=r.subkeys[n];return{secretSubkeyPacket:t,subkeySignaturePacket:await Wo(t,e,a,i)}}))).then((e=>{e.forEach((({secretSubkeyPacket:e,subkeySignaturePacket:t})=>{n.push(e),n.push(t)}))}));const a={key:e};return n.push(await Vo(a,null,e,{signatureType:re.signature.keyRevocation,reasonForRevocationFlag:re.reasonForRevocation.noReason,reasonForRevocationString:""},r.date,void 0,void 0,i)),r.passphrase&&e.clearPrivateParams(),await Promise.all(t.map((async function(e,t){r.subkeys[t].passphrase&&e.clearPrivateParams()}))),new cc(n)}const dc=/*#__PURE__*/V.constructAllowedPackets([Zs,lo,So,ko,Ko,Eo,xo,co,so]),fc=/*#__PURE__*/V.constructAllowedPackets([xo]),lc=/*#__PURE__*/V.constructAllowedPackets([so]);class pc{constructor(e){this.packets=e||new ho}getEncryptionKeyIDs(){const e=[];return this.packets.filterByTag(re.packet.publicKeyEncryptedSessionKey).forEach((function(t){e.push(t.publicKeyID)})),e}getSigningKeyIDs(){const e=this.unwrapCompressed(),t=e.packets.filterByTag(re.packet.onePassSignature);if(t.length>0)return t.map((e=>e.issuerKeyID));return e.packets.filterByTag(re.packet.signature).map((e=>e.issuerKeyID))}async decrypt(e,t,r,i=new Date,n=ie){const a=r||await this.decryptSessionKeys(e,t,i,n),s=this.packets.filterByTag(re.packet.symmetricallyEncryptedData,re.packet.symEncryptedIntegrityProtectedData,re.packet.aeadEncryptedData);if(0===s.length)return this;const o=s[0];let c=null;const u=Promise.all(a.map((async e=>{if(!e||!V.isUint8Array(e.data)||!V.isString(e.algorithm))throw Error("Invalid session key for decryption.");try{await o.decrypt(e.algorithm,e.data,n)}catch(e){V.printDebugError(e),c=e}})));if(j(o.encrypted),o.encrypted=null,await u,!o.packets||!o.packets.length)throw c||Error("Decryption failed.");const h=new pc(o.packets);return o.packets=new ho,h}async decryptSessionKeys(e,t,r=new Date,i=ie){let n,a=[];if(t){const e=this.packets.filterByTag(re.packet.symEncryptedSessionKey);if(0===e.length)throw Error("No symmetrically encrypted session key packet found.");await Promise.all(t.map((async function(t,r){let n;n=r?await ho.fromBinary(e.write(),fc,i):e,await Promise.all(n.map((async function(e){try{await e.decrypt(t),a.push(e)}catch(e){V.printDebugError(e)}})))})))}else{if(!e)throw Error("No key or password specified.");{const t=this.packets.filterByTag(re.packet.publicKeyEncryptedSessionKey);if(0===t.length)throw Error("No public key encrypted session key packet found.");await Promise.all(t.map((async function(t){await Promise.all(e.map((async function(e){let s=[re.symmetric.aes256,re.symmetric.aes128,re.symmetric.tripledes,re.symmetric.cast5];try{const t=await e.getPrimaryUser(r,void 0,i);t.selfCertification.preferredSymmetricAlgorithms&&(s=s.concat(t.selfCertification.preferredSymmetricAlgorithms))}catch(e){}const o=(await e.getDecryptionKeys(t.publicKeyID,null,void 0,i)).map((e=>e.keyPacket));await Promise.all(o.map((async function(e){if(e&&!e.isDummy()){if(!e.isDecrypted())throw Error("Decryption key is not decrypted.");try{if(await t.decrypt(e),!s.includes(re.write(re.symmetric,t.sessionKeyAlgorithm)))throw Error("A non-preferred symmetric algorithm was used.");a.push(t)}catch(e){V.printDebugError(e),n=e}}})))}))),j(t.encrypted),t.encrypted=null})))}}if(a.length){if(a.length>1){const e=new Set;a=a.filter((t=>{const r=t.sessionKeyAlgorithm+V.uint8ArrayToString(t.sessionKey);return!e.has(r)&&(e.add(r),!0)}))}return a.map((e=>({data:e.sessionKey,algorithm:e.sessionKeyAlgorithm})))}throw n||Error("Session key decryption failed.")}getLiteralData(){const e=this.unwrapCompressed().packets.findPacket(re.packet.literalData);return e&&e.getBytes()||null}getFilename(){const e=this.unwrapCompressed().packets.findPacket(re.packet.literalData);return e&&e.getFilename()||null}getText(){const e=this.unwrapCompressed().packets.findPacket(re.packet.literalData);return e?e.getText():null}static async generateSessionKey(e=[],t=new Date,r=[],i=ie){const n=re.read(re.symmetric,await Go("symmetric",e,t,r,i)),a=i.aeadProtect&&await async function(e,t=new Date,r=[],i=ie){let n=!0;return await Promise.all(e.map((async function(e,a){const s=await e.getPrimaryUser(t,r[a],i);s.selfCertification.features&&s.selfCertification.features[0]&re.features.aead||(n=!1)}))),n}(e,t,r,i)?re.read(re.aead,await Go("aead",e,t,r,i)):void 0;return{data:await On.generateSessionKey(n),algorithm:n,aeadAlgorithm:a}}async encrypt(e,t,r,i=!1,n=[],a=new Date,s=[],o=ie){if(r){if(!V.isUint8Array(r.data)||!V.isString(r.algorithm))throw Error("Invalid session key for encryption.")}else if(e&&e.length)r=await pc.generateSessionKey(e,a,s,o);else{if(!t||!t.length)throw Error("No keys, passwords, or session key provided.");r=await pc.generateSessionKey(void 0,void 0,void 0,o)}const{data:c,algorithm:u,aeadAlgorithm:h}=r,d=await pc.encryptSessionKey(c,u,h,e,t,i,n,a,s,o);let f;return h?(f=new So,f.aeadAlgorithm=h):f=new ko,f.packets=this.packets,await f.encrypt(u,c,o),d.packets.push(f),f.packets=new ho,d}static async encryptSessionKey(e,t,r,i,n,a=!1,s=[],o=new Date,c=[],u=ie){const h=new ho;if(i){const r=await Promise.all(i.map((async function(r,i){const n=await r.getEncryptionKey(s[i],o,c,u),h=new Eo;return h.publicKeyID=a?le.wildcard():n.getKeyID(),h.publicKeyAlgorithm=n.keyPacket.algorithm,h.sessionKey=e,h.sessionKeyAlgorithm=t,await h.encrypt(n.keyPacket),delete h.sessionKey,h})));h.push(...r)}if(n){const i=async function(e,t){try{return await e.decrypt(t),1}catch(e){return 0}},a=(e,t)=>e+t,s=async function(e,t,r,o){const c=new xo(u);if(c.sessionKey=e,c.sessionKeyAlgorithm=t,r&&(c.aeadAlgorithm=r),await c.encrypt(o,u),u.passwordCollisionCheck){if(1!==(await Promise.all(n.map((e=>i(c,e))))).reduce(a))return s(e,t,o)}return delete c.sessionKey,c},o=await Promise.all(n.map((i=>s(e,t,r,i))));h.push(...o)}return new pc(h)}async sign(e=[],t=null,r=[],i=new Date,n=[],a=ie){const s=new ho,o=this.packets.findPacket(re.packet.literalData);if(!o)throw Error("No literal data packet to sign.");let c,u;const h=null===o.text?re.signature.binary:re.signature.text;if(t)for(u=t.packets.filterByTag(re.packet.signature),c=u.length-1;c>=0;c--){const t=u[c],r=new co;r.signatureType=t.signatureType,r.hashAlgorithm=t.hashAlgorithm,r.publicKeyAlgorithm=t.publicKeyAlgorithm,r.issuerKeyID=t.issuerKeyID,e.length||0!==c||(r.flags=1),s.push(r)}return await Promise.all(Array.from(e).reverse().map((async function(t,s){if(!t.isPrivate())throw Error("Need private key for signing");const o=r[e.length-1-s],c=await t.getSigningKey(o,i,n,a),u=new co;return u.signatureType=h,u.hashAlgorithm=await Ho(t,c.keyPacket,i,n,a),u.publicKeyAlgorithm=c.keyPacket.algorithm,u.issuerKeyID=c.getKeyID(),s===e.length-1&&(u.flags=1),u}))).then((e=>{e.forEach((e=>s.push(e)))})),s.push(o),s.push(...await yc(o,e,t,r,i,n,!1,a)),new pc(s)}compress(e,t=ie){if(e===re.compression.uncompressed)return this;const r=new lo(t);r.algorithm=re.read(re.compression,e),r.packets=this.packets;const i=new ho;return i.push(r),new pc(i)}async signDetached(e=[],t=null,r=[],i=new Date,n=[],a=ie){const s=this.packets.findPacket(re.packet.literalData);if(!s)throw Error("No literal data packet to sign.");return new Oo(await yc(s,e,t,r,i,n,!0,a))}async verify(e,t=new Date,r=ie){const i=this.unwrapCompressed(),n=i.packets.filterByTag(re.packet.literalData);if(1!==n.length)throw Error("Can only verify message with one literal data packet.");s(i.packets.stream)&&i.packets.push(...await L(i.packets.stream,(e=>e||[])));const a=i.packets.filterByTag(re.packet.onePassSignature).reverse(),o=i.packets.filterByTag(re.packet.signature);return a.length&&!o.length&&V.isStream(i.packets.stream)&&!s(i.packets.stream)?(await Promise.all(a.map((async e=>{e.correspondingSig=new Promise(((t,r)=>{e.correspondingSigResolve=t,e.correspondingSigReject=r})),e.signatureData=W((async()=>(await e.correspondingSig).signatureData)),e.hashed=L(await e.hash(e.signatureType,n[0],void 0,!1)),e.hashed.catch((()=>{}))}))),i.packets.stream=T(i.packets.stream,(async(e,t)=>{const r=K(e),i=D(t);try{for(let e=0;e<a.length;e++){const{value:t}=await r.read();a[e].correspondingSigResolve(t)}await r.readToEnd(),await i.ready,await i.close()}catch(e){a.forEach((t=>{t.correspondingSigReject(e)})),await i.abort(e)}})),bc(a,n,e,t,!1,r)):bc(o,n,e,t,!1,r)}verifyDetached(e,t,r=new Date,i=ie){const n=this.unwrapCompressed().packets.filterByTag(re.packet.literalData);if(1!==n.length)throw Error("Can only verify message with one literal data packet.");return bc(e.packets,n,t,r,!0,i)}unwrapCompressed(){const e=this.packets.filterByTag(re.packet.compressedData);return e.length?new pc(e[0].packets):this}async appendSignature(e,t=ie){await this.packets.read(V.isUint8Array(e)?e:(await de(e)).data,lc,t)}write(){return this.packets.write()}armor(e=ie){return fe(re.armor.message,this.write(),null,null,null,e)}}async function yc(e,t,r=null,i=[],n=new Date,a=[],s=!1,o=ie){const c=new ho,u=null===e.text?re.signature.binary:re.signature.text;if(await Promise.all(t.map((async(t,r)=>{const c=a[r];if(!t.isPrivate())throw Error("Need private key for signing");const h=await t.getSigningKey(i[r],n,c,o);return Vo(e,t,h.keyPacket,{signatureType:u},n,c,s,o)}))).then((e=>{c.push(...e)})),r){const e=r.packets.filterByTag(re.packet.signature);c.push(...e)}return c}async function bc(e,t,r,i=new Date,n=!1,a=ie){return Promise.all(e.filter((function(e){return["text","binary"].includes(re.read(re.signature,e.signatureType))})).map((async function(e){return async function(e,t,r,i=new Date,n=!1,a=ie){let s,o;for(const t of r){const r=t.getKeys(e.issuerKeyID);if(r.length>0){s=t,o=r[0];break}}const c=e instanceof co?e.correspondingSig:e,u={keyID:e.issuerKeyID,verified:(async()=>{if(!o)throw Error("Could not find signing key with key ID "+e.issuerKeyID.toHex());await e.verify(o.keyPacket,e.signatureType,t[0],i,n,a);const r=await c;if(o.getCreationTime()>r.created)throw Error("Key is newer than the signature");return await s.getSigningKey(o.getKeyID(),r.created,void 0,a),!0})(),signature:(async()=>{const e=await c,t=new ho;return e&&t.push(e),new Oo(t)})()};return u.signature.catch((()=>{})),u.verified.catch((()=>{})),u}(e,t,r,i,n,a)})))}const mc=/*#__PURE__*/V.constructAllowedPackets([so]);class gc{constructor(e,t){if(this.text=V.removeTrailingSpaces(e).replace(/\r?\n/g,"\r\n"),t&&!(t instanceof Oo))throw Error("Invalid signature input");this.signature=t||new Oo(new ho)}getSigningKeyIDs(){const e=[];return this.signature.packets.forEach((function(t){e.push(t.issuerKeyID)})),e}async sign(e,t=null,r=[],i=new Date,n=[],a=ie){const s=new Zs;s.setText(this.text);const o=new Oo(await yc(s,e,t,r,i,n,!0,a));return new gc(this.text,o)}verify(e,t=new Date,r=ie){const i=this.signature.packets,n=new Zs;return n.setText(this.text),bc(i,[n],e,t,!0,r)}getText(){return this.text.replace(/\r\n/g,"\n")}armor(e=ie){let t=this.signature.packets.map((function(e){return re.read(re.hash,e.hashAlgorithm).toUpperCase()}));t=t.filter((function(e,t,r){return r.indexOf(e)===t}));const r={hash:t.join(),text:this.text,data:this.signature.packets.write()};return fe(re.armor.signed,r,void 0,void 0,void 0,e)}}function wc(e){if(!(e instanceof pc))throw Error("Parameter [message] needs to be of type Message")}function vc(e){if(!(e instanceof gc||e instanceof pc))throw Error("Parameter [message] needs to be of type Message or CleartextMessage")}function _c(e){if("armored"!==e&&"binary"!==e&&"object"!==e)throw Error("Unsupported format "+e)}const kc=Object.keys(ie).length;function Ac(e){const t=Object.keys(e);if(t.length!==kc)for(const e of t)if(void 0===ie[e])throw Error("Unknown config property: "+e)}function Sc(e){return e&&!V.isArray(e)&&(e=[e]),e}async function Ec(e,t,r="utf8"){const i=V.isStream(e);return"array"===i?L(e):"node"===t?(e=b(e),"binary"!==r&&e.setEncoding(r),e):"web"===t&&"ponyfill"===i?_(e):e}function Pc(e,t){e.data=T(t.packets.stream,(async(t,r)=>{await R(e.data,r,{preventClose:!0});const i=D(r);try{await L(t,(e=>e)),await i.close()}catch(e){await i.abort(e)}}))}function xc(e,t,r){switch(t){case"object":return e;case"armored":return e.armor(r);case"binary":return e.write();default:throw Error("Unsupported format "+t)}}const Mc="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?Symbol:e=>`Symbol(${e})`;function Cc(){}const Kc="undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:void 0;function Dc(e){return"object"==typeof e&&null!==e||"function"==typeof e}const Rc=Cc,Ic=Promise,Uc=Promise.prototype.then,Bc=Promise.resolve.bind(Ic),Tc=Promise.reject.bind(Ic);function zc(e){return new Ic(e)}function qc(e){return Bc(e)}function Oc(e){return Tc(e)}function Fc(e,t,r){return Uc.call(e,t,r)}function Nc(e,t,r){Fc(Fc(e,t,r),void 0,Rc)}function Lc(e,t){Nc(e,t)}function jc(e,t){Nc(e,void 0,t)}function Wc(e,t,r){return Fc(e,t,r)}function Hc(e){Fc(e,void 0,Rc)}const Gc=(()=>{const e=Kc&&Kc.queueMicrotask;if("function"==typeof e)return e;const t=qc(void 0);return e=>Fc(t,e)})();function Vc(e,t,r){if("function"!=typeof e)throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,t,r)}function $c(e,t,r){try{return qc(Vc(e,t,r))}catch(e){return Oc(e)}}class Zc{constructor(){this._cursor=0,this._size=0,this._front={_elements:[],_next:void 0},this._back=this._front,this._cursor=0,this._size=0}get length(){return this._size}push(e){const t=this._back;let r=t;16383===t._elements.length&&(r={_elements:[],_next:void 0}),t._elements.push(e),r!==t&&(this._back=r,t._next=r),++this._size}shift(){const e=this._front;let t=e;const r=this._cursor;let i=r+1;const n=e._elements,a=n[r];return 16384===i&&(t=e._next,i=0),--this._size,this._cursor=i,e!==t&&(this._front=t),n[r]=void 0,a}forEach(e){let t=this._cursor,r=this._front,i=r._elements;for(;!(t===i.length&&void 0===r._next||t===i.length&&(r=r._next,i=r._elements,t=0,0===i.length));)e(i[t]),++t}peek(){const e=this._front,t=this._cursor;return e._elements[t]}}function Yc(e,t){e._ownerReadableStream=t,t._reader=e,"readable"===t._state?eu(e):"closed"===t._state?function(e){eu(e),iu(e)}(e):tu(e,t._storedError)}function Xc(e,t){return Ud(e._ownerReadableStream,t)}function Qc(e){"readable"===e._ownerReadableStream._state?ru(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):function(e,t){tu(e,t)}(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),e._ownerReadableStream._reader=void 0,e._ownerReadableStream=void 0}function Jc(e){return new TypeError("Cannot "+e+" a stream using a released reader")}function eu(e){e._closedPromise=zc(((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r}))}function tu(e,t){eu(e),ru(e,t)}function ru(e,t){void 0!==e._closedPromise_reject&&(Hc(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0)}function iu(e){void 0!==e._closedPromise_resolve&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0)}const nu=Mc("[[AbortSteps]]"),au=Mc("[[ErrorSteps]]"),su=Mc("[[CancelSteps]]"),ou=Mc("[[PullSteps]]"),cu=Number.isFinite||function(e){return"number"==typeof e&&isFinite(e)},uu=Math.trunc||function(e){return e<0?Math.ceil(e):Math.floor(e)};function hu(e,t){if(void 0!==e&&("object"!=typeof(r=e)&&"function"!=typeof r))throw new TypeError(t+" is not an object.");var r}function du(e,t){if("function"!=typeof e)throw new TypeError(t+" is not a function.")}function fu(e,t){if(!function(e){return"object"==typeof e&&null!==e||"function"==typeof e}(e))throw new TypeError(t+" is not an object.")}function lu(e,t,r){if(void 0===e)throw new TypeError(`Parameter ${t} is required in '${r}'.`)}function pu(e,t,r){if(void 0===e)throw new TypeError(`${t} is required in '${r}'.`)}function yu(e){return Number(e)}function bu(e){return 0===e?0:e}function mu(e,t){const r=Number.MAX_SAFE_INTEGER;let i=Number(e);if(i=bu(i),!cu(i))throw new TypeError(t+" is not a finite number");if(i=function(e){return bu(uu(e))}(i),i<0||i>r)throw new TypeError(`${t} is outside the accepted range of 0 to ${r}, inclusive`);return cu(i)&&0!==i?i:0}function gu(e,t){if(!Rd(e))throw new TypeError(t+" is not a ReadableStream.")}function wu(e){return new Su(e)}function vu(e,t){e._reader._readRequests.push(t)}function _u(e,t,r){const i=e._reader._readRequests.shift();r?i._closeSteps():i._chunkSteps(t)}function ku(e){return e._reader._readRequests.length}function Au(e){const t=e._reader;return void 0!==t&&!!Eu(t)}class Su{constructor(e){if(lu(e,1,"ReadableStreamDefaultReader"),gu(e,"First parameter"),Id(e))throw new TypeError("This stream has already been locked for exclusive reading by another reader");Yc(this,e),this._readRequests=new Zc}get closed(){return Eu(this)?this._closedPromise:Oc(xu("closed"))}cancel(e){return Eu(this)?void 0===this._ownerReadableStream?Oc(Jc("cancel")):Xc(this,e):Oc(xu("cancel"))}read(){if(!Eu(this))return Oc(xu("read"));if(void 0===this._ownerReadableStream)return Oc(Jc("read from"));let e,t;const r=zc(((r,i)=>{e=r,t=i}));return Pu(this,{_chunkSteps:t=>e({value:t,done:!1}),_closeSteps:()=>e({value:void 0,done:!0}),_errorSteps:e=>t(e)}),r}releaseLock(){if(!Eu(this))throw xu("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");Qc(this)}}}function Eu(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readRequests")}function Pu(e,t){const r=e._ownerReadableStream;r._disturbed=!0,"closed"===r._state?t._closeSteps():"errored"===r._state?t._errorSteps(r._storedError):r._readableStreamController[ou](t)}function xu(e){return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`)}let Mu;Object.defineProperties(Su.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Su.prototype,Mc.toStringTag,{value:"ReadableStreamDefaultReader",configurable:!0}),"symbol"==typeof Mc.asyncIterator&&(Mu={[Mc.asyncIterator](){return this}},Object.defineProperty(Mu,Mc.asyncIterator,{enumerable:!1}));class Cu{constructor(e,t){this._ongoingPromise=void 0,this._isFinished=!1,this._reader=e,this._preventCancel=t}next(){const e=()=>this._nextSteps();return this._ongoingPromise=this._ongoingPromise?Wc(this._ongoingPromise,e,e):e(),this._ongoingPromise}return(e){const t=()=>this._returnSteps(e);return this._ongoingPromise?Wc(this._ongoingPromise,t,t):t()}_nextSteps(){if(this._isFinished)return Promise.resolve({value:void 0,done:!0});const e=this._reader;if(void 0===e._ownerReadableStream)return Oc(Jc("iterate"));let t,r;const i=zc(((e,i)=>{t=e,r=i}));return Pu(e,{_chunkSteps:e=>{this._ongoingPromise=void 0,Gc((()=>t({value:e,done:!1})))},_closeSteps:()=>{this._ongoingPromise=void 0,this._isFinished=!0,Qc(e),t({value:void 0,done:!0})},_errorSteps:t=>{this._ongoingPromise=void 0,this._isFinished=!0,Qc(e),r(t)}}),i}_returnSteps(e){if(this._isFinished)return Promise.resolve({value:e,done:!0});this._isFinished=!0;const t=this._reader;if(void 0===t._ownerReadableStream)return Oc(Jc("finish iterating"));if(!this._preventCancel){const r=Xc(t,e);return Qc(t),Wc(r,(()=>({value:e,done:!0})))}return Qc(t),qc({value:e,done:!0})}}const Ku={next(){return Du(this)?this._asyncIteratorImpl.next():Oc(Ru("next"))},return(e){return Du(this)?this._asyncIteratorImpl.return(e):Oc(Ru("return"))}};function Du(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_asyncIteratorImpl")}function Ru(e){return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`)}void 0!==Mu&&Object.setPrototypeOf(Ku,Mu);const Iu=Number.isNaN||function(e){return e!=e};function Uu(e){return!!function(e){if("number"!=typeof e)return!1;if(Iu(e))return!1;if(e<0)return!1;return!0}(e)&&e!==1/0}function Bu(e){const t=e._queue.shift();return e._queueTotalSize-=t.size,e._queueTotalSize<0&&(e._queueTotalSize=0),t.value}function Tu(e,t,r){if(!Uu(r=Number(r)))throw new RangeError("Size must be a finite, non-NaN, non-negative number.");e._queue.push({value:t,size:r}),e._queueTotalSize+=r}function zu(e){e._queue=new Zc,e._queueTotalSize=0}function qu(e){return e.slice()}class Ou{constructor(){throw new TypeError("Illegal constructor")}get view(){if(!Lu(this))throw nh("view");return this._view}respond(e){if(!Lu(this))throw nh("respond");if(lu(e,1,"respond"),e=mu(e,"First parameter"),void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");this._view.buffer,function(e,t){if(!Uu(t=Number(t)))throw new RangeError("bytesWritten must be a finite");Qu(e,t)}(this._associatedReadableByteStreamController,e)}respondWithNewView(e){if(!Lu(this))throw nh("respondWithNewView");if(lu(e,1,"respondWithNewView"),!ArrayBuffer.isView(e))throw new TypeError("You can only respond with array buffer views");if(0===e.byteLength)throw new TypeError("chunk must have non-zero byteLength");if(0===e.buffer.byteLength)throw new TypeError("chunk's buffer must have non-zero byteLength");if(void 0===this._associatedReadableByteStreamController)throw new TypeError("This BYOB request has been invalidated");!function(e,t){const r=e._pendingPullIntos.peek();if(r.byteOffset+r.bytesFilled!==t.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(r.byteLength!==t.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");r.buffer=t.buffer,Qu(e,t.byteLength)}(this._associatedReadableByteStreamController,e)}}Object.defineProperties(Ou.prototype,{respond:{enumerable:!0},respondWithNewView:{enumerable:!0},view:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Ou.prototype,Mc.toStringTag,{value:"ReadableStreamBYOBRequest",configurable:!0});class Fu{constructor(){throw new TypeError("Illegal constructor")}get byobRequest(){if(!Nu(this))throw ah("byobRequest");if(null===this._byobRequest&&this._pendingPullIntos.length>0){const e=this._pendingPullIntos.peek(),t=new Uint8Array(e.buffer,e.byteOffset+e.bytesFilled,e.byteLength-e.bytesFilled),r=Object.create(Ou.prototype);!function(e,t,r){e._associatedReadableByteStreamController=t,e._view=r}(r,this,t),this._byobRequest=r}return this._byobRequest}get desiredSize(){if(!Nu(this))throw ah("desiredSize");return rh(this)}close(){if(!Nu(this))throw ah("close");if(this._closeRequested)throw new TypeError("The stream has already been closed; do not close it again!");const e=this._controlledReadableByteStream._state;if("readable"!==e)throw new TypeError(`The stream (in ${e} state) is not in the readable state and cannot be closed`);!function(e){const t=e._controlledReadableByteStream;if(e._closeRequested||"readable"!==t._state)return;if(e._queueTotalSize>0)return void(e._closeRequested=!0);if(e._pendingPullIntos.length>0){if(e._pendingPullIntos.peek().bytesFilled>0){const t=new TypeError("Insufficient bytes to fill elements in the given buffer");throw th(e,t),t}}eh(e),Bd(t)}(this)}enqueue(e){if(!Nu(this))throw ah("enqueue");if(lu(e,1,"enqueue"),!ArrayBuffer.isView(e))throw new TypeError("chunk must be an array buffer view");if(0===e.byteLength)throw new TypeError("chunk must have non-zero byteLength");if(0===e.buffer.byteLength)throw new TypeError("chunk's buffer must have non-zero byteLength");if(this._closeRequested)throw new TypeError("stream is closed or draining");const t=this._controlledReadableByteStream._state;if("readable"!==t)throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be enqueued to`);!function(e,t){const r=e._controlledReadableByteStream;if(e._closeRequested||"readable"!==r._state)return;const i=t.buffer,n=t.byteOffset,a=t.byteLength,s=i;if(Au(r))if(0===ku(r))Gu(e,s,n,a);else{_u(r,new Uint8Array(s,n,a),!1)}else ch(r)?(Gu(e,s,n,a),Xu(e)):Gu(e,s,n,a);ju(e)}(this,e)}error(e){if(!Nu(this))throw ah("error");th(this,e)}[su](e){if(this._pendingPullIntos.length>0){this._pendingPullIntos.peek().bytesFilled=0}zu(this);const t=this._cancelAlgorithm(e);return eh(this),t}[ou](e){const t=this._controlledReadableByteStream;if(this._queueTotalSize>0){const t=this._queue.shift();this._queueTotalSize-=t.byteLength,Zu(this);const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);return void e._chunkSteps(r)}const r=this._autoAllocateChunkSize;if(void 0!==r){let t;try{t=new ArrayBuffer(r)}catch(t){return void e._errorSteps(t)}const i={buffer:t,byteOffset:0,byteLength:r,bytesFilled:0,elementSize:1,viewConstructor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(i)}vu(t,e),ju(this)}}function Nu(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_controlledReadableByteStream")}function Lu(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")}function ju(e){if(!function(e){const t=e._controlledReadableByteStream;if("readable"!==t._state)return!1;if(e._closeRequested)return!1;if(!e._started)return!1;if(Au(t)&&ku(t)>0)return!0;if(ch(t)&&oh(t)>0)return!0;if(rh(e)>0)return!0;return!1}(e))return;if(e._pulling)return void(e._pullAgain=!0);e._pulling=!0;Nc(e._pullAlgorithm(),(()=>{e._pulling=!1,e._pullAgain&&(e._pullAgain=!1,ju(e))}),(t=>{th(e,t)}))}function Wu(e,t){let r=!1;"closed"===e._state&&(r=!0);const i=Hu(t);"default"===t.readerType?_u(e,i,r):function(e,t,r){const i=e._reader._readIntoRequests.shift();r?i._closeSteps(t):i._chunkSteps(t)}(e,i,r)}function Hu(e){const t=e.bytesFilled,r=e.elementSize;return new e.viewConstructor(e.buffer,e.byteOffset,t/r)}function Gu(e,t,r,i){e._queue.push({buffer:t,byteOffset:r,byteLength:i}),e._queueTotalSize+=i}function Vu(e,t){const r=t.elementSize,i=t.bytesFilled-t.bytesFilled%r,n=Math.min(e._queueTotalSize,t.byteLength-t.bytesFilled),a=t.bytesFilled+n,s=a-a%r;let o=n,c=!1;s>i&&(o=s-t.bytesFilled,c=!0);const u=e._queue;for(;o>0;){const r=u.peek(),i=Math.min(o,r.byteLength),n=t.byteOffset+t.bytesFilled;h=t.buffer,d=n,f=r.buffer,l=r.byteOffset,p=i,new Uint8Array(h).set(new Uint8Array(f,l,p),d),r.byteLength===i?u.shift():(r.byteOffset+=i,r.byteLength-=i),e._queueTotalSize-=i,$u(e,i,t),o-=i}var h,d,f,l,p;return c}function $u(e,t,r){Yu(e),r.bytesFilled+=t}function Zu(e){0===e._queueTotalSize&&e._closeRequested?(eh(e),Bd(e._controlledReadableByteStream)):ju(e)}function Yu(e){null!==e._byobRequest&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=null,e._byobRequest=null)}function Xu(e){for(;e._pendingPullIntos.length>0;){if(0===e._queueTotalSize)return;const t=e._pendingPullIntos.peek();Vu(e,t)&&(Ju(e),Wu(e._controlledReadableByteStream,t))}}function Qu(e,t){const r=e._pendingPullIntos.peek();if("closed"===e._controlledReadableByteStream._state){if(0!==t)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");!function(e,t){t.buffer=t.buffer;const r=e._controlledReadableByteStream;if(ch(r))for(;oh(r)>0;)Wu(r,Ju(e))}(e,r)}else!function(e,t,r){if(r.bytesFilled+t>r.byteLength)throw new RangeError("bytesWritten out of range");if($u(e,t,r),r.bytesFilled<r.elementSize)return;Ju(e);const i=r.bytesFilled%r.elementSize;if(i>0){const t=r.byteOffset+r.bytesFilled,n=r.buffer.slice(t-i,t);Gu(e,n,0,n.byteLength)}r.buffer=r.buffer,r.bytesFilled-=i,Wu(e._controlledReadableByteStream,r),Xu(e)}(e,t,r);ju(e)}function Ju(e){const t=e._pendingPullIntos.shift();return Yu(e),t}function eh(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0}function th(e,t){const r=e._controlledReadableByteStream;"readable"===r._state&&(!function(e){Yu(e),e._pendingPullIntos=new Zc}(e),zu(e),eh(e),Td(r,t))}function rh(e){const t=e._controlledReadableByteStream._state;return"errored"===t?null:"closed"===t?0:e._strategyHWM-e._queueTotalSize}function ih(e,t,r){const i=Object.create(Fu.prototype);let n=()=>{},a=()=>qc(void 0),s=()=>qc(void 0);void 0!==t.start&&(n=()=>t.start(i)),void 0!==t.pull&&(a=()=>t.pull(i)),void 0!==t.cancel&&(s=e=>t.cancel(e));const o=t.autoAllocateChunkSize;if(0===o)throw new TypeError("autoAllocateChunkSize must be greater than 0");!function(e,t,r,i,n,a,s){t._controlledReadableByteStream=e,t._pullAgain=!1,t._pulling=!1,t._byobRequest=null,t._queue=t._queueTotalSize=void 0,zu(t),t._closeRequested=!1,t._started=!1,t._strategyHWM=a,t._pullAlgorithm=i,t._cancelAlgorithm=n,t._autoAllocateChunkSize=s,t._pendingPullIntos=new Zc,e._readableStreamController=t,Nc(qc(r()),(()=>{t._started=!0,ju(t)}),(e=>{th(t,e)}))}(e,i,n,a,s,r,o)}function nh(e){return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`)}function ah(e){return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`)}function sh(e,t){e._reader._readIntoRequests.push(t)}function oh(e){return e._reader._readIntoRequests.length}function ch(e){const t=e._reader;return void 0!==t&&!!hh(t)}Object.defineProperties(Fu.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},byobRequest:{enumerable:!0},desiredSize:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Fu.prototype,Mc.toStringTag,{value:"ReadableByteStreamController",configurable:!0});class uh{constructor(e){if(lu(e,1,"ReadableStreamBYOBReader"),gu(e,"First parameter"),Id(e))throw new TypeError("This stream has already been locked for exclusive reading by another reader");if(!Nu(e._readableStreamController))throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");Yc(this,e),this._readIntoRequests=new Zc}get closed(){return hh(this)?this._closedPromise:Oc(dh("closed"))}cancel(e){return hh(this)?void 0===this._ownerReadableStream?Oc(Jc("cancel")):Xc(this,e):Oc(dh("cancel"))}read(e){if(!hh(this))return Oc(dh("read"));if(!ArrayBuffer.isView(e))return Oc(new TypeError("view must be an array buffer view"));if(0===e.byteLength)return Oc(new TypeError("view must have non-zero byteLength"));if(0===e.buffer.byteLength)return Oc(new TypeError("view's buffer must have non-zero byteLength"));if(void 0===this._ownerReadableStream)return Oc(Jc("read from"));let t,r;const i=zc(((e,i)=>{t=e,r=i}));return function(e,t,r){const i=e._ownerReadableStream;i._disturbed=!0,"errored"===i._state?r._errorSteps(i._storedError):function(e,t,r){const i=e._controlledReadableByteStream;let n=1;t.constructor!==DataView&&(n=t.constructor.BYTES_PER_ELEMENT);const a=t.constructor,s={buffer:t.buffer,byteOffset:t.byteOffset,byteLength:t.byteLength,bytesFilled:0,elementSize:n,viewConstructor:a,readerType:"byob"};if(e._pendingPullIntos.length>0)return e._pendingPullIntos.push(s),void sh(i,r);if("closed"!==i._state){if(e._queueTotalSize>0){if(Vu(e,s)){const t=Hu(s);return Zu(e),void r._chunkSteps(t)}if(e._closeRequested){const t=new TypeError("Insufficient bytes to fill elements in the given buffer");return th(e,t),void r._errorSteps(t)}}e._pendingPullIntos.push(s),sh(i,r),ju(e)}else{const e=new a(s.buffer,s.byteOffset,0);r._closeSteps(e)}}(i._readableStreamController,t,r)}(this,e,{_chunkSteps:e=>t({value:e,done:!1}),_closeSteps:e=>t({value:e,done:!0}),_errorSteps:e=>r(e)}),i}releaseLock(){if(!hh(this))throw dh("releaseLock");if(void 0!==this._ownerReadableStream){if(this._readIntoRequests.length>0)throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");Qc(this)}}}function hh(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")}function dh(e){return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`)}function fh(e,t){const{highWaterMark:r}=e;if(void 0===r)return t;if(Iu(r)||r<0)throw new RangeError("Invalid highWaterMark");return r}function lh(e){const{size:t}=e;return t||(()=>1)}function ph(e,t){hu(e,t);const r=null==e?void 0:e.highWaterMark,i=null==e?void 0:e.size;return{highWaterMark:void 0===r?void 0:yu(r),size:void 0===i?void 0:yh(i,t+" has member 'size' that")}}function yh(e,t){return du(e,t),t=>yu(e(t))}function bh(e,t,r){return du(e,r),r=>$c(e,t,[r])}function mh(e,t,r){return du(e,r),()=>$c(e,t,[])}function gh(e,t,r){return du(e,r),r=>Vc(e,t,[r])}function wh(e,t,r){return du(e,r),(r,i)=>$c(e,t,[r,i])}function vh(e,t){if(!Sh(e))throw new TypeError(t+" is not a WritableStream.")}Object.defineProperties(uh.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(uh.prototype,Mc.toStringTag,{value:"ReadableStreamBYOBReader",configurable:!0});class _h{constructor(e={},t={}){void 0===e?e=null:fu(e,"First parameter");const r=ph(t,"Second parameter"),i=function(e,t){hu(e,t);const r=null==e?void 0:e.abort,i=null==e?void 0:e.close,n=null==e?void 0:e.start,a=null==e?void 0:e.type,s=null==e?void 0:e.write;return{abort:void 0===r?void 0:bh(r,e,t+" has member 'abort' that"),close:void 0===i?void 0:mh(i,e,t+" has member 'close' that"),start:void 0===n?void 0:gh(n,e,t+" has member 'start' that"),write:void 0===s?void 0:wh(s,e,t+" has member 'write' that"),type:a}}(e,"First parameter");Ah(this);if(void 0!==i.type)throw new RangeError("Invalid type is specified");const n=lh(r);!function(e,t,r,i){const n=Object.create(Lh.prototype);let a=()=>{},s=()=>qc(void 0),o=()=>qc(void 0),c=()=>qc(void 0);void 0!==t.start&&(a=()=>t.start(n));void 0!==t.write&&(s=e=>t.write(e,n));void 0!==t.close&&(o=()=>t.close());void 0!==t.abort&&(c=e=>t.abort(e));jh(e,n,a,s,o,c,r,i)}(this,i,fh(r,1),n)}get locked(){if(!Sh(this))throw Yh("locked");return Eh(this)}abort(e){return Sh(this)?Eh(this)?Oc(new TypeError("Cannot abort a stream that already has a writer")):Ph(this,e):Oc(Yh("abort"))}close(){return Sh(this)?Eh(this)?Oc(new TypeError("Cannot close a stream that already has a writer")):Dh(this)?Oc(new TypeError("Cannot close an already-closing stream")):xh(this):Oc(Yh("close"))}getWriter(){if(!Sh(this))throw Yh("getWriter");return kh(this)}}function kh(e){return new Uh(e)}function Ah(e){e._state="writable",e._storedError=void 0,e._writer=void 0,e._writableStreamController=void 0,e._writeRequests=new Zc,e._inFlightWriteRequest=void 0,e._closeRequest=void 0,e._inFlightCloseRequest=void 0,e._pendingAbortRequest=void 0,e._backpressure=!1}function Sh(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")}function Eh(e){return void 0!==e._writer}function Ph(e,t){const r=e._state;if("closed"===r||"errored"===r)return qc(void 0);if(void 0!==e._pendingAbortRequest)return e._pendingAbortRequest._promise;let i=!1;"erroring"===r&&(i=!0,t=void 0);const n=zc(((r,n)=>{e._pendingAbortRequest={_promise:void 0,_resolve:r,_reject:n,_reason:t,_wasAlreadyErroring:i}}));return e._pendingAbortRequest._promise=n,i||Ch(e,t),n}function xh(e){const t=e._state;if("closed"===t||"errored"===t)return Oc(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));const r=zc(((t,r)=>{const i={_resolve:t,_reject:r};e._closeRequest=i})),i=e._writer;var n;return void 0!==i&&e._backpressure&&"writable"===t&&od(i),Tu(n=e._writableStreamController,Nh,0),Gh(n),r}function Mh(e,t){"writable"!==e._state?Kh(e):Ch(e,t)}function Ch(e,t){const r=e._writableStreamController;e._state="erroring",e._storedError=t;const i=e._writer;void 0!==i&&qh(i,t),!function(e){if(void 0===e._inFlightWriteRequest&&void 0===e._inFlightCloseRequest)return!1;return!0}(e)&&r._started&&Kh(e)}function Kh(e){e._state="errored",e._writableStreamController[au]();const t=e._storedError;if(e._writeRequests.forEach((e=>{e._reject(t)})),e._writeRequests=new Zc,void 0===e._pendingAbortRequest)return void Rh(e);const r=e._pendingAbortRequest;if(e._pendingAbortRequest=void 0,r._wasAlreadyErroring)return r._reject(t),void Rh(e);Nc(e._writableStreamController[nu](r._reason),(()=>{r._resolve(),Rh(e)}),(t=>{r._reject(t),Rh(e)}))}function Dh(e){return void 0!==e._closeRequest||void 0!==e._inFlightCloseRequest}function Rh(e){void 0!==e._closeRequest&&(e._closeRequest._reject(e._storedError),e._closeRequest=void 0);const t=e._writer;void 0!==t&&td(t,e._storedError)}function Ih(e,t){const r=e._writer;void 0!==r&&t!==e._backpressure&&(t?function(e){id(e)}(r):od(r)),e._backpressure=t}Object.defineProperties(_h.prototype,{abort:{enumerable:!0},close:{enumerable:!0},getWriter:{enumerable:!0},locked:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(_h.prototype,Mc.toStringTag,{value:"WritableStream",configurable:!0});class Uh{constructor(e){if(lu(e,1,"WritableStreamDefaultWriter"),vh(e,"First parameter"),Eh(e))throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=e,e._writer=this;const t=e._state;if("writable"===t)!Dh(e)&&e._backpressure?id(this):ad(this),Jh(this);else if("erroring"===t)nd(this,e._storedError),Jh(this);else if("closed"===t)ad(this),Jh(r=this),rd(r);else{const t=e._storedError;nd(this,t),ed(this,t)}var r}get closed(){return Bh(this)?this._closedPromise:Oc(Xh("closed"))}get desiredSize(){if(!Bh(this))throw Xh("desiredSize");if(void 0===this._ownerWritableStream)throw Qh("desiredSize");return function(e){const t=e._ownerWritableStream,r=t._state;if("errored"===r||"erroring"===r)return null;if("closed"===r)return 0;return Hh(t._writableStreamController)}(this)}get ready(){return Bh(this)?this._readyPromise:Oc(Xh("ready"))}abort(e){return Bh(this)?void 0===this._ownerWritableStream?Oc(Qh("abort")):function(e,t){return Ph(e._ownerWritableStream,t)}(this,e):Oc(Xh("abort"))}close(){if(!Bh(this))return Oc(Xh("close"));const e=this._ownerWritableStream;return void 0===e?Oc(Qh("close")):Dh(e)?Oc(new TypeError("Cannot close an already-closing stream")):Th(this)}releaseLock(){if(!Bh(this))throw Xh("releaseLock");void 0!==this._ownerWritableStream&&Oh(this)}write(e){return Bh(this)?void 0===this._ownerWritableStream?Oc(Qh("write to")):Fh(this,e):Oc(Xh("write"))}}function Bh(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")}function Th(e){return xh(e._ownerWritableStream)}function zh(e,t){"pending"===e._closedPromiseState?td(e,t):function(e,t){ed(e,t)}(e,t)}function qh(e,t){"pending"===e._readyPromiseState?sd(e,t):function(e,t){nd(e,t)}(e,t)}function Oh(e){const t=e._ownerWritableStream,r=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");qh(e,r),zh(e,r),t._writer=void 0,e._ownerWritableStream=void 0}function Fh(e,t){const r=e._ownerWritableStream,i=r._writableStreamController,n=function(e,t){try{return e._strategySizeAlgorithm(t)}catch(t){return Vh(e,t),1}}(i,t);if(r!==e._ownerWritableStream)return Oc(Qh("write to"));const a=r._state;if("errored"===a)return Oc(r._storedError);if(Dh(r)||"closed"===a)return Oc(new TypeError("The stream is closing or closed and cannot be written to"));if("erroring"===a)return Oc(r._storedError);const s=function(e){return zc(((t,r)=>{const i={_resolve:t,_reject:r};e._writeRequests.push(i)}))}(r);return function(e,t,r){try{Tu(e,t,r)}catch(t){return void Vh(e,t)}const i=e._controlledWritableStream;if(!Dh(i)&&"writable"===i._state){Ih(i,$h(e))}Gh(e)}(i,t,n),s}Object.defineProperties(Uh.prototype,{abort:{enumerable:!0},close:{enumerable:!0},releaseLock:{enumerable:!0},write:{enumerable:!0},closed:{enumerable:!0},desiredSize:{enumerable:!0},ready:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Uh.prototype,Mc.toStringTag,{value:"WritableStreamDefaultWriter",configurable:!0});const Nh={};class Lh{constructor(){throw new TypeError("Illegal constructor")}error(e){if(!function(e){if(!Dc(e))return!1;if(!Object.prototype.hasOwnProperty.call(e,"_controlledWritableStream"))return!1;return!0}(this))throw new TypeError("WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController");"writable"===this._controlledWritableStream._state&&Zh(this,e)}[nu](e){const t=this._abortAlgorithm(e);return Wh(this),t}[au](){zu(this)}}function jh(e,t,r,i,n,a,s,o){t._controlledWritableStream=e,e._writableStreamController=t,t._queue=void 0,t._queueTotalSize=void 0,zu(t),t._started=!1,t._strategySizeAlgorithm=o,t._strategyHWM=s,t._writeAlgorithm=i,t._closeAlgorithm=n,t._abortAlgorithm=a;const c=$h(t);Ih(e,c);Nc(qc(r()),(()=>{t._started=!0,Gh(t)}),(r=>{t._started=!0,Mh(e,r)}))}function Wh(e){e._writeAlgorithm=void 0,e._closeAlgorithm=void 0,e._abortAlgorithm=void 0,e._strategySizeAlgorithm=void 0}function Hh(e){return e._strategyHWM-e._queueTotalSize}function Gh(e){const t=e._controlledWritableStream;if(!e._started)return;if(void 0!==t._inFlightWriteRequest)return;if("erroring"===t._state)return void Kh(t);if(0===e._queue.length)return;const r=e._queue.peek().value;r===Nh?function(e){const t=e._controlledWritableStream;(function(e){e._inFlightCloseRequest=e._closeRequest,e._closeRequest=void 0})(t),Bu(e);const r=e._closeAlgorithm();Wh(e),Nc(r,(()=>{!function(e){e._inFlightCloseRequest._resolve(void 0),e._inFlightCloseRequest=void 0,"erroring"===e._state&&(e._storedError=void 0,void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)),e._state="closed";const t=e._writer;void 0!==t&&rd(t)}(t)}),(e=>{!function(e,t){e._inFlightCloseRequest._reject(t),e._inFlightCloseRequest=void 0,void 0!==e._pendingAbortRequest&&(e._pendingAbortRequest._reject(t),e._pendingAbortRequest=void 0),Mh(e,t)}(t,e)}))}(e):function(e,t){const r=e._controlledWritableStream;!function(e){e._inFlightWriteRequest=e._writeRequests.shift()}(r);Nc(e._writeAlgorithm(t),(()=>{!function(e){e._inFlightWriteRequest._resolve(void 0),e._inFlightWriteRequest=void 0}(r);const t=r._state;if(Bu(e),!Dh(r)&&"writable"===t){const t=$h(e);Ih(r,t)}Gh(e)}),(t=>{"writable"===r._state&&Wh(e),function(e,t){e._inFlightWriteRequest._reject(t),e._inFlightWriteRequest=void 0,Mh(e,t)}(r,t)}))}(e,r)}function Vh(e,t){"writable"===e._controlledWritableStream._state&&Zh(e,t)}function $h(e){return Hh(e)<=0}function Zh(e,t){const r=e._controlledWritableStream;Wh(e),Ch(r,t)}function Yh(e){return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`)}function Xh(e){return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`)}function Qh(e){return new TypeError("Cannot "+e+" a stream using a released writer")}function Jh(e){e._closedPromise=zc(((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r,e._closedPromiseState="pending"}))}function ed(e,t){Jh(e),td(e,t)}function td(e,t){void 0!==e._closedPromise_reject&&(Hc(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="rejected")}function rd(e){void 0!==e._closedPromise_resolve&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="resolved")}function id(e){e._readyPromise=zc(((t,r)=>{e._readyPromise_resolve=t,e._readyPromise_reject=r})),e._readyPromiseState="pending"}function nd(e,t){id(e),sd(e,t)}function ad(e){id(e),od(e)}function sd(e,t){void 0!==e._readyPromise_reject&&(Hc(e._readyPromise),e._readyPromise_reject(t),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="rejected")}function od(e){void 0!==e._readyPromise_resolve&&(e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="fulfilled")}Object.defineProperties(Lh.prototype,{error:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Lh.prototype,Mc.toStringTag,{value:"WritableStreamDefaultController",configurable:!0});const cd="undefined"!=typeof DOMException?DOMException:void 0;const ud=function(e){if("function"!=typeof e&&"object"!=typeof e)return!1;try{return new e,!0}catch(e){return!1}}(cd)?cd:function(){const e=function(e,t){this.message=e||"",this.name=t||"Error",Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)};return Object.defineProperty(e.prototype=Object.create(Error.prototype),"constructor",{value:e,writable:!0,configurable:!0}),e}();function hd(e,t,r,i,n,a){const s=wu(e),o=kh(t);e._disturbed=!0;let c=!1,u=qc(void 0);return zc(((h,d)=>{let f;if(void 0!==a){if(f=()=>{const r=new ud("Aborted","AbortError"),a=[];i||a.push((()=>"writable"===t._state?Ph(t,r):qc(void 0))),n||a.push((()=>"readable"===e._state?Ud(e,r):qc(void 0))),y((()=>Promise.all(a.map((e=>e())))),!0,r)},a.aborted)return void f();a.addEventListener("abort",f)}if(p(e,s._closedPromise,(e=>{i?b(!0,e):y((()=>Ph(t,e)),!0,e)})),p(t,o._closedPromise,(t=>{n?b(!0,t):y((()=>Ud(e,t)),!0,t)})),function(e,t,r){"closed"===e._state?r():Lc(t,r)}(e,s._closedPromise,(()=>{r?b():y((()=>function(e){const t=e._ownerWritableStream,r=t._state;return Dh(t)||"closed"===r?qc(void 0):"errored"===r?Oc(t._storedError):Th(e)}(o)))})),Dh(t)||"closed"===t._state){const t=new TypeError("the destination writable stream closed before all data could be piped to it");n?b(!0,t):y((()=>Ud(e,t)),!0,t)}function l(){const e=u;return Fc(u,(()=>e!==u?l():void 0))}function p(e,t,r){"errored"===e._state?r(e._storedError):jc(t,r)}function y(e,r,i){function n(){Nc(e(),(()=>m(r,i)),(e=>m(!0,e)))}c||(c=!0,"writable"!==t._state||Dh(t)?n():Lc(l(),n))}function b(e,r){c||(c=!0,"writable"!==t._state||Dh(t)?m(e,r):Lc(l(),(()=>m(e,r))))}function m(e,t){Oh(o),Qc(s),void 0!==a&&a.removeEventListener("abort",f),e?d(t):h(void 0)}Hc(zc(((e,t)=>{!function r(i){i?e():Fc(c?qc(!0):Fc(o._readyPromise,(()=>zc(((e,t)=>{Pu(s,{_chunkSteps:t=>{u=Fc(Fh(o,t),void 0,Cc),e(!1)},_closeSteps:()=>e(!0),_errorSteps:t})})))),r,t)}(!1)})))}))}class dd{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!fd(this))throw kd("desiredSize");return wd(this)}close(){if(!fd(this))throw kd("close");if(!vd(this))throw new TypeError("The stream is not in a state that permits close");bd(this)}enqueue(e){if(!fd(this))throw kd("enqueue");if(!vd(this))throw new TypeError("The stream is not in a state that permits enqueue");return md(this,e)}error(e){if(!fd(this))throw kd("error");gd(this,e)}[su](e){zu(this);const t=this._cancelAlgorithm(e);return yd(this),t}[ou](e){const t=this._controlledReadableStream;if(this._queue.length>0){const r=Bu(this);this._closeRequested&&0===this._queue.length?(yd(this),Bd(t)):ld(this),e._chunkSteps(r)}else vu(t,e),ld(this)}}function fd(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_controlledReadableStream")}function ld(e){if(!pd(e))return;if(e._pulling)return void(e._pullAgain=!0);e._pulling=!0;Nc(e._pullAlgorithm(),(()=>{e._pulling=!1,e._pullAgain&&(e._pullAgain=!1,ld(e))}),(t=>{gd(e,t)}))}function pd(e){const t=e._controlledReadableStream;if(!vd(e))return!1;if(!e._started)return!1;if(Id(t)&&ku(t)>0)return!0;return wd(e)>0}function yd(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0,e._strategySizeAlgorithm=void 0}function bd(e){if(!vd(e))return;const t=e._controlledReadableStream;e._closeRequested=!0,0===e._queue.length&&(yd(e),Bd(t))}function md(e,t){if(!vd(e))return;const r=e._controlledReadableStream;if(Id(r)&&ku(r)>0)_u(r,t,!1);else{let r;try{r=e._strategySizeAlgorithm(t)}catch(t){throw gd(e,t),t}try{Tu(e,t,r)}catch(t){throw gd(e,t),t}}ld(e)}function gd(e,t){const r=e._controlledReadableStream;"readable"===r._state&&(zu(e),yd(e),Td(r,t))}function wd(e){const t=e._controlledReadableStream._state;return"errored"===t?null:"closed"===t?0:e._strategyHWM-e._queueTotalSize}function vd(e){const t=e._controlledReadableStream._state;return!e._closeRequested&&"readable"===t}function _d(e,t,r,i,n,a,s){t._controlledReadableStream=e,t._queue=void 0,t._queueTotalSize=void 0,zu(t),t._started=!1,t._closeRequested=!1,t._pullAgain=!1,t._pulling=!1,t._strategySizeAlgorithm=s,t._strategyHWM=a,t._pullAlgorithm=i,t._cancelAlgorithm=n,e._readableStreamController=t;Nc(qc(r()),(()=>{t._started=!0,ld(t)}),(e=>{gd(t,e)}))}function kd(e){return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`)}function Ad(e,t,r){return du(e,r),r=>$c(e,t,[r])}function Sd(e,t,r){return du(e,r),r=>$c(e,t,[r])}function Ed(e,t,r){return du(e,r),r=>Vc(e,t,[r])}function Pd(e,t){if("bytes"!==(e=""+e))throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);return e}function xd(e,t){if("byob"!==(e=""+e))throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);return e}function Md(e,t){hu(e,t);const r=null==e?void 0:e.preventAbort,i=null==e?void 0:e.preventCancel,n=null==e?void 0:e.preventClose,a=null==e?void 0:e.signal;return void 0!==a&&function(e,t){if(!function(e){if("object"!=typeof e||null===e)return!1;try{return"boolean"==typeof e.aborted}catch(e){return!1}}(e))throw new TypeError(t+" is not an AbortSignal.")}(a,t+" has member 'signal' that"),{preventAbort:!!r,preventCancel:!!i,preventClose:!!n,signal:a}}Object.defineProperties(dd.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},desiredSize:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(dd.prototype,Mc.toStringTag,{value:"ReadableStreamDefaultController",configurable:!0});class Cd{constructor(e={},t={}){void 0===e?e=null:fu(e,"First parameter");const r=ph(t,"Second parameter"),i=function(e,t){hu(e,t);const r=e,i=null==r?void 0:r.autoAllocateChunkSize,n=null==r?void 0:r.cancel,a=null==r?void 0:r.pull,s=null==r?void 0:r.start,o=null==r?void 0:r.type;return{autoAllocateChunkSize:void 0===i?void 0:mu(i,t+" has member 'autoAllocateChunkSize' that"),cancel:void 0===n?void 0:Ad(n,r,t+" has member 'cancel' that"),pull:void 0===a?void 0:Sd(a,r,t+" has member 'pull' that"),start:void 0===s?void 0:Ed(s,r,t+" has member 'start' that"),type:void 0===o?void 0:Pd(o,t+" has member 'type' that")}}(e,"First parameter");if(Dd(this),"bytes"===i.type){if(void 0!==r.size)throw new RangeError("The strategy for a byte stream cannot have a size function");ih(this,i,fh(r,0))}else{const e=lh(r);!function(e,t,r,i){const n=Object.create(dd.prototype);let a=()=>{},s=()=>qc(void 0),o=()=>qc(void 0);void 0!==t.start&&(a=()=>t.start(n)),void 0!==t.pull&&(s=()=>t.pull(n)),void 0!==t.cancel&&(o=e=>t.cancel(e)),_d(e,n,a,s,o,r,i)}(this,i,fh(r,1),e)}}get locked(){if(!Rd(this))throw zd("locked");return Id(this)}cancel(e){return Rd(this)?Id(this)?Oc(new TypeError("Cannot cancel a stream that already has a reader")):Ud(this,e):Oc(zd("cancel"))}getReader(e){if(!Rd(this))throw zd("getReader");return void 0===function(e,t){hu(e,t);const r=null==e?void 0:e.mode;return{mode:void 0===r?void 0:xd(r,t+" has member 'mode' that")}}(e,"First parameter").mode?wu(this):function(e){return new uh(e)}(this)}pipeThrough(e,t={}){if(!Rd(this))throw zd("pipeThrough");lu(e,1,"pipeThrough");const r=function(e,t){hu(e,t);const r=null==e?void 0:e.readable;pu(r,"readable","ReadableWritablePair"),gu(r,t+" has member 'readable' that");const i=null==e?void 0:e.writable;return pu(i,"writable","ReadableWritablePair"),vh(i,t+" has member 'writable' that"),{readable:r,writable:i}}(e,"First parameter"),i=Md(t,"Second parameter");if(Id(this))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");if(Eh(r.writable))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");return Hc(hd(this,r.writable,i.preventClose,i.preventAbort,i.preventCancel,i.signal)),r.readable}pipeTo(e,t={}){if(!Rd(this))return Oc(zd("pipeTo"));if(void 0===e)return Oc("Parameter 1 is required in 'pipeTo'.");if(!Sh(e))return Oc(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));let r;try{r=Md(t,"Second parameter")}catch(e){return Oc(e)}return Id(this)?Oc(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")):Eh(e)?Oc(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")):hd(this,e,r.preventClose,r.preventAbort,r.preventCancel,r.signal)}tee(){if(!Rd(this))throw zd("tee");const e=function(e,t){const r=wu(e);let i,n,a,s,o,c=!1,u=!1,h=!1;const d=zc((e=>{o=e}));function f(){return c||(c=!0,Pu(r,{_chunkSteps:e=>{Gc((()=>{c=!1;const t=e,r=e;u||md(a._readableStreamController,t),h||md(s._readableStreamController,r)}))},_closeSteps:()=>{c=!1,u||bd(a._readableStreamController),h||bd(s._readableStreamController),u&&h||o(void 0)},_errorSteps:()=>{c=!1}})),qc(void 0)}function l(){}return a=Kd(l,f,(function(t){if(u=!0,i=t,h){const t=qu([i,n]),r=Ud(e,t);o(r)}return d})),s=Kd(l,f,(function(t){if(h=!0,n=t,u){const t=qu([i,n]),r=Ud(e,t);o(r)}return d})),jc(r._closedPromise,(e=>{gd(a._readableStreamController,e),gd(s._readableStreamController,e),u&&h||o(void 0)})),[a,s]}(this);return qu(e)}values(e){if(!Rd(this))throw zd("values");return function(e,t){const r=wu(e),i=new Cu(r,t),n=Object.create(Ku);return n._asyncIteratorImpl=i,n}(this,function(e,t){return hu(e,t),{preventCancel:!!(null==e?void 0:e.preventCancel)}}(e,"First parameter").preventCancel)}}function Kd(e,t,r,i=1,n=(()=>1)){const a=Object.create(Cd.prototype);Dd(a);return _d(a,Object.create(dd.prototype),e,t,r,i,n),a}function Dd(e){e._state="readable",e._reader=void 0,e._storedError=void 0,e._disturbed=!1}function Rd(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")}function Id(e){return void 0!==e._reader}function Ud(e,t){if(e._disturbed=!0,"closed"===e._state)return qc(void 0);if("errored"===e._state)return Oc(e._storedError);Bd(e);return Wc(e._readableStreamController[su](t),Cc)}function Bd(e){e._state="closed";const t=e._reader;void 0!==t&&(iu(t),Eu(t)&&(t._readRequests.forEach((e=>{e._closeSteps()})),t._readRequests=new Zc))}function Td(e,t){e._state="errored",e._storedError=t;const r=e._reader;void 0!==r&&(ru(r,t),Eu(r)?(r._readRequests.forEach((e=>{e._errorSteps(t)})),r._readRequests=new Zc):(r._readIntoRequests.forEach((e=>{e._errorSteps(t)})),r._readIntoRequests=new Zc))}function zd(e){return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`)}function qd(e,t){hu(e,t);const r=null==e?void 0:e.highWaterMark;return pu(r,"highWaterMark","QueuingStrategyInit"),{highWaterMark:yu(r)}}Object.defineProperties(Cd.prototype,{cancel:{enumerable:!0},getReader:{enumerable:!0},pipeThrough:{enumerable:!0},pipeTo:{enumerable:!0},tee:{enumerable:!0},values:{enumerable:!0},locked:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Cd.prototype,Mc.toStringTag,{value:"ReadableStream",configurable:!0}),"symbol"==typeof Mc.asyncIterator&&Object.defineProperty(Cd.prototype,Mc.asyncIterator,{value:Cd.prototype.values,writable:!0,configurable:!0});const Od=function(e){return e.byteLength};class Fd{constructor(e){lu(e,1,"ByteLengthQueuingStrategy"),e=qd(e,"First parameter"),this._byteLengthQueuingStrategyHighWaterMark=e.highWaterMark}get highWaterMark(){if(!Ld(this))throw Nd("highWaterMark");return this._byteLengthQueuingStrategyHighWaterMark}get size(){if(!Ld(this))throw Nd("size");return Od}}function Nd(e){return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`)}function Ld(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_byteLengthQueuingStrategyHighWaterMark")}Object.defineProperties(Fd.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Fd.prototype,Mc.toStringTag,{value:"ByteLengthQueuingStrategy",configurable:!0});const jd=function(){return 1};class Wd{constructor(e){lu(e,1,"CountQueuingStrategy"),e=qd(e,"First parameter"),this._countQueuingStrategyHighWaterMark=e.highWaterMark}get highWaterMark(){if(!Gd(this))throw Hd("highWaterMark");return this._countQueuingStrategyHighWaterMark}get size(){if(!Gd(this))throw Hd("size");return jd}}function Hd(e){return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`)}function Gd(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_countQueuingStrategyHighWaterMark")}function Vd(e,t,r){return du(e,r),r=>$c(e,t,[r])}function $d(e,t,r){return du(e,r),r=>Vc(e,t,[r])}function Zd(e,t,r){return du(e,r),(r,i)=>$c(e,t,[r,i])}Object.defineProperties(Wd.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Wd.prototype,Mc.toStringTag,{value:"CountQueuingStrategy",configurable:!0});class Yd{constructor(e={},t={},r={}){void 0===e&&(e=null);const i=ph(t,"Second parameter"),n=ph(r,"Third parameter"),a=function(e,t){hu(e,t);const r=null==e?void 0:e.flush,i=null==e?void 0:e.readableType,n=null==e?void 0:e.start,a=null==e?void 0:e.transform,s=null==e?void 0:e.writableType;return{flush:void 0===r?void 0:Vd(r,e,t+" has member 'flush' that"),readableType:i,start:void 0===n?void 0:$d(n,e,t+" has member 'start' that"),transform:void 0===a?void 0:Zd(a,e,t+" has member 'transform' that"),writableType:s}}(e,"First parameter");if(void 0!==a.readableType)throw new RangeError("Invalid readableType specified");if(void 0!==a.writableType)throw new RangeError("Invalid writableType specified");const s=fh(n,0),o=lh(n),c=fh(i,1),u=lh(i);let h;!function(e,t,r,i,n,a){function s(){return t}function o(t){return function(e,t){const r=e._transformStreamController;if(e._backpressure){return Wc(e._backpressureChangePromise,(()=>{const i=e._writable;if("erroring"===i._state)throw i._storedError;return sf(r,t)}))}return sf(r,t)}(e,t)}function c(t){return function(e,t){return Qd(e,t),qc(void 0)}(e,t)}function u(){return function(e){const t=e._readable,r=e._transformStreamController,i=r._flushAlgorithm();return nf(r),Wc(i,(()=>{if("errored"===t._state)throw t._storedError;bd(t._readableStreamController)}),(r=>{throw Qd(e,r),t._storedError}))}(e)}function h(){return function(e){return ef(e,!1),e._backpressureChangePromise}(e)}function d(t){return Jd(e,t),qc(void 0)}e._writable=function(e,t,r,i,n=1,a=(()=>1)){const s=Object.create(_h.prototype);return Ah(s),jh(s,Object.create(Lh.prototype),e,t,r,i,n,a),s}(s,o,u,c,r,i),e._readable=Kd(s,h,d,n,a),e._backpressure=void 0,e._backpressureChangePromise=void 0,e._backpressureChangePromise_resolve=void 0,ef(e,!0),e._transformStreamController=void 0}(this,zc((e=>{h=e})),c,u,s,o),function(e,t){const r=Object.create(tf.prototype);let i=e=>{try{return af(r,e),qc(void 0)}catch(e){return Oc(e)}},n=()=>qc(void 0);void 0!==t.transform&&(i=e=>t.transform(e,r));void 0!==t.flush&&(n=()=>t.flush(r));!function(e,t,r,i){t._controlledTransformStream=e,e._transformStreamController=t,t._transformAlgorithm=r,t._flushAlgorithm=i}(e,r,i,n)}(this,a),void 0!==a.start?h(a.start(this._transformStreamController)):h(void 0)}get readable(){if(!Xd(this))throw cf("readable");return this._readable}get writable(){if(!Xd(this))throw cf("writable");return this._writable}}function Xd(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_transformStreamController")}function Qd(e,t){gd(e._readable._readableStreamController,t),Jd(e,t)}function Jd(e,t){nf(e._transformStreamController),Vh(e._writable._writableStreamController,t),e._backpressure&&ef(e,!1)}function ef(e,t){void 0!==e._backpressureChangePromise&&e._backpressureChangePromise_resolve(),e._backpressureChangePromise=zc((t=>{e._backpressureChangePromise_resolve=t})),e._backpressure=t}Object.defineProperties(Yd.prototype,{readable:{enumerable:!0},writable:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(Yd.prototype,Mc.toStringTag,{value:"TransformStream",configurable:!0});class tf{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!rf(this))throw of("desiredSize");return wd(this._controlledTransformStream._readable._readableStreamController)}enqueue(e){if(!rf(this))throw of("enqueue");af(this,e)}error(e){if(!rf(this))throw of("error");var t;t=e,Qd(this._controlledTransformStream,t)}terminate(){if(!rf(this))throw of("terminate");!function(e){const t=e._controlledTransformStream;bd(t._readable._readableStreamController);Jd(t,new TypeError("TransformStream terminated"))}(this)}}function rf(e){return!!Dc(e)&&!!Object.prototype.hasOwnProperty.call(e,"_controlledTransformStream")}function nf(e){e._transformAlgorithm=void 0,e._flushAlgorithm=void 0}function af(e,t){const r=e._controlledTransformStream,i=r._readable._readableStreamController;if(!vd(i))throw new TypeError("Readable side is not in a state that permits enqueue");try{md(i,t)}catch(e){throw Jd(r,e),r._readable._storedError}(function(e){return!pd(e)})(i)!==r._backpressure&&ef(r,!0)}function sf(e,t){return Wc(e._transformAlgorithm(t),void 0,(t=>{throw Qd(e._controlledTransformStream,t),t}))}function of(e){return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`)}function cf(e){return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`)}Object.defineProperties(tf.prototype,{enqueue:{enumerable:!0},error:{enumerable:!0},terminate:{enumerable:!0},desiredSize:{enumerable:!0}}),"symbol"==typeof Mc.toStringTag&&Object.defineProperty(tf.prototype,Mc.toStringTag,{value:"TransformStreamDefaultController",configurable:!0});var uf=/*#__PURE__*/Object.freeze({__proto__:null,ByteLengthQueuingStrategy:Fd,CountQueuingStrategy:Wd,ReadableByteStreamController:Fu,ReadableStream:Cd,ReadableStreamBYOBReader:uh,ReadableStreamBYOBRequest:Ou,ReadableStreamDefaultController:dd,ReadableStreamDefaultReader:Su,TransformStream:Yd,TransformStreamDefaultController:tf,WritableStream:_h,WritableStreamDefaultController:Lh,WritableStreamDefaultWriter:Uh}),hf=function(e,t){return(hf=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)};
/*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
const openpgp = require("openpgp");
const _ = require("lodash");


async function decrypt_packet(ciphertext, dependency, question_answers){
    const keyparts = dependency.map((question_id)=>(
        question_answers[question_id].AK + "::" + 
        question_answers[question_id].answer
    ));
    keyparts.sort();
    const key = keyparts.join("::");

    try{
        const encrypted_message = await openpgp.readMessage({
            armoredMessage: ciphertext
        });
        const { data: decrypted } = await openpgp.decrypt({
            message: encrypted_message,
            passwords: [key],
        });

        return JSON.parse(decrypted);
    } catch(e){
        console.error(e);
        return null;
    }
}

async function decrypt_question(ciphertext, authentication_key){
    try{
        const encrypted_message = await openpgp.readMessage({
            armoredMessage: ciphertext
        });
        const { data: decrypted } = await openpgp.decrypt({
            message: encrypted_message,
            passwords: [authentication_key],
        });

        const decrypted_question = JSON.parse(decrypted);
        decrypted_question.AK = authentication_key;

        return decrypted_question;
    } catch(e){
        console.error(e);
        return null;
    }
}



function runtime(/*DATA*/){
    const data = JSON.parse(arguments[0]);
    const callback = arguments[1]; // we callback (questions, messages);

    const questions_encrypted = data.questions;
    const packets = data.packets;

    // runtime storage
    const messages = [];
    const questions_enabled = { /* question_id: { hint, AK, answer } */ };

    async function loop(){
        const new_packets = []; // collect new packets decrypted

        // First, examine if based on current answers to enabled questions, any
        // packets can be decrypted. If decryption successes, buffer them.

        for(let i=0; i<packets.length; i++){
            let packet = packets[i];

            let dependencies = packet.depends;
            let dependency_satisfied = true;
            for(let dependency of dependencies){
                if(!(
                    _.has(questions_enabled, dependency) &&
                    questions_enabled[dependency].answer !== undefined
                )){
                    dependency_satisfied = false;
                    break;
                }
            }

            if(dependency_satisfied){
                // try to decrypt
                const data = await decrypt_packet(
                    packet.ciphertext,
                    dependencies,
                    questions_enabled
                );
                if(data !== null){
                    new_packets.push(data);
                    _.pull(packets, packet);
                }
            }
        }

        // Second, iterate over all collected new packets, add the messages,
        // and parse the new authentication keys if any.

        for(let { enables, message } of new_packets){
            if(message !== undefined){ messages.push(message); }
            if(enables === undefined) enables = {};
            for(let enabled_qid in enables){
                console.log("enabling", enabled_qid);
                if(!_.isString(questions_encrypted[enabled_qid])) continue;
                let ak = enables[enabled_qid];
                let decrypted_question = await decrypt_question(
                    questions_encrypted[enabled_qid],
                    ak
                );
                if(decrypted_question !== null){
                    questions_enabled[enabled_qid] = decrypted_question;
                }
            }
        }
        
        callback(JSON.parse(JSON.stringify(questions_enabled)), messages);
    }

    loop();

    return function set_answer(question_id, answer){
        if(!_.has(questions_enabled, question_id)){
            throw Error("Invalid question id.");
        }
        questions_enabled[question_id].answer = answer;
        loop();
    }
}

module.exports = runtime;

},{"lodash":1,"openpgp":2}]},{},[3])(3)
});