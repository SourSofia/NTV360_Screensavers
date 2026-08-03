// Floating "View Source" button + slide-in panel showing this page's own HTML.
(function () {
  if (!document.getElementById('vs-font-link')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'vs-font-link';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  const btn = document.createElement('button');
  btn.id = 'view-source-btn';
  btn.title = 'View source code';
  btn.innerHTML = '<span class="vs-icon">&lt;/&gt;</span><span>Show Source Code</span>';

  const overlay = document.createElement('div');
  overlay.id = 'view-source-overlay';

  const panel = document.createElement('div');
  panel.id = 'view-source-panel';
  panel.innerHTML = `
    <div id="view-source-header">
      <div id="view-source-dots"><span></span><span></span><span></span></div>
      <span id="view-source-title">index.html</span>
      <button id="view-source-close" aria-label="Close">&times;</button>
    </div>
    <div id="view-source-body">
      <div id="view-source-code">Loading…</div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #view-source-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9998;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px 22px 15px 18px;
      border-radius: 10px;
      border: 1px solid rgba(253, 253, 253, 0.35);
      background: rgba(17, 24, 39, 0.65);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #fff;
      font: 700 14px/1 'Plus Jakarta Sans', system-ui, sans-serif;
      letter-spacing: 0.02em;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
    }
    #view-source-btn:hover {
      background: rgba(17, 24, 39, 0.85);
      border-color: rgba(253, 253, 253, 0.55);
      transform: translateY(-1px);
    }
    #view-source-btn .vs-icon {
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      color: #f18029;
      font-size: 15px;
    }
    #view-source-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 9999;
      display: none;
    }
    #view-source-panel {
      position: fixed;
      top: 40px;
      bottom: 40px;
      left: 50%;
      width: min(1200px, calc(100vw - 160px));
      max-width: 1200px;
      background: #1e1e1e;
      color: #d4d4d4;
      z-index: 10000;
      display: none;
      flex-direction: column;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.55);
      border: 1px solid rgba(255,255,255,0.08);
      transform: translate(-50%, 8px);
      opacity: 0;
      transition: transform 0.25s ease-out, opacity 0.25s ease-out;
    }
    #view-source-panel.open { display: flex; transform: translate(-50%, 0); opacity: 1; }
    #view-source-overlay.open { display: block; }
    #view-source-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #2d2d2d;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
    }
    #view-source-dots { display: flex; gap: 6px; }
    #view-source-dots span {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #4a4a4a;
    }
    #view-source-title {
      flex: 1;
      text-align: center;
      font: 500 13px system-ui, sans-serif;
      color: #9aa0a6;
    }
    #view-source-close {
      background: none;
      border: none;
      color: #9aa0a6;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      padding: 0 2px;
    }
    #view-source-close:hover { color: #fff; }
    #view-source-body {
      flex: 1;
      overflow: auto;
      background: #1e1e1e;
    }
    #view-source-code {
      display: grid;
      grid-template-columns: auto 1fr;
      width: 100%;
      font: 13px/1.6 'Space Mono', Consolas, monospace;
      tab-size: 2;
      -moz-tab-size: 2;
    }
    .vs-line-num {
      background: #1e1e1e;
      color: #6e7681;
      text-align: right;
      padding: 0 14px;
      user-select: none;
    }
    .vs-line-code {
      padding: 0 20px 0 16px;
      white-space: pre-wrap;
      word-break: break-word;
      color: #d4d4d4;
    }
  `;

  document.head.appendChild(style);
  document.body.append(overlay, panel, btn);

  const codeEl = panel.querySelector('#view-source-code');
  let loaded = false;

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderCode(html) {
    const lines = html.split('\n');
    codeEl.innerHTML = lines
      .map((line, i) => `<div class="vs-line-num">${i + 1}</div><div class="vs-line-code">${escapeHtml(line) || ' '}</div>`)
      .join('');
  }

  function open() {
    overlay.classList.add('open');
    panel.classList.add('open');
    if (!loaded) {
      fetch(location.href)
        .then((res) => res.text())
        .then((html) => { renderCode(html); loaded = true; })
        .catch(() => { codeEl.textContent = 'Unable to load source (view may need to be served over http).'; });
    }
  }

  function close() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
  }

  btn.addEventListener('click', open);
  overlay.addEventListener('click', close);
  panel.querySelector('#view-source-close').addEventListener('click', close);
})();
