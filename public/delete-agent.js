(function() {
  window.cachedToken = window.cachedToken || null;
  let cachedToken = null;

  const origSRH = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (name.toLowerCase() === "authorization") { cachedToken = value; window.cachedToken = value; }
    return origSRH.apply(this, arguments);
  };

  const showConfirm = (cb) => {
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
    const box = document.createElement('div');
    box.style.cssText = 'background:#2d2d2d;border:1px solid #444;border-radius:12px;padding:24px 28px;min-width:260px;text-align:center;color:#eee;';
    box.innerHTML = '<p style="margin:0 0 20px;font-size:15px;">Удалить агента?</p>';
    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:10px;justify-content:center;';
    const cancel = document.createElement('button');
    cancel.textContent = 'Отмена';
    cancel.style.cssText = 'padding:8px 20px;border-radius:8px;border:1px solid #555;background:#3a3a3a;color:#ccc;cursor:pointer;';
    cancel.onclick = () => ov.remove();
    const confirm = document.createElement('button');
    confirm.textContent = 'Удалить';
    confirm.style.cssText = 'padding:8px 20px;border-radius:8px;border:none;background:#e53e3e;color:#fff;cursor:pointer;';
    confirm.onclick = () => { ov.remove(); cb(); };
    btns.append(cancel, confirm);
    box.appendChild(btns);
    ov.appendChild(box);
    document.body.appendChild(ov);
  };

  const addDeleteButtons = () => {
    document.querySelectorAll('[id^="item-agent_"]').forEach(el => {
      if (el.querySelector('.cst-del-btn')) return;
      const agentId = el.id.replace('item-', '');
      if (!agentId) return;
      const btn = document.createElement('button');
      btn.className = 'cst-del-btn';
      btn.innerHTML = '🗑';
      btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:14px;padding:0 4px;color:#999;';
      btn.onclick = async e => {
        e.stopPropagation();
        e.preventDefault();
        if (!cachedToken) { alert('Сначала отправь сообщение'); return; }
        showConfirm(async () => {
          const r = await fetch('/api/agents/' + agentId, {
            method: 'DELETE',
            headers: { 'Authorization': cachedToken }
          });
          if (r.ok) { el.remove(); }
        });
      };
      el.style.position = 'relative';
      el.appendChild(btn);
    });
  };

  new MutationObserver(addDeleteButtons).observe(document.body, { childList: true, subtree: true });
  addDeleteButtons();
})();
