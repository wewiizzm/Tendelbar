(function animateLogos() {
  const logos = Array.from(document.querySelectorAll('.logo'));
  if (logos.length === 0) {
    return;
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrameId = null;

  function resetLogos() {
    logos.forEach((logo) => {
      logo.style.transform = '';
      logo.style.willChange = '';
    });
  }

  function step(now) {
    logos.forEach((logo, index) => {
      const time = now / 1000;
      const phase = index * 0.9;
      const offsetX = Math.sin(time * 0.8 + phase) * 2.5;
      const offsetY = Math.cos(time * 1.2 + phase) * 5;
      const rotation = Math.sin(time * 0.7 + phase) * 1.6;
      const scale = 1 + Math.cos(time * 1.05 + phase) * 0.015;
      logo.style.willChange = 'transform';
      logo.style.transform =
        `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) ` +
        `rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });
    animationFrameId = window.requestAnimationFrame(step);
  }

  function startAnimation() {
    if (animationFrameId !== null || reducedMotionQuery.matches) {
      return;
    }
    animationFrameId = window.requestAnimationFrame(step);
  }

  function stopAnimation() {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    resetLogos();
  }

  if (typeof reducedMotionQuery.addEventListener === 'function') {
    reducedMotionQuery.addEventListener('change', (event) => {
      if (event.matches) {
        stopAnimation();
        return;
      }
      startAnimation();
    });
  } else if (typeof reducedMotionQuery.addListener === 'function') {
    reducedMotionQuery.addListener((event) => {
      if (event.matches) {
        stopAnimation();
        return;
      }
      startAnimation();
    });
  }

  startAnimation();
})();
