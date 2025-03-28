const PurchasingModel = require('../models/purchasing/purchasing.js');
purchasingModel = new PurchasingModel();

module.exports = class PurchasingController {
    get(req, res ,next){
        let tmpPath = req.url.split('/');
        let fun = tmpPath[2].split('?');
        if(fun[0] == 'getLocateList'){
            purchasingModel.getLocateList(req, res, next);
        }else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }  
    };
    post(req, res ,next){
        //console.log(req);
        let tmpPath = req.url.split('/');
        let fun = tmpPath[2].split('?');
        if(fun[0] == 'getInfoById'){
            purchasingModel.getInfoById(req, res, next);
        }else if(fun[0] == 'getInfoByLocate'){
            purchasingModel.getLocateList(req, res, next);
        }else if(fun[0] == 'checkout'){
            purchasingModel.checkOut(req, res, next);
        }else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }          
        
    };    
}