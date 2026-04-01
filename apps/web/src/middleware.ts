import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/proyectos', '/perfil'];

// Rutas de autenticación (para redirigir si ya está logueado)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userCookie = request.cookies.get('user')?.value;
  const { pathname } = request.nextUrl;

  // 1. Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Opcional: guardar la URL de retorno
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirigir al dashboard si ya tiene token e intenta ir a login/register
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Manejar RBAC básico basado en la cookie del usuario (opcional)
  if (pathname.startsWith('/admin') && token && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      if (user.role !== 'admin') {
        // Redirigir si no es admin pero intenta entrar en /admin
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      console.error('Error parsing user cookie in middleware:', e);
    }
  }

  return NextResponse.next();
}

// Configurar el matcher para las rutas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
