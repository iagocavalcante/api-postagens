// import axios from 'axios'
const axios = require('axios')
const POSTS_URL = 'https://medium.com/@iagoangelimc/latest?format=json'

const list = (req, h) => {
  return axios.get(POSTS_URL)
    .then(response => {
      const cleanPosts = removeTrashFromJson(response.data)
      const posts = convertToJson(cleanPosts)
      return transformObjectToArray(posts.payload.references.Post)
    })
    .catch(error => error.data)
}

const transformObjectToArray = ( posts ) => {
  return Object.values(posts)
}

const removeTrashFromJson = ( json ) => {
  return json.replace('])}while(1);</x>', '')
}

const convertToJson = ( object ) => {
  return JSON.parse(object)
}

module.exports = {
  list
}