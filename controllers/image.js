const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'e3556d2ed80c497f8090d95f7fff0790'
});


//Function to keep API key info on baack end, not to front end
const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (db) => (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=',  id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
};