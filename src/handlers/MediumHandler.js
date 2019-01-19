const axios = require('axios')

const list = (req, h) => {
  return axios.get(replaceUserInUrl(req.params.name))
    .then(response => {
      const cleanPosts = removeTrashFromJson(response.data)
      const posts = convertToObject(cleanPosts)
      return transformObjectToArray(posts.payload.references.Post)
    })
    .catch(error => Promise.reject(error.data))
}
const showPost = (req, h) => {
  return axios.get(replaceUserAndPostInUrl(req.params.name, req.params.postName))
    .then(response => {
      const cleanPosts = removeTrashFromJson(response.data)
      const posts = convertToObject(cleanPosts)
      return h.response(posts)
    })
    .catch(error => Promise.reject(error.data))
}

const transformObjectToArray = ( posts ) => Object.values(posts)

const removeTrashFromJson = ( json ) => json.replace('])}while(1);</x>', '')

const convertToObject = ( object ) => JSON.parse(object)

const replaceUserInUrl = ( name ) => process.env.MEDIUM_HOST_USER.replace('@', `@${name}`)

const replaceUserAndPostInUrl = ( name, postName ) => process.env.MEDIUM_HOST_POST.replace('@', `@${name}`).replace('post', `${postName}`)

module.exports = {
  list,
  showPost,
}
