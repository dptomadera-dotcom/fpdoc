import ProjectDetailPage from './ProjectDetailClient';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Para exportación estática en GitHub Pages, devolvemos un ID por defecto
  // para que Next.js pueda generar al menos una versión estática de la página.
  return [{ id: 'default' }];
}

export const dynamicParams = false; // No permitir parámetros dinámicos en tiempo de ejecución (requerido por export)

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProjectDetailPage />;
}
