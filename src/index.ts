import http = require('http');
import * as express from 'express';
import cors = require('cors');
import bodyParser = require('body-parser');
import Promise = require('bluebird');
import mongoose = require('mongoose');
import api from './routes';

let app = express();

//if (process.env.NODE_ENV === 'test') {
  //config = require('./dev.json');
//}

app.use(cors());
app.use(bodyParser.json({ limit: '100kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});
app.use('/api', api);

app.set('port', process.env.PORT);
http.createServer(app).listen(app.get('port'));
console.log(`Ready on port ${app.get('port')}`);

export default app;
