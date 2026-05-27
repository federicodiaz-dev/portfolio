document.addEventListener('DOMContentLoaded', () => {

    // 1. Incident Toggle
    const incidents = document.querySelectorAll('.incident-item');
    incidents.forEach(item => {
        item.addEventListener('click', () => {
            // Close others (optional, keeps UI clean)
            incidents.forEach(other => {
                if(other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // 2. Refresh Simulation
    const btnRefresh = document.getElementById('btn-refresh');
    const lastUpdateEl = document.getElementById('last-update');
    const pipelinesActive = document.getElementById('pipelines-active');
    
    if(btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            const originalText = btnRefresh.textContent;
            btnRefresh.textContent = 'Syncing...';
            btnRefresh.disabled = true;
            btnRefresh.style.opacity = '0.7';

            setTimeout(() => {
                const now = new Date();
                const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                lastUpdateEl.textContent = 'Hoy, ' + timeStr;
                
                // Randomly change active pipelines for visual effect
                pipelinesActive.textContent = Math.floor(Math.random() * 5) + 22;

                btnRefresh.textContent = originalText;
                btnRefresh.disabled = false;
                btnRefresh.style.opacity = '1';
                
                // Add a subtle flash effect to cards to show refresh
                document.querySelectorAll('.dataset-card').forEach(card => {
                    card.style.borderColor = 'var(--accent-blue)';
                    setTimeout(() => card.style.borderColor = '', 500);
                });
            }, 1200);
        });
    }

    // 3. Validation Run Simulation
    const btnValidate = document.getElementById('btn-validate');
    const badges = document.querySelectorAll('.badge');

    if(btnValidate) {
        btnValidate.addEventListener('click', () => {
            const originalText = btnValidate.textContent;
            btnValidate.textContent = 'Running Checks...';
            btnValidate.disabled = true;

            // Set all to checking state (visually)
            badges.forEach(badge => {
                badge.className = 'badge';
                badge.textContent = 'Checking...';
                badge.style.color = 'var(--text-secondary)';
            });

            setTimeout(() => {
                badges.forEach((badge, index) => {
                    // Make one of them fail for realism (e.g., the last one)
                    if (index === badges.length - 1) {
                        badge.className = 'badge badge-fail';
                        badge.textContent = 'Failed';
                        badge.style.color = '';
                    } else {
                        badge.className = 'badge badge-pass';
                        badge.textContent = 'Passed';
                        badge.style.color = '';
                    }
                });

                btnValidate.textContent = originalText;
                btnValidate.disabled = false;
            }, 1500);
        });
    }

    // 4. Initial Setup: set current time
    if(lastUpdateEl) {
        const now = new Date();
        lastUpdateEl.textContent = 'Hoy, ' + now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    }
});
