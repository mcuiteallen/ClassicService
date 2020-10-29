const LineAPI = require('line-api');
const notify = new LineAPI.Notify({
  //token: "MU06ZIvk3EGvQNwEzAsghq2HowdqJKwMmyc5DtRtm9z"
  token: "lDZXcJ2QsJ9puNnpuVzKRIMe22cJMXfy6EMKtDs7ecr"
})
notify.status().then(console.log)

module.exports = class LineNotify {
    pushMessage(message){
        console.log(message);
        notify.send({
            message: message
            //sticker: 'smile'
          }).then(() => {
            console.log('send completed!');
          });
    };
    pushImage(path, message, pictureNameList){
        console.log(pictureNameList);
        console.log(message);
        notify.send({
            message: pictureNameList,
            image: './public/uploads/' + path + '/' + pictureNameList
          }).then(() => {
            console.log('send completed!');
          });
    };
}
