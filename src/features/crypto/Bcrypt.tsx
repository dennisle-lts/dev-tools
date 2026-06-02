import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	compareStrings,
	hashString,
	SALT_DEFAULT,
	SALT_MAX,
	SALT_MIN,
} from './bcrypt';

export default function Bcrypt() {
	// Hash section
	const [hashInput, setHashInput] = useState('');
	const [saltRounds, setSaltRounds] = useState(SALT_DEFAULT);
	const [hashOutput, setHashOutput] = useState('');
	const [hashing, setHashing] = useState(false);
	const [hashCopied, setHashCopied] = useState(false);

	// Compare section
	const [comparePlain, setComparePlain] = useState('');
	const [compareHash, setCompareHash] = useState('');
	const [matchResult, setMatchResult] = useState<boolean | null>(null);
	const [comparing, setComparing] = useState(false);

	function adjustSalt(delta: number) {
		setSaltRounds((prev) =>
			Math.min(SALT_MAX, Math.max(SALT_MIN, prev + delta)),
		);
	}

	function handleSaltInput(value: string) {
		const n = parseInt(value, 10);
		if (!Number.isNaN(n)) {
			setSaltRounds(Math.min(SALT_MAX, Math.max(SALT_MIN, n)));
		}
	}

	async function handleHash() {
		if (!hashInput) return;
		setHashing(true);
		setHashOutput('');
		setHashCopied(false);
		try {
			const result = await hashString(hashInput, saltRounds);
			setHashOutput(result);
		} finally {
			setHashing(false);
		}
	}

	function copyHash() {
		if (!hashOutput) return;
		navigator.clipboard.writeText(hashOutput);
		setHashCopied(true);
		setTimeout(() => setHashCopied(false), 2000);
	}

	async function handleCompare() {
		if (!comparePlain || !compareHash) return;
		setComparing(true);
		setMatchResult(null);
		try {
			const result = await compareStrings(comparePlain, compareHash);
			setMatchResult(result);
		} finally {
			setComparing(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Bcrypt</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Hash and compare text string using bcrypt. Bcrypt is a
					password-hashing function based on the Blowfish cipher.
				</p>
			</div>

			{/* Hash */}
			<Card>
				<CardContent className="space-y-4 pt-6">
					<p className="text-sm font-medium">Hash</p>

					<div className="space-y-2">
						<Label htmlFor="hash-input">String</Label>
						<Input
							id="hash-input"
							placeholder="Enter text to hash…"
							value={hashInput}
							onChange={(e) => setHashInput(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="salt-input">Salt rounds</Label>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => adjustSalt(-1)}
								disabled={saltRounds <= SALT_MIN}
								className="w-8 shrink-0 px-0"
							>
								−
							</Button>
							<Input
								id="salt-input"
								type="number"
								min={SALT_MIN}
								max={SALT_MAX}
								value={saltRounds}
								onChange={(e) => handleSaltInput(e.target.value)}
								className="w-20 text-center tabular-nums"
							/>
							<Button
								variant="outline"
								size="sm"
								onClick={() => adjustSalt(1)}
								disabled={saltRounds >= SALT_MAX}
								className="w-8 shrink-0 px-0"
							>
								+
							</Button>
						</div>
					</div>

					<div className="flex justify-end">
						<Button onClick={handleHash} disabled={!hashInput || hashing}>
							{hashing ? 'Hashing…' : 'Hash'}
						</Button>
					</div>

					{hashOutput && (
						<div className="flex items-start justify-between gap-4 rounded-md bg-muted px-3 py-3">
							<p className="break-all font-mono text-sm leading-relaxed">
								{hashOutput}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={copyHash}
								className="shrink-0"
							>
								{hashCopied ? 'Copied!' : 'Copy'}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Compare */}
			<Card>
				<CardContent className="space-y-4 pt-6">
					<p className="text-sm font-medium">Compare</p>

					<div className="space-y-2">
						<Label htmlFor="compare-plain">Plain string</Label>
						<Input
							id="compare-plain"
							placeholder="Enter plain text…"
							value={comparePlain}
							onChange={(e) => setComparePlain(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="compare-hash">Hash string</Label>
						<Input
							id="compare-hash"
							placeholder="Enter bcrypt hash…"
							value={compareHash}
							onChange={(e) => setCompareHash(e.target.value)}
						/>
					</div>

					<div className="flex justify-end">
						<Button
							onClick={handleCompare}
							disabled={!comparePlain || !compareHash || comparing}
						>
							{comparing ? 'Comparing…' : 'Compare'}
						</Button>
					</div>

					{matchResult !== null && (
						<div className="flex items-center gap-2 rounded-md bg-muted px-3 py-3">
							<span className="text-sm text-muted-foreground">
								Do they match?
							</span>
							<span
								className={`font-semibold ${matchResult ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
							>
								{matchResult ? 'YES' : 'NO'}
							</span>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
