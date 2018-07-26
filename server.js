const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')

const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'jusin',
    password : 'Password',
    database : 'smart-brain'
  }
});

console.log(postgres.select('*').from('users'));


const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'john',
			password: 'cookies',
			email: 'john@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'sally',
			password: 'bananas',
			email: 'sally@gmail.com',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
	{
		id: '987',
		hash: '',
		email: 'john@gmail.com'
	}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

//Sign In Route for Application
app.post('/signin', (req, res) => {
	if (req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
	res.json('signin');
})

//Register Route for Application
app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	database.users.push({
		id: '125',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

//Profile User ID Route
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

//Image User Route : every time submit image, increase entries
app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++
			return res.json(user.entries);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
})



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