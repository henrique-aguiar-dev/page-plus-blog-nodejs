const bcryptjs = require('bcryptjs');
const guestController = require('../controllers/guestController')

exports.middlewareGlobal = async (req, res, next) => {
	res.locals.errors = req.flash('errors')
	res.locals.success = req.flash('success')
	res.locals.user = req.session.user
	res.locals.categories = await guestController.globalCateg() //Importing categories to global

	next()
}

exports.catch404Blog = (req, res, next) => {
	return res.render('blog/404')
}

exports.catch404 = (req, res, next) => {
	return res.render('404')
}

exports.checkCsrfError = (err, req, res, next) => {
	if (err) {
		return res.render('blog/404')
	}
	next()
}

exports.csrfMiddleware = (req, res, next) => {
	res.locals.csrfToken = req.csrfToken()
	next()
}

exports.loginRequired = (req, res, next) => {
	if (!req.session.user) {
		req.flash('errors', 'Você precisa ser administrador!')
		req.session.save(() => res.redirect('/blog/admin/login'))
		return
	}

	if (req.session.user.failed >= 5) {
		req.flash('errors', 'Por segurança, sua conta foi bloqueada após a 5ª tentativa de login com senha errada! Um e-mail foi enviado com as instruções para criar uma nova senha.')
		req.session.user = null
		req.session.save(() => res.redirect('/blog/admin/login'))
		return
	}

	next()
}

exports.suAdmRequired = (req, res, next) => {
	//Session modified on 'controllers/loginAdminController'
	if (req.session.user && bcryptjs.compareSync(process.env.SUADMPASS, req.session.user.suAdm)) {
		return next()
	} else {
		req.flash('errors', 'Você precisa estar logado como desenvolvedor para acessar essa rota!');
		req.session.save(() => res.redirect('/blog/admin'))
		return
	}
}
