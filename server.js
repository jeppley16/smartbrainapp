const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
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

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send(database.users);
})

//Sign In Route for Application
app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')  //no need for a transaction as we are just checking, not modifying database
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash); 
			if (isValid) {
				return db.select('*').from('users')  //always want to make sure we are returning
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])	
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
	.catch(err => res.status(400).json('wrong credentials'))
})

//Register Route for Application
app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {  //create a transaction when >1 thing to do at once, use trx object instead of db 
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')  // from Knex, return all columns
					.insert({ // insert user into database
						email: loginEmail[0],  //we want to return an array [0]
						name: name,
						joined: new Date()
					})
					.then(user => {
						res.json(user[0]); //Because when registering, should only be one user		
					})	
			})
			.then(trx.commit)  // to make sure the transaction is added to database
			.catch(trx.rollback) // if anything fails, rollback changes
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
	db('users').where('id', '=',  id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('Unable to get entries'))
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