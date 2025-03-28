const dbmsHttp = require('dbmsHttp');
const DbmsHttp = new dbmsHttp();
const LineNotifyModel = require('../lineNotify/lineNotify.js');
lineNotifyModel = new LineNotifyModel();

module.exports = class loan {
    async sendLine(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        //console.log(body);
        if(body.name && body.phone && body.locate && body.timeStampOrderDate  && body.orderDate && body.item && body.status && body.gender){
            let message = 
            '\n\n' +'---客戶資訊---'+ '\n' +
            '姓名 : ' + body.name + ' ' +  body.gender + '\n' + 
            '電話 : ' + body.phone + '\n' + 
            '居住地 : ' + body.locate + '\n' + 
            '\n---客戶需求--- '+ '\n' +
            '項目 : ' + body.item + '\n' +
            '資產 : ' + body.status + '\n' ;         
            let tokenList = ["WmlH0nlDLcM8yJu5nHI8CHgMmfjijLDgix17PbGhwIG"]; //群組  
            if(body.name == 'test123'){
                tokenList = ["91pHC1GWJRxh6UMjJgs5SCwAoQda6vAP1trBHHezoki"]; //Allen
            }   
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
        let querySQLiteReq4 = await DbmsHttp.querySqliteData('orderList', "", tmpSubQuery, 'loan'); 
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
                    let deleteSQLiteReq1 = await DbmsHttp.deleteSqliteData('orderList', tmpSubQuery, 'loan');
                    if(deleteSQLiteReq1.Result != 'OK'){
                        return deleteSQLiteReq1.Result
                    }       
                } 
            }catch(error){
                console.log('Query Table Error');
            }
        }
        let tmpColumns = [    
        { "name": "name", "type": "TEXT"},
        { "name": "timeStampOrderDate", "type": "INTEGER"},
        { "name": "orderDate", "type": "TEXT"},
        { "name": "gender", "type": "TEXT"},
        { "name": "phone", "type": "TEXT"},
        { "name": "item", "type": "TEXT"},
        { "name": "locate", "type": "TEXT"},
        { "name": "status", "type": "TEXT"},
        { "name": "orderStatus", "type": "TEXT"},
        { "name": "description", "type": "TEXT"}];
        let tmpValues = [[body.name, body.timeStampOrderDate, body.orderDate, body.gender, body.phone, body.item,
             body.locate, body.status, '未成功', '']]	;
        let insertSQLiteReq = await DbmsHttp.insertSqliteData('orderList', tmpColumns, tmpValues, 'loan');
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
                tmpSubQuery = " timeStampOrderDate >= " + body.dateRange.start + " and timeStampOrderDate < " + body.dateRange.end;
            }else{
                tmpSubQuery = " timeStampOrderDate >=" + newDate;
            }
        }else{
            if(body.dateRange.start != ''){
                tmpSubQuery = " timeStampOrderDate >= " + body.dateRange.start + " and timeStampOrderDate < " + body.dateRange.end;
            }else{
                tmpSubQuery = " timeStampOrderDate >= " + newDate;
            }
        } 
        if(body.orderStatus.successOrder && !body.orderStatus.unSuccessOrder){
            tmpSubQuery = tmpSubQuery + " and orderStatus = '送件成功' ";
        }else if(!body.orderStatus.successOrder && body.orderStatus.unSuccessOrder){
            tmpSubQuery = tmpSubQuery + " and orderStatus = '未成功'";
        }                    
        try{
            let querySQLite = await DbmsHttp.querySqliteData('orderList', tmpColumns, {sql: tmpSubQuery}, 'loan'); 
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
            let updateSQLiteReq1 = await DbmsHttp.updateSqliteData('orderList', [body.column], [body.data], tmpSubQuery, 'loan');    
            res.json(updateSQLiteReq1); 
        }catch(error){
            console.log(error);
            res.json({error: 'Update Table Error'}); 
        }
    }       

}