const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostModel = new Schema({
	titulo: { type: String, required: true },

	slug: { type: String, required: true },

	img: { type: String },

	categoria: { type: Schema.Types.ObjectId, ref: 'categorias', required: true },

	conteudo: { type: String, required: true },

	resumo: { type: String, required: true },

	data: { type: String, default: Date.now() },

	autor: { type: Schema.Types.ObjectId, ref: 'admin', required: true }
})

mongoose.model('postagens', PostModel)
