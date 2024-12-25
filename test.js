// ==UserScript==
// @name         Auto Blum
// @namespace    http://tampermonkey.net/
// @version      16-10-2024
// @description  Đã sợ thì đừng dùng, đã dùng thì đừng sợ!
// @author       caobang
// @match        https://telegram.blum.codes/*
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// @grant        none
// ==/UserScript==

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
let isGamePaused = true
function toggleGamePause() {
    isGamePaused = !isGamePaused;
    pauseButton.textContent = isGamePaused ? '▶' : '❚❚';

    if (isGamePaused) {
        clearInterval(interval1);
        clearInterval(interval2);
    } else {
		console.log("isGamePaused" +isGamePaused)
        interval1 = setInterval(() => {
            const button1 = document.querySelector('button.is-primary');
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
            const button2 = document.querySelector('.play-btn');
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

(() => {
  if (window.BlumAC) return;
  window.BlumAC = true;

  const config = {
    autoPlay: false,
    autorePlay: true,
    greenColor: [208, 216, 0],
	Color1: [194, 20, 139],
	Color2: [255, 255, 255],
	Color3: [254, 137, 0],
	Color4: [217, 216, 0],
    tolerance: 5,
    playButtonSelector: ".play-btn",
	replayButtonSelector: "button.is-primary",
    canvasSelector: "canvas",
    playCheckInterval: 5000,
    objectCheckInterval: 100,
    excludedArea: { top: 70 }
  };

  // Tự động nhấn nút "Play"
  if (config.autoPlay) {
    setInterval(() => {
      const playButton = document.querySelector(config.playButtonSelector);
      if (playButton && playButton.textContent.toLowerCase().includes("play")) {
        playButton.click();
      }
    }, config.playCheckInterval);
  }
  if (config.autorePlay) {
    setInterval(() => {
      const playButton = document.querySelector(config.replayButtonSelector);
      if (playButton && playButton.textContent.toLowerCase().includes("play")) {
        playButton.click();
      }
    }, config.playCheckInterval);
  }

  setInterval(() => {
    const canvas = document.querySelector(config.canvasSelector);
    if (canvas) detectAndClickObjects(canvas);
  }, config.objectCheckInterval);

  function detectAndClickObjects(canvas) {
    const { width, height } = canvas;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for (let y = config.excludedArea.top; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];

        if (isInGreenRange(r, g, b, config.greenColor, config.tolerance)) {
          simulateClick(canvas, x, y);
        }
		if (isInGreenRange(r, g, b, config.Color1, config.tolerance)) {
          simulateClick(canvas, x, y);
        }
		if (isInGreenRange(r, g, b, config.Color2, config.tolerance)) {
          simulateClick(canvas, x, y);
        }
		if (isInGreenRange(r, g, b, config.Color3, config.tolerance)) {
          simulateClick(canvas, x, y);
        }
		if (isInGreenRange(r, g, b, config.Color4, config.tolerance)) {
          simulateClick(canvas, x, y);
        }
      }
    }
  }

  function isInGreenRange(r, g, b, greenColor, tolerance) {
    return greenColor.every((color, i) => Math.abs([r, g, b][i] - color) <= tolerance);
  }

  function simulateClick(canvas, x, y) {
    const eventProps = { clientX: x, clientY: y, bubbles: true };
    ['click', 'mousedown', 'mouseup'].forEach(event => {
      canvas.dispatchEvent(new MouseEvent(event, eventProps));
    });
  }
})();
