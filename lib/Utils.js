"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Utils = void 0;

var _validateHexString = require("./utils/validateHexString");

var _wrapAsBigNumber = require("./utils/wrapAsBigNumber");

var Utils = {
  validateHexString: _validateHexString.validateHexString,
  wrapAsBigNumber: _wrapAsBigNumber.wrapAsBigNumber
};
exports.Utils = Utils;
var _default = Utils;
exports["default"] = _default;