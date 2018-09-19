const axios = require('axios')

const list = (req, h) => {
  return axios.get(process.env.MEDIUM_HOST)
    .then(response => {
      const cleanPosts = removeTrashFromJson(response.data)
      const posts = convertToObject(cleanPosts)
      return transformObjectToArray(posts.payload.references.Post)
    })
    .catch(error => Promise.reject(error.data))
}

const transformObjectToArray = ( posts ) => Object.values(posts)

const removeTrashFromJson = ( json ) => json.replace('])}while(1);</x>', '')

const convertToObject = ( object ) => JSON.parse(object)

module.exports = {
  list
}