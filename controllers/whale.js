const WhaleModel = require('../models/whale/whale.js');
whaleModel = new WhaleModel();

module.exports = class WhaleController {
    get(req, res ,next){
    };
    post(req, res ,next){
        let tmpPath = req.url.split('/');
        let fun = tmpPath[2].split('?');
        if(fun[0] == 'sendLine'){
            whaleModel.sendLine(req, res, next);
        }else if(fun[0] == 'getOrderList'){
            whaleModel.queryData(req, res, next);
        }else if(fun[0] == 'updateOrder'){
            whaleModel.updateData(req, res, next);
        }
        else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }          
        
    };     
}