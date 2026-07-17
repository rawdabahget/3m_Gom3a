const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

let currentSlide = 0;
let timer = setInterval(nextSlide, 4000);

function updateCarousel() {
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  if (slides[currentSlide]) slides[currentSlide].classList.add("active");
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");
}

function nextSlide() {
  if (slides.length > 0) {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
  }
}

function prevSlide() {
  if (slides.length > 0) {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
  }
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(nextSlide, 4000);
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    nextSlide();
    resetTimer();
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    prevSlide();
    resetTimer();
  });
}
