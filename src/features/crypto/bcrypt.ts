import bcryptjs from 'bcryptjs';

export const SALT_MIN = 4;
export const SALT_MAX = 31;
export const SALT_DEFAULT = 10;

export async function hashString(text: string, saltRounds: number): Promise<string> {
	return bcryptjs.hash(text, saltRounds);
}

export async function compareStrings(plain: string, hash: string): Promise<boolean> {
	return bcryptjs.compare(plain, hash);
}
