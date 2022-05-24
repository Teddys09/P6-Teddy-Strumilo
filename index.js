require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

//Database
require('./mongo');
//Controllers
const { signupUser, loginUser } = require('./controllers/users');
const {
  sauceHome,
  sauceCreate,
  sauceId,
  sauceDelete,
  sauceModify,
  sendClientResponse,
  sauceIdPouce,
} = require('./controllers/sauces');

const { saucePouce } = require('./controllers/pouce');

//Middleware
app.use(cors());
app.use(express.json());
//app.use(bodyParser.urlencoded({ entended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'images/',
  filename: imageName,
});
const upload = multer({ storage: storage });

function imageName(req, file, cb) {
  cb(null, Date.now() + '-' + file.originalname);
}
module.exports = { upload };

const { scanUser } = require('./middleware/scanUser');

const exp = require('constants');

//Routes

app.post('/api/auth/signup', signupUser);
app.post('/api/auth/login', loginUser);
app.get('/api/sauces', scanUser, sauceHome);
app.post('/api/sauces', scanUser, upload.single('image'), sauceCreate);
app.get('/api/sauces/:id', scanUser, sauceId);
app.delete('/api/sauces/:id', scanUser, sauceDelete);
app.put(
  '/api/sauces/:id',
  scanUser,
  upload.single('image'),
  sauceModify,
  sendClientResponse
);
app.post('/api/sauces/:id/like', saucePouce);
app.get('/', (req, res) => res.send('hello world'));

//Listen
app.listen(port, () => console.log('Listening on port ', port));
