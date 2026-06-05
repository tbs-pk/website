import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL('/', request.url);
  const res = NextResponse.redirect(url);
  res.cookies.set('student_session', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
