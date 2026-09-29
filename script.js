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

function place() {
  const width = stage.getBoundingClientRect().width;
  slides.forEach((slide) => {
    slide.style.flexBasis = width + "px";
    slide.style.width = width + "px";
  });
  track.style.transform = `translateX(-${current * width}px)`;
}

function show(next) {
  current = (next + slides.length) % slides.length;
  place();
  indexEl.textContent = String(current + 1).padStart(2, "0");
  totalEl.textContent = String(slides.length).padStart(2, "0");
  dots.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("is-on", index === current);
  });
}

function queue() {
  clearInterval(timer);
  if (reduceMotion) return;
  timer = setInterval(() => show(current + 1), 5000);
}

document.querySelector("[data-prev]").addEventListener("click", () => {
  show(current - 1);
  queue();
});
document.querySelector("[data-next]").addEventListener("click", () => {
  show(current + 1);
  queue();
});

const dots = document.querySelector("[data-dots]");
slides.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.className = "dot";
  dots.appendChild(dot);
  void index;
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
window.addEventListener("resize", place);
setProgress();
window.addEventListener("scroll", setProgress, { passive: true });

const notes = [...document.querySelectorAll("[data-notes] article")];
let noteAt = 0;

function showNotes() {
  notes.forEach((card, index) => {
    const second = (noteAt + 1) % notes.length;
    card.classList.toggle("is-on", index === noteAt || index === second);
  });
}

showNotes();
if (!reduceMotion) {
  setInterval(() => {
    noteAt = (noteAt + 1) % notes.length;
    showNotes();
  }, 4500);
}

document.querySelectorAll(".shot img").forEach((image) => {
  image.addEventListener("error", () => {
    const figure = image.closest(".shot");
    figure.classList.add("shot-plain");
    figure.innerHTML = "<p>Project image</p>";
  });
});
