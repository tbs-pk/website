import { SignJWT, jwtVerify } from 'jose';

// Ɗauko secret key daga .env ko amfani da fallback
const SECRET_KEY = process.env.JWT_SECRET || 'tbs_creativity_secret_key_2026_@!';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}