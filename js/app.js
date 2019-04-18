
var pre = document.querySelector("pre");

document.addEventListener("click", () => {navigator.serviceWorker.controller.postMessage("Hello, worker!")});

navigator.serviceWorker.addEventListener("message", function (e) {
  pre.innerHTML = `service worker says: \n ${JSON.stringify(e.data)} \n`;
});

