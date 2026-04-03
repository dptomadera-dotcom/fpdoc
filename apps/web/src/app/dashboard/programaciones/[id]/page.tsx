import ProgramacionClient from './ProgramacionClient';

export function generateStaticParams() {
  return [{ id: 'demo-123' }, { id: 'sample-project' }];
}

export default async function ProgramacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProgramacionClient id={id} />;
}
