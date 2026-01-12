// To-Do (Backend) API configuration
//
// - Local dev: runs against http://localhost:5000/api
// - Production (GitHub Pages / mosambiswas.me): set this to your deployed backend URL
//
// After deploying the backend (Render/Railway/etc.), change the production URL below to:
//   https://YOUR-SERVICE.onrender.com/api
(function () {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    const localApi = 'http://localhost:5000/api';
    // Render service URL (production)
    const productionApi = 'https://to-do-i8qi.onrender.com/api';

    window.TODO_API_URL = isLocal ? localApi : productionApi;
})();
