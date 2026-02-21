// ==UserScript==
// @name         Pinterest Pin Scraper - Fast CSV
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Scrapes Pins with 500ms delay and exports to CSV instantly.
// @author       Gemini
// @match        https://www.pinterest.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let pinDataMap = new Map();
    let scrollInterval = null;

    // --- UI SETUP ---
    const container = document.createElement('div');
    container.style = `
        position: fixed; top: 10px; right: 10px; z-index: 9999;
        background: white; padding: 15px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif;
        display: flex; flex-direction: column; gap: 8px; border: 1px solid #ddd;
    `;

    const statusLabel = document.createElement('div');
    statusLabel.innerHTML = '<b>Pins Collected:</b> <span id="pin-count">0</span>';

    const startBtn = createBtn('Start Scraping', '#E60023', 'white');
    const stopBtn = createBtn('Stop & Export CSV', '#333', 'white');

    container.appendChild(statusLabel);
    container.appendChild(startBtn);
    container.appendChild(stopBtn);
    document.body.appendChild(container);

    function createBtn(text, bg, color) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style = `background: ${bg}; color: ${color}; border: none; padding: 8px 12px;
                    border-radius: 4px; cursor: pointer; font-weight: bold;`;
        return btn;
    }

    // --- SCRAPER LOGIC ---
    function scrapePins() {
        const pinCards = document.querySelectorAll('div[aria-label="Pin card"]');

        pinCards.forEach(card => {
            if (card.dataset.processed) return;

            try {
                const linkEl = card.querySelector('div > div > div > a');
                const pinLink = linkEl ? linkEl.href : null;

                if (!pinLink) return;

                const statsContainer = card.querySelector('div[data-test-id="pin-stats-footer"] > div');

                let views = "0", pins = "0", clicks = "0";
                if (statsContainer && statsContainer.children.length >= 3) {
                    const stats = statsContainer.children;
                    // Removed 'const' keywords here so they update the outer variables correctly
                    views = stats[0]?.innerText?.replace(/\D/g,'') || "0";
                    pins = stats[1]?.innerText?.replace(/\D/g,'') || "0";
                    clicks = stats[2]?.innerText?.replace(/\D/g,'') || "0";
                }

                pinDataMap.set(pinLink, {
                    link: pinLink,
                    views: views,
                    pins: pins,
                    clicks: clicks
                });

                card.dataset.processed = "true";
            } catch (e) {}
        });

        document.getElementById('pin-count').innerText = pinDataMap.size;
        window.scrollBy(0, window.innerHeight);
    }

    // --- CSV CONVERSION ---
    function downloadCSV(data) {
        const headers = ["Link", "Views", "Pins", "Clicks"];
        const csvRows = [headers.join(",")];

        data.forEach(item => {
            const row = [
                `"${item.link}"`,
                `"${item.views}"`,
                `"${item.pins}"`,
                `"${item.clicks}"`
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `pinterest_data_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- BUTTON ACTIONS ---
    startBtn.onclick = () => {
        if (!scrollInterval) {
            scrollInterval = setInterval(scrapePins, 500); // 500ms delay as requested
            startBtn.innerText = "Scraping...";
            startBtn.style.opacity = "0.6";
        }
    };

    stopBtn.onclick = () => {
        clearInterval(scrollInterval);
        scrollInterval = null;
        startBtn.innerText = "Start Scraping";
        startBtn.style.opacity = "1";

        const data = Array.from(pinDataMap.values());
        if(data.length > 0) {
            downloadCSV(data);
        } else {
            alert("No data collected yet!");
        }
    };

})();