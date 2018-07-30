const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'justin',
    password : '123',
    database : 'smart-brain'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });


const app = express();
app.use(bodyParser.json());
app.use(cors());


// ##### SERVER ENDPOINTS #######

app.get('/', (req, res) => {
	res.send(database.users);
})

//Sign In Route for Application
app.post('/signin', signin.handleSignin(db, bcrypt))

//Register Route for Application
app.post('/register', register.handleRegister(db, bcrypt)) //dependency injection, putting in whatever dependencies handleRegister function needs

//Profile User ID Route
app.get('/profile/:id', profile.handleProfile(db))

//Image User Route : every time submit image, increase entries
app.put('/image', image.handleImage(db))

//API Call put in backend for security purposes
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)} )



app.listen(4000, () => {
	console.log('app is running on port 4000');
})















/*
//DIFFERENT ROUTES WE WANT TO CREATE, API PLANNING


/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/