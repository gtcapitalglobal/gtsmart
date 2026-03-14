// ============================================================
// GT Smart Equity — Service Worker
// Versão: gt-smart-v11 | 13/03/2026
// ============================================================

const CACHE_NAME = 'gt-smart-v11';

const ARQUIVOS_CACHE = [
    '/',
    '/manifest.json',
    '/firebase-config.js',

    // GT Smart Equity
    '/GT_Smart_Login.html',
    '/GT_Smart_Menu.html',
    '/GT_Smart_Alertas.html',
    '/GT_Smart_Backup.html',
    '/GT_Smart_Busca.html',
    '/GT_Smart_Calculadora_Nova.html',
    '/GT_Smart_Calendario.html',
    '/GT_Smart_Calendario_Cartoes.html',
    '/GT_Smart_Cartoes.html',
    '/GT_Smart_Comparar_Cartoes.html',
    '/GT_Smart_Configuracoes.html',
    '/GT_Smart_Cripto.html',
    '/GT_Smart_Dashboard_Cartoes.html',
    '/GT_Smart_Estrategia.html',
    '/GT_Smart_Gestao.html',
    '/GT_Smart_Relatorios.html',

    // Empréstimos
    '/GT_Smart_Adicionar_Emprestimo.html',
    '/GT_Smart_Editar_Emprestimo.html',
    '/GT_Smart_Detalhe_Emprestimo.html',

    // Dívidas
    '/GT_Smart_Minhas_Dividas.html',
    '/GT_Smart_Adicionar_Divida.html',
    '/GT_Smart_Editar_Divida.html',
    '/GT_Smart_Detalhe_Divida.html',

    // Cartões
    '/GT_Smart_Adicionar_Cartao.html',
    '/GT_Smart_Editar_Cartao.html',
    '/GT_Smart_Detalhe_Cartao.html',

    // Empresas
    '/GT_Smart_Empresas.html',
    '/GT_Smart_Detalhe_Empresa.html',

    // Contratos
    '/GT_Smart_Gerador_Contrato.html',
    '/GT_Smart_Historico_Contratos.html',

    // DeFi
    '/GT_Smart_DeFi_Dashboard.html',
    '/GT_Smart_DeFi_Pools.html',
    '/GT_Smart_DeFi_Borrows.html',
    '/GT_Smart_DeFi_Colateral.html',
    '/GT_Smart_DeFi_Fees.html',

    // Ledgerlands
    '/LL_Menu.html',
    '/LL_Dashboard.html',
    '/LL_Alertas.html',
    '/LL_Buyers.html',
    '/LL_BuyerForm.html',
    '/LL_BuyerReview.html',
    '/LL_Contracts.html',
    '/LL_Detalhe_Contrato.html',
    '/LL_Installments.html',
    '/LL_Payments.html',
    '/LL_Properties.html',
    '/LL_TaxSchedule.html',
    '/LL_PaymentPortal.html',

    // Outros
    '/404.html',
    '/icon-192.png',
    '/icon-512.png',
];

// INSTALAÇÃO — cacheia todos os arquivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ARQUIVOS_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// ATIVAÇÃO — remove caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((nomes) => {
            return Promise.all(
                nomes
                    .filter((nome) => nome !== CACHE_NAME)
                    .map((nome) => caches.delete(nome))
            );
        }).then(() => self.clients.claim())
    );
});

// FETCH — network first, cache como fallback
self.addEventListener('fetch', (event) => {
    // Ignora requisições externas (Firebase, CoinGecko etc.)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Atualiza o cache com a versão mais recente
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // Offline: usa o cache
                return caches.match(event.request).then((cached) => {
                    return cached || caches.match('/GT_Smart_Login.html');
                });
            })
    );
});
