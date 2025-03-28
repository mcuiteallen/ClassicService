const LineNotifyModel = require('../lineNotify/lineNotify.js');
lineNotifyModel = new LineNotifyModel();

module.exports = class gz {
    async sendLine(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        if(body.name && body.phone && body.itemsChoose && body.seriesChoose){
            let message = 
            '\n\n' +'---客戶資訊---'+ '\n' +
            '姓名 : ' + body.name + '\n' +
            '電話 : ' + body.phone + '\n' + 
            '維修項目 : ' + body.itemsChoose + '\n' + 
	    '手機系列 : ' + body.seriesChoose + '\n' +		
            '手機型號 : ' + body.modelChoose + '\n' + 
            '說明 :' + body.detailNote + '\n';            
            //let tokenList = ["TzvUvEEaiRJkydCHdyryWlro0nk1HK8hc8jLlTZxQEN"]; //島孤人不孤
            let tokenList = ["91pHC1GWJRxh6UMjJgs5SCwAoQda6vAP1trBHHezoki"]; //Allen
            for(let i = 0 ; i < tokenList.length ; i++){
		let result = await lineNotifyModel.pushMessage(message, tokenList[i]);
		if(result == 'send completed!'){
		    res.json({result: 'OK'}); 
	        }else{
		    res.json({error: 'send LineNotify fail'}); 
	        }
            }              
        }else{
            res.json({error: 'Parameter fail'}); 
        } 
        
     
    }    

}
