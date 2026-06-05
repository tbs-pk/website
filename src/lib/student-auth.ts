import { cookies } from 'next/headers';
import { decrypt } from './auth';

export async function getStudentSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('student_session')?.value;

  if (!session) return null;

  try {
    const payload = await decrypt(session);
    if (!payload || !payload.studentId) return null;
    return payload;
  } catch {
    return null;
  }
}
