export interface RegexMatch {
	id: number;
	fullMatch: string;
	groups: string[];
	namedGroups: Record<string, string> | null;
	index: number;
	end: number;
}

export interface HighlightSegment {
	charStart: number;
	text: string;
	isMatch: boolean;
	matchIndex: number;
}

export interface CSVMatchRow {
	rowIndex: number;
	originalValue: string;
	match: string | null;
	groups: string[];
}

export function buildRegex(pattern: string, flags: string): RegExp | null {
	if (!pattern.trim()) return null;
	try {
		return new RegExp(pattern, flags);
	} catch {
		return null;
	}
}

function makeMatch(m: RegExpExecArray, id: number): RegexMatch {
	return {
		id,
		fullMatch: m[0],
		groups: m.slice(1).map((g) => g ?? ''),
		namedGroups: m.groups ? { ...m.groups } : null,
		index: m.index,
		end: m.index + m[0].length,
	};
}

export function findMatches(text: string, regex: RegExp): RegexMatch[] {
	if (!regex.flags.includes('g')) {
		const m = regex.exec(text);
		return m ? [makeMatch(m, 0)] : [];
	}

	const matches: RegexMatch[] = [];
	let id = 0;
	let m = regex.exec(text);
	while (m !== null) {
		matches.push(makeMatch(m, id++));
		if (m[0].length === 0) regex.lastIndex++;
		m = regex.exec(text);
	}
	return matches;
}

export function buildHighlights(
	text: string,
	matches: RegexMatch[],
): HighlightSegment[] {
	if (!matches.length)
		return [{ charStart: 0, text, isMatch: false, matchIndex: -1 }];
	const segs: HighlightSegment[] = [];
	let last = 0;

	for (let i = 0; i < matches.length; i++) {
		const { index, end } = matches[i];
		if (index > last)
			segs.push({
				charStart: last,
				text: text.slice(last, index),
				isMatch: false,
				matchIndex: -1,
			});
		segs.push({
			charStart: index,
			text: text.slice(index, end),
			isMatch: true,
			matchIndex: i,
		});
		last = end;
	}
	if (last < text.length)
		segs.push({
			charStart: last,
			text: text.slice(last),
			isMatch: false,
			matchIndex: -1,
		});
	return segs;
}

export function parseCSV(csv: string): string[][] {
	const rows: string[][] = [];
	for (const line of csv.split('\n')) {
		if (!line.trim()) continue;
		const cells: string[] = [];
		let inQ = false;
		let cell = '';
		for (let i = 0; i < line.length; i++) {
			const ch = line[i];
			if (ch === '"') {
				if (inQ && line[i + 1] === '"') {
					cell += '"';
					i++;
				} else {
					inQ = !inQ;
				}
			} else if (ch === ',' && !inQ) {
				cells.push(cell);
				cell = '';
			} else {
				cell += ch;
			}
		}
		cells.push(cell);
		rows.push(cells);
	}
	return rows;
}

export interface ColumnOption {
	value: string;
	label: string;
}

export function buildColumnOptions(headers: string[]): ColumnOption[] {
	return headers.map((h, i) => ({
		value: String(i),
		label: h.trim() || `Column ${i + 1}`,
	}));
}

export function applyRegexToCSV(
	rows: string[][],
	colIndex: number,
	regex: RegExp,
): CSVMatchRow[] {
	// Non-global so exec always returns first match with groups, no lastIndex drift
	const r = new RegExp(regex.source, regex.flags.replace('g', ''));
	return rows.slice(1).map((row, i) => {
		const value = row[colIndex] ?? '';
		const m = r.exec(value);
		return {
			rowIndex: i + 2,
			originalValue: value,
			match: m ? m[0] : null,
			groups: m ? m.slice(1).map((g) => g ?? '') : [],
		};
	});
}

export function resultsToCSV(
	results: CSVMatchRow[],
	columnHeader: string,
	maxGroups: number,
): string {
	const groupCols = Array.from(
		{ length: maxGroups },
		(_, i) => `Group ${i + 1}`,
	);
	const header = ['Row', columnHeader, 'Match', ...groupCols].join(',');
	const lines = results.map((r) => {
		const row = [
			r.rowIndex,
			`"${r.originalValue.replace(/"/g, '""')}"`,
			r.match !== null ? `"${r.match.replace(/"/g, '""')}"` : '',
			...r.groups.map((g) => `"${g.replace(/"/g, '""')}"`),
		];
		return row.join(',');
	});
	return [header, ...lines].join('\n');
}
