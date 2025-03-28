'use strict';
const express = require('express');
const app = module.exports = express();
const _ = require('lodash');
const configPath = require("./config/config.json");
const servicePort = configPath.serverPort;
app.set('port', process.env.PORT || servicePort);
require('./routes');

const server = app.listen(servicePort, function () {
  console.log('listen on http://127.0.0.1:' + servicePort + '/');
});
