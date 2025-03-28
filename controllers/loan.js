const LoanModel = require('../models/loan/loan.js');
loanModel = new LoanModel();

module.exports = class LoanController {
    get(req, res ,next){
    };
    post(req, res ,next){
        let tmpPath = req.url.split('/');
        let fun = tmpPath[2].split('?');
        if(fun[0] == 'sendLine'){
            loanModel.sendLine(req, res, next);
        }else if(fun[0] == 'getOrderList'){
            loanModel.queryData(req, res, next);
        }else if(fun[0] == 'updateOrder'){
            loanModel.updateData(req, res, next);
        }
        else{
            res.json({
                error: 'Wrong Path!!' 
            });
        }          
        
    };     
}