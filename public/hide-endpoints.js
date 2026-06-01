(function() {
  const run = (token) => {
    fetch('/api/user', { headers: { 'Authorization': token }, credentials: 'include' })
      .then(r => r.json())
      .then(user => {
        if (user.role === 'ADMIN') return;
        const hide = () => {
          document.querySelectorAll('.truncate.text-left').forEach(el => {
            const txt = el.textContent.trim();
            if (txt === 'Claude' || txt === 'GPT' || txt === 'My Agents') {
              const item = el.closest('[class*="relative rounded-lg"]');
              if (item) item.style.display = 'none';
            }
          });
        };
        setInterval(hide, 150);
        hide();
      }).catch(()=>{});
  };
  const wait = setInterval(() => {
    if (window.cachedToken) { clearInterval(wait); run(window.cachedToken); }
  }, 500);
})();
