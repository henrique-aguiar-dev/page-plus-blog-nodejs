const mongoose = require('mongoose')
require('../models/CategoryModel')
const Category = mongoose.model('categorias')
require('../models/PostModel')
const Post = mongoose.model('postagens')

//Exports categories to global variable
exports.globalCateg = () => Category.find().then(categories => {
	return categories
}).catch(err => {
	req.flash('errors', 'Houve um erro ao listar as categorias.')
	return res.redirect('/blog')
})

//list categories in main page
exports.index = (req, res) => {
	Post.find().populate('categoria').sort({ data: 'desc' }).then(posts => {
		res.render('blog/index', { posts: posts })
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao listar as postagens.')
		return res.redirect('/blog')
	})
}

//Open post page
exports.readPost = (req, res) => {
	Post.findOne({ slug: req.params.slug }).then(post => {
		if (post) {
			Category.findOne({ _id: post.categoria }).then(category => {
				res.render('blog/post/index', { post: post, category: category })
			}).catch(err => {
				req.flash('errors', 'Houve um erro interno ao verificar a categoria.')
				return res.redirect('/blog')
			})
		} else {
			req.flash('errors', 'Esta postagem não existe.')
			return res.redirect('/blog')
		}
	}).catch(err => {
		req.flash('errors', 'Houve um erro interno.')
		return res.redirect('/blog')
	})
}

//Open post by category
exports.categPosts = (req, res) => {
	Category.findOne({ slug: req.params.slug }).then(category => {
		if (category) {
			Post.find({ categoria: category._id }).then(posts => {
				res.render('blog/categories/posts', { posts: posts, categName: category.nome })
			}).catch(err => {
				req.flash('errors', 'Houve um erro interno ao carregar a página desta categoria.')
				return res.redirect('/blog')
			})
		} else {
			req.flash('errors', 'Esta categoria não existe.')
			return res.redirect('/blog')
		}
	}).catch(err => {
		req.flash('errors', 'Houve um erro interno ao carregar a página desta categoria.')
		return res.redirect('/blog')
	})
}

//If try to acces '/categories' w/o the param (slug)
exports.redirect = (req, res) => {
	req.flash('errors', 'A página requisitada não existe. Todas as postagens e categorias são acessíveis da página inicial.')
	return res.redirect('/blog')
}

//Search system - show posts related
exports.search = (req, res) => {
	const errors = []
	const prevUrl = req.headers.referer

	if(!req.body.search || typeof req.body.search !== 'string') errors.push('Termo de busca inválido ou não inserido.')

	if (errors.length > 0) {
		res.render('/blog', { errors: errors })
	} else {
		Post.find({$text: {$search: req.body.search}}).then(result => {
			if(result.length > 0) {
				Category.findOne({ _id: result[0].categoria }).then(category => {
					res.render('blog/search_find', { result: result, terms: req.body.search, category: category })
				}).catch(err => {
					req.flash('errors', 'Houve um erro interno ao buscar a categoria das postagens.')
					return res.redirect('/blog')
				})
			} else {
				req.flash('errors', 'A busca não retornou nenhum resultado.')
				return res.redirect(prevUrl)
			}
		}).catch(err => {
			console.log(err)
			req.flash('errors', 'Houve um erro ao fazer a busca.')
			return res.redirect('/blog')
		})
	}
}
