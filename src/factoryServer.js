const Hapi = require('hapi')
const routes = require('./routes')

const factoryServer = () => {
  const server = new Hapi.Server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: { 
      cors: { 
        origin: ['*'] 
      }
    } 
  })
  
  server.route(routes)
  
  // Start the server
  async function start() {
  
    try {
      await server.start()
    }
    catch (err) {
      console.log(err)
      process.exit(1)
    }
  
    console.log('Server running at:', server.info.uri)
  }
  
  start()
}

factoryServer()
