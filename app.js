
document.addEventListener("click", () => {navigator.serviceWorker.controller.postMessage("Hello, worker!")});

navigator.serviceWorker.addEventListener("message", function (e) {
  var pre = document.querySelector("pre");
  pre.innerHTML = `service worker says: \n ${JSON.stringify(e.data)} \n`;
});

