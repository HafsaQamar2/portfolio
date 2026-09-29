const progress = document.querySelector("[data-progress]");
const slides = [...document.querySelectorAll(".project")];
const track = document.querySelector("[data-track]");
const stage = document.querySelector("[data-stage]");
const indexEl = document.querySelector("[data-index]");
const totalEl = document.querySelector("[data-total]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let current = 0;
let timer = 0;

function setProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.textContent = Math.round(amount * 100) + "%";
}

function show(next) {
  current = (next + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  indexEl.textContent = String(current + 1).padStart(2, "0");
  totalEl.textContent = String(slides.length).padStart(2, "0");
}

function queue() {
  clearInterval(timer);
  if (reduceMotion) return;
  timer = setInterval(() => show(current + 1), 6500);
}

document.querySelector("[data-prev]").addEventListener("click", () => {
  show(current - 1);
  queue();
});
document.querySelector("[data-next]").addEventListener("click", () => {
  show(current + 1);
  queue();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    show(current + 1);
    queue();
  }
  if (event.key === "ArrowLeft") {
    show(current - 1);
    queue();
  }
});

let touchStart = 0;
stage.addEventListener("touchstart", (event) => {
  touchStart = event.changedTouches[0].clientX;
}, { passive: true });
stage.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStart;
  if (delta > 40) show(current - 1);
  if (delta < -40) show(current + 1);
  if (Math.abs(delta) > 40) queue();
}, { passive: true });

stage.addEventListener("mouseenter", () => clearInterval(timer));
stage.addEventListener("mouseleave", queue);

show(0);
queue();
setProgress();
window.addEventListener("scroll", setProgress, { passive: true });

document.querySelectorAll(".shot img").forEach((image) => {
  image.addEventListener("error", () => {
    const figure = image.closest(".shot");
    figure.classList.add("shot-plain");
    figure.innerHTML = "<p>Project image</p>";
  });
});
