import Hapi from 'hapi'
import MediumController from './controllers/MediumController'
import VilaController from './controllers/VilaController'

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost',
  routes: { 
    cors: { 
      origin: ['*'] 
    }
  } 
})

server.route({
  method: 'GET',
  path: '/api/medium',
  handler: MediumController.list
})

server.route({
  method: 'GET',
  path: '/api/vila',
  handler: VilaController.list
})

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