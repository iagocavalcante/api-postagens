const axios = require('axios')

// eslint-disable-next-line no-unused-vars
const list = (req, _h) => {
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
		.then(async response => {
			const cleanPosts = removeTrashFromJson(response.data)
			const postObject = convertToObject(cleanPosts)
			const post = await transformInHtml(postObject.payload.value.content.bodyModel.paragraphs)
			return h.response(post)
		})
		.catch(error => Promise.reject(error.data))
}
const transformObjectToArray = ( posts ) => Object.values(posts)
const removeTrashFromJson = ( json ) => json.replace('])}while(1);</x>', '')
const convertToObject = ( object ) => JSON.parse(object)
const replaceUserInUrl = ( name ) => process.env.MEDIUM_HOST_USER.replace('@', `${name}`)
const replaceUserAndPostInUrl = ( name, postName ) => process.env.MEDIUM_HOST_POST.replace('@', `@${name}`).replace('post', `${postName}`)
function requestIframeUrl( iframe ) {
  return axios.get(`https://medium.com/media/${iframe.mediaResourceId}`)
    .then(response => {
      const cleanPosts = removeTrashFromJson(response.data)
			const postObject = convertToObject(cleanPosts)
      return postObject.payload.value
		})
}

function requestGistHtml ( iframe ) {
	const url = `https://${iframe.domain}/${iframe.gist.gistId}.json`
  return axios.get(url)
    .then(response => {
      return response.data
		})
}

async function transformInHtml(paragraphs) {
  return Promise.all(
		paragraphs.map(renderParagraph)
  )
}

async function renderParagraph(paragraph) {
	let iframe = ''
	let gist = ''
	if (paragraph.iframe) {
		iframe = await requestIframeUrl(paragraph.iframe)
		gist = await requestGistHtml(iframe)
	}

  return {
    text: paragraph.text || '',
    tag: checkType(paragraph.type),
    mixtapeMetadata: paragraph.mixtapeMetadata || '',
    iframe: iframe,
    gist: gist,
    markups: paragraph.markups.length ? paragraph.markups : '',
    metadata: paragraph.metadata || '',
  }
}

const checkType = ( type ) => TYPES[type]

const TYPES = {
	0: '<p>_$_</p>',
	1: '<p>_$_</p>',
	3: '<h1>_$_</h1>',
	4: '<img width="100%" src="https://miro.medium.com/max/1400/_$_" />',
	6: '<blockquote>_$_</blockquote>',
	7: '<blockquote>_$_</blockquote>',
	8: '<pre>_$_</pre>',
	9:  '<li><a href="_$_">_%_</a></li>',
	10:  '<ol>_$_</ol>',
	11:  '<iframe width="100%" src="_$_"></iframe>',
	13:  '<h2>_$_</h2>',
	14:  '<a href="_$_">_%_</a>'
}

module.exports = {
	list,
	showPost,
}
