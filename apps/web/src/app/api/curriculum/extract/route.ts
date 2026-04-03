import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
      { error: 'Error al procesar el PDF', details: error.message },
      { status: 500 }
    );
  }
}
