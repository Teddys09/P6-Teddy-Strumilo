require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
//Database
require('./mongo');
//Controllers
const { signupUser, loginUser } = require('./controllers/users');
const { sauceHome, sauceCreate } = require('./controllers/sauces');
//Middleware
app.use(cors());
app.use(express.json());

//Routes

app.post('/api/auth/signup', signupUser);
app.post('/api/auth/login', loginUser);
app.get('/api/sauces', sauceHome);
app.post('/api/sauces', sauceCreate);
app.get('/', (req, res) => res.send('hello world'));

//Listen
app.listen(port, () => console.log('Listening on port ', port));
