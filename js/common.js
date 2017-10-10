"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var initSlider = function(autoSpeed, arrows, dots) {
        var sliderBody = document.getElementsByClassName("js-slider-body")[0],
            sliderItem = document.getElementsByClassName("js-slider-item"),
            sliderTrack = document.getElementsByClassName("js-slider-track")[0],
            prevBtn = document.getElementsByClassName("js-prev")[0],
            nextBtn = document.getElementsByClassName("js-next")[0],
            curSlide = 0,
            slidesCount = sliderItem.length,
            moved = 0,
            autoMove;

        sliderTrack.style.width = sliderItem.length * 200 + "px";

        // set keys for slides

        var countItems = function () {
            for (var i = 0; i < sliderItem.length; i++) {
                sliderItem[i].setAttribute("data-ket", "" + i);
            }
        };

        countItems();

        // automove

        var sliderMove = function () {
            autoMove = setInterval(function () {
                if (curSlide === (sliderItem.length - 3)) {
                    moved = 0;
                    curSlide = 0;
                    sliderTrack.style.transform = "translateX(" + moved + "px)";
                } else {
                    moved -= 200;
                    curSlide++;
                    sliderTrack.style.transform = "translateX(" + moved + "px)";
                }
            }, autoSpeed);
        };

        sliderMove();

        // set new position

        var setPos = function() {
            sliderTrack.style.transform = "translateX(" + moved + "px)";
        };

        // check for arrows

        var addArrows = function () {
            var prevBtn = document.createElement("button"),
                nextBtn = document.createElement("button");

            prevBtn.className = "slider-btn js-prev";
            prevBtn.textContent = "Prev";
            sliderBody.appendChild(prevBtn);
            prevBtn.addEventListener("click", function () {
                    if (curSlide === 0) {
                    moved = -(sliderTrack.offsetWidth - 600);
                    curSlide = slidesCount - 3;
                    setPos();
                } else {
                    curSlide--;
                    moved = 200 + moved;
                    setPos();
                }
            });
            nextBtn.className = "slider-btn slider-btn--next js-next";
            nextBtn.textContent = "Next";
            sliderBody.appendChild(nextBtn);
            nextBtn.addEventListener("click", function () {
                if (curSlide === (sliderItem.length - 3)) {
                    moved = 0;
                    curSlide = 0;
                    setPos();
                } else {
                    curSlide++;
                    moved = -200 + moved;
                    setPos();
                }
            });
        };

        if(arrows === true) {
            addArrows();
        }

        // check for dots

        var addDots = function() {
            var dotsBlock = document.createElement("div");
            dotsBlock.className = "slider-dots-block";
            sliderBody.appendChild(dotsBlock);
            for(var i = 0; i < slidesCount; i++) {
                var dotItem = document.createElement("button");
                dotItem.className = "slider-dot js-dotBtn";
                dotItem.setAttribute("data-key", i);
                dotsBlock.appendChild(dotItem);
            }

            document.addEventListener("click", function(e){
                if(e.target.classList.contains("js-dotBtn")) {
                    var dotInd = e.target.getAttribute("data-key");
                    var stepsTo = curSlide - dotInd;
                    if ((slidesCount - 1) - dotInd === 0) {
                        curSlide = parseInt(slidesCount - 3);
                        moved = moved + ((stepsTo + 2) * 200);
                        setPos();
                    } else if((slidesCount - 1) - dotInd === 1) {
                        curSlide = parseInt(slidesCount - 3);
                        moved = moved + ((stepsTo + 1) * 200);
                        setPos();
                    } else {
                        curSlide = parseInt(dotInd);
                        moved = moved + (stepsTo * 200);
                        setPos();
                    }
                }
            })
        };

        if(dots === true) {
            addDots();
        }

        // automove off on hover

        sliderBody.addEventListener("mouseenter", function () {
            clearInterval(autoMove);
        });

        sliderBody.addEventListener("mouseleave", function () {
            sliderMove();
        });
    };

    initSlider(5000, true, true);

});