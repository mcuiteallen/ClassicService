const LineAPI = require('line-api');

module.exports = class LineNotify {

    pushMessage(message, token){
      return new Promise( async (resolve, reject) => {
        var notify  = new LineAPI.Notify({
          token: token
        })        
        notify.send({
          message: message
          //sticker: 'smile'
        }).then(() => {
          resolve('send completed!');
        });
      });       
    };    

    pushImage(path, message, pictureNameList, token){
      console.log('./public/uploads/' + path + '/' + pictureNameList)
      return new Promise( async (resolve, reject) => {
        var notify  = new LineAPI.Notify({
          token: token
        })
        notify.send({
          message: message,
          image: './public/uploads/' + path + '/' + pictureNameList
        }).then(() => {
          resolve('send completed!');
        }); 
      }); 
    };


      
}
