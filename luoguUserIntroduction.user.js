// ==UserScript==
// @name         洛谷个人介绍显示
// @namespace    https://www.luogu.com.cn/user/
// @version      beta2.0
// @description  自动显示 user.introduction，等待比赛趋势图加载，并通过其定位插入位置，图片大小自适应
// @author       songlll
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @downloadURL  https://songlll.pages.dev/luoguUserIntroduction.user.js
// @updateURL    https://songlll.pages.dev/luoguUserIntroduction.user.js
// @require      https://songlll.pages.dev/markdown.js
// @require      https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.js
// @require      https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js
// ==/UserScript==

(async function() {
    'use strict';

    function renderMarkdown(text) {
        const html = window.runMarkdown(text);
        const container = document.createElement('div');
        container.innerHTML = html;
        // 图片自适应盒子
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

        return container.innerHTML;
    }

    // 获取用户介绍数据
    const jsonScript = document.getElementById('lentille-context');
    if (!jsonScript) return;
    const jsonData = JSON.parse(jsonScript.textContent);
    const introduction = jsonData.data.user.introduction || '这个人很懒，什么都没有留下。';

    // 等待趋势图加载
    function waitForTrendCard(callback) {
        const interval = setInterval(() => {
            const cards = document.querySelectorAll('.l-card');
            let trendCard = null;
            cards.forEach(card => {
                const h3 = card.querySelector('h3.lfe-h3');
                if (h3 && h3.textContent.includes('比赛等级分趋势图')) {
                    trendCard = card;
                }
            });
            if (trendCard) {
                clearInterval(interval);
                callback(trendCard);
            }
        }, 200);
    }

    waitForTrendCard(trendCard => {
        const container = document.createElement('div');
        container.id = 'custom-introduction';
        container.className ='l-card';
        container.style.overflowWrap = 'break-word';

        container.setAttribute('data-v-b62e56e7', '');
        container.setAttribute('data-v-65696950', '');
        container.setAttribute('data-v-754e1ea4-s', '');
        trendCard.parentNode.insertBefore(container, trendCard.nextSibling);

        container.innerHTML = "<h3 data-v-65696950=\"\" style=\"margin: 0px;\">个人介绍 （插件显示）</h3>"+renderMarkdown(introduction);
    });
})();
