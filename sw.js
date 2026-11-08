// Familienplaner: lädt die Seite zuerst aus dem Netz und hält eine Kopie, falls das Internet fehlt.
var NAME = "familienplaner-v1";
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(NAME).then(function (c) { return c.addAll(["./", "index.html", "manifest.json"]); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || e.request.url.indexOf(self.location.origin) !== 0) return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var kopie = r.clone(); caches.open(NAME).then(function (c) { c.put(e.request, kopie); }); return r;
    }).catch(function () {
      return caches.match(e.request).then(function (m) { return m || caches.match("index.html"); });
    })
  );
});
