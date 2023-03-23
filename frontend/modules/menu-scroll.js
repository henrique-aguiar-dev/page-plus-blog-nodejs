//--------------MENU SCROLL--------------------
import { slideDown, slideUp } from './custom-lib.js';

export const initMenuMobile = (clickTarget, scrollTarget) => {
	const speed = 400;
	const delay = speed * 1.1; //re-click allowed after: speed + 10%
	let menuDown = false; //down = true; up = false
	let clicked = true;

	clickTarget.addEventListener('click', () => {
		while (clicked) {
			if (!menuDown) {
				slideDown(scrollTarget, speed);
				menuDown = true;
			} else {
				slideUp(scrollTarget, speed);
				menuDown = false;
			}
			clicked = false;
			setTimeout(() => clicked = true, delay);
		}
	});

	document.querySelector('body,html').addEventListener('click', e => {
		//customization for Odonto - blog project-------
		let parentsClass = e.target.parentElement.className
		if (parentsClass === 'search-box search-mobile' || parentsClass === 'search-form') return
		//----------------------------------------------
		while (clicked) {
			if (menuDown) {
				slideUp(scrollTarget, speed);
				menuDown = false;
			}
			clicked = false;
			setTimeout(() => clicked = true, delay);
		}
	})

	window.addEventListener('scroll', () => {
		if (window.scrollY > 0 && menuDown) {
			slideUp(scrollTarget, speed);
			menuDown = false;
		}
	})

}//End initMenuMobile

