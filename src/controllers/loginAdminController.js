const mongoose = require('mongoose')
require('../models/LoginAdminModel')
const Admin = mongoose.model('admin')
require('../models/TokenModel')
const Tokens = mongoose.model('tokens')
const { validateUserForm, validateEmail, randomCodeGen, bcryptPass, validateNewPass } = require('../helpers/helpers')
const { sendEmailBlocked, sendEmailToken, sendEmailPassChanged } = require('../utils/emailsBodyConstructor')
const bcryptjs = require('bcryptjs')

/*
/*******************Exports to routes.js*******************
*/
//GET route - login form
exports.loginForm = (req, res) => {
	res.render('blog/admin/login')
}

//POST route - logon w/ attempts control
exports.login = (req, res) => {
	const errors = validateUserForm(req)

	if (errors.length > 0) {
		res.render('blog/admin/login', { errors: errors })
	} else {
		//Find the user...
		Admin.findOne({ nome: req.body.name }).then(user => {
			//Wrong pass = +1 failed login; 5 failed logins = blocked!
			if (!bcryptjs.compareSync(req.body.password, user.senha) && user._failed_logins < 5) {
				user._failed_logins += 1
				user.save()
				req.flash('errors', `Senha inválida! Você tem mais ${5 - user._failed_logins} tentativa(s)!`)
				if (user._failed_logins >= 5) {
					req.flash('errors', 'Por segurança, sua conta foi bloqueada após a 5ª tentativa de login com senha errada! Será enviado um e-mail com instruções para criar outra senha.')
					try { sendEmailBlocked(user) } catch (err) { console.log(err) }
					return res.redirect('/blog/admin/login')
				}
				return res.redirect('/blog/admin/login')
			}

			//Reset failed logins if successful
			if (user._failed_logins < 5) {
				user._failed_logins = 0
				user.save()
			}

			//Save user in session
			req.session.user = {
				_id: user._id,
				name: user.nome,
				email: user.email,
				suAdm: user.suAdm,
				failed: user._failed_logins
			}

			req.flash('success', 'Login efetuado com sucesso!')
			req.session.save(() => res.redirect('/blog/admin'))
		}).catch(err => {
			req.flash('errors', 'Esse usuário não existe.')
			res.redirect('/blog/admin/login')
		})
	}

}

//Destroy session on logout - GET route
exports.logout = (req, res) => {
	res.redirect('/blog/admin/login')
	req.session.destroy()
}

//User account manager - GET route
exports.userData = (req, res) => {
	if (req.session.user) {
		res.render('blog/admin/user')
		return
	}
	req.flash('errors', 'Sessão de usuário inválida.')
	res.redirect('/blog/admin')
	return
}

//Edit user information - POST route
exports.userEdit = (req, res) => {
	const errors = validateUserForm(req)

	if (errors.length > 0) {
		res.render('blog/admin/user', { errors: errors })
	} else {
		Admin.findOne({ _id: req.body.id }).then(user => {
			if (!bcryptjs.compareSync(req.body.password, user.senha)) {
				req.flash('errors', 'Senha atual inválida!')
				return res.redirect('/blog/admin/user')
			}
			//If new pass... compare w/ prev pass & change
			if (req.body.password_new) {
				if (bcryptjs.compareSync(req.body.password_new, user.senha)) {
					req.flash('errors', 'A senha nova é igual à anterior!')
					return res.redirect('/blog/admin/user')
				}
				user.senha = bcryptPass(req.body.password_new)
			}

			Admin.findOne({ nome: req.body.name }).then(found => {
				if (found) {
					req.flash('errors', 'Nome de usuário já utilizado.')
					return res.redirect('/blog/admin/user')
				}

				//Can save now
				user.nome = req.body.name

				user.save().then(() => {
					req.flash('success', 'Dados do administrador alterados com sucesso.')
					//Update session
					req.session.user = {
						_id: user._id,
						name: user.nome,
						email: user.email,
						suAdm: user.suAdm
					}
					req.session.save(() => res.redirect('/blog/admin/user'))
				}).catch(err => {
					req.flash('errors', 'Erro ao salvar os dados do usuário.')
					return res.redirect('/blog/admin/user')
				})

			}).catch(err => {
				req.flash('errors', 'Erro ao consultar os nomes de usuário cadastrados.')
				return res.redirect('/blog/admin/user')
			})
		}).catch(err => {
			req.flash('errors', 'Erro ao consultar usuários cadastrados.')
			return res.redirect('/blog/admin/user')
		})
	}
}

exports.codeGenStart = (req, res) => {
	res.render('blog/admin/getcode')
}

exports.codeGen = (req, res) => {
	const errors = validateEmail(req.body.email)

	if (errors.length > 0) {
		res.render('blog/admin/getcode', { errors: errors })
	} else {
		Admin.findOne({ email: req.body.email }).then(user => {
			if (!user) {
				req.flash('errors', 'O e-mail fornecido não está cadastrado!')
				return res.redirect('/blog/admin/get_code')
			} else {
				Tokens.findOneAndRemove({ userId: user._id }).then(() => {
					let token = randomCodeGen()
					try { sendEmailToken(user, token) } catch (err) { console.log(err) }

					const newToken = {
						userId: user._id,
						token: bcryptPass(token)
					}

					token = null//Unsetting variable w/ unhashed code

					new Tokens(newToken).save().then(() => {
						req.flash('success', 'Um email foi enviado com o código e um link para gerar outra senha.')
						return res.redirect('/blog/admin/get_code')
					}).catch(err => {
						req.flash('errors', 'Erro ao gerar o código.')
						return res.redirect('/blog/admin/get_code')
					})
				})
			}
		})
	}
}

exports.changePassForm = (req, res) => {
	res.render('blog/admin/changepass', { uid: req.query.uid })
}

exports.changePass = (req, res) => {
	const errors = validateNewPass(req.body)

	if (errors.length > 0) {
		req.flash('errors', errors)
		return res.redirect(`/blog/admin/change_pass?uid=${req.body.id}`)
	} else {
		Tokens.findOne({ userId: req.body.id }).then(found => {
			if (!bcryptjs.compareSync(req.body.code, found.token)) {
				req.flash('errors', 'Código incorreto! Verifique novamente o token recebido.')
				return res.redirect(`/blog/admin/change_pass?uid=${req.body.id}`)
			}

			Admin.findOne({ _id: req.body.id }).then(user => {
				if (bcryptjs.compareSync(req.body.password_new, user.senha)) {
					req.flash('errors', 'Senha nova é igual à anterior. Por segurança, crie uma senha diferente.')
					return res.redirect(`/blog/admin/change_pass?uid=${req.body.id}`)
				}

				user.senha = bcryptPass(req.body.password_new)
				user._failed_logins = 0

				user.save().then(() => {
					try { sendEmailPassChanged(user) } catch (err) { console.log(err) }
					found.delete()
					req.flash('success', 'Senha alterada com sucesso. Faça login')
					return res.redirect(`/blog/admin/login`)
				}).catch(err => {
					req.flash('errors', 'Erro ao salvar nova senha.')
					return res.redirect(`/blog/admin/change_pass?uid=${req.body.id}`)
				})

			}).catch(err => {
				req.flash('errors', 'Erro ao buscar os dados do usuário.')
				return res.redirect(`/blog/admin/change_pass?uid=${req.body.id}`)
			})

		}).catch(err => {
			req.flash('errors', 'Não existe token gerado para este usuário ou pode ter expirado (válido por 1 hora).')
			return res.redirect(`/blog/admin/change_pass?uid=${req.body.id}`)
		})
	}
}

//--------CREATE NEW USER--SUPER USER (DEV) ONLY------

exports.createAdmForm = (req, res) => {
	res.render('blog/admin/create')
}

exports.createAdm = (req, res) => {
	const errors = validateUserForm(req)

	if (errors.length > 0) {
		res.render('blog/admin/create', { errors: errors })
	} else {
		Admin.findOne({ email: req.body.email }).then(exists => {
			if (exists) {
				req.flash('errors', 'Email já cadastrado.')
				return res.redirect('/blog/admin/create')
			}

			Admin.findOne({ nome: req.body.name }).then(found => {
				if (found) {
					req.flash('errors', 'Nome de usuário já utilizado.')
					return res.redirect('/blog/admin/create')
				}

				const newAdmin = {
					nome: req.body.name,
					email: req.body.email,
					senha: bcryptPass(req.body.password_new)
				}

				new Admin(newAdmin).save().then(() => {
					req.flash('success', 'Usuário administrador criado com sucesso.')
					res.redirect('/blog/admin/login')
				}).catch(err => {
					req.flash('errors', 'Erro ao criar usuário administrador.')
					return res.redirect('/blog/admin/create')
				})
			}).catch(err => {
				req.flash('errors', 'Erro ao consultar os nomes de usuário cadastrados.')
				res.redirect('/blog/admin/create')
			})

		}).catch(err => {
			req.flash('errors', 'Erro ao consultar os emails cadastrados.')
			res.redirect('/blog/admin/create')
		})
	}
}
