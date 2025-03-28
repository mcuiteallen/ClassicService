const dbmsHttp = require('dbmsHttp');
const DbmsHttp = new dbmsHttp();
const LineNotifyModel = require('../lineNotify/lineNotify.js');
lineNotifyModel = new LineNotifyModel();

module.exports = class whale {
    async sendLine(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        if(body.name && body.phone && body.lineID && body.date && body.time && body.adult >= 1 && body.children >= 0 && body.baby >= 0 && body.allParticipant && body.price ){
            let planName = '';
            //let allParticipant = 0;
            //allParticipant = body.adult + body.children + body.baby;
            let message = 
            '\n\n' +'---訂購人資訊---'+ '\n' +
            '姓名 : ' + body.name + '\n' +
            '電話 : ' + body.phone + '\n' + 
            'LineID : ' + body.lineID + '\n' + 
            '\n---訂購內容--- '+ '\n' +
            '方案 : ' + body.plan + '\n' +
            '日期 : ' + body.date + '\n' +
            '場次 : ' + body.time + '\n' +
            '\n---參加人員--- '+ '\n' +
            '成人 : ' + body.adult + '\n' +
            '兒童 : ' + body.children + '\n'  +
            '嬰兒 : ' + body.baby + '\n'  +
            '總人數 : ' + body.totleParticipant + '\n'  +
            '名單(客戶自行輸入) : \n' + body.allParticipant + '\n' + 
            '\n---付款狀況--- '+ '\n' +
            '訂金 :' + body.orderPrice + '\n' + 
            '付訂狀態 :' + body.orderStatus + '\n' + 
            '總金額 :' + body.price + '\n';            
            //let tokenList = ["TzvUvEEaiRJkydCHdyryWlro0nk1HK8hc8jLlTZxQEN"]; //島孤人不孤
            let tokenList = ["91pHC1GWJRxh6UMjJgs5SCwAoQda6vAP1trBHHezoki"]; //Allen
            for(let i = 0 ; i < tokenList.length ; i++){
                let insertDataResult = await this.insertData(body);
                if(insertDataResult == 'OK'){
                    let result = await lineNotifyModel.pushMessage(message, tokenList[i]);
                    if(result == 'send completed!'){
                        res.json({result: 'OK'}); 
                    }else{
                        res.json({error: 'send LineNotify fail'}); 
                    }
                }else{
                    res.json({error: 'insertData fail'}); 
                }
            }              
        }else{
            res.json({error: 'Parameter fail'}); 
        } 
        
     
    }
    async insertData(body) {
        //SQLite API test
        let tmpSubQuery = [{"logic":"&&", "key":"phone", "val": body.phone, "conditions":"="}]	;
        let querySQLiteReq4 = await DbmsHttp.querySqliteData('orderList', "", tmpSubQuery, 'whale'); 
        let tableExist = true;
        if(querySQLiteReq4.Error){
            if(querySQLiteReq4.Error.search('no such table') != -1){
                tableExist = false;
            }
        }
        if(tableExist){
            try{
                if(querySQLiteReq4.data.values.length > 0){
                    let tmpSubQuery = [{"logic":"&&", "key":"phone", "val": body.phone, "conditions":"="}]	;
                    let deleteSQLiteReq1 = await DbmsHttp.deleteSqliteData('orderList', tmpSubQuery, 'whale');
                    if(deleteSQLiteReq1.Result != 'OK'){
                        return deleteSQLiteReq1.Result
                    }       
                } 
            }catch(error){
                console.log('Query Table Error');
            }
        }
        let tmpColumns = [    
        { "name": "orderDate", "type": "TEXT"},
        { "name": "timeStampOrderDate", "type": "INTEGER"},
        { "name": "name", "type": "TEXT"},
        { "name": "phone", "type": "TEXT"},
        { "name": "lineID", "type": "TEXT"},
        { "name": "plan", "type": "TEXT"},
        { "name": "timeStampDate", "type": "INTEGER"},
        { "name": "date", "type": "TEXT"},
        { "name": "time", "type": "TEXT"},
        { "name": "adult", "type": "INTEGER"},
        { "name": "children", "type": "INTEGER"},
        { "name": "baby", "type": "INTEGER"},
        { "name": "totleParticipant", "type": "INTEGER"},
        { "name": "allParticipant", "type": "TEXT"},
        { "name": "orderPrice", "type": "INTEGER"},
        { "name": "balance", "type": "INTEGER"},
        { "name": "currentPrice", "type": "INTEGER"},
        { "name": "price", "type": "INTEGER"},
        { "name": "orderStatus", "type": "TEXT"},
        { "name": "description", "type": "TEXT"}];
        let tmpValues = [[body.orderDate, body.timeStampOrderDate, body.name, body.phone, body.lineID, body.plan, body.timeStampDate,
             body.date, body.time, body.adult, body.children, body.baby, body.totleParticipant, 
             body.allParticipant, body.orderPrice, body.balance, body.currentPrice, body.price, body.orderStatus, ""]]	;
        let insertSQLiteReq = await DbmsHttp.insertSqliteData('orderList', tmpColumns, tmpValues, 'whale');
        if(insertSQLiteReq.Result == 'OK'){
          //this.queryData();  
          return "OK"      
        }else{
          return insertSQLiteReq.Result
        }        
      }
      
    async queryData(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        let tmpColumns = body.columns;
        let tmpSubQuery = '';
        let today = new Date();
        let y = today.getFullYear()
        let m = today.getMonth() + 1
        let d = today.getDate()
        let tmpDate = y+'/'+m+'/'+d
        var tmpDateArr = tmpDate.split("/");
        var newDate = new Date( tmpDateArr[0], tmpDateArr[1] - 1, tmpDateArr[2]).getTime();                
        if(body.dateType == 0){
            tmpSubQuery = " timeStampOrderDate >= " + newDate;
        }else if(body.dateType == 1){
            if(body.dateRange.start != ''){
                tmpSubQuery = " timeStampOrderDate >= " + body.dateRange.start + " and timeStampOrderDate <= " + body.dateRange.end;
            }else{
                tmpSubQuery = " timeStampOrderDate >= " + newDate;
            }
        }else{
            if(body.dateRange.start != ''){
                tmpSubQuery = " timeStampOrderDate >= " + body.dateRange.start + " and timeStampOrderDate <= " + body.dateRange.end;
            }else{
                tmpSubQuery = " timeStampOrderDate >= " + newDate;
            }
        }         
        if(body.orderStatus.pay && body.orderStatus.notpay && body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and (orderStatus = "已付訂" or orderStatus = "未付訂" or orderStatus = "取消")';
        }else if(body.orderStatus.pay && body.orderStatus.notpay && !body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and (orderStatus = "已付訂" or orderStatus = "未付訂")';
        }else if(body.orderStatus.pay && !body.orderStatus.notpay && !body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and orderStatus = "已付訂"';
        }else if(!body.orderStatus.pay && !body.orderStatus.notpay && body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and orderStatus = "取消"';
        }else if(!body.orderStatus.pay && body.orderStatus.notpay && body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and (orderStatus = "取消" or orderStatus = "未付訂")';
        }else if(!body.orderStatus.pay && body.orderStatus.notpay && !body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and orderStatus = "未付訂"';
        }else if(body.orderStatus.pay && !body.orderStatus.notpay && body.orderStatus.cancel){
            tmpSubQuery = tmpSubQuery + ' and (orderStatus = "取消" or orderStatus = "已付訂")';
        }               
        try{
            let querySQLite = await DbmsHttp.querySqliteData('orderList', tmpColumns, {sql: tmpSubQuery}, 'whale'); 
            res.json(querySQLite); 
        }catch(error){
            console.log(error);
            res.json({error: 'Query Table Error'}); 
        }
    }
      
    async updateData(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        let tmpSubQuery = [{"logic":"&&", "key":"phone", "val": body.id, "conditions":"="}]	;
        try{
            let updateSQLiteReq1 = await DbmsHttp.updateSqliteData('orderList', [body.column], [body.data], tmpSubQuery, 'whale');    
            res.json(updateSQLiteReq1); 
        }catch(error){
            console.log(error);
            res.json({error: 'Update Table Error'}); 
        }
    }       

}
