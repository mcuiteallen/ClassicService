const multer = require('multer');
const fs = require('fs');
const path = require('path');
const LineNotifyModel = require('../lineNotify/lineNotify.js');
lineNotifyModel = new LineNotifyModel();

const storage = multer.diskStorage({
    destination: './public/uploads/', // 設定儲存路徑
    filename: function (req, file, cb) {
        let originalName = file.originalname;
        cb(null, originalName);
    }
});

// Init Upload 
const upload = multer({
    storage: storage,
}).single('myImage'); 


module.exports = class mainten {
    uploadImg(req, res) {
        upload(req, res, async (err) => {
            if (err) console.log(err);
            else {
                // Create folder path
                let body = JSON.parse(JSON.stringify(req.body));
                //console.log(body)
                let mkdirsync = './public/uploads/' + body.session + '/'; //建立目錄
                function mkdirpath(mkdirsync) {
                    if (!fs.existsSync(mkdirsync)) {
                        try {
                            fs.mkdirSync(mkdirsync);
                        }
                        catch (e) {
                            mkdirpath(path.dirname(mkdirsync));
                            mkdirpath(mkdirsync);
                        }
                    }
                }
                mkdirpath(mkdirsync);
                let originalName = req.file.originalname;
                let imageType = originalName.split('.')
                let sourceFile = './public/uploads/' + originalName; //原暫存目錄
                let destFile = mkdirsync + body.newName + '.' + imageType[1]; //最後儲存目錄
                fs.rename(sourceFile, destFile, function (err) {
                    if (err) console.log('ERROR+ err');
                });
                if(body.lastData == 'true'){
                    let pictureNameList = body.pictureNameList.split(',');
                    let tokenList = ["MU06ZIvk3EGvQNwEzAsghq2HowdqJKwMmyc5DtRtm9z", "lDZXcJ2QsJ9puNnpuVzKRIMe22cJMXfy6EMKtDs7ecr"];
                    for(let i = 0 ; i < tokenList.length ; i++){
                        let result = await lineNotifyModel.pushMessage(body.message, tokenList[i]);
                        console.log(result);
                        for(let j = 0 ; j < pictureNameList.length ; j++){
                            lineNotifyModel.pushImage(body.session, '圖片', pictureNameList[j], tokenList[i]);
                        }
                    }
                }
                res.json({result: true});
            }
        });
    };
}