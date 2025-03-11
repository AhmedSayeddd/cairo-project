let sliderItems = document.querySelectorAll(".slider .list .item");
let dotsContainer = document.querySelector(".dots");
let currentIndex = 0;
let intervalTime = 3000; // تغيير الصورة كل 3 ثوانٍ
let autoSlide = setInterval(nextSlide, intervalTime);

// إنشاء النقاط بناءً على عدد الصور
sliderItems.forEach((_, index) => {
    let dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

let dots = document.querySelectorAll(".dots .dot");

// دالة لتحديث الشريحة
function updateSlide() {
    sliderItems.forEach((item, i) => {
        item.classList.toggle("active", i === currentIndex);
        dots[i].classList.toggle("active", i === currentIndex);
    });
}

// دالة لتفعيل الشريحة التالية
function nextSlide() {
    currentIndex = (currentIndex + 1) % sliderItems.length;
    updateSlide();
}

// دالة للانتقال إلى شريحة معينة عند الضغط على النقاط
function goToSlide(index) {
    clearInterval(autoSlide);
    currentIndex = index;
    updateSlide();
    autoSlide = setInterval(nextSlide, intervalTime);
}
// scroll nav
const navbar = document.getElementById("navbar");
window.onscroll = function () {
    if (window.scrollY > 0) {
        navbar.classList.add("scrolled");
        navbar.classList.remove("not-scroll");
    } else {
        navbar.classList.add("not-scroll");
        navbar.classList.remove("scrolled");
    }
};