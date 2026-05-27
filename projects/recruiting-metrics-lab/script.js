document.addEventListener('DOMContentLoaded', () => {

    // 1. Table Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tableRows = document.querySelectorAll('.cand-row');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-role');

            tableRows.forEach(row => {
                if (filter === 'all' || row.getAttribute('data-role') === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // 2. Candidate Selection
    const emptyState = document.getElementById('details-empty');
    const detailsPanel = document.getElementById('candidate-details');
    
    // Elements to update
    const dName = document.getElementById('d-name');
    const dRole = document.getElementById('d-role');
    const dAvatar = document.getElementById('d-avatar');
    const dScore = document.getElementById('d-score');
    const dTime = document.getElementById('d-time');
    const dStrong = document.getElementById('d-strong');
    const dWeak = document.getElementById('d-weak');

    const candidateData = {
        'cand-1': {
            name: 'Laura M.', role: 'Frontend Engineer', initials: 'LM',
            score: '92/100', time: '45 min',
            strong: ['React', 'CSS Architecture', 'Accessibility'],
            weak: ['State Machines', 'WebGL']
        },
        'cand-2': {
            name: 'Carlos T.', role: 'Backend Dev', initials: 'CT',
            score: '88/100', time: '52 min',
            strong: ['Node.js', 'PostgreSQL', 'System Design'],
            weak: ['GraphQL', 'Docker Swarm']
        },
        'cand-3': {
            name: 'Sofia R.', role: 'Data Analyst', initials: 'SR',
            score: '95/100', time: '38 min',
            strong: ['Python', 'Pandas', 'SQL Optimization'],
            weak: ['Airflow', 'Spark']
        }
    };

    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            // Update active row
            tableRows.forEach(r => r.classList.remove('active-row'));
            row.classList.add('active-row');

            const id = row.getAttribute('id');
            const data = candidateData[id];

            if(data) {
                // Populate details
                dName.textContent = data.name;
                dRole.textContent = data.role;
                dAvatar.textContent = data.initials;
                dScore.textContent = data.score;
                dTime.textContent = data.time;
                
                dStrong.innerHTML = data.strong.map(s => `<span class="skill-tag" style="border-color: var(--status-pass); background: rgba(34,197,94,0.05);">${s}</span>`).join('');
                dWeak.innerHTML = data.weak.map(s => `<span class="skill-tag" style="border-color: var(--status-pending); background: rgba(245,158,11,0.05);">${s}</span>`).join('');

                // Show panel
                emptyState.style.display = 'none';
                detailsPanel.classList.add('active');
            }
        });
    });

    // 3. Test Engine Simulation
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('test-feedback');

    options.forEach(btn => {
        btn.addEventListener('click', () => {
            // Disable all
            options.forEach(o => o.disabled = true);

            const isCorrect = btn.getAttribute('data-correct') === 'true';

            if(isCorrect) {
                btn.classList.add('correct');
                feedback.innerHTML = '<strong>✅ Correcto.</strong> <code>O(n)</code> es la complejidad temporal ideal para encontrar duplicados en un array no ordenado usando un Hash Set.';
                feedback.style.borderColor = 'var(--status-pass)';
                feedback.style.backgroundColor = '#f0fdf4';
            } else {
                btn.classList.add('wrong');
                // Highlight correct
                document.querySelector('.option-btn[data-correct="true"]').classList.add('correct');
                feedback.innerHTML = '<strong>❌ Incorrecto.</strong> Tu respuesta no es la más óptima. Usar un Hash Set permite resolverlo en <code>O(n)</code>.';
                feedback.style.borderColor = 'var(--status-fail)';
                feedback.style.backgroundColor = '#fef2f2';
            }
            
            feedback.style.display = 'block';
        });
    });
});
