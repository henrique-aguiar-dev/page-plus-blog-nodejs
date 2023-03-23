//Customized library - JavaScript


// Vanilla JavaScript Scroll to Anchor
// @ https://perishablepress.com/vanilla-javascript-scroll-anchor/

/* (function () {
	scrollTo();
})(); */

export function scrollTo() {
	const links = document.querySelectorAll('.scroll');
	links.forEach(each => (each.onclick = scrollAnchors));
}

function scrollAnchors(e, respond = null) {
	const distanceToTop = el => Math.floor(el.getBoundingClientRect().top);
	e.preventDefault();
	var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
	const targetAnchor = document.querySelector(targetID);
	if (!targetAnchor) return;
	const originalTop = distanceToTop(targetAnchor);
	window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
	const checkIfDone = setInterval(function () {
		const atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
		if (distanceToTop(targetAnchor) === 0 || atBottom) {
			targetAnchor.tabIndex = '-1';
			targetAnchor.focus();
			window.history.pushState('', '', targetID);
			clearInterval(checkIfDone);
		}
	}, 100);
}

//--------------------------------------------------------------------------------
// functions: show(), hide() and toggle()
export const show = element => element.style.display = 'block';

export const hide = element => element.style.display = 'none';

export const toggle = element => {
	if (window.getComputedStyle(element).display === 'block') {
		hide(element);
		return;
	} else show(element);
}

//Slide side-to-side menu
export const sideIn = (obj, startPos, endPos, speed) => {
	obj.animate([{ width: startPos }, { width: endPos }], speed);
	obj.style.width = endPos;
}

export const sideOut = (obj, startPos, endPos, speed) => {
	obj.animate([{ width: startPos }, { width: endPos }], speed);
	obj.style.width = endPos;
}


//-----------------------------------------------------------------------------------
//Vanilla JS slideUp, slideDown and slideToggle
//https://gist.github.com/skttl/b8ea597ebf2db66a3e2a06491f7b4029

/* SLIDE UP */
export const slideUp = (target, duration = 500) => {

	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		//alert("!");
	}, duration);
}

/* SLIDE DOWN */
export const slideDown = (target, duration = 500) => {

	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none') display = 'block';
	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}

/* TOGGLE */
export const slideToggle = (target, duration = 500) => {
	if (window.getComputedStyle(target).display === 'none') {
		return slideDown(target, duration);
	} else {
		return slideUp(target, duration);
	}
}



// Specify Element and Duration (milliseconds)
/*
document.querySelector("#button-slide").addEventListener('click', () => {
	slideToggle(document.getElementById("slide"), 1000);
	slideDown(document.getElementById("slide"), 1000);
	slideUp(document.getElementById("slide"), 1000);
})
*/

//------------------------------------------------------------------------------
