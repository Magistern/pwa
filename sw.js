var filesToCache=[
  "/",
  "/images.html",
  "/index.html",
  "/css/style.css",
  "/app.webmanifest",
  "/images/icons/icon-128x128.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-384x384.png",
  "/images/icons/icon-512x512.png",
  "/images/icons/icon-72x72.png",
  "/images/icons/icon-96x96.png"
  //   "/js/app.js",
]; //  "/js/webworker.js" good or bad? 

/************************************************************
    The Caches object can consist of multiple named caches. 
    During install, we create a new named cache. 
    If there was a previous named cache
    we should delete it.
******************************/
latestCacheName = 'App-Shell-v9';


/************************************************************
    Activating new service worker. Remove old named caches
******************************/
self.addEventListener('activate', event => {
  const activeCache=latestCacheName; //don't remove the current named cache
  event.waitUntil(
    caches.keys().then(allCaches => {
        allCaches.forEach(cache => {
          if (activeCache !== cache) {
            caches.delete(cache);
          }
        })
    })
  );
});
/** ** ** ** ** ** ** ** ** ** ** **
 * This is only run during install. 
 * That means, files that you 
 * cache hear will be the 
 * app shell. If you 
 * change your mind 
 * and add more 
 * files to it,
 * you need to
 * ... dunno? 
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(latestCacheName)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(filesToCache)
        .then(() => self.skipWaiting());
      })
  );
});

/* * * * * * * ***********************
    How to respond to a fetch event.
    if match in cache, return 
    cached file, else return 
    the requested file from 
    the web server.
******************************/
self.addEventListener('fetch', function (event) {
  event.respondWith( 
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          //console.log("Fanns i cache. Status "+response.status+" för filen "+response.url.substring(response.url.lastIndexOf("/")+1));
          return response;
        }
        return fetch(event.request);
      })
  );
});

/*********************************************************************************************
 * 
    Sending messages using postMessage
    and listening to dito
*************************************/
self.addEventListener("message", function justLog(event) {
  console.log(event.data);
});

// to post a message to the worker from a page:
/*

navigator.serviceWorker.controller.postMessage('hello world!')

*/

// To listen for a message from a SW on the page:
/* 

navigator.serviceWorker.addEventListener("message", function (event) {
  console.log('I got this \n'+event.data +' \nback from the sw');
});

*/


// get info about the sender:
self.addEventListener("message", function whoPosted(event) {
/*   console.log("Message received:",                event.data);
  console.log("From a window with the id:",       event.source.id);
  console.log("which is currently pointing at:",  event.source.url);
  console.log("and is",                           event.source.focused? "focused":"not focused");
  console.log("and",                              event.source.visibilityState); */
  event.source.postMessage({responseTime: Date.now()-event.data.time});
  self.clients.matchAll().then(function (clients) {
    let match=clients.filter((client, i) => {client.id==event.source.id})[0]
    clients.forEach(function (client, i) {
      if (client.id !== event.source.id ) {
        client.postMessage("sibling page got clicked: " + match);
      } else {
        client.postMessage("I got clicked: " + i );
      }
    });
  });

});

// to make sure the sw is really activated:
/*
if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage(
    "cache-current-page"
  );
}
 */


//finding all windows currently open: 
/* 
self.clients.matchAll().then(function(clients) {
  clients.forEach(function(client) {
      client.postMessage("Hi client: "+client.id);
  });
});



*/


/******************************
    This is another cache pattern
    it doens't return a promice 
    for all files in waitUntil
    keeps caching in the 
    background.
******************************/

 
/*  self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function(cache) {
      cache.addAll(
        // levels 11-20
      );
      return cache.addAll(
        // core assets & levels 1-10
      );
    })
  );
}); */



//Remy Martins copy paste SW

/************************************************************
https://remysharp.com/2016/03/22/the-copy-paste-guide-to-your-first-service-worker#-the-service-worker
    
******************************/