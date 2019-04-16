// web worker
self.onmessage = e => {
  self.postMessage({responseTime: Date.now()-e.data.time})
}