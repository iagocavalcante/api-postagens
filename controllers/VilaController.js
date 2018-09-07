import axios from 'axios'

const POSTS_URL = 'http://viladosilicio.com.br/wp-json/wp/v2/'

const list = (req, h) => {
  return axios.get(`${POSTS_URL}posts?author=5&_embed&_jsonp`)
    .then(response => {
      return response.data
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

export default {
  list
}