const Proxy = require('../models/proxy/proxy.js');
proxy = new Proxy();

module.exports = class ProxyController {
    get(req, res ,next){
      console.log('Start controller');
      proxy.get(req, res, next);
    };
}
