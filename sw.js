const CACHE_NAME = 'gt-smart-v2';
const urlsToCache = [
  '/',
  '/GT_Smart_Login.html',
  '/GT_Smart_Menu.html',
  '/GT_Smart_Gestao.html',
  '/GT_Smart_Adicionar_Emprestimo.html',
  '/GT_Smart_Detalhe_Emprestimo.html',
  '/GT_Smart_Editar_Emprestimo.html',
  '/GT_Smart_Calculadora_Nova.html',
  '/GT_Smart_Gerador_Contrato.html',
  '/GT_Smart_Historico_Contratos.html',
  '/GT_Smart_Minhas_Dividas.html',
  '/GT_Smart_Calendario.html',
  '/GT_Smart_Relatorios.html',
  '/GT_Smart_Configuracoes.html',
  '/GT_Smart_Cartoes.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});
