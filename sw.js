/************************************************************
    Create an array of file paths to files you want to have
    available offline. Think of it like an App Shell.
    You may want to cache all files if you are
    making a game or similar and don't need 
    network access while using the app.
******************************/
var filesToCache=[
  "/pwa/",
  "/pwa/index.html",
  "/pwa/css/style.css",
  "/pwa/js/app.js",
  "/pwa/app.webmanifest",
  "/pwa/images/icons/icon-128x128.png",
  "/pwa/images/icons/icon-144x144.png",
  "/pwa/images/icons/icon-152x152.png",
  "/pwa/images/icons/icon-192x192.png",
  "/pwa/images/icons/icon-384x384.png",
  "/pwa/images/icons/icon-512x512.png",
  "/pwa/images/icons/icon-72x72.png",
  "/pwa/images/icons/icon-96x96.png"
];

/************************************************************
    The Caches object can consist of multiple named caches. 
    During install, we create a new named cache. 
******************************/
latestCacheName = 'App-Shell-v2';

/** ** ** ** ** ** ** ** ** ** ** **
 * This will only run once, during install. 
 * It opens a new cache ('App-Shell-v1')
 * adds the entire array of files,
 * then activates itself using
 * self.skipWaiting()
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(latestCacheName)
      .then(function (cache) {
        return cache.addAll(filesToCache)
        .then(() => self.skipWaiting());
      })
  );
});

/************************************************************
    this event fires when a new service worker is activated.
    it's a good place to remove the 
    old caches, if there are any 
******************************/
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(allCaches => {
        allCaches.forEach(cache => {
          if (cache !== latestCacheName) {
              caches.delete(cache);
          }
        })
    })
  );
});


/* * * * * * * ***********************
    Hijacking the user's web requests.
    if match in caches, return 
    cached file, else return 
    the requested file from 
    the web server.
******************************/
self.addEventListener('fetch', function (event) {
  event.respondWith( 
    caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
);
});

/*********************************************************************************************
 * 
    Sending messages using postMessage
    and listening to dito
*************************************/

// get info about the sender:
self.addEventListener("message", function whoPosted(event) {
  console.log("Message received:",                event.data);
  console.log("From a window with the id:",       event.source.id);
  console.log("which is currently pointing at:",  event.source.url);
  console.log("and is",                           event.source.focused? "focused":"not focused");
  console.log("and",                              event.source.visibilityState);
  event.source.postMessage( "Hello, page!" );
});
