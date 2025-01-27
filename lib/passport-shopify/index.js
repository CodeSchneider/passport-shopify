'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Strategy = exports.version = undefined;

var _strategy = require('./strategy');

Object.defineProperty(exports, 'Strategy', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_strategy).default;
  }
});

var _pkginfo = require('pkginfo');

var _pkginfo2 = _interopRequireDefault(_pkginfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _pkginfo2.default)(module, 'version'); /*
                                            * Framework version.
                                            */
var version = exports.version = module.exports.version;

/*
 * Expose constructors.
 */