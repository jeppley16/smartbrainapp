const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'justin',
    password : 'Password',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});


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
	db('users')
		.returning('*')  // from Knex, return all columns
		.insert({ // insert user into database
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => {
			res.json(user[0]); //Because when registering, should only be one user		
		})
		.catch(err => res.status(400).json('unable to register'))
})

//Profile User ID Route
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users')
		.where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0])
			} else {
				res.status(400).json('Not Found')
			}
		})
		.catch(err => res.status(400).json('Error getting user'))
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