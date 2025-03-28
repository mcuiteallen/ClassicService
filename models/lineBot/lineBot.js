const line = require('@line/bot-sdk');
const request = require('request');

const client = new line.Client({
    channelAccessToken: 'eHXHlj5irxGNKHhR0fzZyRMgi4TC+N00rEvR0ZnxIA0q1P7i9IG9R3MgHy/2XfM29FU14bkzgXsoZKY+s5jkEzPNIxLuiY2tU4lN93jUpFgx/ylhXpPK9IUexcKBg/jRyDoe1MunO6M9lUIg/HQhtAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '03cbe7fe7e29d5d544cdc9e5a6674355'
});

module.exports = class lineBot {
    async webhook(req, res) {
        let body = JSON.parse(JSON.stringify(req.body));
        const event = req.body.events[0];
        console.log(event.source);
        if (event) {
            if (event.type === 'message') {
              const message = event.message;
              if (message.type === 'text' && message.text === 'Hello') {
		console.log(event);
                client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: 'Hey domy',
                });
              }
            }
        }
        //this.sendReplyMessage("Hello dom");     
        res.json({result: 'OK'});
    };
    sendReplyMessage(text) {
	return new Promise( async (resolve, reject) => {
	  //client.pushMessage("Uafe1adc6d51c04ae844d3a428ac653f5", [{
	  client.pushMessage("Cc2cb4f620861bfd546b6be26a8261b62", [{
	    type: 'text',
	    text: text
	  }]).then(() => {
            resolve('send completed!');
          }); 
        });
    };
    async sendReplyMessage_bk(text) {
        let options = {
            'uri': 'https://api.line.me/v2/bot/message/multicast',
            'method': 'POST',
            'content-type': 'application/json',
            'auth': {
                'bearer': 'eHXHlj5irxGNKHhR0fzZyRMgi4TC+N00rEvR0ZnxIA0q1P7i9IG9R3MgHy/2XfM29FU14bkzgXsoZKY+s5jkEzPNIxLuiY2tU4lN93jUpFgx/ylhXpPK9IUexcKBg/jRyDoe1MunO6M9lUIg/HQhtAdB04t89/1O/w1cDnyilFU='
            },
            'data': {
                'content-type': 'application/json',
                'body': JSON.stringify({
                        "to": ["Uafe1adc6d51c04ae844d3a428ac653f5"],
                        "messages":[
                            {
                                "type":"text",
                                "text": text
                            }
                        ]
                    }) 
                }                                 
        };
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);           
            }else{
                console.log(error);       
            }
        });         
    };       

}
