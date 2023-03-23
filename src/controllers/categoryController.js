const mongoose = require('mongoose')
require('../models/CategoryModel')
const Category = mongoose.model('categorias')
require('../models/PostModel')
const Post = mongoose.model('postagens')
const { validateCateg, createSlug, stringFilter } = require('../helpers/helpers');

//------------- Categories -------------------
//Open categories edition page
exports.addCateg = (req, res) => {
	res.render('blog/admin/addcategory')
}

//Create new category and slug - POST route
exports.newCateg = (req, res) => {
	const errors = validateCateg(req)
	const cleanName = stringFilter(req.body.name)

	if (errors.length > 0) {
		res.render('blog/admin/addcategory', { errors: errors })
	} else {
		Category.findOne({ nome: cleanName }).collation({ locale: 'pt', strength: 1 }).then(categExists => {
			//No repetitions
			if (categExists) {
				req.flash('errors', 'Categoria já existe.')
				return res.redirect('/blog/admin/categories/add')
			}

			//Can save now
			const newCategory = {
				nome: cleanName,
				slug: createSlug(cleanName)
			}

			new Category(newCategory).save().then(() => {
				req.flash('success', 'Categoria criada com sucesso.')
				res.redirect('/blog/admin')
			}).catch(err => {
				req.flash('errors', 'Erro ao salvar categoria.')
				res.redirect('/blog/admin')
			})

		}).catch(err => {
			req.flash('errors', 'Erro ao consultar as categorias.')
			res.redirect('/blog/admin/categories/add')
		})

	}
}

//Open category edition page - GET route; Avoid edition of default category
exports.editCategPage = (req, res) => {
	Category.findOne({ nome: 'Sem categoria' }).then(cantEdit => {
		if (req.params.id === cantEdit._id.toString()) {
			req.flash('errors', 'Você não pode editar a categoria "Sem categoria"!')
			return res.redirect('/blog/admin')
		}

		Category.findOne({ _id: req.params.id }).then(category => {
			return res.render('blog/admin/editcategory', { category: category })
		}).catch(err => {
			req.flash('errors', 'Essa categoria não existe.')
			return res.redirect('/blog/admin')
		})
	}).catch(err => {
		req.flash('errors', 'Erro ao consultar as categorias.')
		return res.redirect('/blog/admin')
	})
	
}

//Category edition - POST route; avoid repetitions and saving without changes
exports.editCateg = (req, res) => {
	const errors = validateCateg(req)
	const cleanName = stringFilter(req.body.name)

	if (errors.length > 0) {
		res.render('blog/admin/editcategory', { errors: errors })
	} else {
		//Changes needed
		Category.findOne({ _id: req.body.id }).then(category => {
			if (cleanName === category.nome) {
				req.flash('errors', 'Você não fez nenhuma alteração.')
				return res.redirect(`/blog/admin/categories/edit/${req.body.id}`)
			}
			//No repetitions
			Category.findOne({ nome: cleanName }).collation({ locale: 'pt', strength: 1 }).then(match => {
				if (match) {
					req.flash('errors', 'Já existe uma categoria com esse nome.')
					return res.redirect(`/blog/admin/categories/edit/${req.body.id}`)
				}
				//Can save now
				category.nome = cleanName
				category.slug = createSlug(cleanName)

				category.save().then(() => {
					req.flash('success', 'Categoria editada com sucesso.')
					return res.redirect('/blog/admin')
				}).catch(err => {
					req.flash('errors', 'Erro ao editar a categoria.')
					return res.redirect(`/blog/admin/categories/edit/${req.body.id}`)
				})
			}).catch(err => {
				req.flash('errors', 'Erro ao consultar as categorias que já existem.')
				return res.redirect(`/blog/admin/categories/edit/${req.body.id}`)
			})

		}).catch(err => {
			req.flash('errors', 'Erro ao buscar dados da categoria.')
			return res.redirect(`/blog/admin/categories/edit/${req.body.id}`)
		})
	}
}

//Delete categories, avoid deletion of default category and redesignate posts to default (prevent breaking errors)
exports.deleteCateg = (req, res) => {
	//Can't del 'uncategorized'
	Category.findOne({ nome: 'Sem categoria' }).then(cantDel => {
		if (req.body.id === cantDel._id.toString()) {
			req.flash('errors', 'Você não pode deletar a categoria "Sem categoria"!')
			return res.redirect('/blog/admin')
		}
		//Redesignate binded posts and add +1 to the number of posts of the default category
		Post.find({ categoria: req.body.id }).then(postsRel => {
			postsRel.forEach(post => {
				post.categoria = cantDel._id
				cantDel.num_posts += 1
				post.save()
			})
			cantDel.save()
		}).catch(err => {
			req.flash('errors', 'Houve um erro ao consultar as postagens dessa categoria.')
			return res.redirect('/blog/admin')
		})

		//then delete
		Category.deleteOne({ _id: req.body.id }).then(() => {
			req.flash('success', 'Categoria deletada com sucesso.')
			return res.redirect('/blog/admin')
		}).catch(err => {
			req.flash('errors', 'Houve um erro ao deletar a categoria.')
			return res.redirect('/blog/admin')
		})
	}).catch(err => {
		req.flash('errors', 'Houve um erro ao consultar as categorias.')
		return res.redirect('/blog/admin')
	})

}
