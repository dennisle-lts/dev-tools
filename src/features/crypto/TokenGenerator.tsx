import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
	DEFAULT_OPTIONS,
	LENGTH_DEFAULT,
	LENGTH_MAX,
	LENGTH_MIN,
	type TokenOptions,
	generateToken,
} from './token-generator';

const CHAR_OPTIONS: { key: keyof TokenOptions; label: string }[] = [
	{ key: 'uppercase', label: 'Uppercase (A–Z)' },
	{ key: 'lowercase', label: 'Lowercase (a–z)' },
	{ key: 'numbers', label: 'Numbers (0–9)' },
	{ key: 'symbols', label: 'Symbols (!@#…)' },
];

export default function TokenGenerator() {
	const [opts, setOpts] = useState<TokenOptions>(DEFAULT_OPTIONS);
	const [length, setLength] = useState(LENGTH_DEFAULT);
	const [token, setToken] = useState('');
	const [copied, setCopied] = useState(false);

	const noneSelected = !Object.values(opts).some(Boolean);

	function toggle(key: keyof TokenOptions) {
		setOpts((prev) => ({ ...prev, [key]: !prev[key] }));
	}

	function generate() {
		setToken(generateToken(opts, length));
		setCopied(false);
	}

	function copy() {
		if (!token) return;
		navigator.clipboard.writeText(token);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-semibold tracking-tight'>Token Generator</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					Generate random string with the chars you want, uppercase or lowercase
					letters, numbers and/or symbols.
				</p>
			</div>

			<Card>
				<CardContent className='space-y-6 pt-6'>
					<div className='space-y-3'>
						<p className='text-sm font-medium'>Characters</p>
						<div className='flex flex-wrap gap-6'>
							{CHAR_OPTIONS.map(({ key, label }) => (
								<div key={key} className='flex items-center gap-2'>
									<Checkbox
										id={key}
										checked={opts[key]}
										onCheckedChange={() => toggle(key)}
									/>
									<Label htmlFor={key}>{label}</Label>
								</div>
							))}
						</div>
					</div>

					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<p className='text-sm font-medium'>Length</p>
							<span className='tabular-nums text-sm text-muted-foreground'>
								{length}
							</span>
						</div>
						<Slider
							min={LENGTH_MIN}
							max={LENGTH_MAX}
							step={1}
							value={[length]}
							onValueChange={([val]) => setLength(val)}
						/>
						<div className='flex justify-between text-xs text-muted-foreground'>
							<span>{LENGTH_MIN}</span>
							<span>{LENGTH_MAX}</span>
						</div>
					</div>

					<Button onClick={generate} disabled={noneSelected} className='w-full'>
						Generate
					</Button>
				</CardContent>
			</Card>

			{token && (
				<Card>
					<CardContent className='pt-6'>
						<div className='flex items-start justify-between gap-4'>
							<p className='break-all font-mono text-sm leading-relaxed'>{token}</p>
							<Button
								variant='outline'
								size='sm'
								onClick={copy}
								className='shrink-0'
							>
								{copied ? 'Copied!' : 'Copy'}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
