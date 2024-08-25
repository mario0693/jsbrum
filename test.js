// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
// ==UserScript==
// @name         Blum Android Share
// @version      2024-07-07
// @namespace    Mokhoa.vn
// @autor        Mokhoa.vn
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://raw.githubusercontent.com/ilfae/ilfae/main/logo.webp
// ==/UserScript==

let GAME_SETTINGS = {
    BombHits: 0,
    IceHits: 99999,
    flowerSkipPercentage: 3,
};

let isGamePaused = true;
let isSettingsOpen = false;

let gameStats = {
    score: 0,
    bombHits: 0,
    iceHits: 0,
    flowersSkipped: 0,
    isGameOver: false,
};

const originalPush = Array.prototype.push;
Array.prototype.push = function (...items) {
    if (!isGamePaused) {
        items.forEach(item => {
            if (item && item.item) {
                switch (item.item.type) {
                    case "CLOVER":
                        processFlower(item);
                        break;
                    case "BOMB":
                        processBomb(item);
                        break;
                    case "FREEZE":
                        processIce(item);
                        break;
                }
            }
        });
    }
    return originalPush.apply(this, items);
};

function processFlower(element) {
    const shouldSkip = Math.random() < (GAME_SETTINGS.flowerSkipPercentage / 100);
    if (!shouldSkip) {
        processElementWithDelay(element, 1100, () => {
            gameStats.score++;
            clickElement(element);
        });
    } else {
        gameStats.flowersSkipped++;
    }
}

let bombClickCount = 0;

function processBomb(element) {
    if (bombClickCount < 5 && gameStats.bombHits < GAME_SETTINGS.BombHits) {
        processElementWithDelay(element, 1200, () => {
            gameStats.score = 0;
            clickElement(element);
            gameStats.bombHits++;
        });
        bombClickCount++;
    } else {
        gameStats.flowersSkipped++;
        bombClickCount = 0;
    }
}

let skipIce = false;

function processIce(element) {
    if (!skipIce && gameStats.iceHits < GAME_SETTINGS.IceHits) {
        processElementWithDelay(element, 1300, () => {
            clickElement(element);
            gameStats.iceHits++;
            skipIce = true;
        });
    } else {
        skipIce = false;
    }
}

function processElementWithDelay(element, delayMs, callback) {
    setTimeout(() => {
        callback();
    }, delayMs);
}

function clickElement(element) {
    element.onClick(element);
    element.isExplosion = true;
    element.addedAt = performance.now();
}

function checkGameCompletion() {
    const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');
    if (rewardElement && !gameStats.isGameOver) {
        gameStats.isGameOver = true;
        console.log(`Game Over. Stats: Score: ${gameStats.score}, Bombs: ${gameStats.bombHits}, Ice: ${gameStats.iceHits}, Flowers Skipped: ${gameStats.flowersSkipped}`);
        resetGameStats();
        if (window.__NUXT__.state.$s$0olocQZxou.playPasses > 0) {
            startNewGame();
        }
    }
}

function resetGameStats() {
    gameStats = {
        score: 0,
        bombHits: 0,
        iceHits: 0,
        flowersSkipped: 0,
        isGameOver: false,
    };
}

function getRandomDelay() {
    return Math.random() * (GAME_SETTINGS.maxDelayMs - GAME_SETTINGS.minDelayMs) + GAME_SETTINGS.minDelayMs;
}

function startNewGame() {
    setTimeout(() => {
        const newGameButton = document.querySelector("#app > div > div > div.buttons > button:nth-child(2)");
        if (newGameButton) {
            newGameButton.click();
        }
        gameStats.isGameOver = false;
    }, getRandomDelay());
}

const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            checkGameCompletion();
        }
    }
});

const appElement = document.querySelector('#app');
if (appElement) {
    observer.observe(appElement, { childList: true, subtree: true });
}

const controlsContainer = document.createElement('div');
controlsContainer.style.position = 'fixed';
controlsContainer.style.top = '0';
controlsContainer.style.left = '50%';
controlsContainer.style.transform = 'translateX(-50%)';
controlsContainer.style.zIndex = '9999';
controlsContainer.style.backgroundColor = 'black';
controlsContainer.style.padding = '10px 20px';
controlsContainer.style.borderRadius = '10px';
document.body.appendChild(controlsContainer);

const OutGamePausedTrue = document.createElement('a');
OutGamePausedTrue.href = atob('aHR0cHM6Ly9tb2tob2Eudm4=');
OutGamePausedTrue.textContent = atob('VEc6IE1va2hvYS52bg==');
OutGamePausedTrue.style.color = 'white';
controlsContainer.appendChild(OutGamePausedTrue);

const lineBreak = document.createElement('br');
controlsContainer.appendChild(lineBreak);

const pauseButton = document.createElement('button');
pauseButton.textContent = '▶';
pauseButton.style.padding = '4px 8px';
pauseButton.style.backgroundColor = '#5d2a8f';
pauseButton.style.color = 'white';
pauseButton.style.border = 'none';
pauseButton.style.borderRadius = '10px';
pauseButton.style.cursor = 'pointer';
pauseButton.style.marginRight = '5px';
pauseButton.onclick = toggleGamePause;
controlsContainer.appendChild(pauseButton);

const settingsButton = document.createElement('button');
settingsButton.textContent = 'Settings';
settingsButton.style.padding = '4px 8px';
settingsButton.style.backgroundColor = '#5d2a8f';
settingsButton.style.color = 'white';
settingsButton.style.border = 'none';
settingsButton.style.borderRadius = '10px';
settingsButton.style.cursor = 'pointer';
settingsButton.onclick = toggleSettings;
controlsContainer.appendChild(settingsButton);

const settingsContainer = document.createElement('div');
settingsContainer.style.display = 'none';
settingsContainer.style.marginTop = '10px';
controlsContainer.appendChild(settingsContainer);

function createSettingInput(label, settingName, min, max) {
    const settingDiv = document.createElement('div');
    settingDiv.style.marginBottom = '5px';
    settingDiv.style.color = 'white';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.style.display = 'block';
    labelElement.style.color = 'white';
    settingDiv.appendChild(labelElement);

    const inputElement = document.createElement('input');
    inputElement.type = 'number';
    inputElement.value = GAME_SETTINGS[settingName];
    inputElement.min = min;
    inputElement.max = max;
    inputElement.style.width = '50px';
    inputElement.addEventListener('input', () => {
        GAME_SETTINGS[settingName] = parseInt(inputElement.value, 10);
    });
    settingDiv.appendChild(inputElement);

    return settingDiv;
}

function toggleSettings() {
    isSettingsOpen = !isSettingsOpen;
    settingsContainer.style.display = isSettingsOpen ? 'block' : 'none';
    if (isSettingsOpen) {
        settingsContainer.innerHTML = '';
        settingsContainer.appendChild(createSettingInput('Bomb:', 'BombHits', 0, 10));
        settingsContainer.appendChild(createSettingInput('Ice:', 'IceHits', 0, 10));
        settingsContainer.appendChild(createSettingInput('Flower Skip %:', 'flowerSkipPercentage', 0, 100));
    }
}

let interval1;
let interval2;
let clickCount1 = 0;
let clickCount2 = 0;

function toggleGamePause() {
    isGamePaused = !isGamePaused;
    pauseButton.textContent = isGamePaused ? '▶' : '❚❚';

    if (isGamePaused) {
        clearInterval(interval1);
        clearInterval(interval2);
    } else {
        interval1 = setInterval(() => {
            const button1 = document.querySelector('#app > div > div > div.pages-index-drop.drop-zone > div > a');
            if (button1) {
                button1.click();
                clickCount1 = 0;
            } else {
                clickCount1++;
                if (clickCount1 >= 5) {
                    clearInterval(interval1);
                }
            }
        }, 5000);

        interval2 = setInterval(() => {
            const button2 = document.querySelector('#app > div > div > div.buttons > button:nth-child(2)');
            if (button2) {
                button2.click();
                clickCount2 = 0;
            } else {
                clickCount2++;
                if (clickCount2 >= 20) {
                    clearInterval(interval2);
                    clickCount2 = 0;
                }
            }
        }, 7000);
    }
}

const versionContainer = document.createElement('div');
versionContainer.style.position = 'fixed';
versionContainer.style.bottom = '10px';
versionContainer.style.right = '10px';
versionContainer.style.color = 'white';

const authorText = document.createElement('div');
authorText.textContent = atob('RnJlZSAwJA==');
versionContainer.appendChild(authorText);

const versionText = document.createElement('div');
versionText.textContent = atob('VmVyc2lvbiAxLjE=');
versionContainer.appendChild(versionText);

document.body.appendChild(versionContainer);
