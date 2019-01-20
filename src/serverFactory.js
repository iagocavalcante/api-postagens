const Hapi = require('hapi')
const routes = require('./routes')
//testing deploy pipeline with jenkins and githooks
const serverFactory = () => {
  const server = new Hapi.Server({
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
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

module.exports = {
  serverFactory,
  start,
}
