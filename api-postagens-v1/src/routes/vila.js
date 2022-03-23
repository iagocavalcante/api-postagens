const VilaHandler = require('./../handlers/VilaHandler')

module.exports = {
	method: 'GET',
	path: '/api/vila',
	handler: VilaHandler.list
}
