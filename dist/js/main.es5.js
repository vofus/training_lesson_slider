'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function () {
	'use strict';

	document.onreadystatechange = function () {
		if (document.readyState === "complete") {
			var Slider = function () {
				function Slider(options) {
					_classCallCheck(this, Slider);

					this.sliderBox = options.sliderBox;
					this.sliderBox.dataset.currentSlide = 1;
					this.initSlider();
				}

				_createClass(Slider, [{
					key: 'detectSize',
					value: function detectSize() {
						var _this = this;

						var promise = new Promise(function (resolve) {
							var slideWidth = 0,
							    slideHeight = 0,
							    sizeArr = [];

							slideWidth = parseInt(window.getComputedStyle(_this.sliderBox, null).getPropertyValue('width'));
							slideHeight = Math.round(slideWidth / 1.7778);

							sizeArr.push(slideWidth);
							sizeArr.push(slideHeight);
							resolve(sizeArr);
						});
						return promise;
					}
				}, {
					key: 'installSize',
					value: function installSize(sizeArr) {
						var slideWidth = sizeArr[0],
						    slideHeight = sizeArr[1];

						var slidesArr = this.sliderBox.getElementsByClassName('slide');
						slidesArr = Array.prototype.slice.call(slidesArr);

						this.sliderBox.style.height = slideHeight + 'px';

						slidesArr.forEach(function (item, index) {
							item.style.width = slideWidth + 'px';
							item.style.height = slideHeight + 'px';
							item.dataset.slide = index + 1;
						});

						// console.log(slideHeight);
						// console.log(slidesArr = Array.prototype.slice.call(slidesArr));

						return slidesArr;
					}
				}, {
					key: 'navArrows',
					value: function navArrows(obj) {
						var _this2 = this;

						var navBtns = document.createElement('div'),
						    nextBtn = document.createElement('span'),
						    prevBtn = document.createElement('span'),
						    slidesArr = obj.slidesArr,
						    bulletsArr = obj.bulletsArr;

						navBtns.classList.add('nav__btns');
						nextBtn.classList.add('nav__btn', 'nav__btn--next');
						prevBtn.classList.add('nav__btn', 'nav__btn--prev');
						nextBtn.dataset.nextSlide = 0;
						prevBtn.dataset.prevSlide = 0;

						navBtns.appendChild(nextBtn);
						navBtns.appendChild(prevBtn);
						this.sliderBox.appendChild(navBtns);

						this.sliderBox.addEventListener('transitionend', function (event) {
							if (event.target.classList.contains('slide')) {
								// console.log(event.target);
							}
						});

						navBtns.addEventListener('click', function (event) {
							if (event.target.classList.contains('nav__btn--next')) {
								_this2.nextSlide(slidesArr, bulletsArr);
							}
							if (event.target.classList.contains('nav__btn--prev')) {
								_this2.prevSlide(slidesArr, bulletsArr);
							}
							return;
						});
					}
				}, {
					key: 'navBullets',
					value: function navBullets(slidesArr) {
						var _this3 = this;

						var bullets = document.createElement('div');

						bullets.classList.add('bullets');

						slidesArr.forEach(function (item, index) {
							var bullet = document.createElement('span');
							bullet.classList.add('bullet');
							bullet.dataset.slide = index + 1;
							bullets.appendChild(bullet);
						});
						this.sliderBox.appendChild(bullets);

						var bulletsArr = this.sliderBox.getElementsByClassName('bullet');
						bulletsArr = Array.prototype.slice.call(bulletsArr);

						bullets.addEventListener('click', function (event) {
							if (event.target.classList.contains('bullet')) {
								var slide = parseInt(event.target.dataset.slide);

								_this3.sliderBox.dataset.currentSlide = slide;
								for (var i = 0; i < slide; i++) {
									slidesArr[i].style.left = '-100%';
								}

								slidesArr[slide - 1].style.left = '0';

								for (var _i = slide; _i < slidesArr.length; _i++) {
									slidesArr[_i].style.left = '100%';
								}

								bulletsArr.forEach(function (item) {
									item.classList.remove('bullet--active');
								});
								bulletsArr[slide - 1].classList.add('bullet--active');
							}
							return;
						});
					}
				}, {
					key: 'moveSlide',
					value: function moveSlide(slidesArr) {
						var _this4 = this;

						var self = this;
						var bulletsArr = document.getElementsByClassName('bullet');

						bulletsArr = Array.prototype.slice.call(bulletsArr);
						slidesArr[0].style.left = '0';
						bulletsArr[0].classList.add('bullet--active');

						var taimer = setInterval(function () {
							_this4.nextSlide(slidesArr, bulletsArr);
						}, 3000);

						this.sliderBox.onmouseover = this.sliderBox.onmouseout = listener;

						function listener(event) {
							if (event.type === 'mouseover') {
								clearInterval(taimer);
								// console.log('Stop taimer!');
							}
							if (event.type === 'mouseout') {
								taimer = setInterval(function () {
									self.nextSlide(slidesArr, bulletsArr);
								}, 3000);
								// console.log('Start taimer!');
							}
						}
						// let obj = {slidesArr: slidesArr, bulletsArr: bulletsArr};
						return { slidesArr: slidesArr, bulletsArr: bulletsArr };
					}
				}, {
					key: 'nextSlide',
					value: function nextSlide(slidesArr, bulletsArr) {
						var index = parseInt(this.sliderBox.dataset.currentSlide);
						var lastIndex = slidesArr.length;

						if (index === lastIndex) {
							this.sliderBox.dataset.currentSlide = 1;
							slidesArr.forEach(function (item) {
								item.style.left = '100%';
							});
							slidesArr[0].style.left = '0';
							bulletsArr[lastIndex - 1].classList.remove('bullet--active');
							bulletsArr[0].classList.add('bullet--active');
							return;
						}
						this.sliderBox.dataset.currentSlide = index + 1;
						slidesArr[index - 1].style.left = '-100%';
						slidesArr[index].style.left = '0';

						bulletsArr.forEach(function (item) {
							item.classList.remove('bullet--active');
						});
						bulletsArr[index].classList.add('bullet--active');
						// console.log('next slide!');
					}
				}, {
					key: 'prevSlide',
					value: function prevSlide(slidesArr, bulletsArr) {
						var _this5 = this;

						var index = parseInt(this.sliderBox.dataset.currentSlide);
						var lastIndex = slidesArr.length;

						if (index === 1) {
							var _ret = function () {
								_this5.sliderBox.dataset.currentSlide = lastIndex;
								var revArr = [];
								slidesArr.forEach(function (item) {
									revArr.unshift(item);
								});
								revArr.forEach(function (item) {
									item.style.left = '-100%';
								});
								slidesArr[lastIndex - 1].style.left = '0';
								bulletsArr[0].classList.remove('bullet--active');
								bulletsArr[lastIndex - 1].classList.add('bullet--active');
								return {
									v: void 0
								};
							}();

							if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
						}
						this.sliderBox.dataset.currentSlide = index - 1;
						slidesArr[index - 1].style.left = '100%';
						slidesArr[index - 2].style.left = '0';

						bulletsArr.forEach(function (item) {
							item.classList.remove('bullet--active');
						});
						bulletsArr[index - 2].classList.add('bullet--active');
						// console.log('prev slide!');
					}
				}, {
					key: 'initSlider',
					value: function initSlider() {
						var _this6 = this;

						this.detectSize().then(function (sizeArr) {
							return _this6.installSize(sizeArr);
						}).then(function (slidesArr) {
							_this6.navBullets(slidesArr);
							var obj = _this6.moveSlide(slidesArr);
							_this6.navArrows(obj);
						});
					}
				}]);

				return Slider;
			}();

			var slider = new Slider({ sliderBox: document.getElementById('mySlider') });
			// console.log(slider);
		}
	};
})();