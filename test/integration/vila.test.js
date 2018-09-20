require('dotenv').config()
const serverFactory = require('../../src/serverFactory')
serverFactory.start( serverFactory.serverFactory() )

describe('Vila Handler', () => {

  const request = {
    method: 'GET',
    url: '/api/vila'
  }

  test('Respond with status code 200', ( done ) => {
    return serverFactory.serverFactory().inject( request )
      .then( response => {
        expect( response.statusCode ).toBe( 200 )
        expect(response.result).toBeInstanceOf(Array)
        done()
      })
  })
})