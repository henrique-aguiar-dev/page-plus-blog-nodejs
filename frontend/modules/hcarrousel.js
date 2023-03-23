export const carouselBuilder = carousel => {
	//Global variables
	const slidesContainer = carousel.slidesContainer
	const allSlides = carousel.allSlides //Original slides
	const numOfSlides = allSlides.length
	const allSlidesFull = slidesContainer.children //Clones included - firsl - last
	const navNext = carousel.arrowRight
	const navPrev = carousel.arrowLeft
	const speed = carousel.speed
	const timeToChange = carousel.interval
	const swipeLimit = Math.floor(window.innerWidth * 0.4)
	let allBullets
	let actualSlide = 0
	let autoSlideOn = false
	let autoSlideInterval
	let clicked = false
	let mouseTouchDown = false
	let x1
	let x2

	const setTransition = () => slidesContainer.style.transition = `${speed}ms`
	const removeTransition = () => slidesContainer.style.transition = 'unset'

	//Calculate width and hide overflow
	const setWidthAndShow = () => {
		slidesContainer.style.width = `calc(100% * ${numOfSlides + 2})`
		slidesContainer.parentElement.style.overflow = 'hidden'
	}

	//Nav bullets - create and change--------------------
	const createBullets = numOfSlides => {
		const bulletsBox = carousel.bulletsContainer
		for (let i = 0; i < numOfSlides; i++) {
			const span = document.createElement('span')
			const bullet = bulletsBox.appendChild(span)
			bullet.className = 'bullet'
		}

		document.querySelector('.bullet').classList.add('active')
	}

	const changeBullet = nextSlide => {
		if (nextSlide === numOfSlides) nextSlide = 0
		allBullets.forEach(each => each.classList.remove('active'))
		allBullets[nextSlide].classList.add('active')
	}

	//Main slider functions - movement
	const moveCarousel = nextSlide => {
		let next

		if (nextSlide != actualSlide) {
			next = allSlides[nextSlide].offsetLeft
			setTransition()
			slidesContainer.style.transform = `translateX(-${next}px)`
			actualSlide = nextSlide
			setTimeout(() => removeTransition(), speed)
		}

		changeBullet(actualSlide)
	}

	//Reset and repositioning - infinite
	const startPosition = () => slidesContainer.style.transform = `translateX(-${allSlides[0].offsetLeft}px)`
	const endPosition = () => slidesContainer.style.transform = `translateX(-${allSlides[numOfSlides - 1].offsetLeft}px)`

	const resetCarousel = nextSlide => {
		setTransition()

		if (nextSlide >= 0) {
			slidesContainer.style.transform = `translateX(-${allSlidesFull[nextSlide + 1].offsetLeft}px)`
			actualSlide = 0
			setTimeout(() => {
				removeTransition()
				startPosition()
			}, speed)
		}

		if (nextSlide < 0) {
			slidesContainer.style.transform = `translateX(-${allSlidesFull[nextSlide + 1].offsetLeft}px)`
			actualSlide = numOfSlides - 1
			setTimeout(() => {
				removeTransition()
				endPosition()
			}, speed)
		}

		changeBullet(actualSlide)
	}

	//Create clones - 1st and last slides
	const duplicate = () => {
		let cloneFirst = allSlides[0].cloneNode(true)
		let cloneLast = allSlides[numOfSlides - 1].cloneNode(true)
		slidesContainer.appendChild(cloneFirst)
		slidesContainer.prepend(cloneLast)
		startPosition()
	}

	//Auto-slide - no mouseover, no click
	const moveAutoSlide = () => {
		let nextSlide = actualSlide + 1

		if (nextSlide === numOfSlides) {
			resetCarousel(nextSlide)
			nextSlide = 0
		} else {
			moveCarousel(nextSlide)
		}
	}

	const startAutoSlide = () => {
		if (!autoSlideOn) {
			autoSlideInterval = setInterval(moveAutoSlide, timeToChange)
			autoSlideOn = true
		}
		return
	}

	const stopAutoSlide = () => {
		if (autoSlideOn) {
			clearInterval(autoSlideInterval)
			autoSlideOn = false
		}
		return
	}


	//Slide grab & swiper - mouse and touchscreen
	const defineX1 = e => navigator.maxTouchPoints != 0 && e.changedTouches ? x1 = e.changedTouches[0].pageX : x1 = e.pageX

	const defineX2 = e => navigator.maxTouchPoints != 0 && e.changedTouches ? x2 = e.changedTouches[0].pageX : x2 = e.pageX

	const initSlideSwipe = () => {
		if (x1 < x2 && (x2 - x1) >= swipeLimit) {
			let nextSlide = actualSlide - 1
			actualSlide > 0 ? moveCarousel(nextSlide) : resetCarousel(nextSlide)
			clicked = true //avoid click while swiping
			setTimeout(() => clicked = false, speed)
		} else if (x1 > x2 && (x1 - x2) >= swipeLimit) {
			let nextSlide = actualSlide + 1
			actualSlide < numOfSlides - 1 ? moveCarousel(nextSlide) : resetCarousel(nextSlide)
			clicked = true //avoid click while swiping
			setTimeout(() => clicked = false, speed)
		} else return;
	}

	const drag = event => slidesContainer.style.transform += `translateX(${event.movementX}px)`

	const grab = () => mouseTouchDown ? slidesContainer.addEventListener('mousemove', drag) : false

	const unGrab = () => {
		slidesContainer.removeEventListener('mousemove', drag)
		let prevPos = allSlides[actualSlide].offsetLeft
		setTransition()
		!mouseTouchDown && Math.abs(x2 - x1) < swipeLimit ? slidesContainer.style.transform = `translateX(-${prevPos}px)` : false
		setTimeout(() => removeTransition(), speed)
	}

	//Event listeners
	const listenNavArrows = () => {
		allBullets = Array.from(document.querySelectorAll('.bullet'));

		allBullets.forEach(thisBullet => {
			thisBullet.addEventListener('click', event => {
				autoSlideOn ? stopAutoSlide() : false
				let nextSlide = allBullets.indexOf(event.target)
				moveCarousel(nextSlide)
			})
		})

		navNext.addEventListener('click', () => {
			if (clicked) return
			autoSlideOn ? stopAutoSlide() : false
			let nextSlide = actualSlide + 1
			actualSlide < numOfSlides - 1 ? moveCarousel(nextSlide) : resetCarousel(nextSlide)
			clicked = true
			setTimeout(() => clicked = false, speed)
		})

		navPrev.addEventListener('click', () => {
			if (clicked) return
			autoSlideOn ? stopAutoSlide() : false
			let nextSlide = actualSlide - 1
			actualSlide > 0 ? moveCarousel(nextSlide) : resetCarousel(nextSlide)
			clicked = true
			setTimeout(() => clicked = false, speed)
		})
	}

	if (navigator.maxTouchPoints === 0) {
		slidesContainer.parentElement.addEventListener('mouseenter', stopAutoSlide)
		slidesContainer.parentElement.addEventListener('mouseleave', e => {
			startAutoSlide()
			if (mouseTouchDown) {
				defineX2(e)
				initSlideSwipe()
				mouseTouchDown = false
				unGrab()
			}
		})
		//carousel.bulletsContainer.addEventListener('mouseenter', stopAutoSlide)
		//carousel.bulletsContainer.addEventListener('mouseleave', startAutoSlide)

		slidesContainer.addEventListener('mousedown', e => {
			mouseTouchDown = true
			defineX1(e)
			grab()
		})

		slidesContainer.addEventListener('mouseup', e => {
			defineX2(e)
			initSlideSwipe()
			mouseTouchDown = false
			unGrab()
		})
	} else {
		slidesContainer.addEventListener('touchstart', e => {
			stopAutoSlide()
			mouseTouchDown = true
			defineX1(e)
			grab()
		})

		slidesContainer.addEventListener('touchend', e => {
			defineX2(e)
			initSlideSwipe()
			mouseTouchDown = false
			unGrab()
			startAutoSlide()
		})
	}

	//Starting main functions
	setWidthAndShow()
	createBullets(numOfSlides)
	listenNavArrows()
	duplicate()
	startAutoSlide()
}