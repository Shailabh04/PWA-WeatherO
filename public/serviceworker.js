const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

//this in the service worker file actually represents service worker
const self = this;

//Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened Cache');

            return cache.addAll(urlsToCache);
        })
    )
});

//Listener for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        //We respond with upper function in which we match al the request that our pages are saving like "API call or another Image request"
        caches.match(event.request)
            .then(() => {
                //then all the request, we simply catch them again | Always want to get new data.
                return fetch(event.request)
                    //In case we didn't fetch the data or that means we are offline, we simply return the offline.html file.
                    .catch(() => caches.match('offline.html'))
            })
    )
});

//Activate the Service Worker
self.addEventListener('activate', (event) => {
    //with time, a lot of things going to change, and we don't wnt to save all the previous versions. So to only save the latest updated data only.
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        //returns a promise
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                //if the cacheWhitelist doesnt include the cacheName
                if(!cacheWhitelist.includes(cacheName)) {
                    //then we want to delete the specific cacheName, but if includes the thing that we have here in the Whitelist above, then we wanna keep it.
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});