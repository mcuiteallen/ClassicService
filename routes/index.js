app = require('../app');
const MaintenController = require('../controllers/mainten.js');
const PurchasingController = require('../controllers/purchasing.js');
const WhaleController = require('../controllers/whale.js');
const LoanController = require('../controllers/loan.js');
const LineBot = require('../models/lineBot/lineBot.js');
const line = require('@line/bot-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
purchasingController = new PurchasingController();
maintenController = new MaintenController();
whaleController = new WhaleController();
loanController = new LoanController();
lineBot = new LineBot();
app.use(cors());

const config = {
    channelAccessToken: 'eHXHlj5irxGNKHhR0fzZyRMgi4TC+N00rEvR0ZnxIA0q1P7i9IG9R3MgHy/2XfM29FU14bkzgXsoZKY+s5jkEzPNIxLuiY2tU4lN93jUpFgx/ylhXpPK9IUexcKBg/jRyDoe1MunO6M9lUIg/HQhtAdB04t89/1O/w1cDnyilFU=',
    channelSecret: '03cbe7fe7e29d5d544cdc9e5a6674355'
}

app.use('/webhook', line.middleware(config));
app.use(bodyParser.json({limit: '50mb'}));
app.post('/uploadPhoto', maintenController.upload);
app.get('/purchasing/*', purchasingController.get);
app.post('/whale/*', whaleController.post);
app.post('/loan/*', loanController.post);
app.post('/webhook', lineBot.webhook);
app.get('/sendLineReply', lineBot.sendReplyMessage);
