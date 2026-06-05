import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { email }
    });

    if (existingStudent) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ studentId: student.id, email: student.email, name: student.name, expires });
    const cookieStore = await cookies();
    cookieStore.set('student_session', session, { expires, httpOnly: true, path: '/' });

    return NextResponse.json({ success: true, message: 'Signup successful' });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
