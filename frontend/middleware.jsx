import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    const rutasProtegidas = [
        '/escaneo-de-vulnerabilidades',
        '/escaneo-de-vulnerabilidades/[id]',
        '/busqueda-de-activos',
        '/busqueda-de-activos/[id]'
    ];
    
    const esRutaProtegida = rutasProtegidas.some(ruta => {
        if (ruta.includes('[id]')) {
            const rutaBase = ruta.split('[id]')[0];
            return pathname.startsWith(rutaBase) && pathname.length > rutaBase.length;
        }
        return pathname === ruta;
    });
    
    if (!esRutaProtegida) 
        return NextResponse.next();
    
    const cookieSession = request.cookies.get('session');
    
    if (!cookieSession) {
        const urlRetorno = request.nextUrl.pathname + request.nextUrl.search;
        const urlLogin = new URL('/login', request.url);
        urlLogin.searchParams.set('returnTo', urlRetorno);
        
        return NextResponse.redirect(urlLogin);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/escaneo-de-vulnerabilidades',
        '/escaneo-de-vulnerabilidades/:path*',
        '/busqueda-de-activos',
        '/busqueda-de-activos/:path*',
    ],
};