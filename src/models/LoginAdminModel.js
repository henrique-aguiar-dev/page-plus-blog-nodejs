const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LoginModel = new Schema({
	nome: { type: String, required: true },

	email: { type: String, required: true, unique: true },

	senha: { type: String, required: true },

	suAdm: { type: String, default: '0' },

	_failed_logins: { type: Number, default: 0 }
})

mongoose.model('admin', LoginModel)