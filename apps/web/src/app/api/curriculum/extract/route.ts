import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Robust dynamic import to handle both CJS and ESM environments in Next.js
    let pdf;
    try {
      const pdfParse = await import('pdf-parse');
      // Some bundlers place the function at .default, others at the import itself
      if (typeof pdfParse === 'function') {
        pdf = pdfParse;
      } else if (pdfParse && typeof (pdfParse as any).default === 'function') {
        pdf = (pdfParse as any).default;
      } else {
        // Fallback for some Node environments
        // @ts-ignore
        pdf = (await import('pdf-parse/lib/pdf-parse.js')).default || (await import('pdf-parse/lib/pdf-parse.js'));
      }
    } catch (importErr) {
      console.error('Failed to import pdf-parse:', importErr);
      return NextResponse.json({ error: 'El servidor no puede procesar PDFs en este momento.' }, { status: 500 });
    }

    // Extract text from PDF
    const data = await pdf(buffer);

    return NextResponse.json({
      text: data.text,
      metadata: data.metadata,
      info: data.info,
      numPages: data.numpages
    });
  } catch (error: any) {
    console.error('PDF Extraction Error:', error);
    return NextResponse.json(
      { error: 'Error al extraer texto del PDF. Asegúrese de que el archivo es válido.', details: error.message },
      { status: 500 }
    );
  }
}
