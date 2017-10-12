"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var initSlider = function(autoSpeed, arrows, dots) {
        var slider = document.getElementsByClassName("js-slider")[0],
            sliderItem = document.getElementsByClassName("js-slider-item"),
            sliderTrack = document.getElementsByClassName("js-slider-track")[0],
            sliderBody = document.getElementsByClassName("js-slider-body")[0],
            prevBtn = document.getElementsByClassName("js-prev")[0],
            nextBtn = document.getElementsByClassName("js-next")[0],
            curSlide = 0,
            slidesCount = sliderItem.length,
            moved = -sliderItem[0].offsetWidth,
            autoMove;

        sliderTrack.style.minWidth =  sliderItem[0].offsetWidth * (slidesCount + 1) + "px";

        // math slider body width

        var mathWidth = function() {
            var wholeItems = Math.floor(sliderBody.offsetWidth / sliderItem[0].offsetWidth);
            sliderBody.style.width = sliderItem[0].offsetWidth * wholeItems + "px";
        };

        mathWidth();

        // set keys for slides

        var countItems = function () {
            for (var i = 0; i < sliderItem.length; i++) {
                sliderItem[i].setAttribute("data-ket", "" + i);
            }
        };

        countItems();

        // add slide to left

        var addItems = function() {
            var lastItem = sliderItem[slidesCount - 1];
            var itemCloned = lastItem.cloneNode(true);
            sliderTrack.insertBefore(itemCloned, sliderTrack.firstChild);
            lastItem.parentNode.removeChild(lastItem);
        };

        addItems();

        // automove

        var sliderMove = function () {
            autoMove = setInterval(function () {
                moved -= 200;
                if(curSlide === slidesCount - 1) {
                    curSlide = 0;
                } else {
                    curSlide++;
                }
                sliderTrack.style.transform = "translateX(" + moved + "px)";
                moveItems(false, 1);
                activeDot();
            }, autoSpeed);
        };

        // sliderMove();

        // slides move on step

        var moveItems = function(side, moves) {
            slider.classList.add("disable");
            if(side === true) {
                setTimeout(function(){
                    var lastItem = sliderItem[sliderItem.length - 1];
                    var cloneSlide = lastItem.cloneNode(true);
                    sliderTrack.style.transition = "0s";
                    moved = moved - sliderItem[0].offsetWidth;
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
                    var cloneSlide = sliderItem[i].cloneNode(true);
                    sliderTrack.appendChild(cloneSlide);
                    console.log(cloneSlide);
                }
                setTimeout(function(){
                    sliderTrack.style.transition = "0s";
                    console.log(moves);
                    moved = moved + (sliderItem[0].offsetWidth * moves);
                    for(var i = 0; i < moves; i++) {
                        sliderItem[0].parentNode.removeChild(sliderItem[0]);
                    }
                    sliderTrack.style.transform = "translateX(" + moved + "px)";

                }, 800);
                setTimeout(function(){
                    sliderTrack.style.transition = "transform 0.8s";
                    slider.classList.remove("disable");
                }, 830);
            }
        };

        // check for dots

        var addDots = function() {
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
                    var dotInd = e.target.getAttribute("data-key");
                    var stepsTo = curSlide - dotInd;
                    if(stepsTo < 0) {
                        moved = moved + (sliderItem[0].offsetWidth * stepsTo);
                    } else {
                        stepsTo = slidesCount - stepsTo;
                        moved = moved - (sliderItem[0].offsetWidth * stepsTo);
                    }
                    curSlide = dotInd;
                    stepsTo = stepsTo < 0 ? -stepsTo : stepsTo;
                    moveItems(false, stepsTo);
                    setPos();
                }
            })
        };

        if(dots === true) {
            addDots();
        }

        // active dot

        var activeDot = function() {
            if(document.getElementsByClassName("js-dotBtn active").length !== 0) {
                document.getElementsByClassName("js-dotBtn active")[0].classList.remove("active");
            }
            document.getElementsByClassName("js-dotBtn")[curSlide].classList.add("active");
        };

        activeDot();

        // set new position

        var setPos = function(fast) {
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
        };

        setPos(true);

        // check for arrows

        var addArrows = function () {
            var prevBtn = document.createElement("button"),
                nextBtn = document.createElement("button");

            prevBtn.className = "slider-btn js-prev";
            prevBtn.textContent = "Prev";
            slider.appendChild(prevBtn);
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
            nextBtn.className = "slider-btn slider-btn--next js-next";
            nextBtn.textContent = "Next";
            slider.appendChild(nextBtn);
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
        };

        if(arrows === true) {
            addArrows();
        }

        // automove off on hover

        slider.addEventListener("mouseenter", function () {
            clearInterval(autoMove);
        });

        slider.addEventListener("mouseleave", function () {
            sliderMove();
        });
    };

    initSlider(5000, true, true);

});