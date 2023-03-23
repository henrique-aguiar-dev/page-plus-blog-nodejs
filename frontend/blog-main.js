import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { initMenuMobile } from './modules/menu-scroll.js'

const onLoad = () => {
	const openMobile = document.querySelector('.fa-bars')
	const menuMob = document.querySelector(".menu-mobile");
	const openSearch = document.querySelector(".fa-search");
	const searchField = document.querySelector(".search-mobile");
	let scrolled = false;
	let menuMinimized = false;

	const sizeMenu = size => {
		const menuParent = document.querySelector('header')
		const fixHeader = document.querySelector('.fix-header')
		const allMenuLinks = document.querySelectorAll('.menu-desktop ul li a')
		let menuMobHeight

		menuParent.style.transition = '0.5s'
		menuParent.className = `height-${size}`
		size === 1 ? menuMobHeight = 70 + 'px' : menuMobHeight = 50 + 'px'
		menuMob.style.top = menuMobHeight
		if (searchField) searchField.style.top = menuMobHeight
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
			scrolled = true
			!menuMinimized ? sizeMenu(2) : false
		} else {
			scrolled = false
			menuMinimized ? sizeMenu(1) : false
		}
	}

	//On specific scrollY functions
	window.addEventListener('scroll', () => checkMenuSize())

	//Listen delete buttons
	const initMiniModal = () => {
		const btnDel = document.querySelectorAll('.open-confirm')
		const closeAbort = document.querySelectorAll('.close-abort')

		if (btnDel) {
			btnDel.forEach(eachBtn => {
				eachBtn.addEventListener('click', () => {
					let confirm = eachBtn.parentElement.querySelector('.confirm-del')
					confirm.parentElement.style.position = 'relative'
					confirm.style.display = 'block'
				})
			})

			closeAbort.forEach(eachClose => {
				eachClose.addEventListener('click', () => {
					eachClose.parentElement.style.display = 'none'
				})
			})
		}
	}

	const inputToken = document.querySelector('.input-token')

	if (inputToken) {
		inputToken.addEventListener('input', () => {
			if(inputToken.value.length > 6) inputToken.value = inputToken.value.slice(0, -1)
		})
	}


	initMenuMobile(openMobile, menuMob)
	if (openSearch && searchField) initMenuMobile(openSearch, searchField)
	checkMenuSize()
	initMiniModal()
}

onLoad()
