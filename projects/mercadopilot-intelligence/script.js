document.addEventListener('DOMContentLoaded', () => {
    // 1. Animated Counters
    const animateValue = (obj, start, end, duration, formatFn = val => val) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * (end - start) + start);
            obj.innerHTML = formatFn(currentVal);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = formatFn(end);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Formatters
    const numFormatter = new Intl.NumberFormat('es-AR');
    const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

    const impressionsEl = document.getElementById('metric-impressions');
    const conversionEl = document.getElementById('metric-conversion');
    const salesEl = document.getElementById('metric-sales');

    if (impressionsEl) animateValue(impressionsEl, 0, 1425890, 2000, val => numFormatter.format(val));
    if (conversionEl) animateValue(conversionEl, 0, 32, 1500, val => (val / 10).toFixed(1) + '%');
    if (salesEl) animateValue(salesEl, 0, 8450000, 2000, val => currencyFormatter.format(val));


    // 2. Table Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tableRows = document.querySelectorAll('.pub-row');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            tableRows.forEach(row => {
                if (filter === 'all' || row.getAttribute('data-status') === filter) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });


    // 3. SEO Simulator
    const seoBtn = document.getElementById('btn-analyze');
    const seoInput = document.getElementById('input-title');
    const seoResults = document.getElementById('seo-results');
    const scoreCircle = document.getElementById('score-circle');
    const tipsList = document.getElementById('seo-tips');

    if (seoBtn) {
        seoBtn.addEventListener('click', () => {
            const title = seoInput.value.trim();
            if (!title) return;

            // Simulate loading
            seoBtn.textContent = 'Analizando...';
            seoBtn.disabled = true;

            setTimeout(() => {
                analyzeTitle(title);
                seoBtn.textContent = 'Analizar Título';
                seoBtn.disabled = false;
            }, 800);
        });
    }

    function analyzeTitle(title) {
        // Simple heuristic for demonstration
        let score = 100;
        const tips = [];
        const length = title.length;

        if (length < 30) {
            score -= 30;
            tips.push('El título es muy corto. Intenta usar entre 45 y 60 caracteres.');
        } else if (length > 60) {
            score -= 15;
            tips.push('El título roza el límite. Asegúrate de poner lo más importante al principio.');
        } else {
            tips.push('Longitud óptima (' + length + ' caracteres).');
        }

        const keywords = ['original', 'nuevo', 'oferta', 'envio gratis'];
        let hasKeywords = false;
        keywords.forEach(kw => {
            if (title.toLowerCase().includes(kw)) hasKeywords = true;
        });

        if (!hasKeywords) {
            score -= 20;
            tips.push('Faltan palabras gancho (ej. Original, Nuevo).');
        } else {
            tips.push('Contiene palabras clave atractivas para el comprador.');
        }

        if (!/\d/.test(title)) {
            score -= 10;
            tips.push('Considera agregar características numéricas (ej. 128GB, 500W).');
        }

        score = Math.max(0, score);

        // Update UI
        seoResults.classList.add('active');
        
        // Reset classes
        scoreCircle.className = 'score-circle';
        if (score >= 80) scoreCircle.classList.add('score-excellent');
        else if (score >= 50) scoreCircle.classList.add('score-warning');
        else scoreCircle.classList.add('score-poor');

        // Animate score
        animateValue(scoreCircle, 0, score, 1000);

        // Update tips
        tipsList.innerHTML = '';
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
});
