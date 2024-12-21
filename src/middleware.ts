import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface UserPayload {
    isAdmin: boolean;
    isVerified: boolean;
    [key: string]: any;
}

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.clone();

    let isAdmin = false;
    let isVerified = false;

    if (token) {
        const userPayload = token as UserPayload;
        isAdmin = userPayload.isAdmin;
        isVerified = userPayload.isVerified;
    }

    // Permettre l'accès aux pages de login et register
    if (!token && (url.pathname === '/login' || url.pathname === '/register')) {
        return NextResponse.next();
    }

    // Rediriger vers login si non authentifié
    if (!token && url.pathname === '/profile') {
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.set('flashMessage', 'Vous devez être connecté pour accéder à cette page.', { path: '/' });
        return response;
    }

    // Rediriger les utilisateurs connectés essayant d'accéder à /login ou /register
    if (token && (url.pathname === '/login' || url.pathname === '/register')) {
        url.pathname = '/';
        const response = NextResponse.redirect(url);
        response.cookies.set('flashMessage', 'Vous êtes déjà connecté.', { path: '/' });
        return response;
    }

    // Bloquer l'accès à /validation si l'utilisateur est déjà vérifié
    if (token && isVerified && url.pathname === '/validation') {
        url.pathname = '/';
        const response = NextResponse.redirect(url);
        response.cookies.set('flashMessage', 'Vous avez déjà vérifié votre compte.', { path: '/' });
        return response;
    }

    // Rediriger les utilisateurs non-vérifiés vers la page de validation
    if (token && !isVerified && url.pathname !== '/validation' && !url.pathname.startsWith('/admin')) {
        url.pathname = '/validation';
        const response = NextResponse.redirect(url);
        response.cookies.set('flashMessage', 'Veuillez vérifier votre compte.', { path: '/' });
        return response;
    }

    // Rediriger les utilisateurs non-admin essayant d'accéder à des pages admin
    if (token && isVerified && !isAdmin && url.pathname.startsWith('/admin')) {
        url.pathname = '/';
        const response = NextResponse.redirect(url);
        response.cookies.set('flashMessage', 'Accès interdit. Administrateurs uniquement.', { path: '/' });
        return response;
    }

    // Autoriser l'accès si aucune condition de redirection n'est remplie
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/about',
        '/contact',
        '/products',
        '/paiement',
        '/admin/:path*',
        '/profile',
        '/login',
        '/register',
        '/validation',
    ],
};
