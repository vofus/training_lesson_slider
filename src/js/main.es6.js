;(function() {
	'use strict';

	document.onreadystatechange = function () {
		if (document.readyState === "complete") {
	    	class Slider {
				constructor(options) {
					this.sliderBox = options.sliderBox;
					this.sliderBox.dataset.currentSlide = 1;
					this.initSlider();
				}
				detectSize() {
					let promise = new Promise((resolve) => {
						let slideWidth = 0,
							slideHeight = 0,
							sizeArr = [];

						slideWidth = parseInt(window.getComputedStyle(this.sliderBox, null).getPropertyValue('width'));
						slideHeight = Math.round(slideWidth / 1.7778);

						sizeArr.push(slideWidth);
						sizeArr.push(slideHeight);
						resolve(sizeArr);
					});	
					return promise;
				}
				installSize(sizeArr) {
					let slideWidth = sizeArr[0],
						slideHeight = sizeArr[1];

					let slidesArr = this.sliderBox.getElementsByClassName('slide');
					slidesArr = Array.prototype.slice.call(slidesArr);
					
					this.sliderBox.style.height = `${slideHeight}px`;

					slidesArr.forEach((item, index) => {
						item.style.width = `${slideWidth}px`;
						item.style.height = `${slideHeight}px`;
						item.dataset.slide = index + 1;
					});

					// console.log(slideHeight);
					// console.log(slidesArr = Array.prototype.slice.call(slidesArr));

					return slidesArr;
				}
				navArrows(obj) {
					let navBtns = document.createElement('div'),
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

					navBtns.addEventListener('click', (event) => {
						if (event.target.classList.contains('nav__btn--next')) {
							this.nextSlide(slidesArr, bulletsArr);
						}
						if (event.target.classList.contains('nav__btn--prev')) {
							this.prevSlide(slidesArr, bulletsArr);
						}
						return;
					});

				}
				navBullets(slidesArr) {
					let bullets = document.createElement('div');

					bullets.classList.add('bullets');

					slidesArr.forEach((item, index) => {
						let bullet = document.createElement('span');
						bullet.classList.add('bullet');
						bullet.dataset.slide = index + 1;
						bullets.appendChild(bullet);
					});
					this.sliderBox.appendChild(bullets);

					let bulletsArr = this.sliderBox.getElementsByClassName('bullet');
					bulletsArr = Array.prototype.slice.call(bulletsArr);

					bullets.addEventListener('click', (event) => {
						if (event.target.classList.contains('bullet')) {
							let slide = parseInt(event.target.dataset.slide);

							this.sliderBox.dataset.currentSlide = slide;
							for (let i=0; i<slide; i++) {
								slidesArr[i].style.left = '-100%';
							}

							slidesArr[slide-1].style.left = '0';

							for (let i=slide; i<slidesArr.length; i++) {
								slidesArr[i].style.left = '100%';
							}

							bulletsArr.forEach((item) => {
								item.classList.remove('bullet--active');
							});
							bulletsArr[slide-1].classList.add('bullet--active');
						}
						return;
					});
				}
				moveSlide(slidesArr) {
					let self = this;
					let bulletsArr = document.getElementsByClassName('bullet');

					bulletsArr = Array.prototype.slice.call(bulletsArr);
					slidesArr[0].style.left = '0';
					bulletsArr[0].classList.add('bullet--active');

					let taimer = setInterval(() => {
						this.nextSlide(slidesArr, bulletsArr)
					}, 3000);

					this.sliderBox.onmouseover = this.sliderBox.onmouseout = listener;

					function listener(event) {
						if (event.type === 'mouseover') {
							clearInterval(taimer);
							// console.log('Stop taimer!');
						}
						if (event.type === 'mouseout') {
						    taimer = setInterval(() => {
						    	self.nextSlide(slidesArr, bulletsArr)
						    }, 3000);
						    // console.log('Start taimer!');
						}
					}
					// let obj = {slidesArr: slidesArr, bulletsArr: bulletsArr};
					return {slidesArr: slidesArr, bulletsArr: bulletsArr};
				}
				nextSlide(slidesArr, bulletsArr) {
					let index = parseInt(this.sliderBox.dataset.currentSlide);
					let lastIndex = slidesArr.length;

					if (index === lastIndex) {
						this.sliderBox.dataset.currentSlide = 1;
						slidesArr.forEach((item) => {
							item.style.left = '100%';
						});
						slidesArr[0].style.left = '0';
						bulletsArr[lastIndex-1].classList.remove('bullet--active');
						bulletsArr[0].classList.add('bullet--active');
						return;
					}
					this.sliderBox.dataset.currentSlide = index + 1;
					slidesArr[index - 1].style.left = '-100%';
					slidesArr[index].style.left = '0';

					bulletsArr.forEach((item) => {
						item.classList.remove('bullet--active');
					});
					bulletsArr[index].classList.add('bullet--active');
					// console.log('next slide!');
				}
				prevSlide(slidesArr, bulletsArr) {
					let index = parseInt(this.sliderBox.dataset.currentSlide);
					let lastIndex = slidesArr.length;

					if (index === 1) {
						this.sliderBox.dataset.currentSlide = lastIndex;
						let revArr = [];
						slidesArr.forEach((item) => {
							revArr.unshift(item);
						});
						revArr.forEach((item) => {
							item.style.left = '-100%';
						});
						slidesArr[lastIndex - 1].style.left = '0';
						bulletsArr[0].classList.remove('bullet--active');
						bulletsArr[lastIndex - 1].classList.add('bullet--active');
						return;
					}
					this.sliderBox.dataset.currentSlide = index - 1;
					slidesArr[index - 1].style.left = '100%';
					slidesArr[index - 2].style.left = '0';

					bulletsArr.forEach((item) => {
						item.classList.remove('bullet--active');
					});
					bulletsArr[index - 2].classList.add('bullet--active');
					// console.log('prev slide!');
				}
				initSlider() {
					this.detectSize()
						.then(sizeArr => this.installSize(sizeArr))
						.then(slidesArr => {
							this.navBullets(slidesArr);
							let obj = this.moveSlide(slidesArr);
							this.navArrows(obj);
						});
				}
			}

			let slider = new Slider({sliderBox: document.getElementById('mySlider')});
			// console.log(slider);
		}
	}

	

})();