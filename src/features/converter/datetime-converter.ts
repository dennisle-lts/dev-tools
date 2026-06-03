import dayjs from 'dayjs';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

export interface TZOption {
	label: string;
	iana: string;
}

export const TIMEZONES: TZOption[] = [
	{ label: 'UTC', iana: 'UTC' },
	{ label: 'Melbourne', iana: 'Australia/Melbourne' },
	{ label: 'Sydney', iana: 'Australia/Sydney' },
	{ label: 'Brisbane', iana: 'Australia/Brisbane' },
	{ label: 'Adelaide', iana: 'Australia/Adelaide' },
	{ label: 'Darwin', iana: 'Australia/Darwin' },
	{ label: 'Perth', iana: 'Australia/Perth' },
];

export const DEFAULT_TZ = 'Australia/Melbourne';

export interface FormatRow {
	label: string;
	value: string;
}

export interface TimezoneRow {
	label: string;
	iana: string;
	datetime: string;
	abbr: string;
	offset: string;
}

function tzPart(
	date: Date,
	iana: string,
	name: Intl.DateTimeFormatOptions['timeZoneName'],
): string {
	return (
		new Intl.DateTimeFormat('en', { timeZone: iana, timeZoneName: name })
			.formatToParts(date)
			.find((p) => p.type === 'timeZoneName')?.value ?? ''
	);
}

export function nowInTz(iana: string): string {
	return dayjs().tz(iana).format('YYYY-MM-DDTHH:mm:ss');
}

export function parseInTz(value: string, iana: string): Date | null {
	const d = dayjs.tz(value, iana);
	return d.isValid() ? d.toDate() : null;
}

export function convertTz(
	value: string,
	fromIana: string,
	toIana: string,
): string {
	const d = dayjs.tz(value, fromIana);
	return d.isValid() ? d.tz(toIana).format('YYYY-MM-DDTHH:mm:ss') : value;
}

export function getFormatRows(date: Date, displayTz: string): FormatRow[] {
	const d = dayjs(date).tz(displayTz);
	const ms = date.getTime();
	const unixSec = Math.floor(ms / 1000);

	const longName = tzPart(date, displayTz, 'long');
	const gmtOffset = tzPart(date, displayTz, 'shortOffset');

	const jsLocale = `${d.format('ddd MMM DD YYYY HH:mm:ss')} ${gmtOffset} (${longName})`;
	const iso8601 = d.format('YYYY-MM-DDTHH:mm:ssZ');
	const iso9075 = d.format('YYYY-MM-DD HH:mm:ss');
	const rfc3339 = d.format('YYYY-MM-DDTHH:mm:ssZ');
	const rfc7231 = date.toUTCString();
	const mongoId = `${unixSec.toString(16).padStart(8, '0')}0000000000000000`;

	// Excel serial: days since Dec 30, 1899 UTC (accounts for Excel's 1900 leap year bug)
	const excelEpochMs = -2209161600000;
	const excelDate = (ms - excelEpochMs) / 86_400_000;
	const excelStr = excelDate.toFixed(11).replace(/0+$/, '').replace(/\.$/, '');

	return [
		{ label: 'JS locale date string', value: jsLocale },
		{ label: 'ISO 8601', value: iso8601 },
		{ label: 'ISO 9075', value: iso9075 },
		{ label: 'RFC 3339', value: rfc3339 },
		{ label: 'RFC 7231', value: rfc7231 },
		{ label: 'Unix timestamp', value: unixSec.toString() },
		{ label: 'Timestamp', value: ms.toString() },
		{ label: 'UTC format', value: date.toUTCString() },
		{ label: 'Mongo ObjectID', value: mongoId },
		{ label: 'Excel date/time', value: excelStr },
	];
}

export function getTimezoneRows(date: Date): TimezoneRow[] {
	return TIMEZONES.map((tz) => ({
		label: tz.label,
		iana: tz.iana,
		datetime: dayjs(date).tz(tz.iana).format('ddd, DD MMM YYYY HH:mm:ss'),
		abbr: tzPart(date, tz.iana, 'short'),
		offset: tzPart(date, tz.iana, 'shortOffset'),
	}));
}
