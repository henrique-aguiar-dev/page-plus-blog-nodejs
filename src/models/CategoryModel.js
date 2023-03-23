const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategoryModel = new Schema({
	nome: { type: String, required: true },

	slug: { type: String, required: true },

	num_posts: { type: Number, default: 0 }
})

mongoose.model('categorias', CategoryModel)