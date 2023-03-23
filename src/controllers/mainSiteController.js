const mongoose = require('mongoose')
require('../models/PostModel')
const Post = mongoose.model('postagens')
const { validateContactForm } = require('../helpers/helpers')
const { receiveEmail } = require('../utils/sendBlogEmails')

//Landing page - main website
exports.landingPage = (req, res) => {
	Post.find().populate('categoria').sort({ data: 'desc' }).then(posts => {
		res.render('index', { posts: posts })
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao listar as postagens.')
		return res.redirect('/blog')
	})
}

exports.sendContactMail = (req, res) => {
	const errors = validateContactForm(req.body)

	if (errors.length > 0) {
		req.flash('errors', errors)
		return res.redirect('/#anch-contato')
	} else {
		const mailBody = {
			to: process.env.MAIL,
			from: `${req.body.nome} <${req.body.email}>`,
			replyTo: req.body.email,
			subject: `Nova mensagem de: ${req.body.nome}`,
			text: `Nome: ${req.body.nome}\nEmail: ${req.body.email}\nTelefone: ${req.body.telefone}\nConvênio: ${req.body.convenio}\nMensagem:\n${req.body.mensagem}`,
			html: `<b>Nome:</b> ${req.body.nome}<br><b>Email:</b> ${req.body.email}<br><b>Telefone:</b> ${req.body.telefone}<br><b>Convênio:</b> ${req.body.convenio}<br><br><b>Mensagem:</b><br>${req.body.mensagem}`
		}
		
		receiveEmail(mailBody).then(info => {
			req.flash('success', 'Sua mensagem foi enviada! Responderemos em breve.')
			return res.redirect('/#anch-mail-sended')
		}).catch(err => console.log(err))
		
	}
}
