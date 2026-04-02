import ProjectDetailPage from './ProjectDetailClient';

export async function generateStaticParams() {
  // Para exportación estática en GitHub Pages, si no conocemos los IDs,
  // devolvemos una lista vacía. Next.js permitirá la compilación.
  return [];
}

export const dynamicParams = false; // No permitir parámetros dinámicos en tiempo de ejecución (requerido por export)

export default function Page() {
  return <ProjectDetailPage />;
}
