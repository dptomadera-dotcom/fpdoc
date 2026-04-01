import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// En modo static export (GitHub Pages) el middleware no puede redirigir
// server-side. La protección de rutas se hace client-side en cada página.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
