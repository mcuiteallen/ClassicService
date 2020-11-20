app = require('../app');
const MaintenController = require('../controllers/mainten.js');
const PurchasingController = require('../controllers/purchasing.js');
const bodyParser = require('body-parser');
const cors = require('cors');
purchasingController = new PurchasingController();
maintenController = new MaintenController();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

app.post('/uploadPhoto', maintenController.upload);
app.get('/purchasing/*', purchasingController.get);
app.post('/purchasing/*', purchasingController.post);