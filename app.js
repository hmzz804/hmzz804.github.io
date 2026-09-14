const config = window.SITE_CONFIG || {};
const projectList = document.querySelector("#project-list");

if (projectList && Array.isArray(config.projects)) {
  projectList.innerHTML = config.projects.map((project, index) => `
    <a class="project" href="${project.url || "#"}" ${project.url?.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>
      <span class="project-index">0${index + 1}</span>
      <h3>${project.title}</h3>
      <div>
        <p>${project.description}</p>
        <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <span class="project-arrow" aria-hidden="true">↗</span>
    </a>
  `).join("");
}

document.querySelector("#year").textContent = new Date().getFullYear();
const emailLink = document.querySelector("#email-link");
if (emailLink && config.email) emailLink.href = `mailto:${config.email}`;
const githubLink = document.querySelector("#github-link");
const bilibiliLink = document.querySelector("#bilibili-link");
if (githubLink && config.socials?.github) githubLink.href = config.socials.github;
if (bilibiliLink && config.socials?.bilibili) bilibiliLink.href = config.socials.bilibili;

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

document.querySelector(".back-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

const canvas = document.querySelector("#terrain");
const context = canvas.getContext("2d");
const visual = canvas.closest(".hero-visual");
const exploreLabel = document.querySelector("#explore-label");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchFirst = window.matchMedia("(pointer: coarse)").matches;
let pointerX = 0.5;
let pointerY = 0.5;
let targetX = 0.5;
let targetY = 0.5;
let pressed = false;
let ripples = [];
let frame = 0;
let animationId;

if (touchFirst) exploreLabel.textContent = "TOUCH TO EXPLORE";

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * ratio);
  canvas.height = Math.floor(canvas.clientHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawTerrain(time = 0) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  pointerX += (targetX - pointerX) * (pressed ? 0.2 : 0.075);
  pointerY += (targetY - pointerY) * (pressed ? 0.2 : 0.075);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#141614";
  context.fillRect(0, 0, width, height);
  context.lineWidth = 1;

  for (let row = -3; row < 32; row += 1) {
    context.beginPath();
    for (let x = -20; x <= width + 20; x += 6) {
      const yBase = row * (height / 27);
      const centerPull = Math.exp(-Math.pow((x / width) - pointerX, 2) * 15);
      const wave = Math.sin(x * 0.018 + row * 0.68 + time * 0.00035) * 15;
      const ripple = Math.sin(x * 0.042 - row * 0.35 + pointerY * 5) * 6;
      let touchWave = 0;
      ripples.forEach((pulse) => {
        const age = (time - pulse.startedAt) / 900;
        const distance = Math.hypot((x / width) - pulse.x, (yBase / height) - pulse.y);
        touchWave += Math.sin(distance * 38 - age * 13) * Math.exp(-distance * 7) * (1 - age) * 18;
      });
      const y = yBase + wave * centerPull + ripple + touchWave;
      if (x === -20) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.strokeStyle = row % 5 === 0 ? "rgba(215,255,70,.68)" : "rgba(242,240,233,.22)";
    context.stroke();
  }
  ripples = ripples.filter((pulse) => time - pulse.startedAt < 900);
  frame = time;
  if (!reducedMotion) animationId = requestAnimationFrame(drawTerrain);
}

function updatePointer(event) {
  const rect = canvas.getBoundingClientRect();
  targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  targetY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
}

canvas.addEventListener("pointerdown", (event) => {
  pressed = true;
  canvas.setPointerCapture(event.pointerId);
  updatePointer(event);
  ripples.push({ x: targetX, y: targetY, startedAt: performance.now() });
  visual.classList.add("is-active");
  exploreLabel.textContent = touchFirst ? "DRAG TO SHAPE" : "PRESS / MOVE TO SHAPE";
});
canvas.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch" && !pressed) return;
  updatePointer(event);
  visual.classList.add("is-active");
});
canvas.addEventListener("pointerup", (event) => {
  pressed = false;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  exploreLabel.textContent = touchFirst ? "TOUCH TO EXPLORE" : "MOVE TO EXPLORE";
});
canvas.addEventListener("pointercancel", () => {
  pressed = false;
});
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
if (reducedMotion) drawTerrain(frame); else animationId = requestAnimationFrame(drawTerrain);
