import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import {
	convertTz,
	DEFAULT_TZ,
	type FormatRow,
	getFormatRows,
	getTimezoneRows,
	nowInTz,
	parseInTz,
	TIMEZONES,
	type TimezoneRow,
} from './datetime-converter';

function CopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);

	function copy() {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={copy}
			className="h-7 w-7 shrink-0 px-0 text-muted-foreground hover:text-foreground"
		>
			{copied ? (
				<span className="text-[10px] font-medium text-green-600">✓</span>
			) : (
				<Copy className="h-3.5 w-3.5" />
			)}
		</Button>
	);
}

function FormatTable({ rows }: { rows: FormatRow[] }) {
	return (
		<div className="divide-y">
			{rows.map((row) => (
				<div key={row.label} className="flex items-center gap-3 px-6 py-2.5">
					<span className="w-44 shrink-0 text-right text-sm text-muted-foreground">
						{row.label}
					</span>
					<span className="flex-1 truncate font-mono text-sm">{row.value}</span>
					<CopyButton value={row.value} />
				</div>
			))}
		</div>
	);
}

function TimezoneTable({ rows }: { rows: TimezoneRow[] }) {
	return (
		<div className="divide-y">
			{rows.map((row) => (
				<div key={row.iana} className="flex items-center gap-3 px-6 py-2.5">
					<span className="w-24 shrink-0 text-right text-sm text-muted-foreground">
						{row.label}
					</span>
					<span className="flex-1 font-mono text-sm">{row.datetime}</span>
					<span className="w-14 shrink-0 text-right text-xs text-muted-foreground">
						{row.abbr}
					</span>
					<span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
						{row.offset}
					</span>
					<CopyButton value={row.datetime} />
				</div>
			))}
		</div>
	);
}

export default function DateTimeConverter() {
	const [inputValue, setInputValue] = useState(() => nowInTz(DEFAULT_TZ));
	const [inputTz, setInputTz] = useState(DEFAULT_TZ);
	const [formats, setFormats] = useState<FormatRow[]>([]);
	const [timezones, setTimezones] = useState<TimezoneRow[]>([]);

	useEffect(() => {
		const date = parseInTz(inputValue, inputTz);
		if (!date) {
			setFormats([]);
			setTimezones([]);
			return;
		}
		setFormats(getFormatRows(date, inputTz));
		setTimezones(getTimezoneRows(date));
	}, [inputValue, inputTz]);

	function handleTzChange(newTz: string) {
		// Keep the same UTC moment, update the displayed local time
		setInputValue((prev) => convertTz(prev, inputTz, newTz));
		setInputTz(newTz);
	}

	function handleNow() {
		setInputValue(nowInTz(inputTz));
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					Date-Time Converter
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Convert date and time into various formats and across Australian
					timezones.
				</p>
			</div>

			{/* Input */}
			<Card>
				<CardContent className="space-y-4 pt-6">
					<div className="flex gap-2">
						<Input
							type="datetime-local"
							step={1}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							className="flex-1"
						/>
						<Button variant="outline" onClick={handleNow}>
							Now
						</Button>
					</div>
					<div className="space-y-2">
						<Label>Timezone</Label>
						<Select value={inputTz} onValueChange={handleTzChange}>
							<SelectTrigger className="w-56">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TIMEZONES.map((tz) => (
									<SelectItem key={tz.iana} value={tz.iana}>
										{tz.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Format conversions */}
			{formats.length > 0 && (
				<Card>
					<CardHeader className="pb-2 pt-4">
						<CardTitle className="text-sm font-medium">Formats</CardTitle>
					</CardHeader>
					<CardContent className="p-0 pb-2">
						<FormatTable rows={formats} />
					</CardContent>
				</Card>
			)}

			{/* Timezone conversions */}
			{timezones.length > 0 && (
				<Card>
					<CardHeader className="pb-2 pt-4">
						<CardTitle className="text-sm font-medium">Timezones</CardTitle>
					</CardHeader>
					<CardContent className="p-0 pb-2">
						<TimezoneTable rows={timezones} />
					</CardContent>
				</Card>
			)}
		</div>
	);
}
