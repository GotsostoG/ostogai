(function() {
  let lastScrollHeight = null;
  let scrollDone = false;
  let currentPath = location.pathname;

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

  const scrollToBottom = () => {
    const container = getScrollContainer();
    if (container) {
      container.scrollTop = container.scrollHeight;
      scrollDone = true;
    }
  };

  const tryScroll = () => {
    if (scrollDone) return;
    const container = getScrollContainer();
    if (!container) return;
    if (lastScrollHeight === container.scrollHeight) {
      scrollToBottom();
      return;
    }
    lastScrollHeight = container.scrollHeight;
  };

  const reset = () => {
    lastScrollHeight = null;
    scrollDone = false;
  };

  // Сброс при смене чата (SPA навигация)
  const observer = new MutationObserver(() => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      reset();
    }
    if (!scrollDone) tryScroll();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Страховочный таймер
  setTimeout(() => {
    if (!scrollDone) scrollToBottom();
  }, 3000);
})();
