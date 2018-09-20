const Hapi = require('hapi')
const routes = require('./routes')
require('dotenv').config()

const serverFactory = () => {
  const server = new Hapi.Server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: { 
      cors: { 
        origin: ['*'] 
      }
    } 
  })
  
  server.route(routes)

  return server
}

// Start the server
const start = ( server ) => {
  server.start((err) => {
    if ( err ) {
      console.log(err)
      process.exit(1)
    }
    console.log('Server running at:', server.info.uri)
  })
}

const stop = ( server ) => {
  server.stop({ timeout: 10000 })
    .then( err => {
      console.log('hapi server stopped')
      process.exit((err) ? 1 : 0)
    })
}

module.exports = {
  serverFactory,
  start,
  stop
}
