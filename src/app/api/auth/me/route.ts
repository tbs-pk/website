import { NextResponse } from 'next/server';
import { getStudentSession } from '@/lib/student-auth';

export async function GET() {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user: session });
}
