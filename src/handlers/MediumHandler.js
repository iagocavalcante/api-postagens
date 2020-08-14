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
			const postObject = convertToObject(cleanPosts)
			const post = transformInHtml(postObject.payload.value.content.bodyModel.paragraphs)
			return h.response(post)
		})
		.catch(error => Promise.reject(error.data))
}
const transformObjectToArray = ( posts ) => Object.values(posts)
const removeTrashFromJson = ( json ) => json.replace('])}while(1);</x>', '')
const convertToObject = ( object ) => JSON.parse(object)
const replaceUserInUrl = ( name ) => process.env.MEDIUM_HOST_USER.replace('@', `@${name}`)
const replaceUserAndPostInUrl = ( name, postName ) => process.env.MEDIUM_HOST_POST.replace('@', `@${name}`).replace('post', `${postName}`)

const transformInHtml = ( paragraphs ) => 
	paragraphs.reduce((html, paragraph) => {
		if (!paragraph.type && paragraph.type === 11) paragraph.text = paragraph.iframe.thumbnailUrl
		return html.concat({text: `${paragraph.text}`, tag: checkType(paragraph.type)})
	}, [])

const checkType = ( type ) => TYPES[type]

const TYPES = {
	10:  '<li>_$_</li>',
	1 : '<p>_$_</p>',
	3 : '<h1>_$_</h1>',
	4 : '<p>_$_</p>',
	11:  '<embed src="_$_"/>',
	7 : '<blockquote>_$_</blockquote>',
	6 : '<blockquote>_$_</blockquote>',
	13:  '<h2>_$_</h2>',
	0: '<p>_$_</p>',
}

module.exports = {
	list,
	showPost,
}
