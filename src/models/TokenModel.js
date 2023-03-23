const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenModel = new Schema({
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'admin' },

	token: { type: String, required: true },

	createdAt: { type: Date, default: Date.now, expires: 3600 }
})

mongoose.model('tokens', TokenModel)