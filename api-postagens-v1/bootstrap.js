require('dotenv').config()
const serverFactory = require('./src/serverFactory')
serverFactory.start(serverFactory.serverFactory())
