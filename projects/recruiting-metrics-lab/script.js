document.addEventListener('DOMContentLoaded', () => {
    const candidates = [
        {
            id: 'lara',
            name: 'Lara S.',
            role: 'frontend',
            score: 91,
            decision: 'avanzar',
            summary: 'Excelente criterio de componentes, accesibilidad y performance. La evidencia es clara y repetible.',
            skills: { UI: 94, React: 89, Producto: 86 },
            evidence: ['Refactorizo un flujo complejo sin romper estados.', 'Detecto problemas de contraste antes del reviewer.', 'Explico tradeoffs de cache con precision.']
        },
        {
            id: 'mateo',
            name: 'Mateo R.',
            role: 'backend',
            score: 84,
            decision: 'avanzar',
            summary: 'Buen diseno de APIs y ownership operacional. Necesita profundizar observabilidad distribuida.',
            skills: { APIs: 92, Datos: 78, SRE: 81 },
            evidence: ['Propuso idempotency keys.', 'Modelo errores de dominio claramente.', 'Pidio metricas antes de optimizar.']
        },
        {
            id: 'ines',
            name: 'Ines M.',
            role: 'data',
            score: 76,
            decision: 'review',
            summary: 'Solida en SQL y calidad de datos. La senal de arquitectura necesita calibracion con otro interviewer.',
            skills: { SQL: 88, Calidad: 83, Arquitectura: 61 },
            evidence: ['Identifico duplicados y drift.', 'Buen razonamiento de freshness.', 'Falto plan de rollback.']
        },
        {
            id: 'tomas',
            name: 'Tomas V.',
            role: 'frontend',
            score: 63,
            decision: 'no',
            summary: 'Buen potencial visual, pero la evidencia tecnica no alcanza el nivel buscado para seniority.',
            skills: { UI: 72, React: 58, Producto: 62 },
            evidence: ['Necesito mucha guia en estado compartido.', 'No pudo explicar el bug principal.', 'Buen cuidado visual en pantallas simples.']
        }
    ];

    const questions = [
        {
            text: 'Que senal pesa mas para decidir si una API esta lista para produccion?',
            options: ['Cantidad de endpoints', 'Contrato versionado y SLO medible', 'Nombre consistente del repositorio'],
            answer: 1,
            feedback: 'La mejor senal combina contrato, ownership y SLO observable.'
        },
        {
            text: 'En una entrevista frontend, que evidencia es mas fuerte?',
            options: ['Usar la libreria mas nueva', 'Explicar estados, accesibilidad y tradeoffs', 'Terminar mas rapido que el resto'],
            answer: 1,
            feedback: 'La evidencia fuerte muestra criterio, no solo velocidad.'
        },
        {
            text: 'Cuando conviene mandar un candidato a calibracion?',
            options: ['Cuando hay senales mixtas importantes', 'Cuando el score es perfecto', 'Cuando falta mirar el CV'],
            answer: 0,
            feedback: 'Calibracion sirve cuando la decision necesita una segunda lectura.'
        }
    ];

    const deck = document.getElementById('candidateDeck');
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profileSummary = document.getElementById('profileSummary');
    const skillBars = document.getElementById('skillBars');
    const evidenceList = document.getElementById('evidenceList');
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const feedbackBox = document.getElementById('feedbackBox');
    const questionCounter = document.getElementById('questionCounter');
    let activeCandidate = candidates[0].id;
    let activeRole = 'all';
    let questionIndex = 0;

    function visibleCandidates() {
        return candidates.filter(candidate => activeRole === 'all' || candidate.role === activeRole);
    }

    function renderCandidates() {
        const visible = visibleCandidates();
        if (!visible.some(candidate => candidate.id === activeCandidate)) activeCandidate = visible[0]?.id || candidates[0].id;
        deck.innerHTML = visible.map(candidate => `
            <button class="candidate-card ${candidate.id === activeCandidate ? 'active' : ''}" data-id="${candidate.id}">
                <span>
                    <h3>${candidate.name}</h3>
                    <p>${candidate.role} / score ${candidate.score}</p>
                </span>
                <em class="decision ${candidate.decision === 'review' ? 'review' : candidate.decision === 'no' ? 'no' : ''}">${candidate.decision}</em>
            </button>
        `).join('');

        deck.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                activeCandidate = button.dataset.id;
                renderCandidates();
                renderProfile();
            });
        });
    }

    function renderProfile() {
        const candidate = candidates.find(item => item.id === activeCandidate) || candidates[0];
        profileName.textContent = candidate.name;
        profileRole.textContent = `${candidate.role} / score ${candidate.score}`;
        profileSummary.textContent = candidate.summary;
        skillBars.innerHTML = Object.entries(candidate.skills).map(([label, value]) => `
            <div class="skill-row">
                <span>${label}</span>
                <div class="skill-track"><span style="--value:${value}%"></span></div>
                <strong>${value}</strong>
            </div>
        `).join('');
        evidenceList.innerHTML = candidate.evidence.map(item => `<li>${item}</li>`).join('');
    }

    function renderQuestion() {
        const question = questions[questionIndex];
        questionText.textContent = question.text;
        questionCounter.textContent = `${questionIndex + 1} / ${questions.length}`;
        feedbackBox.textContent = '';
        answerOptions.innerHTML = question.options.map((option, index) => `<button data-index="${index}">${option}</button>`).join('');
        answerOptions.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                const isCorrect = Number(button.dataset.index) === question.answer;
                button.classList.add(isCorrect ? 'correct' : 'wrong');
                feedbackBox.textContent = isCorrect ? question.feedback : 'Cerca, pero esa senal es menos confiable.';
                setTimeout(() => {
                    questionIndex = (questionIndex + 1) % questions.length;
                    renderQuestion();
                }, 1050);
            });
        });
    }

    document.querySelectorAll('[data-role]').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('[data-role]').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            activeRole = button.dataset.role;
            renderCandidates();
            renderProfile();
        });
    });

    document.getElementById('calibrateBtn').addEventListener('click', () => {
        document.getElementById('driftValue').textContent = '7%';
    });

    document.getElementById('startBtn').addEventListener('click', () => {
        questionIndex = 0;
        renderQuestion();
        document.querySelector('.interview-kit').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    renderCandidates();
    renderProfile();
    renderQuestion();
});
