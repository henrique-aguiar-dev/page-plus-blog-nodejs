const mongoose = require('mongoose')
require('../models/CategoryModel')
const Category = mongoose.model('categorias')
require('../models/PostModel')
const Post = mongoose.model('postagens')
require('../models/LoginAdminModel')
const Admin = mongoose.model('admin')

/***********Admin controllers***********/
//Index - feed initial page w/ posts & categories
const getPostsAndCateg = async (req, res) => {
	const posts = await Post.find().populate('categoria').populate('autor').sort({ _id: 'desc' }).then(posts => {
		return posts
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao listar as postagens.')
		res.redirect('/blog/admin')
	})

	const categories = await Category.find().then(categories => {
		return categories
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao listar as categorias')
		res.redirect('/blog/admin')
	})

	const authors = await Admin.find().then(authors => {
		return authors
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao listar as categorias')
		res.redirect('/blog/admin')
	})

	return { posts, categories, authors }
}

exports.indexAdm = (req, res) => {
	getPostsAndCateg().then(data => {
		res.render('blog/admin/index', { posts: data.posts, categories: data.categories, authors: data.authors })
	})
}