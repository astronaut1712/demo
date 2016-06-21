var dataCacheName = 'Flickr-v1-data';
var cacheName = 'Flickr-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/stylesheets/inline.css',
  '/javascripts/main.js',
  '/javascripts/jquery-3.0.0.min.js',
  '/javascripts/Flickr.js',
  '/images/bkg.png',
  '/images/blacktocat.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = "https://api.flickr.com/";
  if(e.request.url.startsWith(dataUrl)){
    return fetch(e.request);
  }else{
    e.respondWith(
      caches.match(e.request).then(function(response) {
        if (response) {
          return response;
        } else {
          fetch(e.request).then(function(response) {
            return caches.open(dataCacheName).then(function(cache) {
              cache.put(e.request.url, response.clone());
              console.log('[ServiceWorker] Fetched&Cached Data');
              return response;
            });
          })
        }
      })
    );
  }
});
