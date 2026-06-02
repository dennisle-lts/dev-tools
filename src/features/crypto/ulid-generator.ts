import { ulid } from 'ulid';

export const COUNT_MIN = 1;
export const COUNT_MAX = 100;
export const COUNT_DEFAULT = 1;

export function generateULIDs(count: number): string[] {
	return Array.from({ length: count }, () => ulid());
}
