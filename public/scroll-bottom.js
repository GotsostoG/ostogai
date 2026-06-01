(function() {
  let lastScrolled = null;
  let scrollDone = false;

  const getScrollContainer = () => {
    let best = null;
    let maxHeight = 0;
    document.querySelectorAll('div').forEach(el => {
      const style = window.getComputedStyle(el);
      const overflow = style.overflowY;
      if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight + 100) {
        if (el.scrollHeight > maxHeight) {
          maxHeight = el.scrollHeight;
          best = el;
        }
      }
    });
    return best;
  };

  const tryScroll = () => {
    const container = getScrollContainer();
    if (!container) return false;
    // Если scrollHeight не изменился за последние 600мс — считаем что загрузка завершена
    if (lastScrolled === container.scrollHeight) {
      if (!scrollDone) {
        container.scrollTop = container.scrollHeight;
        scrollDone = true;
      }
      return true;
    }
    lastScrolled = container.scrollHeight;
    return false;
  };

  const observer = new MutationObserver(() => {
    if (!scrollDone) tryScroll();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Страховочный таймер — через 3 секунды скроллим в любом случае
  setTimeout(() => {
    if (!scrollDone) {
      const container = getScrollContainer();
      if (container) {
        container.scrollTop = container.scrollHeight;
        scrollDone = true;
      }
    }
    observer.disconnect();
  }, 3000);
})();
