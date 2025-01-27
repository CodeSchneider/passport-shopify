'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _passportOauth = require('passport-oauth2');

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Module dependencies.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var SHOP_NAME_SLUG = /^[a-z0-9-_]+$/i;

/*
 * Inherit `Strategy` from `OAuth2Strategy`.
 */

var Strategy = function (_OAuth2Strategy) {
  _inherits(Strategy, _OAuth2Strategy);

  function Strategy() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var verify = arguments[1];

    _classCallCheck(this, Strategy);

    (0, _lodash.defaults)(options, {
      shop: 'example'
    });

    var shopName = void 0;
    if (options.shop.match(SHOP_NAME_SLUG)) {
      shopName = options.shop + '.myshopify.com';
    } else {
      shopName = options.shop;
    }

    (0, _lodash.defaults)(options, {
      authorizationURL: 'https://' + shopName + '/admin/oauth/authorize',
      tokenURL: 'https://' + shopName + '/admin/oauth/access_token',
      profileURL: 'https://' + shopName + '/admin/shop.json',
      userAgent: 'passport-shopify',
      customHeaders: {},
      scopeSeparator: ','
    });

    (0, _lodash.defaults)(options.customHeaders, {
      'User-Agent': options.userAgent
    });

    var _this = _possibleConstructorReturn(this, (Strategy.__proto__ || Object.getPrototypeOf(Strategy)).call(this, options, verify));

    _this.name = 'shopify';

    _this._profileURL = options.profileURL;
    _this._clientID = options.clientID;
    _this._clientSecret = options.clientSecret;
    _this._callbackURL = options.callbackURL;
    return _this;
  }

  _createClass(Strategy, [{
    key: 'userProfile',
    value: function userProfile(accessToken, done) {
      this._oauth2.get(this._profileURL, accessToken, function (err, body) {
        if (err) {
          return done(new _passportOauth.InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
          var json = JSON.parse(body);
          var profile = {
            provider: 'shopify'
          };
          profile.id = json.shop.id;
          profile.displayName = json.shop.shop_owner;
          profile.username = json.shop.name;
          profile.profileURL = json.shop.domain;
          profile.emails = [{
            value: json.shop.email
          }];
          profile._raw = body;
          profile._json = json;
          return done(null, profile);
        } catch (e) {
          return done(e);
        }
      });
    }
  }, {
    key: 'authenticate',
    value: function authenticate(req, options) {
      // If shop is defined
      // with authentication
      if (!(0, _lodash.isUndefined)(options.shop)) {
        var shopName = this.normalizeShopName(options.shop);

        // update _oauth2 settings
        this._oauth2._authorizeUrl = 'https://' + shopName + '/admin/oauth/authorize';
        this._oauth2._accessTokenUrl = 'https://' + shopName + '/admin/oauth/access_token';
        this._profileURL = 'https://' + shopName + '/admin/shop.json';
      }

      // Call superclass
      return _get(Strategy.prototype.__proto__ || Object.getPrototypeOf(Strategy.prototype), 'authenticate', this).call(this, req, options);
    }
  }, {
    key: 'normalizeShopName',
    value: function normalizeShopName(shop) {
      if (shop.match(SHOP_NAME_SLUG)) {
        return shop + '.myshopify.com';
      }

      return shop;
    }
  }]);

  return Strategy;
}(_passportOauth.Strategy);

/*
 * Expose `Strategy`.
 */


exports.default = Strategy;