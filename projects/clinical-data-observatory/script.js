document.addEventListener('DOMContentLoaded', () => {
    const datasets = [
        {
            id: 'ehr',
            name: 'EHR encounters',
            owner: 'Clinical Data',
            state: 'warn',
            freshness: 82,
            desc: 'Encuentros medicos y admisiones. El SLA esta demorado por una cola SFTP del origen on-premise.',
            meta: ['18.4M rows', 'owner: data clinic', 'SLA 30m'],
            rules: [
                ['ok', 'patient_id presente en 100% de filas'],
                ['warn', 'freshness excedida por 12 minutos'],
                ['ok', 'PHI tokenizada para entornos no productivos']
            ]
        },
        {
            id: 'labs',
            name: 'Lab results',
            owner: 'Diagnostics',
            state: 'ok',
            freshness: 98,
            desc: 'Resultados de laboratorio normalizados con unidades y rangos clinicos versionados.',
            meta: ['6.2M rows', 'owner: diagnostics', 'SLA 15m'],
            rules: [
                ['ok', 'unidades normalizadas'],
                ['ok', 'rango clinico validado'],
                ['ok', 'sin duplicados criticos']
            ]
        },
        {
            id: 'claims',
            name: 'Claims feed',
            owner: 'Revenue Ops',
            state: 'bad',
            freshness: 64,
            desc: 'Feed financiero con retraso de lote. BI clinico no se bloquea, pero revenue cycle recibe alerta.',
            meta: ['3.9M rows', 'owner: rev ops', 'SLA 2h'],
            rules: [
                ['bad', 'lote de facturacion incompleto'],
                ['ok', 'schema compatible'],
                ['warn', 'volumen 18% bajo la media']
            ]
        }
    ];

    const incident = [
        ['09:12', 'Detectado', 'EHR ingest supero la ventana esperada.'],
        ['09:16', 'Aislado', 'El retraso viene del origen SFTP.'],
        ['09:22', 'Mitigado', 'Se activo reintento con watermark.'],
        ['09:31', 'Proximo', 'Reprocesar particion y cerrar alerta.']
    ];

    const list = document.getElementById('datasetList');
    const name = document.getElementById('datasetName');
    const desc = document.getElementById('datasetDesc');
    const meta = document.getElementById('datasetMeta');
    const freshnessValue = document.getElementById('freshnessValue');
    const freshnessBar = document.getElementById('freshnessBar');
    const rules = document.getElementById('qualityRules');
    const lastSync = document.getElementById('lastSync');
    const reliabilityScore = document.getElementById('reliabilityScore');
    let active = datasets[0].id;

    function renderList() {
        list.innerHTML = datasets.map(dataset => `
            <button class="dataset-item ${dataset.id === active ? 'active' : ''}" data-id="${dataset.id}">
                <span>
                    <strong>${dataset.name}</strong>
                    <small>${dataset.owner}</small>
                </span>
                <em class="status ${dataset.state}">${dataset.state}</em>
            </button>
        `).join('');

        list.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                active = button.dataset.id;
                renderList();
                renderDetail();
            });
        });
    }

    function renderDetail() {
        const dataset = datasets.find(item => item.id === active) || datasets[0];
        name.textContent = dataset.name;
        desc.textContent = dataset.desc;
        meta.innerHTML = dataset.meta.map(item => `<span>${item}</span>`).join('');
        freshnessValue.textContent = `${dataset.freshness}%`;
        freshnessBar.style.setProperty('--value', `${dataset.freshness}%`);
        rules.innerHTML = dataset.rules.map(([state, text]) => `
            <div class="rule">
                <span class="dot ${state}"></span>
                <div>
                    <strong>${state === 'ok' ? 'Validado' : state === 'warn' ? 'Revisar' : 'Bloqueante'}</strong>
                    <p>${text}</p>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('incidentSteps').innerHTML = incident.map(([time, title, text]) => `
        <div class="incident-step">
            <time>${time}</time>
            <strong>${title}</strong>
            <p>${text}</p>
        </div>
    `).join('');

    document.getElementById('refreshState').addEventListener('click', () => {
        const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
        lastSync.textContent = `Sincronizado ${now}`;
        reliabilityScore.textContent = '97';
    });

    document.getElementById('runQuality').addEventListener('click', () => {
        const dataset = datasets.find(item => item.id === active);
        dataset.rules = dataset.rules.map(rule => rule[0] === 'bad' ? ['warn', 'lote reprocesado, requiere confirmacion'] : rule);
        if (dataset.freshness < 90) dataset.freshness += 8;
        renderDetail();
    });

    renderList();
    renderDetail();
});
