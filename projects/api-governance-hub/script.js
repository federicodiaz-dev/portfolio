document.addEventListener('DOMContentLoaded', () => {
    const endpoints = [
        {
            id: 'orders',
            name: 'Orders API',
            method: 'GET',
            path: '/v2/orders/{orderId}',
            desc: 'Consulta una orden con trazabilidad, pagos y estado logistico.',
            availability: '99.94%',
            latency: 182,
            score: 91,
            policies: [['good', 'JWT'], ['good', 'rate limit'], ['good', 'schema validation'], ['warn', 'missing example']],
            response: { orderId: 'ORD-24591', status: 'in_transit', traceId: 'trc_91ac2', owner: 'commerce-platform' }
        },
        {
            id: 'risk',
            name: 'Risk Scoring',
            method: 'POST',
            path: '/v1/risk/score',
            desc: 'Evalua senales de fraude y devuelve una decision explicable.',
            availability: '99.88%',
            latency: 236,
            score: 84,
            policies: [['good', 'JWT'], ['warn', 'PII review'], ['good', 'audit log'], ['good', 'timeout 800ms']],
            response: { score: 0.18, decision: 'approve', reasons: ['known_device', 'low_velocity'], traceId: 'trc_77bf0' }
        },
        {
            id: 'identity',
            name: 'Identity API',
            method: 'PATCH',
            path: '/v3/users/{userId}/profile',
            desc: 'Actualiza perfil con contrato estricto y auditoria de cambios.',
            availability: '99.97%',
            latency: 154,
            score: 96,
            policies: [['good', 'OAuth scopes'], ['good', 'RBAC'], ['good', 'idempotency'], ['good', 'audit log']],
            response: { userId: 'usr_932', changed: ['phone'], version: 17, traceId: 'trc_52ae9' }
        }
    ];

    const endpointList = document.getElementById('endpointList');
    const serviceName = document.getElementById('serviceName');
    const servicePath = document.getElementById('servicePath');
    const methodBadge = document.getElementById('methodBadge');
    const urlInput = document.getElementById('urlInput');
    const policyList = document.getElementById('policyList');
    const availabilityValue = document.getElementById('availabilityValue');
    const latencyValue = document.getElementById('latencyValue');
    const contractScore = document.getElementById('contractScore');
    const responseMeta = document.getElementById('responseMeta');
    const jsonOutput = document.getElementById('jsonOutput');
    const contractOutput = document.getElementById('contractOutput');
    let active = endpoints[0].id;

    function selected() {
        return endpoints.find(endpoint => endpoint.id === active) || endpoints[0];
    }

    function renderRail() {
        endpointList.innerHTML = endpoints.map(endpoint => `
            <button class="endpoint ${endpoint.id === active ? 'active' : ''}" data-id="${endpoint.id}">
                <strong>${endpoint.name}</strong>
                <small>${endpoint.method} ${endpoint.path}</small>
            </button>
        `).join('');

        endpointList.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                active = button.dataset.id;
                render();
            });
        });
    }

    function render() {
        const endpoint = selected();
        renderRail();
        serviceName.textContent = endpoint.name;
        servicePath.textContent = endpoint.desc;
        methodBadge.textContent = endpoint.method;
        urlInput.value = endpoint.path;
        availabilityValue.textContent = endpoint.availability;
        latencyValue.textContent = `${endpoint.latency}ms`;
        contractScore.textContent = endpoint.score;
        policyList.innerHTML = endpoint.policies.map(([state, text]) => `<span class="policy ${state}">${text}</span>`).join('');
        responseMeta.textContent = 'idle';
        jsonOutput.textContent = JSON.stringify({ status: 'ready', endpoint: endpoint.path }, null, 2);
    }

    document.getElementById('sendRequest').addEventListener('click', () => {
        const endpoint = selected();
        const latency = endpoint.latency + Math.floor(Math.random() * 28);
        responseMeta.textContent = `200 OK / ${latency}ms`;
        latencyValue.textContent = `${latency}ms`;
        jsonOutput.textContent = JSON.stringify({
            ok: true,
            endpoint: endpoint.path,
            data: endpoint.response,
            governance: {
                contractScore: endpoint.score,
                policies: endpoint.policies.map(([, policy]) => policy)
            }
        }, null, 2);
    });

    document.getElementById('runContract').addEventListener('click', () => {
        const endpoint = selected();
        const warning = endpoint.score < 90 ? 'warning: one policy needs review' : 'no breaking changes';
        contractOutput.textContent = `$ openapi-diff current.yaml proposed.yaml
service: ${endpoint.name}
score: ${endpoint.score}/100
result: ${warning}
next: ${endpoint.score < 90 ? 'request owner approval' : 'safe to deploy'}`;
    });

    render();
});
