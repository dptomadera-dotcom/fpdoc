'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Determinamos dinámicamente el basePath para el Service Worker
      // En GitHub Pages la ruta es /TRANSVERSAL-FP/sw.js
      const isProd = window.location.hostname !== 'localhost';
      const swPath = isProd ? '/FPDOC/sw.js' : '/sw.js';

      navigator.serviceWorker
        .register(swPath)
        .then((reg) => console.log('FPdoc SW registered successfully:', reg.scope))
        .catch((err) => console.error('FPdoc SW failure:', err));
    }
  }, []);

  return null;
}
