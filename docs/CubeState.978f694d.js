// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/vector.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector =
/** @class */
function () {
  function Vector(a) {
    if (typeof a == "number") {
      this.length = a;
      this.elements = new Array(a);

      for (var i = 0; i < this.length; i++) {
        this.elements[i] = 0;
      }

      return;
    }

    if (a instanceof Array) {
      this.length = a.length;
      this.elements = a;
      return;
    }

    if (a instanceof Vector) {
      this.length = a.length;
      this.elements = new Array(this.length);

      for (var i = 0; i < a.length; i++) {
        this.elements[i] = a.at(i);
      }

      return;
    }

    console.error("よくわからん型の奴が呼び出された");
  }

  Vector.prototype.at = function (i) {
    return this.elements[i];
  };

  Vector.prototype.set = function (i, value) {
    if (i < 0 || i >= this.length) {
      console.error("you cannot access the area");
      return;
    }

    this.elements[i] = value;
  };

  Vector.prototype.map = function (func) {
    var a = new Vector(this.elements.map(func));
    return a;
  };

  Vector.prototype.add = function (b) {
    if (b instanceof Vector) {
      if (b.length != this.length) {
        console.error("the number of elements are not same");
        return;
      }

      var a = this.elements.concat();

      for (var i = 0; i < this.length; i++) {
        a[i] += b.at(i);
      }

      return new Vector(a);
    }

    if (b instanceof Array) {
      if (b.length != this.length) {
        console.error("the number of elements are not same");
        return;
      }

      var a = this.elements.concat();

      for (var i = 0; i < this.length; i++) {
        a[i] += b[i];
      }

      return new Vector(a);
    }

    console.error("invalid argument");
  };

  Vector.prototype.mul = function (c) {
    var a = new Vector(this);
    return a.map(function (e) {
      return e * c;
    });
  };

  Vector.prototype.div = function (c) {
    if (c == 0) console.error("do not divide with 0");
    var a = new Vector(this);
    return a.map(function (e) {
      return e / c;
    });
  };

  Vector.prototype.mod = function (c) {
    if (c == 0) console.error("do not mod with 0");
    var a = new Vector(this);
    return a.map(function (e) {
      return e % c;
    });
  }; //indexを入れ込むみたいなことをする python(numpy)の[]演算子みたいな感じ


  Vector.prototype.apply_move = function (move) {
    var ret_v = new Vector(this);

    if (ret_v.length != move.length) {
      console.error("the number of elements are not same");
      return;
    }

    for (var i = 0; i < this.length; i++) {
      ret_v.set(i, this.at(move.at(i)));
    }

    return ret_v;
  };

  Vector.prototype.each_is_in_limitation = function (end) {
    var is_ok = true;

    for (var i = 0; i < this.length; i++) {
      if (this.elements[i] >= end) is_ok = false;
    }

    return is_ok;
  };

  return Vector;
}();

exports.Vector = Vector;

var TestVector = function TestVector() {
  var a = new Vector([1, 2, 3]);
  var b = new Vector([4, 5, 6]);
  console.log(a.at(2));
  console.log(a.length);
  var v = a.add(b).mul(3).mod(4);
  console.log(v);
  console.log(a);
  console.log(new Vector(3));
  console.log(a.add([1, 2, 3]));
  var self = new Vector([0, 1, 2, 3, 4, 5, 6, 7]);
  var move = new Vector([0, 2, 6, 3, 4, 1, 5, 7]);
  self = self.apply_move(move);
  console.log(self);
};
},{}],"src/CubeState.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vector_1 = require("./vector");

var CubeState =
/** @class */
function () {
  function CubeState(co, cp, eo, ep) {
    if (co instanceof vector_1.Vector && cp instanceof vector_1.Vector && eo instanceof vector_1.Vector && ep instanceof vector_1.Vector) {
      if (co.length !== 8 || cp.length !== 8 || eo.length !== 12 || ep.length !== 12) {
        throw new Error("the number of corners should be 8,and the number of edges should be 12");
      }

      this.co = co;
      this.cp = cp;
      this.eo = eo;
      this.ep = ep;
      return;
    }

    if (co instanceof Array && cp instanceof Array && eo instanceof Array && ep instanceof Array) {
      if (co.length !== 8 || cp.length !== 8 || eo.length !== 12 || ep.length !== 12) {
        throw new Error("the number of corners should be 8,and the number of edges should be 12");
      }

      this.co = new vector_1.Vector(co);
      this.cp = new vector_1.Vector(cp);
      this.eo = new vector_1.Vector(eo);
      this.ep = new vector_1.Vector(ep);
      return;
    }

    throw new Error("えらった");
  }

  CubeState.prototype.applyMove = function (move) {
    var newCo = this.co.apply_move(move.cp).add(move.co).mod(3);
    var newCp = this.cp.apply_move(move.cp);
    var newEo = this.eo.apply_move(move.ep).add(move.eo).mod(2);
    var newEp = this.ep.apply_move(move.ep);
    return new CubeState(newCo, newCp, newEo, newEp);
  }; // URF みたいな感じで指定したら 現在URFにある面の色を返してほしいな
  // RU みたいな感じで指定したら 現在 RUにある面の色を返してほしいな


  CubeState.prototype.getFaceOf = function (placeName) {
    if (placeName.length === 3) {
      var cpIndex = this.cp.at(cornerIndex[placeName]);
      var coIndex = this.co.at(cornerIndex[placeName]);
      return cornerNames[cpIndex].charAt(coIndex);
    }

    if (placeName.length === 2) {
      var epIndex = this.ep.at(edgeIndex[placeName]);
      var eoIndex = this.eo.at(edgeIndex[placeName]);
      return cornerNames[epIndex].charAt(eoIndex);
    }

    throw new Error("Invalid number of characters: should be 2 or 3");
  };

  CubeState.prototype.getFaceOfCorner = function (co, cp) {
    return cornerNames[cp].charAt(co);
  };

  CubeState.prototype.getFaceOfEdge = function (eo, ep) {
    return edgeNames[ep].charAt(eo);
  };

  return CubeState;
}();

exports.CubeState = CubeState;
var cornerNames = ["ULB", "UBR", "URF", "UFL", "DBL", "DRB", "DFR", "DLF"];
var edgeNames = ["BL", "BR", "FR", "FL", "UB", "UR", "UF", "UL", "DB", "DR", "DF", "DL"];
var cornerIndex = {}; // maped type 取りあコロン

for (var i = 0; i < 8; i++) {
  cornerIndex[cornerNames[i]] = i;
}

var edgeIndex = {};

for (var i = 0; i < 12; i++) {
  edgeIndex[edgeNames[i]] = i;
}

exports.solved = new CubeState([0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 3, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
exports.moves = {
  R: new CubeState([0, 1, 2, 0, 0, 2, 1, 0], [0, 2, 6, 3, 4, 1, 5, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 5, 9, 3, 4, 2, 6, 7, 8, 1, 10, 11]),
  L: new CubeState([2, 0, 0, 1, 1, 0, 0, 2], [4, 1, 2, 0, 7, 5, 6, 3], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [11, 1, 2, 7, 4, 5, 6, 0, 8, 9, 10, 3]),
  U: new CubeState([0, 0, 0, 0, 0, 0, 0, 0], [3, 0, 1, 2, 4, 5, 6, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11]),
  D: new CubeState([0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 3, 5, 6, 7, 4], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 8]),
  F: new CubeState([0, 0, 1, 2, 0, 0, 2, 1], [0, 1, 3, 7, 4, 5, 2, 6], [0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0], [0, 1, 6, 10, 4, 5, 3, 7, 8, 9, 2, 11]),
  B: new CubeState([1, 2, 0, 0, 2, 1, 0, 0], [1, 5, 2, 3, 0, 4, 6, 7], [1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [4, 8, 2, 3, 1, 5, 6, 7, 0, 9, 10, 11])
};
var faces = ["U", "D", "R", "L", "F", "B"];
var moveName = [];

for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
  var face = faces_1[_i];
  moveName.push(face, "\'" + face, face + "2");
  exports.moves[face + "2"] = exports.moves[face].applyMove(exports.moves[face]);
  exports.moves["\'" + face] = exports.moves[face + "2"].applyMove(exports.moves[face]);
}

var TestRubicCube = function TestRubicCube() {
  var a = exports.solved;
  console.log(a); // for (const key in moves) {
  // if (moves.hasOwnProperty(key)) {
  // const move = moves[key];
  // console.log(solved.applyMove(move));
  // }
  // }
};

TestRubicCube();
},{"./vector":"src/vector.ts"}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60270" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/CubeState.ts"], null)
//# sourceMappingURL=/CubeState.978f694d.js.map