app = require('../app');
const MaintenController = require('../controllers/mainten.js');
const bodyParser = require('body-parser');
const cors = require('cors');
maintenController = new MaintenController();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

app.post('/uploadPhoto', maintenController.upload);