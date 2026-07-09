// Web Worker — runs independently of main thread
// Keeps ticking even when screen dims
let interval = null;
let seconds = 0;

self.onmessage = (e) => {
  const { type, value } = e.data;

  if (type === "START") {
    if (interval) return;
    interval = setInterval(() => {
      seconds++;
      self.postMessage({ type: "TICK", seconds });
    }, 1000);
  }

  if (type === "PAUSE") {
    clearInterval(interval);
    interval = null;
  }

  if (type === "RESET") {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    self.postMessage({ type: "TICK", seconds });
  }

  if (type === "SET") {
    seconds = value || 0;
  }
};
