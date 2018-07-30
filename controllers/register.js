
const handleRegister = (db, bcrypt) => (req,res) => {
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
}

module.exports = {
	handleRegister: handleRegister
};