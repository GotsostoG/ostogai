// Inject effort selector for Claude agents
setTimeout(() => {
  const chatContainer = document.querySelector('[class*="chat"]');
  if (!chatContainer) return;
  
  // Check if agent is Claude (Pro or Ultra)
  const agentName = document.querySelector('[class*="agent"]')?.textContent || '';
  if (!agentName.includes('Pro') && !agentName.includes('Ultra')) return;
  
  // Create effort selector
  const effortDiv = document.createElement('div');
  effortDiv.id = 'effort-selector';
  effortDiv.style.cssText = `
    display: flex;
    gap: 8px;
    padding: 10px;
    background: #1e1e1e;
    border-radius: 8px;
    margin-bottom: 10px;
  `;
  
  const levels = ['Low', 'Medium', 'High', 'Extra', 'Max'];
  levels.forEach(level => {
    const btn = document.createElement('button');
    btn.textContent = level;
    btn.dataset.effort = level.toLowerCase();
    btn.style.cssText = `
      padding: 6px 12px;
      background: #333;
      border: 1px solid #555;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    if (level === 'High') btn.classList.add('active');
    btn.onclick = (e) => {
      document.querySelectorAll('#effort-selector button').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      window.currentEffort = level.toLowerCase();
    };
    effortDiv.appendChild(btn);
  });
  
  document.querySelector('[class*="message-input"]')?.parentElement?.insertBefore(effortDiv, document.querySelector('[class*="message-input"]'));
}, 1000);
