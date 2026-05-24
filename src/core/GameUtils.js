// UI utility functions extracted from GameEngine.js

export function setWaveButton(label, disabled) {
  const btn = document.getElementById('btn-wave');
  btn.textContent = label;
  btn.disabled = disabled;
  btn.classList.toggle('active', disabled);
}

export function log(msg, cls = '') {
  const el = document.getElementById('status-log');
  const entry = document.createElement('div');
  entry.className = `log-entry${cls ? ' ' + cls : ''}`;
  entry.textContent = msg;
  el.appendChild(entry);
  el.scrollTop = el.scrollHeight;
  while (el.children.length > 20) el.removeChild(el.firstChild);
}

export function spawnFloatText(text, x, y, cls = '') {
  const el = document.createElement('div');
  el.className = `float-text${cls ? ' ' + cls : ''}`;
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  const num = parseInt(text);
  if (!isNaN(num) && num > 0) {
    if      (num >= 150) el.style.fontSize = '1.2rem';
    else if (num >= 80)  el.style.fontSize = '1.05rem';
    else if (num >= 40)  el.style.fontSize = '0.9rem';
  }
  document.getElementById('float-container').appendChild(el);
  setTimeout(() => el.remove(), 900);
}

export function shakeNexus() {
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach(h => {
    h.style.animation = 'none';
    h.offsetHeight;
    h.style.animation = 'heartPulse 0.4s ease-out';
  });
  if (!document.getElementById('heart-pulse-style')) {
    const s = document.createElement('style');
    s.id = 'heart-pulse-style';
    s.textContent = `@keyframes heartPulse { 0%{transform:scale(1)} 50%{transform:scale(1.5)} 100%{transform:scale(1)} }`;
    document.head.appendChild(s);
  }
}
