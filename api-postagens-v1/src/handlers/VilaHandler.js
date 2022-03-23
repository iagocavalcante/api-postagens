const axios = require('axios')

// eslint-disable-next-line no-unused-vars
const list = (req, h) => {
	return axios.get(`${process.env.VILADOSILICIO_HOST}posts?author=5&_embed&_jsonp`)
		.then( response => response.data )
		.catch( error => Promise.reject(error.data) )
}

module.exports = {
	list
}