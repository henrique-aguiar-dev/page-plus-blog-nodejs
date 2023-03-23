const mongoose = require('mongoose')
require('../models/CategoryModel')
const Category = mongoose.model('categorias')
require('../models/PostModel')
const Post = mongoose.model('postagens')
const { validatePost, createSlug } = require('../helpers/helpers');
const path = require('path')

//------------- Posts -------------------
//Open post creation page - GET route
exports.addPostPage = (req, res) => {
	Category.find().then(categories => {
		res.render('blog/admin/addpost', { categories: categories }) //recovery - see createPost()
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao carregar o formulário.')
		res.redirect('/blog/admin')
	})
}

//Create ne post - POST route
exports.createPost = (req, res) => {
	const errors = validatePost(req)
	let uploadPath
	//Saving new post to session - avoid losing it after errors
	req.session.user.posting = req.body
	req.session.save()

	if (errors.length > 0) {
		res.render('blog/admin/addpost', { errors: errors })
	} else {

		const newPost = {
			titulo: req.body.title,
			data: new Date().toLocaleString('pt-BR'),
			slug: createSlug(req.body.title),
			img: null,
			categoria: req.body.category,
			conteudo: req.body.content,
			resumo: req.body.summary,
			autor: req.session.user._id
		}

		//keep 'save' in a function for later use
		const save = () => {
			new Post(newPost).save().then(() => {
				//Add +1 to the number of posts in the chosen category
				Category.findOne({ _id: newPost.categoria }).then(category => {
					category.num_posts += 1
					category.save()
					req.session.user.posting = null
					req.session.save()
					req.flash('success', 'Postagem criada com sucesso.')
					return res.redirect('/blog/admin')
				}).catch(err => {
					req.flash('errors', 'Erro ao consultar as categorias.')
					return res.redirect('/blog/admin/posts/add')
				})
			}).catch(err => {
				req.flash('errors', 'Erro ao salvar postagem.')
				return res.redirect('/blog/admin/posts/add')
			})
		}

		//If there is a image: Validade and upload before saving
		if (req.files) {
			const image = req.files.postImg
			image.name = createSlug(image.name)
			uploadPath = path.resolve(process.cwd(), 'public', 'assets', 'media', image.name)

			image.mv(uploadPath, err => {
				if (err) {
					req.flash('errors', 'Erro ao enviar a imagem!')
					return res.redirect(`/blog/admin/posts/edit/${req.body.id}`)
				}
				newPost.img = `/assets/media/${image.name}`
				save()
			})

		} else {
			save()
		}
	}
}

//Open post edition page - GET route
exports.editPostPage = (req, res) => {
	Post.findOne({ _id: req.params.id }).then(post => {
		//Allow editing by post author only
		if (post.autor.toString() === req.session.user._id) {
			//list the categories in the select field
			Category.find().then(categories => {
				res.render('blog/admin/editpost', { categories: categories, post: post })
			}).catch(err => {
				req.flash('errors', 'Houve um erro ao listar as categorias.')
				return res.redirect('/blog/admin')
			})
		} else {
			req.flash('errors', 'Apenas o autor tem permissão para editar ou excluir a postagem.')
			return res.redirect('/blog/admin')
		}
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao carregar o formulário de edição.')
		return res.redirect('/blog/admin')
	})
}

//Edit post - POST route
exports.editPost = (req, res) => {
	const errors = validatePost(req)
	let image

	if (errors.length > 0) {
		res.render('blog/admin/addpost', { errors: errors })
	} else {
		//If there is a image: Validade and upload before saving
		if (req.files) {
			image = req.files.postImg
			image.name = createSlug(image.name)
			const filePath = path.resolve(process.cwd(), 'public', 'assets', 'media', image.name)

			image.mv(filePath, err => {
				if (err) {
					req.flash('errors', 'Erro ao enviar a imagem!')
					return res.redirect(`/blog/admin/posts/edit/${req.body.id}`)
				}
				image = `/assets/media/${image.name}`
			})

		} else image = null

		//Find the post & update
		Post.findOne({ _id: req.body.id }).then(post => {
			//Allow editing by post author only
			if (post.autor.toString() !== req.session.user._id) {
				req.flash('errors', 'Apenas o autor tem permissão para editar ou excluir a postagem.')
				return res.redirect('/blog/admin')
			} else {
				let prevCategId = post.categoria //Store ID of the previos category

				post.titulo = req.body.title
				post.slug = createSlug(req.body.title)
				if (req.files) post.img = image
				post.conteudo = req.body.content
				post.categoria = req.body.category
				post.resumo = req.body.summary,
				post.autor = req.session.user._id

				post.save().then(() => {
					//Deduct -1 (if > 0) from the number of posts in the previous category
					Category.findOne({ _id: prevCategId }).then(oldCateg => {
						if (oldCateg.num_posts > 0) oldCateg.num_posts -= 1
						oldCateg.save()
					}).catch(err => {
						req.flash('errors', 'Erro ao desvincular da categoria anterior.')
						return res.redirect(`/blog/admin/posts/edit/${req.body.id}`)
					})

					//Add +1 to the number of posts in the chosen category
					Category.findOne({ _id: req.body.category }).then(category => {
						category.num_posts += 1
						category.save()
						req.flash('success', 'Postagem editada com sucesso.')
						return res.redirect('/blog/admin')
					}).catch(err => {
						req.flash('errors', 'Erro ao consultar as categorias.')
						return res.redirect(`/blog/admin/posts/edit/${req.body.id}`)
					})
				}).catch(err => {
					console.log(err)
					req.flash('errors', 'Erro ao editar a postagem.')
					return res.redirect(`/blog/admin/posts/edit/${req.body.id}`)
				})
			}// else - is the author

		}).catch(err => {
			req.flash('errors', 'Erro ao editar a postagem.')
			return res.redirect(`/blog/admin/posts/edit/${req.body.id}`)
		})
	}

}

//POST route - delete post
exports.deletePost = (req, res) => {
	//Deduct -1 (if > 0) from the number of posts in the category
	Post.findOne({ _id: req.body.id }).then(post => {
		//Authors only
		if (post.autor.toString() !== req.session.user._id) {
			req.flash('errors', 'Apenas o autor tem permissão para editar ou excluir a postagem.')
			return res.redirect('/blog/admin')
		} else {
			Category.findOne({ _id: post.categoria }).then(categ => {
				if (categ.num_posts > 0) categ.num_posts -= 1
				categ.save()
				post.remove()
				req.flash('success', 'Postagem deletada com sucesso.')
				return res.redirect('/blog/admin')
			}).catch(err => {
				console.log(err)
				req.flash('errors', 'Houve um erro ao remover a postagem da categoria.')
				return res.redirect('/blog/admin')
			})
		}
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao deletar a postagem.')
		return res.redirect('/blog/admin')
	})

}

//Allows to delete the image from the post edition page
exports.delImg = (req, res) => {
	Post.findOneAndUpdate({ _id: req.params.id }, { img: null }, { returnOriginal: false }).then(() => {
		req.flash('success', 'Imagem excluída.')
		return res.redirect(`/blog/admin/posts/edit/${req.params.id}`)
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao deletar a imagem.')
		return res.redirect(`/blog/admin/posts/edit/${req.params.id}`)
	})
}