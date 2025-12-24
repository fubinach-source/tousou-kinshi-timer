let seconds = 0;
let timer = null;

let gaugeSeconds = 0;
const GAUGE_TIME = 1200; // 1200秒で1コイン（テスト用）

let coins = 0;

const timeEl = document.getElementById("time");
const coinsEl = document.getElementById("coins");
const gaugeBar = document.getElementById("gauge-bar");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");

const codeArea = document.getElementById("code-area");
const codeDisplay = document.getElementById("code-display");
const codeInput = document.getElementById("code-input");
const codeSubmit = document.getElementById("code-submit");

let currentCode = "";
let codeTimer = null;

function updateTime() {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  timeEl.textContent = `${h}:${m}:${s}`;
}

function stopTimer(reason) {
  clearInterval(timer);
  timer = null;
  alert(reason);
}

function showCodeCheck() {
  clearInterval(timer);
  timer = null;

  currentCode = String(Math.floor(1000 + Math.random() * 9000));
  codeDisplay.textContent = currentCode;
  codeInput.value = "";
  codeArea.style.display = "block";

  codeTimer = setTimeout(() => {
    codeArea.style.display = "none";
    stopTimer("時間切れ！コード未入力で停止！");
  }, 30000);
}

function startMainTimer() {
  timer = setInterval(() => {
    seconds++;
    gaugeSeconds++;
    updateTime();

    // ゲージ進行
    const progress = (gaugeSeconds / GAUGE_TIME) * 100;
    gaugeBar.style.width = progress + "%";

    // 色変化
    if (progress < 50) {
      gaugeBar.style.background = "#22c55e";
    } else if (progress < 80) {
      gaugeBar.style.background = "#eab308";
    } else {
      gaugeBar.style.background = "#ef4444";
    }

    // 満タン → 1コイン
    if (gaugeSeconds >= GAUGE_TIME) {
      coins++;
      coinsEl.textContent = "🪙 " + coins;
      gaugeSeconds = 0;
      gaugeBar.style.width = "0%";
    }

    // 10分ごとコードチェック
    if (seconds % 600 === 0) {
      showCodeCheck();
    }
  }, 1000);
}

startBtn.onclick = () => {
  if (timer) return;
  startMainTimer();
};

stopBtn.onclick = () => {
  stopTimer("手動停止");
};

codeSubmit.onclick = () => {
  if (codeInput.value === currentCode) {
    clearTimeout(codeTimer);
    codeArea.style.display = "none";
    startMainTimer();
  } else {
    stopTimer("コード間違い！停止！");
  }
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTimer("逃亡検知！タイマー停止！");
  }
});
