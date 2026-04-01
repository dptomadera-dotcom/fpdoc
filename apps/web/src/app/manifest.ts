import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Transversal FP - Gestión Académica',
    short_name: 'Transversal FP',
    description: 'Plataforma de gestión de proyectos transversales para Formación Profesional.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0a',
    theme_color: '#3b82f6',
    categories: ['education', 'productivity'],
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Mis Proyectos',
        url: '/projects',
        description: 'Ver todos los proyectos',
      },
      {
        name: 'Iniciar Sesión',
        url: '/login',
        description: 'Acceder a la plataforma',
      },
    ],
  }
}
