import { v1, v3, v4, v5, v7 } from 'uuid';

export type UUIDVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'v7';

export const UUID_VERSIONS: UUIDVersion[] = ['v1', 'v3', 'v4', 'v5', 'v7'];

export const COUNT_MIN = 1;
export const COUNT_MAX = 100;
export const COUNT_DEFAULT = 1;

export const NAMESPACES = {
	DNS: v3.DNS,
	URL: v3.URL,
	OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
	X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
} as const;

export type NamespaceName = keyof typeof NAMESPACES;

export interface UUIDOptions {
	version: UUIDVersion;
	count: number;
	namespace: NamespaceName;
	name: string;
}

function generateOne(opts: UUIDOptions): string {
	switch (opts.version) {
		case 'v1':
			return v1();
		case 'v3':
			return v3(opts.name || 'example', NAMESPACES[opts.namespace]);
		case 'v4':
			return v4();
		case 'v5':
			return v5(opts.name || 'example', NAMESPACES[opts.namespace]);
		case 'v7':
			return v7();
	}
}

export function generateUUIDs(opts: UUIDOptions): string[] {
	return Array.from({ length: opts.count }, () => generateOne(opts));
}

export function needsNamespace(version: UUIDVersion): boolean {
	return version === 'v3' || version === 'v5';
}
