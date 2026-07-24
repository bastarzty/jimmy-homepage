function scaleCanvas() {
  const canvas = document.getElementById('canvas');
  const wrap = document.querySelector('.scale-wrap');
  const designWidth = 1728;
  const designHeight = 1368;
  const viewportWidth = window.innerWidth;
  const scale = Math.min(1, viewportWidth / designWidth);

  canvas.style.transform = `scale(${scale})`;
  wrap.style.height = (designHeight * scale) + 'px';
}

window.addEventListener('resize', scaleCanvas);
window.addEventListener('load', scaleCanvas);
scaleCanvas();

// ---------- 订阅弹窗 ----------
const subscribeOverlay = document.getElementById('subscribeOverlay');
const subscribeClose = document.getElementById('subscribeClose');

function openSubscribe(e) {
  e.preventDefault();
  subscribeOverlay.classList.add('active');
}

function closeSubscribe() {
  subscribeOverlay.classList.remove('active');
}

document.querySelectorAll('.js-subscribe').forEach(el => {
  el.addEventListener('click', openSubscribe);
});

if (subscribeClose) {
  subscribeClose.addEventListener('click', closeSubscribe);
}

if (subscribeOverlay) {
  subscribeOverlay.addEventListener('click', (e) => {
    if (e.target === subscribeOverlay) closeSubscribe();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSubscribe();
});
