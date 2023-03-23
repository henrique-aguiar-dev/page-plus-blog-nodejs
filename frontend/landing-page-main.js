import { initMenuMobile } from '../../modules/menu-scroll.js'
import { carouselBuilder } from '../../modules/hcarrousel.js'
import { formValidation } from '../../modules/form-validation'

const onLoad = () => {
	const servicosTop = Math.floor(document.querySelector('.servicos').getBoundingClientRect().top - 100)
	const form = document.querySelector('#form')
	const openMobile = document.querySelector('.fa-bars')
	const menuMobile = document.querySelector(".menu-mobile");

	//Reload if width has changed
	const initialWidth = window.innerWidth

	const checkWidthChange = () => {
		let actualWidth = window.innerWidth
		actualWidth !== initialWidth ? setTimeout(() => location.reload(), 0) : false
	}

	window.addEventListener('resize', checkWidthChange)

	//SlideDown menu mobile - close on scroll
	//Flags
	let scrolled = false;
	let menuMinimized = false;

	const sizeMenu = size => {
		const menuParent = document.querySelector('header')
		const menuMob = document.querySelector('.menu-mobile')
		const fixHeader = document.querySelector('.fix-header')
		const allMenuLinks = document.querySelectorAll('.menu-desktop ul li a')
		let menuMobHeight

		menuParent.style.transition = '0.5s'
		menuParent.className = `height-${size}`
		size === 1 ? menuMobHeight = 70 + 'px' : menuMobHeight = 50 + 'px'
		menuMob.style.top = menuMobHeight
		size === 2 ? menuMinimized = true : menuMinimized = false

		if (menuMinimized) {
			fixHeader.style.height = 50 + 'px'
			allMenuLinks.forEach(each => each.style.padding = '10px')
		} else {
			fixHeader.style.height = 70 + 'px'
			allMenuLinks.forEach(each => each.style.padding = '15px 10px')
		}
	}

	const checkMenuSize = () => {
		if (window.pageYOffset > 50) {
			scrolled = true;
			!menuMinimized ? sizeMenu(2) : false;
		} else {
			scrolled = false;
			menuMinimized ? sizeMenu(1) : false;
		}
	}

	//Select proper carousel - desktop or mobile
	const loadCarousel = () => {
		return window.innerWidth >= 540 ? document.querySelector('.carousel-desktop') : document.querySelector('.carousel-mobile')
	}

	const choosedCarousel = loadCarousel()

	//create carousel object
	const carousel = {
		slidesContainer: choosedCarousel, //container - all slides
		allSlides: choosedCarousel.querySelectorAll('.slide-single'), //DOM object w/ each single slide
		bulletsContainer: document.querySelector('.carousel-bullets'), //navigation bullets container
		arrowLeft: document.querySelector('#navprev'),
		arrowRight: document.querySelector('#navnext'),
		speed: 500, //speed of animation (ms)
		interval: 5000 //interval between slides (ms)
	}

	//SlideDown animation - 'servicos' section
	const startServCard = direction => {
		const cardsServ = document.querySelectorAll('.servicos-single')
		let delay = 0
		let dir

		if (direction === 'right') dir = `translateX(0)`
		if (direction === 'down') dir = `translateY(0)`

		const slideDown = target => {
			delay += 500
			setTimeout(() => {
				target.style.visibility = 'visible'
				target.style.transition = `0.5s`
				target.style.transform = dir
			}, delay)
		}

		cardsServ.forEach(each => slideDown(each))
	}

	//On specific scrollY functions
	window.addEventListener('scroll', () => {
		checkMenuSize()
		if (window.innerWidth < 540 && window.pageYOffset > (servicosTop + 700)) startServCard('right')
		if (navigator.maxTouchPoints === 0 && window.pageYOffset > servicosTop) startServCard('down')
		if (navigator.maxTouchPoints !== 0 && window.pageYOffset > (servicosTop - 100)) startServCard('down')
	})

	//On load functions
	formValidation(form);
	initMenuMobile(openMobile, menuMobile)
	checkMenuSize()
	carouselBuilder(carousel)
}

onLoad();
