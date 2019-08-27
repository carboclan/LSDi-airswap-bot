"use strict";

require("core-js/stable");

require("regenerator-runtime/runtime");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _ethers = require("ethers");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _protocolMessaging = _interopRequireDefault(require("airswap.js/src/protocolMessaging"));

var _erc20Generic = require("./abi/erc20Generic");

var _Utils = require("./Utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

console.log('Configuring maker...');
var cdai = '0xf5dce57282a584d2746faf1593d3121fcac444dc';
console.log('collateralAddress', process.env.COLLATERAL_ADDRESS);

var collateralAddress = _Utils.Utils.validateHexString(process.env.COLLATERAL_ADDRESS);

var priceFeed = "https://api.compound.finance/api/v2/ctoken?addresses[]=".concat(cdai);
var privateKey = process.env.PRIVATE_KEY;
var eighteen = (0, _bignumber["default"])('1000000000000000000');
var five = (0, _bignumber["default"])('100000');
var thirteen = '0000000000000';

var eighteenToFive = function eighteenToFive(num) {
  return (0, _bignumber["default"])(num).dividedBy(eighteen).multipliedBy(five);
};

console.log('tokens', process.env.TOKENS);
var tokens = process.env.TOKENS.split(',').map(function (token) {
  return _Utils.Utils.validateHexString(token);
});
var config = {
  collateralAddress: collateralAddress,
  priceFeed: priceFeed,
  privateKey: privateKey,
  tokens: tokens
};

var provider = _ethers.ethers.getDefaultProvider();

var wallet = new _ethers.ethers.Wallet(config.privateKey);
var address = wallet.address.toLowerCase();
var keyspace = false;

var messageSigner = function messageSigner(data) {
  return wallet.signMessage(data);
};

var requireAuthentication = true;
var jsonrpc = '2.0';

var getPrice =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var response, feed, value;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _nodeFetch["default"])(config.priceFeed);

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.json();

          case 5:
            feed = _context.sent;
            console.log('feed', feed);
            value = feed.cToken[0].supply_rate.value; // TODO: Handle the Long position pricing

            return _context.abrupt("return", (0, _bignumber["default"])(value).multipliedBy(100).minus(6).dp(2));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getPrice() {
    return _ref.apply(this, arguments);
  };
}();

getPrice();
console.log('erc20', _erc20Generic.erc20Generic);

var getBalance =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(makerAddress, tokenAddress) {
    var contract, balance;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('getBalance maker:', makerAddress, 'token:', tokenAddress);
            contract = new _ethers.ethers.Contract(tokenAddress, _erc20Generic.erc20Generic, provider);
            _context2.next = 4;
            return contract.balanceOf(makerAddress);

          case 4:
            balance = _context2.sent;
            return _context2.abrupt("return", _Utils.Utils.wrapAsBigNumber(balance.toString()));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getBalance(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var signOrder =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(order) {
    var types, expiration, makerAddress, makerAmount, makerToken, nonce, takerAddress, takerAmount, takerToken, hashedOrder, signedMsg, sig;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            types = ['address', // makerAddress
            'uint256', // makerAmount
            'address', // makerToken
            'address', // takerAddress
            'uint256', // takerAmount
            'address', // takertoken
            'uint256', // expiration
            'uint256'];
            expiration = order.expiration, makerAddress = order.makerAddress, makerAmount = order.makerAmount, makerToken = order.makerToken, nonce = order.nonce, takerAddress = order.takerAddress, takerAmount = order.takerAmount, takerToken = order.takerToken;
            hashedOrder = _ethers.ethers.utils.solidityKeccak256(types, [makerAddress, makerAmount, makerToken, takerAddress, takerAmount, takerToken, expiration, nonce]);
            console.log(hashedOrder);
            _context3.next = 6;
            return wallet.signMessage(_ethers.ethers.utils.arrayify(hashedOrder));

          case 6:
            signedMsg = _context3.sent;
            sig = _ethers.ethers.utils.splitSignature(signedMsg);
            return _context3.abrupt("return", _objectSpread({}, order, sig));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function signOrder(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var router = new _protocolMessaging["default"]({
  address: address,
  keyspace: keyspace,
  messageSigner: messageSigner,
  requireAuthentication: requireAuthentication
});

var main =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var intents;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log('Connecting to Airswap...');
            _context7.next = 3;
            return router.connect()["catch"](function (e) {
              console.log('unable to connect to the Airswap WebSocket', e);
              process.exit(1);
            });

          case 3:
            intents = [];
            config.tokens.forEach(function (token) {
              intents.push({
                makerToken: token,
                role: 'maker',
                supportedMethods: ['getOrder', 'getQuote', 'getMaxQuote'],
                takerToken: config.collateralAddress
              });
            });
            console.log('Setting intents...', intents);
            _context7.next = 8;
            return router.setIntents(intents)["catch"](function (e) {
              console.log('unable to set intents', e);
              process.exit(1);
            });

          case 8:
            router.RPC_METHOD_ACTIONS.getOrder =
            /*#__PURE__*/
            function () {
              var _ref5 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4(payload) {
                var message, sender, id, params, makerToken, takerAddress, takerToken, makerAmount, makerAddress, requestedMakerAmount, makerBalance, price, takerAmount, takerBalance, expiration, nonce, order, result, response;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        console.log('getOrder called with', payload);
                        message = payload.message, sender = payload.sender;
                        id = message.id, params = message.params;
                        makerToken = params.makerToken, takerAddress = params.takerAddress, takerToken = params.takerToken, makerAmount = params.makerAmount;
                        makerAddress = address;
                        requestedMakerAmount = (0, _bignumber["default"])(makerAmount);

                        if (requestedMakerAmount.isZero()) {
                          console.warn('Zero amount order request halted'); // return;
                        } // get our token balance


                        _context4.next = 9;
                        return getBalance(makerAddress, makerToken);

                      case 9:
                        makerBalance = _context4.sent;

                        if (!makerBalance.isLessThan(requestedMakerAmount)) {
                          _context4.next = 13;
                          break;
                        }

                        console.error('Insufficient maker balance', requestedMakerAmount.toString(), '<', makerBalance.toString());
                        return _context4.abrupt("return");

                      case 13:
                        _context4.next = 15;
                        return getPrice();

                      case 15:
                        price = _context4.sent;
                        takerAmount = requestedMakerAmount.multipliedBy(price).toString() + thirteen; // get their token balance

                        _context4.next = 19;
                        return getBalance(takerAddress, takerToken);

                      case 19:
                        takerBalance = _context4.sent;

                        if (!takerBalance.isLessThan(takerAmount)) {
                          _context4.next = 23;
                          break;
                        }

                        console.error('Insufficient taker balance', takerBalance.toString(), '<', takerAmount);
                        return _context4.abrupt("return");

                      case 23:
                        // Good to go
                        expiration = Math.round(new Date().getTime() / 1000) + 600; // Expire after 5 minutes

                        nonce = Number(Math.random() * 100000).toFixed().toString();
                        order = {
                          expiration: expiration,
                          makerAddress: makerAddress,
                          makerAmount: makerAmount,
                          makerToken: makerToken,
                          nonce: nonce,
                          takerAddress: takerAddress,
                          takerAmount: takerAmount,
                          takerToken: takerToken
                        };
                        console.log('ORDER', order);
                        _context4.next = 29;
                        return signOrder(order);

                      case 29:
                        result = _context4.sent;
                        response = {
                          id: id,
                          jsonrpc: jsonrpc,
                          result: result
                        }; // Send the order

                        router.call(sender, response);
                        console.log('sent order', response);

                      case 33:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }();

            router.RPC_METHOD_ACTIONS.getQuote =
            /*#__PURE__*/
            function () {
              var _ref6 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee5(payload) {
                var message, sender, id, params, makerAddress, makerToken, takerAmount, takerToken, price, requestedAmount, requiredMakerAmount, makerAmount, result, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        console.log('getQuote called with', payload);
                        message = payload.message, sender = payload.sender;
                        id = message.id, params = message.params;
                        makerAddress = params.makerAddress, makerToken = params.makerToken, takerAmount = params.takerAmount, takerToken = params.takerToken;
                        _context5.next = 6;
                        return getPrice();

                      case 6:
                        price = _context5.sent;
                        _context5.next = 9;
                        return _Utils.Utils.wrapAsBigNumber(takerAmount);

                      case 9:
                        requestedAmount = _context5.sent;
                        requiredMakerAmount = requestedAmount.dividedBy(price);
                        makerAmount = eighteenToFive(requiredMakerAmount).dp(0).toString();
                        result = {
                          makerAddress: makerAddress,
                          makerAmount: makerAmount,
                          makerToken: makerToken,
                          takerAmount: takerAmount,
                          takerToken: takerToken
                        };
                        response = {
                          id: id,
                          jsonrpc: jsonrpc,
                          result: result
                        }; // Send the quote

                        router.call(sender, response);
                        console.log('sent quote', response);

                      case 16:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }();

            router.RPC_METHOD_ACTIONS.getMaxQuote =
            /*#__PURE__*/
            function () {
              var _ref7 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee6(payload) {
                var message, sender, id, params, makerToken, takerToken, makerAddress, makerBalance, price, makerAmount, takerAmount, result, response;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        console.log('getMaxQuote called with', payload);
                        message = payload.message, sender = payload.sender;
                        id = message.id, params = message.params;
                        makerToken = params.makerToken, takerToken = params.takerToken;
                        makerAddress = address; // get our token balance

                        _context6.next = 7;
                        return getBalance(makerAddress, makerToken);

                      case 7:
                        makerBalance = _context6.sent;
                        _context6.next = 10;
                        return getPrice();

                      case 10:
                        price = _context6.sent;
                        makerAmount = makerBalance.toString();
                        takerAmount = makerBalance.multipliedBy(price).dp(0).toString() + thirteen;
                        result = {
                          makerAddress: makerAddress,
                          makerAmount: makerAmount,
                          makerToken: makerToken,
                          takerAmount: takerAmount,
                          takerToken: takerToken
                        };
                        response = {
                          id: id,
                          jsonrpc: jsonrpc,
                          result: result
                        }; // Send the quote

                        router.call(sender, response);
                        console.log('sent max quote', response);

                      case 17:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x6) {
                return _ref7.apply(this, arguments);
              };
            }();

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function main() {
    return _ref4.apply(this, arguments);
  };
}();

main();