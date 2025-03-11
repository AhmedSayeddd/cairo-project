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

// dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    // حفظ الوضع في localStorage ليبقى بعد إعادة تحميل الصفحة
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".rating").forEach(group => {
        const ratingKey = group.dataset.key; // كل تقييم له مفتاحه الخاص
        const savedRating = localStorage.getItem(ratingKey);

        if (savedRating) {
            const selectedInput = group.querySelector(`input[value="${savedRating}"]`);
            if (selectedInput) selectedInput.checked = true;
        }

        group.addEventListener("change", function (event) {
            if (event.target.type === "radio") {
                localStorage.setItem(ratingKey, event.target.value);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const ratingInputs = document.querySelectorAll(".rating input");
    ratingInputs.forEach(input => input.disabled = true);
    fetchRatings();  // استدعاء دالة جلب التقييمات
});