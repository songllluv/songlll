// ==UserScript==
// @name         洛谷个人介绍显示
// @namespace    https://www.luogu.com.cn/user/
// @version      beta2.1
// @description  自动显示 user.introduction，支持 Markdown + KaTeX + Prism + Unicode
// @author       songlll
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @downloadURL  https://songlll.pages.dev/luoguUserIntroduction.user.js
// @updateURL    https://songlll.pages.dev/luoguUserIntroduction.user.js
// @require      https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/dist/markdown-it.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/contrib/auto-render.min.js
// @require      https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.js
// @require      https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js
// ==/UserScript==

(async function () {
  'use strict';

  // 手动注入 KaTeX 和 Prism 的 CSS
  const styleLinks = [
    'https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css',
    'https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css'
  ];
  for (const href of styleLinks) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  // Markdown + KaTeX 渲染
  function renderMarkdown(text) {
    const md = window.markdownit({
      html: true,
      linkify: true,
      typographer: true
    });

    const html = md.render(text);
    const container = document.createElement('div');
    container.innerHTML = html;

    // 图片自适应
    container.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px 0';
    });

    // 代码高亮
    container.querySelectorAll('pre code').forEach(block => {
      Prism.highlightElement(block);
      block.style.display = 'block';
      block.style.overflowX = 'auto';
    });

    // 等待 KaTeX 自动渲染加载完毕
    if (typeof renderMathInElement === 'function') {
      renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }

    return container.innerHTML;
  }

  // 读取 JSON
  const jsonScript = document.getElementById('lentille-context');
  if (!jsonScript) {
    console.warn('未找到 lentille-context');
    return;
  }

  const jsonData = JSON.parse(jsonScript.textContent);
  const introduction = jsonData?.data?.user?.introduction || '这个人很懒，什么都没有留下。';

  // 等待趋势图加载
  function waitForTrendCard(callback) {
    const observer = new MutationObserver(() => {
      const cards = document.querySelectorAll('.l-card');
      for (const card of cards) {
        const h3 = card.querySelector('h3.lfe-h3');
        if (h3 && h3.textContent.includes('比赛等级分趋势图')) {
          observer.disconnect();
          callback(card);
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  waitForTrendCard(trendCard => {
    const container = document.createElement('div');
    container.id = 'custom-introduction';
    container.className = 'l-card';
    container.style.overflowWrap = 'break-word';

    container.setAttribute('data-v-b62e56e7', '');
    container.setAttribute('data-v-65696950', '');
    container.setAttribute('data-v-754e1ea4-s', '');

    trendCard.parentNode.insertBefore(container, trendCard.nextSibling);

    container.innerHTML = `
      <h3 data-v-65696950="" style="margin:0;">个人介绍（插件显示）</h3>
      ${renderMarkdown(introduction)}
    `;
    console.log('[luoguUserIntroduction] 插入成功');
  });
})();
