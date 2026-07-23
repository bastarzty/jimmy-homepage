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
