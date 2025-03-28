const GzModel = require('../models/gz/gz.js');
gzModel = new GzModel();

module.exports = class gzController {
    get(req, res ,next){
    };
    post(req, res ,next){
        let tmpPath = req.url.split('/');
        let fun = tmpPath[2].split('?');
        if(fun[0] == 'sendLine'){
            gzModel.sendLine(req, res, next);
        }else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }          
        
    };     
}
