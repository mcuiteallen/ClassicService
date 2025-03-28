const MaintenModel = require('../models/mainten/maintenWeb.js');
maintenModel = new MaintenModel();

module.exports = class MaintenController {
    upload(req, res ,next){
        console.log('controllers do Mainten');
        //console.log(req);
        maintenModel.uploadImg(req, res, next);
    };
}