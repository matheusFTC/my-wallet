const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

dotenv.config();

let app = express();
let router = express.Router();

const authentication = require('./routes/authentication');
const user = require('./routes/user');

router.use('/authentication', authentication);
router.use('/users', user);

app.use(express.static('public'));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use('/api/v1', router);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Recurso não encontrado.' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

mongoose.Promise = bluebird;

mongoose.connect(process.env.APP_DB_URL, {
  useMongoClient: true
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

app.listen(process.env.PORT || process.env.APP_PORT);