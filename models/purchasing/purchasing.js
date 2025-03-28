const fs = require('fs');
const path = require('path');
const request = require('request');

const LineNotifyModel = require('../lineNotify/lineNotify.js');
lineNotifyModel = new LineNotifyModel();

module.exports = class purchasing {
    async checkOut(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        if(body.cart && body.market && body.shipping && body.order){
            let itemDetail = '';
            for(let i = 0 ; i < body.cart.length ; i++){
                let itemKind = '';
                let tmpData = body.cart[i]
                for(let j = 0 ; j < tmpData.productItem.kind.length ; j++){
                    let tmp = tmpData.productItem.kind[j];
                    itemKind = itemKind + tmp.name + ' : ' + tmp.choosed + '\n'
                }
                let index = i + 1;
                itemDetail = itemDetail + '======第' + index + '項======\n商品名稱 : ' + tmpData.productItem.title + '\n' + '數量 : ' +  tmpData.count + '\n' +
                itemKind + '單項金額 : ' + tmpData.productItem.realPrice + '元\n'  
                
            }
            let message = 
            '\n\n' +'---訂購人資訊---'+ '\n' +
            '姓名 : ' + body.order.name + '\n' +
            '電話 : ' + body.order.phone + '\n' + 
            'Email : ' + body.order.email + '\n' + 
            '備註 : ' + body.order.remark + '\n' + 
            '\n---訂購項目--- '+ '\n' +
            itemDetail + '\n' +
            '---總金額--- '+ '\n' +
            '商品總金額 ' + body.price + '元 + 運費 ' + body.shipping  + '元 = ' + body.allPay + '元\n\n' +
            '---寄送方式--- '+ '\n' +
            '超商 : ' + body.market.type.name + '\n' +
            '門市名稱 : ' + body.market.name + '\n'  +
            '門市編號 : ' + body.market.id + '\n'  + 
            '門市地址 : ' + body.market.address + '\n'
            let tokenList = ["f807ECm04kGPMMkfBqLtmON5bg0q0vmSwzhcRuoiat5"];
            for(let i = 0 ; i < tokenList.length ; i++){
                let result = await lineNotifyModel.pushMessage(message, tokenList[i]);
                if(result == 'send completed!'){
                    res.json({result: 'OK'}); 
                }else{
                    res.json({error: 'fail'}); 
                }
            }               
        }
        
     
    };

    async getLocateList(req, res) {
        // Create folder path
        //let time = new Date().getTime();
        //console.log(time);
        let result = await purchasing.getData('https://emap.pcsc.com.tw/emap.aspx');
        let locateList = []
        if(result != ''){
            let tmp1Arr = result.split('id="maplink_');
            for(let i = 1 ; i < tmp1Arr.length ; i++){
                let tmpData = tmp1Arr[i];
                let tmp2Arr = tmpData.split('</a>'); 
                let tmp3Arr = tmp2Arr[0].split('>');
                //console.log(tmp3Arr[1]);
                locateList.push(tmp3Arr[1]);
            }
        }
        res.json({result: locateList}); 
    };

    async getInfoById(req, res) {
        // Create folder path
        let time = new Date().getTime();
        console.log(time);
        let body = JSON.parse(JSON.stringify(req.body));
        if(body != {} && body.id){
            let formData =  {
                commandid: 'SearchStore',
                ID: body.id
            }
            let result = await purchasing.postFormData('https://emap.pcsc.com.tw/EMapSDK.aspx', formData);
            let name = '';
            let address = '';
            if(result != ''){
                let statusArr = result.split('Status>');
                let nameArr = result.split('POIName>');
                let addressArr = result.split('Address>');                
                if(statusArr[1] === '連線成功</' && nameArr.length > 1 && addressArr.length > 1){
                    name = nameArr[1].replace('</', '');
                    address = addressArr[1].replace('</', '');
                    res.json({result: {name: name, address: address}}); 
                }else{
                    res.json({error: 'Store is not found'}); 
                }
            }            
        }else{
            res.json({error: 'id is fail'}); 
        }
    };



    static getData(url) {
        return new Promise( async (resolve, reject) => {
            let options = {
                uri: url,
                method: 'GET'         
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);           
                }else{
                    reject(error);       
                }
            });  
        });     
    };

    static postFormData(url, formData) {
        return new Promise( async (resolve, reject) => {
            let options = {
                headers: {
                    "Content-Type": "multipart/form-data"
                },                
                uri: url,
                method: 'POST',
                formData: formData  
            };  
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);           
                }else{
                    reject(error);       
                }
            });  
        });     
    };

 

}