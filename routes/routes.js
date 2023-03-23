const express = require('express')
const router = express.Router()
const indexController = require('../src/controllers/indexController')
const categoryController = require('../src/controllers/categoryController')
const postsController = require('../src/controllers/postsController')
const guestController = require('../src/controllers/guestController')
const loginAdminController = require('../src/controllers/loginAdminController')
const mainSiteController = require('../src/controllers/mainSiteController')
const { loginRequired, suAdmRequired, catch404, catch404Blog} = require('../src/middlewares/middleware')

//Admin routes - Login, logout see and edit
router.get('/blog/admin/login', loginAdminController.loginForm)
router.post('/blog/admin/login', loginAdminController.login)
router.get('/blog/admin/logout', loginRequired, loginAdminController.logout)
router.get('/blog/admin/user', loginRequired, loginAdminController.userData)
router.post('/blog/admin/user/edit', loginRequired, loginAdminController.userEdit)
router.get('/blog/admin/get_code', loginAdminController.codeGenStart)
router.post('/blog/admin/gen_code', loginAdminController.codeGen)
router.get('/blog/admin/change_pass', loginAdminController.changePassForm)
router.post('/blog/admin/change_pass', loginAdminController.changePass)

//Super User (dev) routes - create admin(editor)
//router.get('/blog/admin/create', suAdmRequired, loginAdminController.createAdmForm)
//router.post('/blog/admin/create', suAdmRequired, loginAdminController.createAdm)

//Admin routes - index
router.get('/blog/admin', loginRequired, indexController.indexAdm)

//admin routes - categories
router.get('/blog/admin/categories', loginRequired, categoryController.addCateg)
router.get('/blog/admin/categories/add', loginRequired, categoryController.addCateg)
router.post('/blog/admin/categories/new', loginRequired, categoryController.newCateg)
router.get('/blog/admin/categories/edit/:id', loginRequired, categoryController.editCategPage)
router.post('/blog/admin/categories/edit', loginRequired, categoryController.editCateg)
router.post('/blog/admin/categories/delete', loginRequired, categoryController.deleteCateg)

//Admin routes - posts
router.get('/blog/admin/posts', loginRequired, postsController.addPostPage)
router.get('/blog/admin/posts/add', loginRequired, postsController.addPostPage)
router.post('/blog/admin/posts/new', loginRequired, postsController.createPost)
router.get('/blog/admin/posts/edit/:id', loginRequired, postsController.editPostPage)
router.post('/blog/admin/posts/edit', loginRequired, postsController.editPost)
router.post('/blog/admin/posts/delete', loginRequired, postsController.deletePost)
router.get('/blog/admin/posts/imgdel/:id', loginRequired, postsController.delImg)

//Guests routes - BLOG
router.get('/blog', guestController.index)
router.get('/blog/posts', guestController.redirect)
router.get('/blog/post/:slug', guestController.readPost)
router.get('/blog/categories/:slug', guestController.categPosts)
router.get('/blog/categories', guestController.redirect)
router.post('/blog/search', guestController.search)

//Guest routes - Landing page
router.get('/', mainSiteController.landingPage)
router.post('/mail', mainSiteController.sendContactMail)

//If route doesn't exist
router.get('/blog/*', catch404Blog)
router.get('/admin/*', catch404Blog)
router.get('*', catch404)


module.exports = router
