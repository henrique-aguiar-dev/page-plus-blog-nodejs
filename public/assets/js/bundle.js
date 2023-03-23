/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/assets/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/assets/js/main.js":
/*!*******************************!*\
  !*** ./src/assets/js/main.js ***!
  \*******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_menu_scroll_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../modules/menu-scroll.js */ "./src/modules/menu-scroll.js");
/* harmony import */ var _modules_hcarrousel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../modules/hcarrousel.js */ "./src/modules/hcarrousel.js");
/* harmony import */ var _modules_form_validation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../modules/form-validation */ "./src/modules/form-validation.js");




var onLoad = function onLoad() {
  var servicosTop = Math.floor(document.querySelector('.servicos').getBoundingClientRect().top - 100);
  var form = document.querySelector('#form'); //Reload if width has changed

  var initialWidth = window.innerWidth;

  var checkWidthChange = function checkWidthChange() {
    var actualWidth = window.innerWidth;
    actualWidth !== initialWidth ? setTimeout(function () {
      return location.reload();
    }, 0) : false;
  };

  window.addEventListener('resize', checkWidthChange); //SlideDown menu mobile - close on scroll
  //Flags

  var scrolled = false;
  var menuMinimized = false;

  var sizeMenu = function sizeMenu(size) {
    var menuParent = document.querySelector('header');
    var menuMob = document.querySelector('.menu-mobile');
    var fixHeader = document.querySelector('.fix-header');
    var allMenuLinks = document.querySelectorAll('.menu-desktop ul li a');
    var menuMobHeight;
    menuParent.style.transition = '0.5s';
    menuParent.className = "height-".concat(size);
    size === 1 ? menuMobHeight = 70 + 'px' : menuMobHeight = 50 + 'px';
    menuMob.style.top = menuMobHeight;
    size === 2 ? menuMinimized = true : menuMinimized = false;

    if (menuMinimized) {
      fixHeader.style.height = 50 + 'px';
      allMenuLinks.forEach(function (each) {
        return each.style.padding = '10px';
      });
    } else {
      fixHeader.style.height = 70 + 'px';
      allMenuLinks.forEach(function (each) {
        return each.style.padding = '15px 10px';
      });
    }
  };

  var checkMenuSize = function checkMenuSize() {
    if (window.pageYOffset > 50) {
      scrolled = true;
      !menuMinimized ? sizeMenu(2) : false;
    } else {
      scrolled = false;
      menuMinimized ? sizeMenu(1) : false;
    }
  }; //Select proper carousel - desktop or mobile


  var loadCarousel = function loadCarousel() {
    return window.innerWidth >= 540 ? document.querySelector('.carousel-desktop') : document.querySelector('.carousel-mobile');
  };

  var choosedCarousel = loadCarousel(); //create carousel object

  var carousel = {
    slidesContainer: choosedCarousel,
    //container - all slides
    allSlides: choosedCarousel.querySelectorAll('.slide-single'),
    //DOM object w/ each single slide
    bulletsContainer: document.querySelector('.carousel-bullets'),
    //navigation bullets container
    arrowLeft: document.querySelector('#navprev'),
    arrowRight: document.querySelector('#navnext'),
    speed: 500,
    //speed of animation (ms)
    interval: 5000 //interval between slides (ms)

  }; //SlideDown animation - 'servicos' section

  var startServCard = function startServCard(direction) {
    var cardsServ = document.querySelectorAll('.servicos-single');
    var delay = 0;
    var dir;
    if (direction === 'right') dir = "translateX(0)";
    if (direction === 'down') dir = "translateY(0)";

    var slideDown = function slideDown(target) {
      delay += 500;
      setTimeout(function () {
        target.style.visibility = 'visible';
        target.style.transition = "0.5s";
        target.style.transform = dir;
      }, delay);
    };

    cardsServ.forEach(function (each) {
      return slideDown(each);
    });
  }; //On specific scrollY functions


  window.addEventListener('scroll', function () {
    checkMenuSize();
    if (window.innerWidth < 540 && window.pageYOffset > servicosTop + 700) startServCard('right');
    if (navigator.maxTouchPoints === 0 && window.pageYOffset > servicosTop) startServCard('down');
    if (navigator.maxTouchPoints !== 0 && window.pageYOffset > servicosTop - 100) startServCard('down');
  }); //On load functions

  Object(_modules_form_validation__WEBPACK_IMPORTED_MODULE_2__["formValidation"])(form);
  Object(_modules_menu_scroll_js__WEBPACK_IMPORTED_MODULE_0__["initMenuMobile"])();
  checkMenuSize();
  Object(_modules_hcarrousel_js__WEBPACK_IMPORTED_MODULE_1__["carouselBuilder"])(carousel);
};

onLoad();

/***/ }),

/***/ "./src/modules/custom-lib.js":
/*!***********************************!*\
  !*** ./src/modules/custom-lib.js ***!
  \***********************************/
/*! exports provided: scrollTo, show, hide, toggle, sideIn, sideOut, slideUp, slideDown, slideToggle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollTo", function() { return scrollTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "show", function() { return show; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hide", function() { return hide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggle", function() { return toggle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sideIn", function() { return sideIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sideOut", function() { return sideOut; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slideUp", function() { return slideUp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slideDown", function() { return slideDown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slideToggle", function() { return slideToggle; });
//Customized library - JavaScript
// Vanilla JavaScript Scroll to Anchor
// @ https://perishablepress.com/vanilla-javascript-scroll-anchor/

/* (function () {
	scrollTo();
})(); */
function scrollTo() {
  var links = document.querySelectorAll('.scroll');
  links.forEach(function (each) {
    return each.onclick = scrollAnchors;
  });
}

function scrollAnchors(e) {
  var respond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var distanceToTop = function distanceToTop(el) {
    return Math.floor(el.getBoundingClientRect().top);
  };

  e.preventDefault();
  var targetID = respond ? respond.getAttribute('href') : this.getAttribute('href');
  var targetAnchor = document.querySelector(targetID);
  if (!targetAnchor) return;
  var originalTop = distanceToTop(targetAnchor);
  window.scrollBy({
    top: originalTop,
    left: 0,
    behavior: 'smooth'
  });
  var checkIfDone = setInterval(function () {
    var atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;

    if (distanceToTop(targetAnchor) === 0 || atBottom) {
      targetAnchor.tabIndex = '-1';
      targetAnchor.focus();
      window.history.pushState('', '', targetID);
      clearInterval(checkIfDone);
    }
  }, 100);
} //--------------------------------------------------------------------------------
// functions: show(), hide() and toggle()


var show = function show(element) {
  return element.style.display = 'block';
};
var hide = function hide(element) {
  return element.style.display = 'none';
};
var toggle = function toggle(element) {
  if (window.getComputedStyle(element).display === 'block') {
    hide(element);
    return;
  } else show(element);
}; //Slide side-to-side menu

var sideIn = function sideIn(obj, startPos, endPos, speed) {
  obj.animate([{
    width: startPos
  }, {
    width: endPos
  }], speed);
  obj.style.width = endPos;
};
var sideOut = function sideOut(obj, startPos, endPos, speed) {
  obj.animate([{
    width: startPos
  }, {
    width: endPos
  }], speed);
  obj.style.width = endPos;
}; //-----------------------------------------------------------------------------------
//Vanilla JS slideUp, slideDown and slideToggle
//https://gist.github.com/skttl/b8ea597ebf2db66a3e2a06491f7b4029

/* SLIDE UP */

var slideUp = function slideUp(target) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
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
  window.setTimeout(function () {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property'); //alert("!");
  }, duration);
};
/* SLIDE DOWN */

var slideDown = function slideDown(target) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  target.style.removeProperty('display');
  var display = window.getComputedStyle(target).display;
  if (display === 'none') display = 'block';
  target.style.display = display;
  var height = target.offsetHeight;
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
  window.setTimeout(function () {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
};
/* TOGGLE */

var slideToggle = function slideToggle(target) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}; // Specify Element and Duration (milliseconds)

/*
document.querySelector("#button-slide").addEventListener('click', () => {
	slideToggle(document.getElementById("slide"), 1000);
	slideDown(document.getElementById("slide"), 1000);
	slideUp(document.getElementById("slide"), 1000);
})
*/
//------------------------------------------------------------------------------

/***/ }),

/***/ "./src/modules/form-validation.js":
/*!****************************************!*\
  !*** ./src/modules/form-validation.js ***!
  \****************************************/
/*! exports provided: formValidation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formValidation", function() { return formValidation; });
/* harmony import */ var _phonemask__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./phonemask */ "./src/modules/phonemask.js");
 //-----------FORM VALIDATION------------

var formValidation = function formValidation(form) {
  var inputPhone = form.querySelector('#fone');

  var loadMask = function loadMask() {
    var phoneMask = new _phonemask__WEBPACK_IMPORTED_MODULE_0__["default"](inputPhone);
    phoneMask.mask();
  };

  loadMask();
  inputPhone.addEventListener('focusin', function (e) {
    return e.target.placeholder = '(__)____-____';
  });
  inputPhone.addEventListener('focusout', function (e) {
    return e.target.placeholder = 'Telefone p/ contato...';
  });
  inputPhone.addEventListener('paste', function (event) {
    return event.preventDefault();
  }); //Disable Enter key on form inputs

  document.querySelectorAll('input:not(textarea)').forEach(function (input) {
    input.addEventListener('keydown', function (event) {
      if (event.key == "Enter") {
        event.preventDefault();
      }

      ;
    });
  });
};

/***/ }),

/***/ "./src/modules/hcarrousel.js":
/*!***********************************!*\
  !*** ./src/modules/hcarrousel.js ***!
  \***********************************/
/*! exports provided: carouselBuilder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "carouselBuilder", function() { return carouselBuilder; });
var carouselBuilder = function carouselBuilder(carousel) {
  //Global variables
  var slidesContainer = carousel.slidesContainer;
  var allSlides = carousel.allSlides; //Original slides

  var numOfSlides = allSlides.length;
  var allSlidesFull = slidesContainer.children; //Clones included - firsl - last

  var navNext = carousel.arrowRight;
  var navPrev = carousel.arrowLeft;
  var speed = carousel.speed;
  var timeToChange = carousel.interval;
  var swipeLimit = Math.floor(window.innerWidth * 0.4);
  var allBullets;
  var actualSlide = 0;
  var autoSlideOn = false;
  var autoSlideInterval;
  var clicked = false;
  var mouseTouchDown = false;
  var x1;
  var x2;

  var setTransition = function setTransition() {
    return slidesContainer.style.transition = "".concat(speed, "ms");
  };

  var removeTransition = function removeTransition() {
    return slidesContainer.style.transition = 'unset';
  }; //Calculate width and hide overflow


  var setWidthAndShow = function setWidthAndShow() {
    slidesContainer.style.width = "calc(100% * ".concat(numOfSlides + 2, ")");
    slidesContainer.parentElement.style.overflow = 'hidden';
  }; //Nav bullets - create and change--------------------


  var createBullets = function createBullets(numOfSlides) {
    var bulletsBox = carousel.bulletsContainer;

    for (var i = 0; i < numOfSlides; i++) {
      var span = document.createElement('span');
      var bullet = bulletsBox.appendChild(span);
      bullet.className = 'bullet';
    }

    document.querySelector('.bullet').classList.add('active');
  };

  var changeBullet = function changeBullet(nextSlide) {
    if (nextSlide === numOfSlides) nextSlide = 0;
    allBullets.forEach(function (each) {
      return each.classList.remove('active');
    });
    allBullets[nextSlide].classList.add('active');
  }; //Main slider functions - movement


  var moveCarousel = function moveCarousel(nextSlide) {
    var next;

    if (nextSlide != actualSlide) {
      next = allSlides[nextSlide].offsetLeft;
      setTransition();
      slidesContainer.style.transform = "translateX(-".concat(next, "px)");
      actualSlide = nextSlide;
      setTimeout(function () {
        return removeTransition();
      }, speed);
    }

    changeBullet(actualSlide);
  }; //Reset and repositioning - infinite


  var startPosition = function startPosition() {
    return slidesContainer.style.transform = "translateX(-".concat(allSlides[0].offsetLeft, "px)");
  };

  var endPosition = function endPosition() {
    return slidesContainer.style.transform = "translateX(-".concat(allSlides[numOfSlides - 1].offsetLeft, "px)");
  };

  var resetCarousel = function resetCarousel(nextSlide) {
    setTransition();

    if (nextSlide >= 0) {
      slidesContainer.style.transform = "translateX(-".concat(allSlidesFull[nextSlide + 1].offsetLeft, "px)");
      actualSlide = 0;
      setTimeout(function () {
        removeTransition();
        startPosition();
      }, speed);
    }

    if (nextSlide < 0) {
      slidesContainer.style.transform = "translateX(-".concat(allSlidesFull[nextSlide + 1].offsetLeft, "px)");
      actualSlide = numOfSlides - 1;
      setTimeout(function () {
        removeTransition();
        endPosition();
      }, speed);
    }

    changeBullet(actualSlide);
  }; //Create clones - 1st and last slides


  var duplicate = function duplicate() {
    var cloneFirst = allSlides[0].cloneNode(true);
    var cloneLast = allSlides[numOfSlides - 1].cloneNode(true);
    slidesContainer.appendChild(cloneFirst);
    slidesContainer.prepend(cloneLast);
    startPosition();
  }; //Auto-slide - no mouseover, no click


  var moveAutoSlide = function moveAutoSlide() {
    var nextSlide = actualSlide + 1;

    if (nextSlide === numOfSlides) {
      resetCarousel(nextSlide);
      nextSlide = 0;
    } else {
      moveCarousel(nextSlide);
    }
  };

  var startAutoSlide = function startAutoSlide() {
    if (!autoSlideOn) {
      autoSlideInterval = setInterval(moveAutoSlide, timeToChange);
      autoSlideOn = true;
    }

    return;
  };

  var stopAutoSlide = function stopAutoSlide() {
    if (autoSlideOn) {
      clearInterval(autoSlideInterval);
      autoSlideOn = false;
    }

    return;
  }; //Slide grab & swiper - mouse and touchscreen


  var defineX1 = function defineX1(e) {
    return navigator.maxTouchPoints != 0 && e.changedTouches ? x1 = e.changedTouches[0].pageX : x1 = e.pageX;
  };

  var defineX2 = function defineX2(e) {
    return navigator.maxTouchPoints != 0 && e.changedTouches ? x2 = e.changedTouches[0].pageX : x2 = e.pageX;
  };

  var initSlideSwipe = function initSlideSwipe() {
    if (x1 < x2 && x2 - x1 >= swipeLimit) {
      var nextSlide = actualSlide - 1;
      actualSlide > 0 ? moveCarousel(nextSlide) : resetCarousel(nextSlide);
      clicked = true; //avoid click while swiping

      setTimeout(function () {
        return clicked = false;
      }, speed);
    } else if (x1 > x2 && x1 - x2 >= swipeLimit) {
      var _nextSlide = actualSlide + 1;

      actualSlide < numOfSlides - 1 ? moveCarousel(_nextSlide) : resetCarousel(_nextSlide);
      clicked = true; //avoid click while swiping

      setTimeout(function () {
        return clicked = false;
      }, speed);
    } else return;
  };

  var drag = function drag(event) {
    return slidesContainer.style.transform += "translateX(".concat(event.movementX, "px)");
  };

  var grab = function grab() {
    return mouseTouchDown ? slidesContainer.addEventListener('mousemove', drag) : false;
  };

  var unGrab = function unGrab() {
    slidesContainer.removeEventListener('mousemove', drag);
    var prevPos = allSlides[actualSlide].offsetLeft;
    setTransition();
    !mouseTouchDown && Math.abs(x2 - x1) < swipeLimit ? slidesContainer.style.transform = "translateX(-".concat(prevPos, "px)") : false;
    setTimeout(function () {
      return removeTransition();
    }, speed);
  }; //Event listeners


  var listenNavArrows = function listenNavArrows() {
    allBullets = Array.from(document.querySelectorAll('.bullet'));
    allBullets.forEach(function (thisBullet) {
      thisBullet.addEventListener('click', function (event) {
        autoSlideOn ? stopAutoSlide() : false;
        var nextSlide = allBullets.indexOf(event.target);
        moveCarousel(nextSlide);
      });
    });
    navNext.addEventListener('click', function () {
      if (clicked) return;
      autoSlideOn ? stopAutoSlide() : false;
      var nextSlide = actualSlide + 1;
      actualSlide < numOfSlides - 1 ? moveCarousel(nextSlide) : resetCarousel(nextSlide);
      clicked = true;
      setTimeout(function () {
        return clicked = false;
      }, speed);
    });
    navPrev.addEventListener('click', function () {
      if (clicked) return;
      autoSlideOn ? stopAutoSlide() : false;
      var nextSlide = actualSlide - 1;
      actualSlide > 0 ? moveCarousel(nextSlide) : resetCarousel(nextSlide);
      clicked = true;
      setTimeout(function () {
        return clicked = false;
      }, speed);
    });
  };

  if (navigator.maxTouchPoints === 0) {
    slidesContainer.parentElement.addEventListener('mouseenter', stopAutoSlide);
    slidesContainer.parentElement.addEventListener('mouseleave', function (e) {
      startAutoSlide();

      if (mouseTouchDown) {
        defineX2(e);
        initSlideSwipe();
        mouseTouchDown = false;
        unGrab();
      }
    }); //carousel.bulletsContainer.addEventListener('mouseenter', stopAutoSlide)
    //carousel.bulletsContainer.addEventListener('mouseleave', startAutoSlide)

    slidesContainer.addEventListener('mousedown', function (e) {
      mouseTouchDown = true;
      defineX1(e);
      grab();
    });
    slidesContainer.addEventListener('mouseup', function (e) {
      defineX2(e);
      initSlideSwipe();
      mouseTouchDown = false;
      unGrab();
    });
  } else {
    slidesContainer.addEventListener('touchstart', function (e) {
      stopAutoSlide();
      mouseTouchDown = true;
      defineX1(e);
      grab();
    });
    slidesContainer.addEventListener('touchend', function (e) {
      defineX2(e);
      initSlideSwipe();
      mouseTouchDown = false;
      unGrab();
      startAutoSlide();
    });
  } //Starting main functions


  setWidthAndShow();
  createBullets(numOfSlides);
  listenNavArrows();
  duplicate();
  startAutoSlide();
};

/***/ }),

/***/ "./src/modules/menu-scroll.js":
/*!************************************!*\
  !*** ./src/modules/menu-scroll.js ***!
  \************************************/
/*! exports provided: initMenuMobile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initMenuMobile", function() { return initMenuMobile; });
/* harmony import */ var _custom_lib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./custom-lib.js */ "./src/modules/custom-lib.js");
//--------------MENU SCROLL--------------------

var initMenuMobile = function initMenuMobile() {
  var menuMobile = document.querySelector(".menu-mobile");
  var speed = 400;
  var delay = speed * 1.1; //re-click allowed after: speed + 10%

  var menuDown = false; //down = true; up = false

  var clicked = true;
  document.querySelector('.icon-menu-mob').addEventListener('click', function () {
    while (clicked) {
      if (!menuDown) {
        Object(_custom_lib_js__WEBPACK_IMPORTED_MODULE_0__["slideDown"])(menuMobile, speed);
        menuDown = true;
      } else {
        Object(_custom_lib_js__WEBPACK_IMPORTED_MODULE_0__["slideUp"])(menuMobile, speed);
        menuDown = false;
      }

      clicked = false;
      setTimeout(function () {
        return clicked = true;
      }, delay);
    }
  });
  document.querySelector('body,html').addEventListener('click', function () {
    while (clicked) {
      if (menuDown) {
        Object(_custom_lib_js__WEBPACK_IMPORTED_MODULE_0__["slideUp"])(menuMobile, speed);
        menuDown = false;
      }

      clicked = false;
      setTimeout(function () {
        return clicked = true;
      }, delay);
    }
  });
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0 && menuDown) {
      Object(_custom_lib_js__WEBPACK_IMPORTED_MODULE_0__["slideUp"])(menuMobile, speed);
      menuDown = false;
    }
  });
}; //End initMenuMobile

/***/ }),

/***/ "./src/modules/phonemask.js":
/*!**********************************!*\
  !*** ./src/modules/phonemask.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Mask; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//Máscara para formulários de telefone (fixo é móvel - BR)
var Mask = /*#__PURE__*/function () {
  function Mask(input) {
    _classCallCheck(this, Mask);

    this.input = input;
  } //Número mais longo - móvel


  _createClass(Mask, [{
    key: "_mobileNumber",
    value: function _mobileNumber() {
      var num = this.input.value.replace('-', '');
      this.input.pattern = '[(]{1}[0-9]{2}[)]{1}[0-9]{5}[-]{1}[0-9]{4}';
      this.input.value = "".concat(num.slice(0, 9), "-").concat(num.slice(9, 13));
    } //Inserir padrão, parênteses e hífen (telefone fixo)

  }, {
    key: "mask",
    value: function mask() {
      var _this = this;

      this.input.addEventListener('input', function (e) {
        isNaN(e.data) || e.data === null || e.data === ' ' ? _this.input.value = _this.input.value.slice(0, -1) : false;
        var numberSize = _this.input.value.length;
        if (numberSize <= 13) _this.input.pattern = '[(]{1}[0-9]{2}[)]{1}[0-9]{4}[-]{1}[0-9]{4}';
        if (numberSize === 1) _this.input.value = "(".concat(_this.input.value);
        if (numberSize === 3) _this.input.value += ')';
        if (numberSize === 8 || numberSize === 9 && _this.input.value[8] !== '-') _this.input.value += '-';
        if (numberSize === 14) _this._mobileNumber(); //Número extra - telefone móvel
      });
    }
  }]);

  return Mask;
}();



/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map