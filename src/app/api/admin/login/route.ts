import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs'; // Canzawa zuwa bcryptjs gaba daya
import { encrypt } from '@/lib/auth'; 
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Duba abin da ya fito daga Browser
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Username da aka shigar:", username);

    if (!username || !password) {
      return NextResponse.json({ error: "Saka username da password tukunna" }, { status: 400 });
    }

    // Nemo admin a cikin teburin AdminUser
    const admin = await prisma.adminUser.findUnique({
      where: { username }
    });

    // 2. Duba ko an same shi a Database
    if (!admin) {
      console.log("Sakamako: Ba a sami wannan username din a database ba!");
      return NextResponse.json({ error: "Username ko Password ba daidai ba" }, { status: 401 });
    }
    
    console.log("Sakamako: An sami user a database. Ana duba password...");

    // 3. Duba kalmar sirri ta amfani da bcryptjs (Pure JS)
    const passwordMatch = await bcryptjs.compare(password, admin.password);
    console.log("Shin password din ya dace (Match)?:", passwordMatch);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Username ko Password ba daidai ba" }, { status: 401 });
    }

    // Kafa zama lafiya lau (Session Cookie)
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); 
    const session = await encrypt({ adminId: admin.id, username: admin.username, expires });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true, path: '/' });

    console.log("LOGIN SUCCESSFUL FOR:", username);
    return NextResponse.json({ success: true, message: "Login successful" });

  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error);
    return NextResponse.json({ error: "An samu matsala a cikin uwar garke: " + error.message }, { status: 500 });
  }
}