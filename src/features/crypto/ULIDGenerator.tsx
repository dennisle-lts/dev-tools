import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	COUNT_DEFAULT,
	COUNT_MAX,
	COUNT_MIN,
	generateULIDs,
} from './ulid-generator';

export default function ULIDGenerator() {
	const [count, setCount] = useState(COUNT_DEFAULT);
	const [ulids, setULIDs] = useState<string[]>([]);
	const [copied, setCopied] = useState(false);

	function adjustCount(delta: number) {
		setCount((prev) => Math.min(COUNT_MAX, Math.max(COUNT_MIN, prev + delta)));
	}

	function handleCountInput(value: string) {
		const n = parseInt(value, 10);
		if (!Number.isNaN(n)) {
			setCount(Math.min(COUNT_MAX, Math.max(COUNT_MIN, n)));
		}
	}

	function generate() {
		setULIDs(generateULIDs(count));
		setCopied(false);
	}

	function copyAll() {
		navigator.clipboard.writeText(ulids.join('\n'));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					ULID Generator
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Generate Universally Unique Lexicographically Sortable Identifiers.
					ULIDs are 128-bit, URL-safe, and monotonically sortable.
				</p>
			</div>

			<Card>
				<CardContent className="space-y-5 pt-6">
					<div className="space-y-2">
						<Label htmlFor="count-input">Count</Label>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => adjustCount(-1)}
								disabled={count <= COUNT_MIN}
								className="w-8 shrink-0 px-0"
							>
								−
							</Button>
							<Input
								id="count-input"
								type="number"
								min={COUNT_MIN}
								max={COUNT_MAX}
								value={count}
								onChange={(e) => handleCountInput(e.target.value)}
								className="w-20 text-center tabular-nums"
							/>
							<Button
								variant="outline"
								size="sm"
								onClick={() => adjustCount(1)}
								disabled={count >= COUNT_MAX}
								className="w-8 shrink-0 px-0"
							>
								+
							</Button>
						</div>
					</div>

					<div className="flex justify-end">
						<Button onClick={generate}>Generate</Button>
					</div>
				</CardContent>
			</Card>

			{ulids.length > 0 && (
				<Card>
					<CardContent className="space-y-3 pt-6">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">
								{ulids.length} ULIDs generated
							</p>
							<Button variant="outline" size="sm" onClick={copyAll}>
								{copied ? 'Copied!' : 'Copy all'}
							</Button>
						</div>
						<div className="space-y-1 rounded-md bg-muted p-3">
							{ulids.map((id) => (
								<p key={id} className="font-mono text-sm">
									{id}
								</p>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
