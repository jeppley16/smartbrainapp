
const handleSignin = (db, bcrypt) => (req, res) => {
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
}

module.exports = {
	handleSignin: handleSignin
}