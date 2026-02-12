const CACHE_NAME = "QuizConcursoPoliciaFederal-v1";
const urlsToCache = ["index.html", "style.css"];

// Instala e adiciona arquivos básicos ao cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Remove caches antigos quando ativado
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Estratégia Network First
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Se a resposta for válida, atualiza o cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se falhar (offline), tenta servir do cache
        return caches.match(event.request);
      })
  );
});
