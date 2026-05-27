document.addEventListener('DOMContentLoaded', () => {

    const endpoints = {
        'auth-login': {
            method: 'POST',
            url: 'https://api.nexus.com/v1/auth/login',
            color: 'var(--method-post)',
            response: {
                "status": "success",
                "data": {
                    "token": "eyJhbGciOiJIUzI1NiIsInR...",
                    "expires_in": 3600,
                    "user": {
                        "id": "usr_98213",
                        "email": "dev@nexus.com",
                        "role": "admin"
                    }
                }
            },
            time: '124ms',
            status: '200 OK'
        },
        'projects-list': {
            method: 'GET',
            url: 'https://api.nexus.com/v1/projects?limit=10',
            color: 'var(--method-get)',
            response: {
                "meta": { "total": 42, "page": 1 },
                "data": [
                    { "id": "prj_1", "name": "Migration to Cloud", "status": "active" },
                    { "id": "prj_2", "name": "API Gateway Setup", "status": "completed" }
                ]
            },
            time: '45ms',
            status: '200 OK'
        },
        'users-delete': {
            method: 'DELETE',
            url: 'https://api.nexus.com/v1/users/usr_4412',
            color: 'var(--method-delete)',
            response: {
                "status": "success",
                "message": "User permanently deleted.",
                "deleted_at": "2025-05-26T14:22:10Z"
            },
            time: '210ms',
            status: '204 No Content'
        }
    };

    const apiItems = document.querySelectorAll('.api-item');
    const methodSelect = document.getElementById('method-select');
    const urlInput = document.getElementById('url-input');
    const btnSend = document.getElementById('btn-send');
    const jsonOutput = document.getElementById('json-output');
    const resStatus = document.getElementById('res-status');
    const resTime = document.getElementById('res-time');
    const copyBtn = document.getElementById('copy-btn');

    let currentEndpoint = 'auth-login';

    // Highlight JSON function
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 4);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-boolean';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Load endpoint data
    function loadEndpoint(id) {
        const data = endpoints[id];
        if (!data) return;
        
        currentEndpoint = id;
        
        methodSelect.value = data.method;
        methodSelect.style.color = data.color;
        urlInput.value = data.url;

        // Clear output
        jsonOutput.innerHTML = '// Click "Send Request" to fetch data...';
        resStatus.textContent = '---';
        resTime.textContent = '0ms';

        // Update active class
        apiItems.forEach(item => {
            if(item.getAttribute('data-id') === id) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    // Initial load
    loadEndpoint('auth-login');

    // Click on sidebar items
    apiItems.forEach(item => {
        item.addEventListener('click', () => {
            loadEndpoint(item.getAttribute('data-id'));
        });
    });

    // Send Request
    btnSend.addEventListener('click', () => {
        const data = endpoints[currentEndpoint];
        
        btnSend.textContent = 'Sending...';
        btnSend.disabled = true;
        jsonOutput.innerHTML = '<i>Fetching response...</i>';
        
        setTimeout(() => {
            btnSend.textContent = 'Send Request';
            btnSend.disabled = false;
            
            resStatus.textContent = data.status;
            resTime.textContent = data.time;
            
            jsonOutput.innerHTML = syntaxHighlight(data.response);
        }, 600);
    });

    // Copy JSON
    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            const data = endpoints[currentEndpoint].response;
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy JSON', 2000);
        });
    }
});
