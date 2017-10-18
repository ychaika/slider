"use strict";

document.addEventListener("DOMContentLoaded", function() {

    var imgList = [
        {
            "id": 0,
            "src" : "./img/slide-1.jpg"
        },
        {
            "id": 1,
            "src" : "./img/slide-2.jpg"
        },
        {
            "id": 2,
            "src" : "./img/slide-3.jpg"
        },
        {
            "id": 3,
            "src" : "./img/slide-4.jpg"
        },
        {
            "id": 4,
            "src" : "./img/slide-5.jpg"
        },
        {
            "id": 5,
            "src" : "./img/slide-6.jpg"
        }
    ];

    function MySlider() {
        var slider,
            sliderItems,
            sliderTrack = document.getElementsByClassName("js-slider-track")[0],
            sliderBody = document.getElementsByClassName("js-slider-body")[0],
            curSlide = 0,
            slidesCount,
            moved,
            self = this,
            autoMove;

        this.autoSpeed = 4000;
        this.arrows = true;
        this.dots = true;
        this.init = function(DOMAINName, imagePathList) {
            createSlides(imagePathList);
            slider = document.getElementsByClassName(DOMAINName)[0];
            sliderItems = document.getElementsByClassName("js-slider-item");
            slidesCount = sliderItems.length;
            moved = -sliderItems[0].offsetWidth;
            sliderTrack.style.minWidth =  sliderItems[0].offsetWidth * (slidesCount + 1) + "px";

            mathWidth();
            countItems();
            addItems();
            if(this.dots === true) {
                addDots();
            }
            sliderMove();
            setPos(true);
            activeDot();
            if(this.arrows === true) {
                addArrows();
            }

            slider.addEventListener("mouseenter", function () {
                clearInterval(autoMove);
            });

            slider.addEventListener("mouseleave", function () {
                sliderMove();
            });
        };

        function createSlides (imagePathList) {
            for(var i = 0; i < imagePathList.length; i++) {
                var newSlide = document.createElement("div");
                var slideInner = document.createElement("div");
                var slideImg = document.createElement("img");
                newSlide.className = "slider-item js-slider-item";
                slideInner.className = "slider-item-inner";
                slideImg.setAttribute("src", imagePathList[i]["src"]);
                slideInner.appendChild(slideImg);
                newSlide.appendChild(slideInner);
                sliderTrack.appendChild(newSlide);
            }
        }

        function mathWidth () {
            var wholeItems = Math.floor(sliderBody.offsetWidth / sliderItems[0].offsetWidth);
            sliderBody.style.width = sliderItems[0].offsetWidth * wholeItems + "px";
        }

        function countItems () {
            for (var i = 0; i < sliderItems.length; i++) {
                sliderItems[i].setAttribute("data-ket", "" + i);
            }
        }

        function addItems () {
            var lastItem = sliderItems[slidesCount - 1];
            var itemCloned = lastItem.cloneNode(true);
            sliderTrack.insertBefore(itemCloned, sliderTrack.firstChild);
            lastItem.parentNode.removeChild(lastItem);
        }

        function sliderMove () {
            autoMove = setInterval(function () {
                moved -= 200;
                if(curSlide === (slidesCount - 1)) {
                    curSlide = 0;
                } else {
                    curSlide++;
                }
                sliderTrack.style.transform = "translateX(" + moved + "px)";
                moveItems(false, 1);
                activeDot();
            }, self.autoSpeed);
        }

        function moveItems (side, moves) {
            slider.classList.add("disable");
            if(side === true) {
                setTimeout(function(){
                    var lastItem = sliderItems[sliderItems.length - 1];
                    var cloneSlide = lastItem.cloneNode(true);
                    sliderTrack.style.transition = "0s";
                    moved = moved - sliderItems[0].offsetWidth;
                    sliderTrack.style.transform = "translateX(" + moved + "px)";
                    sliderTrack.insertBefore(cloneSlide, sliderTrack.firstChild);
                    lastItem.parentNode.removeChild(lastItem);
                }, 800);
                setTimeout(function(){
                    sliderTrack.style.transition = "transform 0.8s";
                    slider.classList.remove("disable");
                }, 830);
            } else {
                for(var i = 0; i < moves; i++) {
                    var cloneSlide = sliderItems[i].cloneNode(true);
                    sliderTrack.appendChild(cloneSlide);
                }
                setTimeout(function(){
                    sliderTrack.style.transition = "0s";
                    moved = moved + (sliderItems[0].offsetWidth * moves);
                    for(var i = 0; i < moves; i++) {
                        sliderItems[0].parentNode.removeChild(sliderItems[0]);
                    }
                    sliderTrack.style.transform = "translateX(" + moved + "px)";
                }, 800);
                setTimeout(function(){
                    sliderTrack.style.transition = "transform 0.8s";
                    slider.classList.remove("disable");
                }, 830);
            }
        }

        function addDots () {
            var dotsBlock = document.createElement("div");
            dotsBlock.className = "slider-dots-block";
            slider.appendChild(dotsBlock);
            for(var i = 0; i < slidesCount; i++) {
                var dotItem = document.createElement("button");
                dotItem.className = "slider-dot js-dotBtn";
                dotItem.setAttribute("data-key", i);
                dotsBlock.appendChild(dotItem);
            }

            document.addEventListener("click", function(e){
                if(slider.classList.contains("disable")) {
                    return false;
                }
                if(e.target.classList.contains("js-dotBtn")) {
                    var dotInd = parseInt(e.target.getAttribute("data-key"));
                    var stepsTo = curSlide - dotInd;
                    if(stepsTo < 0) {
                        moved = moved + (sliderItems[0].offsetWidth * stepsTo);
                    } else {
                        stepsTo = slidesCount - stepsTo;
                        moved = moved - (sliderItems[0].offsetWidth * stepsTo);
                    }
                    curSlide = dotInd;
                    stepsTo = stepsTo < 0 ? -stepsTo : stepsTo;
                    moveItems(false, stepsTo);
                    setPos();
                }
            })
        }

        function activeDot () {
            if(document.getElementsByClassName("js-dotBtn active").length !== 0) {
                document.getElementsByClassName("js-dotBtn active")[0].classList.remove("active");
            }
            document.getElementsByClassName("js-dotBtn")[curSlide].classList.add("active");
        }

        function setPos (fast) {
            if(fast === undefined) {
                sliderTrack.style.transform = "translateX(" + moved + "px)";
            } else {
                sliderTrack.style.transition = "0s";
                sliderTrack.style.transform = "translateX(" + moved + "px)";
                setTimeout(function() {
                    sliderTrack.style.transition = "transform 0.8s"
                }, 10);
            }
            activeDot();
        }

        function addArrows () {
            var prevBtn = document.createElement("button"),
                nextBtn = document.createElement("button");

            prevBtn.className = "slider-btn js-prev";
            prevBtn.textContent = "Prev";
            slider.appendChild(prevBtn);
            nextBtn.className = "slider-btn slider-btn--next js-next";
            nextBtn.textContent = "Next";
            slider.appendChild(nextBtn);
            attachArrowEvents(prevBtn, nextBtn);
        }

        function attachArrowEvents (prevBtn, nextBtn) {
            prevBtn.addEventListener("click", function () {
                if(slider.classList.contains("disable")) {
                    return false;
                }
                if(curSlide === 0) {
                    curSlide = slidesCount - 1;
                } else {
                    curSlide--;
                }
                moved = 200 + moved;
                moveItems(true, 1);
                setPos();
            });
            nextBtn.addEventListener("click", function () {
                if(slider.classList.contains("disable")) {
                    return false;
                }
                if(curSlide === slidesCount - 1) {
                    curSlide = 0;
                } else {
                    curSlide++;
                }
                moved = -200 + moved;
                moveItems(false, 1);
                setPos();
            });
        }
    }

    const newSlider = new MySlider();
    newSlider.autoSpeed = 2200;
    newSlider.init("js-slider", imgList);
});