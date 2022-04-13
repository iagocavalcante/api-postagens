require('dotenv').config()
const serverFactory = require('../../src/serverFactory')

describe('Medium Handler', () => {

  const request = {
    method: 'GET',
    url: '/api/medium'
  }

  test('Respond with status code 200', (done) => {
    serverFactory.serverFactory().inject(request)
      .then(response => {
        expect(response.statusCode).toBe(200)
        expect(response.result).toBeInstanceOf(Array)
      })
    done()    
  })
})