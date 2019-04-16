/** 
 * Register an ordinary web worker
*/
var requests = [];
var ww = new Worker('/js/webworker.js');
var pre = document.querySelector("pre");
var h1  = document.querySelector("h1") ? document.querySelector("h1") : document.body.insertAdjacentElement("afterBegin", document.createElement("h1"))

document.querySelector("pre").addEventListener("click", () => {ww.postMessage({time: Date.now()})});
document.querySelector("html").addEventListener("dblclick", () => {navigator.serviceWorker.controller.postMessage({time: Date.now()})});



ww.onmessage=e => {
  pre.innerHTML = `
  webWorkerResponse: ${JSON.stringify(e.data)}\n`;
}
navigator.serviceWorker.addEventListener("message", function (e) {
  h1.innerHTML=`sw says: \n ${e.data} \n`;
});

