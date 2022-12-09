self.addEventListener("install", event => {
    console.log("install")
    event.waitUntil(
        caches.open("my-cache-1")
            .then(cache => {
                cache.addAll(["./", "./src/style.css", "./src/script.js", "./src/micromustache.umd.js"]);
            })
    )
    self.skipWaiting();
})


self.addEventListener("fetch", event => {
    console.log("Intercepting fetch request for:", event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response) {
                    return response
                }
                return fetch(event.request)
            })
    )
})