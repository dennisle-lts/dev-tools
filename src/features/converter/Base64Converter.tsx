import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { decodeBase64, encodeBase64 } from './base64';

export default function Base64Converter() {
	const [urlSafe, setUrlSafe] = useState(false);

	// Encode
	const [plainText, setPlainText] = useState('');
	const [encoded, setEncoded] = useState('');
	const [encodedCopied, setEncodedCopied] = useState(false);

	// Decode
	const [b64Text, setB64Text] = useState('');
	const [decoded, setDecoded] = useState('');
	const [decodeError, setDecodeError] = useState('');
	const [decodedCopied, setDecodedCopied] = useState(false);

	function handleEncode() {
		setEncoded(encodeBase64(plainText, urlSafe));
		setEncodedCopied(false);
	}

	function handleDecode() {
		try {
			setDecoded(decodeBase64(b64Text));
			setDecodeError('');
		} catch {
			setDecoded('');
			setDecodeError('Invalid Base64 string.');
		}
		setDecodedCopied(false);
	}

	function copyEncoded() {
		navigator.clipboard.writeText(encoded);
		setEncodedCopied(true);
		setTimeout(() => setEncodedCopied(false), 2000);
	}

	function copyDecoded() {
		navigator.clipboard.writeText(decoded);
		setDecodedCopied(true);
		setTimeout(() => setDecodedCopied(false), 2000);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Base64 Converter
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Encode plain text to Base64 and decode Base64 back to plain text.
					URL-safe mode replaces <code>+</code> with <code>-</code> and{' '}
					<code>/</code> with <code>_</code>.
				</p>
			</div>

			{/* URL-safe toggle */}
			<div className="flex items-center gap-3">
				<Switch id="url-safe" checked={urlSafe} onCheckedChange={setUrlSafe} />
				<Label htmlFor="url-safe">URL-safe encoding</Label>
			</div>

			{/* Encode */}
			<Card>
				<CardContent className="space-y-4 pt-6">
					<p className="text-sm font-medium">Encode</p>
					<div className="space-y-2">
						<Label htmlFor="plain-input">Plain text</Label>
						<Textarea
							id="plain-input"
							placeholder="Enter text to encode…"
							value={plainText}
							onChange={(e) => setPlainText(e.target.value)}
							rows={4}
						/>
					</div>
					<div className="flex justify-end">
						<Button onClick={handleEncode} disabled={!plainText}>
							Encode
						</Button>
					</div>
					{encoded && (
						<div className="flex items-start justify-between gap-4 rounded-md bg-muted px-3 py-3">
							<p className="break-all font-mono text-sm leading-relaxed">
								{encoded}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={copyEncoded}
								className="shrink-0"
							>
								{encodedCopied ? 'Copied!' : 'Copy'}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Decode */}
			<Card>
				<CardContent className="space-y-4 pt-6">
					<p className="text-sm font-medium">Decode</p>
					<div className="space-y-2">
						<Label htmlFor="b64-input">Base64 string</Label>
						<Textarea
							id="b64-input"
							placeholder="Enter Base64 to decode…"
							value={b64Text}
							onChange={(e) => setB64Text(e.target.value)}
							rows={4}
						/>
					</div>
					<div className="flex justify-end">
						<Button onClick={handleDecode} disabled={!b64Text}>
							Decode
						</Button>
					</div>
					{decodeError && (
						<p className="text-sm text-destructive">{decodeError}</p>
					)}
					{decoded && (
						<div className="flex items-start justify-between gap-4 rounded-md bg-muted px-3 py-3">
							<p className="break-all font-mono text-sm leading-relaxed">
								{decoded}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={copyDecoded}
								className="shrink-0"
							>
								{decodedCopied ? 'Copied!' : 'Copy'}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
