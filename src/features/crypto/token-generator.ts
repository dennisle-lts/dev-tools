const CHARS = {
	uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	lowercase: 'abcdefghijklmnopqrstuvwxyz',
	numbers: '0123456789',
	symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
} as const;

export interface TokenOptions {
	uppercase: boolean;
	lowercase: boolean;
	numbers: boolean;
	symbols: boolean;
}

export const DEFAULT_OPTIONS: TokenOptions = {
	uppercase: true,
	lowercase: true,
	numbers: true,
	symbols: false,
};

export const LENGTH_MIN = 4;
export const LENGTH_MAX = 128;
export const LENGTH_DEFAULT = 32;

export function generateToken(opts: TokenOptions, length: number): string {
	const pool = (Object.keys(CHARS) as Array<keyof typeof CHARS>)
		.filter((key) => opts[key])
		.map((key) => CHARS[key])
		.join('');

	if (!pool) return '';

	return Array.from(
		{ length },
		() => pool[Math.floor(Math.random() * pool.length)],
	).join('');
}
