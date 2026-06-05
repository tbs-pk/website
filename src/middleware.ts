import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Dauko secret key madaidaici daga .env
const SECRET_KEY = process.env.JWT_SECRET || 'tbs_creativity_secret_key_2026_@!';
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kare duka hanyoyin da suka fara da /admin
  if (pathname.startsWith('/admin')) {
    
    // Kyale mutum ya bude shafin login ko logout ba tare da tsangwama ba
    if (pathname === '/admin/login' || pathname === '/admin/logout') {
      return NextResponse.next();
    }

    // 1. Dauko cookie din 'session' wanda route.ts ya kafa
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      console.log(`[MIDDLEWARE LOG] Babu session cookie, an juyo da mai amfani daga: ${pathname}`);
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      // 2. Tabbatar da ingancin JWT Token din ta amfani da Jose (Edge Runtime Compatible)
      const { payload } = await jwtVerify(sessionCookie, key, {
        algorithms: ['HS256'],
      });

      // Tabbatar cewa token din bai rube ba (Expiration Check)
      if (!payload || (payload.expires && Date.now() > new Date(payload.expires as string).getTime())) {
        throw new Error("Session expired");
      }

      // Idan komai ya yi daidai, kyale shi ya wuce Dashboard lafiya lau
      return NextResponse.next();

    } catch (error) {
      console.log("[MIDDLEWARE LOG] Token bai gantu ba ko ya rube, ana juyawa zuwa login...");
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      
      // Share gurbataccen cookie din domin tsafta
      const response = NextResponse.redirect(url);
      response.cookies.delete('session');
      return response;
    }
  }

  // Kare student routes - courses, dashboard, profile, etc.
  const protectedStudentRoutes = ['/courses', '/tools', '/tips-tricks', '/dashboard', '/profile'];
  const isProtectedStudentRoute = protectedStudentRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedStudentRoute) {
    const studentSessionCookie = request.cookies.get('student_session')?.value;
    
    if (!studentSessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(studentSessionCookie, key, {
        algorithms: ['HS256'],
      });

      if (!payload || (payload.expires && Date.now() > new Date(payload.expires as string).getTime())) {
        throw new Error("Session expired");
      }

      return NextResponse.next();

    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      const response = NextResponse.redirect(url);
      response.cookies.delete('student_session');
      return response;
    }
  }

  return NextResponse.next();
}

// Takaita middleware din ya kula da shafukan admin kawai domin gudun jinkirin uwar garke
export const config = {
  matcher: ['/admin/:path*', '/courses/:path*', '/tools/:path*', '/tips-tricks/:path*', '/dashboard', '/profile'],
};