document.addEventListener('DOMContentLoaded', () => {
    const listings = [
        {
            id: 'MLA-884',
            title: 'Auriculares gamer 48hs bateria',
            status: 'risk',
            score: 61,
            reason: 'Precio arriba del lider y CTR bajo.',
            impact: '+$430k',
            meta: ['Audio', '0.8% CTR', 'stock 9 dias'],
            scores: { Titulo: 58, Precio: 42, Envio: 86 },
            steps: ['Mover 48hs bateria al inicio.', 'Bajar precio 4% por 72 horas.', 'Cambiar imagen principal.']
        },
        {
            id: 'MLA-241',
            title: 'Smartwatch deportivo resistente al agua',
            status: 'growth',
            score: 78,
            reason: 'Puede ganar ranking si entra a Full.',
            impact: '+$215k',
            meta: ['Wearables', '2.1% CTR', 'stock 18 dias'],
            scores: { Titulo: 81, Precio: 76, Envio: 49 },
            steps: ['Enviar lote piloto a Full.', 'Agregar compatibilidad Android/iOS.', 'Testear cupon mobile.']
        },
        {
            id: 'MLA-399',
            title: 'Teclado mecanico RGB switch red',
            status: 'ok',
            score: 92,
            reason: 'Publicacion sana, margen estable.',
            impact: '+$128k',
            meta: ['Gaming', '4.2% CTR', 'stock 22 dias'],
            scores: { Titulo: 94, Precio: 89, Envio: 93 },
            steps: ['Escalar pauta 18%.', 'Crear bundle con mouse.', 'Proteger stock antes del pico.']
        },
        {
            id: 'MLA-812',
            title: 'Notebook Ryzen 7 16GB ultraliviana',
            status: 'risk',
            score: 57,
            reason: 'Ticket alto con quiebre proyectado.',
            impact: '+$690k',
            meta: ['Computacion', '2.9% CTR', 'stock 4 dias'],
            scores: { Titulo: 79, Precio: 71, Envio: 38 },
            steps: ['Reponer 40 unidades.', 'Responder preguntas de garantia.', 'Pausar descuentos.']
        }
    ];

    const activity = [
        ['09:44', 'Audio: competidor bajo precio 6.8%.'],
        ['09:31', 'Busqueda "auriculares gamer" subio 22%.'],
        ['09:12', 'Notebook Ryzen entra en riesgo de stock.'],
        ['08:58', 'Smartwatch habilitado para envio Full.']
    ];

    const els = {
        accountScore: document.getElementById('accountScore'),
        listingList: document.getElementById('listingList'),
        detailTitle: document.getElementById('detailTitle'),
        detailText: document.getElementById('detailText'),
        detailMeta: document.getElementById('detailMeta'),
        scoreList: document.getElementById('scoreList'),
        nextSteps: document.getElementById('nextSteps'),
        titleInput: document.getElementById('titleInput'),
        analyzeBtn: document.getElementById('analyzeBtn'),
        titleScore: document.getElementById('titleScore'),
        titleFeedback: document.getElementById('titleFeedback'),
        activityFeed: document.getElementById('activityFeed')
    };

    let activeId = listings[0].id;

    function renderListings(filter = 'all') {
        const visible = listings.filter(item => filter === 'all' || item.status === filter);
        if (!visible.some(item => item.id === activeId)) activeId = visible[0]?.id || listings[0].id;

        els.listingList.innerHTML = visible.map(item => `
            <button class="listing ${item.id === activeId ? 'active' : ''}" data-id="${item.id}">
                <span>
                    <h3>${item.title}</h3>
                    <small>${item.id} / ${item.reason}</small>
                </span>
                <strong class="listing-score ${item.status}">${item.score}</strong>
            </button>
        `).join('');

        els.listingList.querySelectorAll('.listing').forEach(button => {
            button.addEventListener('click', () => {
                activeId = button.dataset.id;
                renderListings(filter);
                renderDetail();
            });
        });

        renderDetail();
    }

    function renderDetail() {
        const item = listings.find(listing => listing.id === activeId) || listings[0];
        els.detailTitle.textContent = item.title;
        els.detailText.textContent = item.reason;
        els.detailMeta.innerHTML = item.meta.map(meta => `<span class="pill">${meta}</span>`).join('');
        els.scoreList.innerHTML = Object.entries(item.scores).map(([label, value]) => `
            <div class="score-row">
                <span>${label}</span>
                <div class="bar"><span style="--value:${value}%"></span></div>
                <strong>${value}</strong>
            </div>
        `).join('');
        els.nextSteps.innerHTML = item.steps.map(step => `<li>${step}</li>`).join('');
    }

    function analyzeTitle() {
        const value = els.titleInput.value.trim().toLowerCase();
        const checks = [
            value.length >= 48 && value.length <= 70 ? 24 : 13,
            /(auriculares|notebook|smartwatch|teclado|camara)/.test(value) ? 26 : 12,
            /(\d|bateria|rgb|ryzen|dpi|inalambrico|full)/.test(value) ? 27 : 14,
            /(oferta|barato|promo|imperdible)/.test(value) ? 9 : 23
        ];
        const score = checks.reduce((sum, item) => sum + item, 0);
        els.titleScore.textContent = score;
        els.titleFeedback.textContent = score >= 82
            ? 'Claro, buscable y con atributos concretos.'
            : score >= 68
                ? 'Buen titulo; conviene sumar un atributo fuerte.'
                : 'Le falta intencion de busqueda y precision.';
    }

    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            renderListings(button.dataset.filter);
        });
    });

    els.analyzeBtn.addEventListener('click', analyzeTitle);
    els.titleInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') analyzeTitle();
    });

    els.activityFeed.innerHTML = activity.map(([time, text]) => `
        <div class="event">
            <time>${time}</time>
            <p>${text}</p>
        </div>
    `).join('');

    let score = 76;
    const scoreTimer = setInterval(() => {
        score += 1;
        els.accountScore.textContent = score;
        if (score === 84) clearInterval(scoreTimer);
    }, 55);

    renderListings();
    analyzeTitle();
});
