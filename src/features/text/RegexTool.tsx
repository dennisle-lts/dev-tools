import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import type { CSVMatchRow, RegexMatch } from './regex';
import {
	applyRegexToCSV,
	buildColumnOptions,
	buildHighlights,
	buildRegex,
	findMatches,
	parseCSV,
	resultsToCSV,
} from './regex';

type Mode = 'text' | 'csv';

const FLAG_OPTIONS = [
	{ flag: 'g', desc: 'Global — find all matches' },
	{ flag: 'i', desc: 'Case insensitive' },
	{ flag: 'm', desc: 'Multiline (^ and $ match line boundaries)' },
	{ flag: 's', desc: 'Dot matches newline' },
];

const CHEATSHEET = [
	{
		title: 'Character Classes',
		items: [
			{ pattern: '.', desc: 'Any char except newline' },
			{ pattern: '\\d', desc: 'Digit [0-9]' },
			{ pattern: '\\D', desc: 'Not a digit' },
			{ pattern: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
			{ pattern: '\\W', desc: 'Not a word char' },
			{ pattern: '\\s', desc: 'Whitespace' },
			{ pattern: '\\S', desc: 'Not whitespace' },
			{ pattern: '[abc]', desc: 'Any of: a, b, c' },
			{ pattern: '[^abc]', desc: 'Not a, b, or c' },
			{ pattern: '[a-z]', desc: 'Char in range a–z' },
		],
	},
	{
		title: 'Anchors',
		items: [
			{ pattern: '^', desc: 'Start of string/line' },
			{ pattern: '$', desc: 'End of string/line' },
			{ pattern: '\\b', desc: 'Word boundary' },
			{ pattern: '\\B', desc: 'Not word boundary' },
		],
	},
	{
		title: 'Quantifiers',
		items: [
			{ pattern: '*', desc: '0 or more (greedy)' },
			{ pattern: '+', desc: '1 or more (greedy)' },
			{ pattern: '?', desc: '0 or 1 (optional)' },
			{ pattern: '{n}', desc: 'Exactly n times' },
			{ pattern: '{n,}', desc: 'n or more times' },
			{ pattern: '{n,m}', desc: 'Between n and m' },
			{ pattern: '*?', desc: '0 or more (lazy)' },
			{ pattern: '+?', desc: '1 or more (lazy)' },
		],
	},
	{
		title: 'Groups',
		items: [
			{ pattern: '(abc)', desc: 'Capture group' },
			{ pattern: '(?:abc)', desc: 'Non-capturing group' },
			{ pattern: '(?<name>abc)', desc: 'Named capture group' },
			{ pattern: 'a|b', desc: 'a or b (alternation)' },
		],
	},
	{
		title: 'Lookarounds',
		items: [
			{ pattern: '(?=abc)', desc: 'Positive lookahead' },
			{ pattern: '(?!abc)', desc: 'Negative lookahead' },
			{ pattern: '(?<=abc)', desc: 'Positive lookbehind' },
			{ pattern: '(?<!abc)', desc: 'Negative lookbehind' },
		],
	},
	{
		title: 'Common Patterns',
		items: [
			{ pattern: '\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}', desc: 'Phone number' },
			{ pattern: '[\\w.-]+@[\\w-]+\\.[a-z]{2,}', desc: 'Email address' },
			{ pattern: 'https?://\\S+', desc: 'URL' },
			{
				pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}',
				desc: 'IPv4 address',
			},
			{ pattern: '\\d{4}-\\d{2}-\\d{2}', desc: 'Date YYYY-MM-DD' },
			{ pattern: '\\$[\\d,]+(\\.\\d{2})?', desc: 'Dollar amount' },
			{ pattern: '[A-Z]{2}\\d{5}', desc: 'Postal/zip code (US-style)' },
		],
	},
	{
		title: 'Escapes',
		items: [
			{ pattern: '\\n', desc: 'Newline' },
			{ pattern: '\\t', desc: 'Tab' },
			{ pattern: '\\r', desc: 'Carriage return' },
			{ pattern: '\\.', desc: 'Literal dot' },
			{ pattern: '\\*', desc: 'Literal asterisk' },
			{ pattern: '\\(', desc: 'Literal parenthesis' },
			{ pattern: '\\\\', desc: 'Literal backslash' },
		],
	},
];

function Cheatsheet({ onInsert }: { onInsert: (pattern: string) => void }) {
	const [recentInsert, setRecentInsert] = useState<string | null>(null);

	function handleInsert(pattern: string) {
		onInsert(pattern);
		setRecentInsert(pattern);
		setTimeout(() => setRecentInsert(null), 800);
	}

	return (
		<Card className="flex flex-col overflow-hidden">
			<CardHeader className="border-b pb-3">
				<CardTitle className="text-sm font-semibold">
					Regex Cheatsheet
				</CardTitle>
				<p className="text-xs text-muted-foreground">
					Click any pattern to insert at cursor
				</p>
			</CardHeader>
			<CardContent className="overflow-y-auto p-0">
				<div className="space-y-4 p-4">
					{CHEATSHEET.map((section, si) => (
						<div key={section.title}>
							{si > 0 && <Separator className="mb-4" />}
							<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								{section.title}
							</p>
							<div className="space-y-0.5">
								{section.items.map((item) => (
									<button
										key={item.pattern}
										type="button"
										onClick={() => handleInsert(item.pattern)}
										className="flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-muted"
									>
										<code
											className={cn(
												'w-36 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs transition-colors',
												recentInsert === item.pattern
													? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
													: 'bg-muted',
											)}
										>
											{item.pattern}
										</code>
										<span className="text-xs text-muted-foreground">
											{item.desc}
										</span>
									</button>
								))}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function GroupItems({ groups }: { groups: string[] }) {
	const items = groups.map((value, i) => ({
		key: `group-${i + 1}`,
		label: `Group ${i + 1}`,
		value,
	}));
	return (
		<div className="mt-1 space-y-0.5">
			{items.map(({ key, label, value }) => (
				<p key={key} className="text-xs text-muted-foreground">
					{label}: <span className="font-mono text-foreground">{value}</span>
				</p>
			))}
		</div>
	);
}

function MatchList({ matches }: { matches: RegexMatch[] }) {
	if (matches.length === 0) return null;
	return (
		<div className="space-y-2">
			{matches.slice(0, 50).map((m, displayNum) => (
				<div key={m.id} className="rounded-md border px-3 py-2">
					<div className="flex items-center justify-between gap-2">
						<span className="text-xs text-muted-foreground">
							Match {displayNum + 1}
						</span>
						<span className="text-xs text-muted-foreground">
							pos {m.index}–{m.end}
						</span>
					</div>
					<p className="mt-1 break-all font-mono text-sm">
						{m.fullMatch || (
							<em className="text-muted-foreground">empty match</em>
						)}
					</p>
					{m.namedGroups && Object.keys(m.namedGroups).length > 0 ? (
						<div className="mt-1 space-y-0.5">
							{Object.entries(m.namedGroups).map(([name, val]) => (
								<p key={name} className="text-xs text-muted-foreground">
									<span className="font-mono">{name}</span>:{' '}
									<span className="font-mono text-foreground">{val}</span>
								</p>
							))}
						</div>
					) : m.groups.length > 0 ? (
						<GroupItems groups={m.groups} />
					) : null}
				</div>
			))}
			{matches.length > 50 && (
				<p className="text-center text-xs text-muted-foreground">
					Showing first 50 of {matches.length} matches
				</p>
			)}
		</div>
	);
}

function TextMode({
	inputText,
	setInputText,
	matches,
	hasPattern,
	hasText,
	isInvalidPattern,
}: {
	inputText: string;
	setInputText: (v: string) => void;
	matches: RegexMatch[];
	hasPattern: boolean;
	hasText: boolean;
	isInvalidPattern: boolean;
}) {
	const highlights = buildHighlights(inputText, matches);

	return (
		<>
			<Card>
				<CardContent className="space-y-3 pt-6">
					<Label htmlFor="input-text">Input Text</Label>
					<Textarea
						id="input-text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Paste or type text to match against…"
						rows={7}
					/>
				</CardContent>
			</Card>

			{hasText && hasPattern && !isInvalidPattern && (
				<Card>
					<CardContent className="space-y-4 pt-6">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">
								{matches.length === 0
									? 'No matches'
									: `${matches.length} match${matches.length !== 1 ? 'es' : ''}`}
							</p>
						</div>

						<div className="rounded-md bg-muted p-3">
							<p className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed">
								{highlights.map((seg) =>
									seg.isMatch ? (
										<mark
											key={seg.charStart}
											className="rounded-sm bg-yellow-300 px-0.5 text-foreground dark:bg-yellow-600"
										>
											{seg.text}
										</mark>
									) : (
										<span key={seg.charStart}>{seg.text}</span>
									),
								)}
							</p>
						</div>

						<MatchList matches={matches} />
					</CardContent>
				</Card>
			)}
		</>
	);
}

function CSVMode({
	csvText,
	setCsvText,
	csvRows,
	csvCol,
	setCsvCol,
	csvResults,
	hasPattern,
	isInvalidPattern,
}: {
	csvText: string;
	setCsvText: (v: string) => void;
	csvRows: string[][];
	csvCol: string;
	setCsvCol: (v: string) => void;
	csvResults: CSVMatchRow[];
	hasPattern: boolean;
	isInvalidPattern: boolean;
}) {
	const csvHeaders = csvRows[0] ?? [];
	const colIndex = Number.parseInt(csvCol, 10);
	const columnOptions = buildColumnOptions(csvHeaders);
	const matchCount = csvResults.filter((r) => r.match !== null).length;
	const maxGroups = Math.max(0, ...csvResults.map((r) => r.groups.length));
	const groupColumns = Array.from({ length: maxGroups }, (_, i) => ({
		header: `Group ${i + 1}`,
		index: i,
	}));
	const hasResults = csvRows.length > 1 && hasPattern && !isInvalidPattern;

	function downloadResults() {
		const colHeader = csvHeaders[colIndex]?.trim() || `Column ${colIndex + 1}`;
		const csv = resultsToCSV(csvResults, colHeader, maxGroups);
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'regex-results.csv';
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<>
			<Card>
				<CardContent className="space-y-4 pt-6">
					<div className="space-y-2">
						<Label htmlFor="csv-input">Paste CSV</Label>
						<Textarea
							id="csv-input"
							value={csvText}
							onChange={(e) => setCsvText(e.target.value)}
							placeholder={
								'name,notes,phone\nAlice,Call her at 555-123-4567 anytime,\nBob,Prefers text: (800) 555-9876,'
							}
							rows={6}
							className="font-mono text-xs"
						/>
					</div>

					{columnOptions.length > 0 && (
						<div className="space-y-2">
							<Label htmlFor="csv-col">Column to extract from</Label>
							<Select value={csvCol} onValueChange={setCsvCol}>
								<SelectTrigger id="csv-col">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{columnOptions.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</CardContent>
			</Card>

			{hasResults && (
				<Card>
					<CardContent className="space-y-3 pt-6">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">
								{matchCount} of {csvResults.length} rows matched
							</p>
							<Button variant="outline" size="sm" onClick={downloadResults}>
								Download CSV
							</Button>
						</div>

						<div className="overflow-x-auto rounded-md border">
							<table className="w-full text-xs">
								<thead>
									<tr className="border-b bg-muted/50">
										<th className="px-3 py-2 text-left font-medium text-muted-foreground">
											Row
										</th>
										<th className="px-3 py-2 text-left font-medium text-muted-foreground">
											{csvHeaders[colIndex]?.trim() || `Column ${colIndex + 1}`}
										</th>
										<th className="px-3 py-2 text-left font-medium text-muted-foreground">
											Match
										</th>
										{groupColumns.map(({ header }) => (
											<th
												key={header}
												className="px-3 py-2 text-left font-medium text-muted-foreground"
											>
												{header}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{csvResults.slice(0, 200).map((row) => (
										<tr key={row.rowIndex} className="border-b last:border-0">
											<td className="px-3 py-2 text-muted-foreground">
												{row.rowIndex}
											</td>
											<td className="max-w-48 truncate px-3 py-2 font-mono">
												{row.originalValue}
											</td>
											<td className="px-3 py-2 font-mono">
												{row.match !== null ? (
													<span className="font-medium text-foreground">
														{row.match}
													</span>
												) : (
													<span className="italic text-muted-foreground">
														no match
													</span>
												)}
											</td>
											{groupColumns.map(({ header, index }) => (
												<td key={header} className="px-3 py-2 font-mono">
													{row.groups[index] ?? (
														<span className="text-muted-foreground">—</span>
													)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
							{csvResults.length > 200 && (
								<p className="p-3 text-center text-xs text-muted-foreground">
									Showing first 200 of {csvResults.length} rows
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}

export default function RegexTool() {
	const patternRef = useRef<HTMLInputElement>(null);
	const [mode, setMode] = useState<Mode>('text');
	const [pattern, setPattern] = useState('');
	const [flags, setFlags] = useState<Set<string>>(new Set(['g']));
	const [inputText, setInputText] = useState('');
	const [csvText, setCsvText] = useState('');
	const [csvCol, setCsvCol] = useState('0');

	const [regexCopied, setRegexCopied] = useState(false);

	const flagStr = [...flags].sort().join('');
	const regex = buildRegex(pattern, flagStr);
	const isInvalidPattern = pattern.trim().length > 0 && regex === null;
	const regexLiteral =
		pattern.trim() && !isInvalidPattern ? `/${pattern}/${flagStr}` : null;

	function copyRegex() {
		if (!regexLiteral) return;
		navigator.clipboard.writeText(regexLiteral);
		setRegexCopied(true);
		setTimeout(() => setRegexCopied(false), 2000);
	}

	const textMatches = regex && inputText ? findMatches(inputText, regex) : [];

	const csvRows = csvText ? parseCSV(csvText) : [];
	const colIndex = Number.parseInt(csvCol, 10);
	const csvResults =
		regex && csvRows.length > 1
			? applyRegexToCSV(csvRows, colIndex, regex)
			: [];

	function toggleFlag(f: string) {
		setFlags((prev) => {
			const next = new Set(prev);
			if (next.has(f)) next.delete(f);
			else next.add(f);
			return next;
		});
	}

	function insertPattern(p: string) {
		const input = patternRef.current;
		if (!input) {
			setPattern((prev) => prev + p);
			return;
		}
		const start = input.selectionStart ?? pattern.length;
		const end = input.selectionEnd ?? pattern.length;
		const next = pattern.slice(0, start) + p + pattern.slice(end);
		setPattern(next);
		requestAnimationFrame(() => {
			input.focus();
			input.setSelectionRange(start + p.length, start + p.length);
		});
	}

	return (
		<div className="flex gap-6">
			{/* Left: tool area */}
			<div className="min-w-0 flex-1 space-y-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Regex Tester
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Test regular expressions in real time. Switch to CSV mode to extract
						data from a column across all rows.
					</p>
				</div>

				{/* Mode toggle */}
				<div className="flex w-fit gap-1 rounded-md border p-1">
					<Button
						variant={mode === 'text' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setMode('text')}
						className="h-7 px-3 text-xs"
					>
						Text
					</Button>
					<Button
						variant={mode === 'csv' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setMode('csv')}
						className="h-7 px-3 text-xs"
					>
						CSV
					</Button>
				</div>

				{/* Pattern input — shared across modes */}
				<Card>
					<CardContent className="space-y-3 pt-6">
						<Label>Regex Pattern</Label>
						<div className="flex items-center gap-2">
							<span className="shrink-0 font-mono text-muted-foreground">
								/
							</span>
							<Input
								ref={patternRef}
								value={pattern}
								onChange={(e) => setPattern(e.target.value)}
								placeholder="e.g. \d{3}-\d{4}"
								className={cn(
									'font-mono',
									isInvalidPattern &&
										'border-destructive focus-visible:ring-destructive',
								)}
								spellCheck={false}
							/>
							<span className="shrink-0 font-mono text-muted-foreground">
								/
							</span>
							<div className="flex shrink-0 gap-1">
								{FLAG_OPTIONS.map(({ flag, desc }) => (
									<Toggle
										key={flag}
										pressed={flags.has(flag)}
										onPressedChange={() => toggleFlag(flag)}
										size="sm"
										variant="outline"
										title={desc}
										className="h-8 w-8 font-mono"
									>
										{flag}
									</Toggle>
								))}
							</div>
						</div>
						{isInvalidPattern && (
							<p className="text-xs text-destructive">Invalid regex pattern</p>
						)}
						{regexLiteral && (
							<div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
								<span className="font-mono text-sm">{regexLiteral}</span>
								<Button
									variant="outline"
									size="sm"
									onClick={copyRegex}
									className="shrink-0"
								>
									{regexCopied ? 'Copied!' : 'Copy'}
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{mode === 'text' ? (
					<TextMode
						inputText={inputText}
						setInputText={setInputText}
						matches={textMatches}
						hasPattern={pattern.trim().length > 0}
						hasText={inputText.length > 0}
						isInvalidPattern={isInvalidPattern}
					/>
				) : (
					<CSVMode
						csvText={csvText}
						setCsvText={setCsvText}
						csvRows={csvRows}
						csvCol={csvCol}
						setCsvCol={setCsvCol}
						csvResults={csvResults}
						hasPattern={pattern.trim().length > 0}
						isInvalidPattern={isInvalidPattern}
					/>
				)}
			</div>

			{/* Right: sticky cheatsheet */}
			<div className="w-72 shrink-0">
				<div
					className="sticky top-6"
					style={{ maxHeight: 'calc(100vh - 5rem)' }}
				>
					<Cheatsheet onInsert={insertPattern} />
				</div>
			</div>
		</div>
	);
}
