const validator = require('validator')
const bcryptjs = require('bcryptjs')

class ImageFilter {
	// Accept images only
	type(imgType) {
		if (imgType === 'image/jpeg' || imgType === 'image/png' || imgType === 'image/gif' || imgType === 'image/webp') {
			return true
		}
		return false
	}

	size(imgSyze) {
		if (imgSyze < 2000000) return true
		return false
	}

}

exports.validateUserForm = req => {
	const errors = []

	if (!req.body.name || typeof req.body.name !== 'string') errors.push('Nome inválido!')

	if (req.route.path === '/blog/admin/create') {
		if (!req.body.email || typeof req.body.email !== 'string' || !validator.isEmail(req.body.email)) errors.push('Email inválido!')
		if (!req.body.password_new || !req.body.password_rep) errors.push('Crie uma nova senha e confirme!')
	}

	if (req.route.path === '/blog/admin/user/edit' || req.route.path === '/blog/admin/create') {
		if (req.body.name.length < 4) errors.push('Nome de usuário muito pequeno!')
		if (req.body.password_new && req.body.password_rep) {
			if (typeof req.body.password_new !== 'string') errors.push('Senha inválida!')
			if (typeof req.body.password_rep !== 'string') errors.push('Confirmação de senha inválida!')
			if (req.body.password_new.length < 8 || req.body.password_new.length > 16) errors.push('Senha precisa ter no mínimo 8 e no máximo 16 caracteres!')
			if (req.body.password_new !== req.body.password_rep) errors.push('As senhas não são iguais!')
		}
	}

	if (req.route.path === '/blog/admin/login') {
		if (req.body.password.length < 8 || req.body.password.length > 16) errors.push('Senha precisa ter no mínimo 8 e no máximo 16 caracteres!')
		if (!req.body.password || typeof req.body.password !== 'string') errors.push('Senha inválida!')
	}

	return errors
}

exports.createSlug = originalString => {
	return originalString.toLowerCase().normalize('NFD')
	.replace(/\s+/g, '-')
	.replace(/[\u0300-\u036f!@#$%&*()+=\[\]{}_¢£§=/?|]/g, "")
}

//Remove multiples white spaces
exports.stringFilter = string => {
	return string.replace(/\s+/g,' ').replace(/^\s+|\s+$/,'');
}

exports.validateCateg = req => {
	const errors = []

	if (!req.body.name || typeof req.body.name !== 'string') errors.push('Nome inválido!')
	if (req.body.name.length < 2) errors.push('Nome da categoria muito pequeno!')
	if (req.body.name.length > 16) errors.push('Nome da categoria maior que o permitido (16 caracteres)!')

	return errors
}

exports.validatePost = req => {
	const errors = []
	const filter = new ImageFilter

	if (req.files) {
		if (!filter.type(req.files.postImg.mimetype)) errors.push('Formato de arquivo não permitido!')
		if (!filter.size(req.files.postImg.size)) errors.push('O tamanho máximo permitido é 2 MB!')
	}

	if (req.body.categoria === '0') errors.push('Escolha uma categoria!')
	if (!req.body.title || typeof req.body.title !== 'string') errors.push('Crie um título inválido!')
	if (!req.body.content || typeof req.body.content !== 'string') errors.push('O conteúdo está vazio')
	if (!req.body.summary || typeof req.body.summary !== 'string') errors.push('Crie um resumo.')

	return errors
}

exports. validateEmail = email => {
	const errors = []

	if (!email || typeof email !== 'string' || !validator.isEmail(email)) errors.push('Email inválido!')

	return errors
}

exports.validateNewPass = reqBody => {
	const errors = []

	if (!reqBody.password_new || !reqBody.password_rep) {
		errors.push('Crie uma nova senha e confirme!')
	} else {
		if (typeof reqBody.password_new !== 'string') errors.push('Senha inválida!')
		if (typeof reqBody.password_rep !== 'string') errors.push('Confirmação de senha inválida!')
		if (reqBody.password_new.length < 8 || reqBody.password_new.length > 16) errors.push('Senha precisa ter no mínimo 8 e no máximo 16 caracteres!')
		if (reqBody.password_new !== reqBody.password_rep) errors.push('As senhas inseridas não são iguais!')
	}

	return errors
}

exports.validateContactForm = reqBody => {
	const errors = []

	if (!reqBody.nome || typeof reqBody.nome !== 'string') errors.push('Nome inválido!')
	if (!reqBody.email || typeof reqBody.email !== 'string' || !validator.isEmail(reqBody.email)) errors.push('Email inválido!')
	if (!reqBody.telefone || typeof reqBody.telefone !== 'string') errors.push('Telefone inválido!')
	if (!reqBody.convenio|| typeof reqBody.convenio!== 'string') errors.push('Convênio inválido')
	if (!reqBody.mensagem || typeof reqBody.mensagem !== 'string') errors.push('Formato de mensagem não permitido.')

	return errors
}

//--------BcryptJs hash--------
exports.bcryptPass = password => {
	const salt = bcryptjs.genSaltSync()
	return bcryptjs.hashSync(password, salt)
}

//Generate random token for password reset
exports.randomCodeGen = () => {
	let codeString = ''
	for (let i = 0; i < 6; i++) {
		codeString += Math.floor(Math.random() * 10)
	}

	return codeString
}