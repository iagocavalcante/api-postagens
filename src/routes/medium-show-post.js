const MediumHandler = require('../handlers/MediumHandler')

module.exports = {
  method: 'GET',
  path: '/api/medium/{name}/{postName}',
  handler: MediumHandler.showPost
}