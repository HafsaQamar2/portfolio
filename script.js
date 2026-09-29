const progress = document.querySelector("[data-progress]");
const slides = [...document.querySelectorAll(".project")];
const indexEl = document.querySelector("[data-index]");
const totalEl = document.querySelector("[data-total]");
let current = 0;

function setProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.textContent = Math.round(amount * 100) + "%";
}

function show(next) {
  current = (next + slides.length) % slides.length;
  slides.forEach((slide, index) => slide.classList.toggle("is-active", index === current));
  indexEl.textContent = String(current + 1).padStart(2, "0");
  totalEl.textContent = String(slides.length).padStart(2, "0");
}

document.querySelector("[data-prev]").addEventListener("click", () => show(current - 1));
document.querySelector("[data-next]").addEventListener("click", () => show(current + 1));
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") show(current + 1);
  if (event.key === "ArrowLeft") show(current - 1);
});

const stage = document.querySelector("[data-stage]");
let touchStart = 0;
stage.addEventListener("touchstart", (event) => {
  touchStart = event.changedTouches[0].clientX;
}, { passive: true });
stage.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStart;
  if (delta > 40) show(current - 1);
  if (delta < -40) show(current + 1);
}, { passive: true });

show(0);
setProgress();
window.addEventListener("scroll", setProgress, { passive: true });

document.querySelectorAll(".shot img").forEach((image) => {
  image.addEventListener("error", () => {
    const figure = image.closest(".shot");
    figure.classList.add("shot-plain");
    figure.innerHTML = "<p>Live project</p>";
  });
});
