(function() {
  const addNotice = () => {
    const greeting = document.querySelector('.split-parent');
    if (!greeting) return;
    const parent = greeting.parentElement;
    if (!parent || parent.querySelector('.gotso-notice')) return;
    const notice = document.createElement('p');
    notice.className = 'gotso-notice';
    notice.textContent = 'Вы пользуетесь искусственным интеллектом от Gotso, который находится на стадии разработки';
    notice.style.cssText = 'font-size:13px;color:#888;text-align:center;margin-bottom:4px;width:100%;';
    parent.insertBefore(notice, parent.firstChild);
  };
  new MutationObserver(addNotice).observe(document.body, {childList:true,subtree:true});
})();
