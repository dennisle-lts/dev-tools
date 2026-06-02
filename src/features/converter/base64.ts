export function encodeBase64(text: string, urlSafe: boolean): string {
	const bytes = new TextEncoder().encode(text);
	const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
	const b64 = btoa(binary);
	if (!urlSafe) return b64;
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeBase64(b64: string): string {
	// Normalise URL-safe chars and restore padding
	const normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
	const padded = normalized + '=='.slice(0, (4 - (normalized.length % 4)) % 4);
	const binary = atob(padded);
	const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}
