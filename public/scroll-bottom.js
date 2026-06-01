(function() {
  let currentPath = location.pathname;
  let scrollDone = false;
  let lastHeight = 0;
  let stableCount = 0;
  let intervalId = null;

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
    }
  };

  const reset = () => {
    scrollDone = false;
    lastHeight = 0;
    stableCount = 0;
    if (intervalId) clearInterval(intervalId);
    start();
  };

  const start = () => {
    // Каждые 200мс проверяем высоту контейнера
    // Если 3 раза подряд не изменилась — считаем загрузку завершённой
    intervalId = setInterval(() => {
      const container = getScrollContainer();
      if (!container) return;

      if (container.scrollHeight === lastHeight) {
        stableCount++;
      } else {
        lastHeight = container.scrollHeight;
        stableCount = 0;
      }

      if (stableCount >= 3 && !scrollDone) {
        scrollToBottom();
        scrollDone = true;
        clearInterval(intervalId);
      }
    }, 200);

    // Страховка — через 5 секунд скроллим в любом случае
    setTimeout(() => {
      if (!scrollDone) {
        scrollToBottom();
        scrollDone = true;
        clearInterval(intervalId);
      }
    }, 5000);
  };

  // Сброс при смене чата (SPA навигация)
  new MutationObserver(() => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      reset();
    }
  }).observe(document.body, { childList: true, subtree: true });

  start();
})();
