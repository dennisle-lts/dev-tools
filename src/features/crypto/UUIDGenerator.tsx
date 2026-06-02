import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
	COUNT_DEFAULT,
	COUNT_MAX,
	COUNT_MIN,
	generateUUIDs,
	type NamespaceName,
	needsNamespace,
	UUID_VERSIONS,
	type UUIDVersion,
} from './uuid-generator';

export default function UUIDGenerator() {
	const [version, setVersion] = useState<UUIDVersion>('v4');
	const [count, setCount] = useState(COUNT_DEFAULT);
	const [namespace, setNamespace] = useState<NamespaceName>('DNS');
	const [name, setName] = useState('');
	const [uuids, setUUIDs] = useState<string[]>([]);
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
		setUUIDs(generateUUIDs({ version, count, namespace, name }));
		setCopied(false);
	}

	function copyAll() {
		navigator.clipboard.writeText(uuids.join('\n'));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	const showNamespace = needsNamespace(version);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">
					UUID Generator
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Generate universally unique identifiers. Supports UUID v1, v3, v4, v5,
					and v7.
				</p>
			</div>

			<Card>
				<CardContent className="space-y-5 pt-6">
					<div className="space-y-2">
						<Label>Version</Label>
						<ToggleGroup
							type="single"
							value={version}
							onValueChange={(val) => val && setVersion(val as UUIDVersion)}
							className="justify-start"
						>
							{UUID_VERSIONS.map((v) => (
								<ToggleGroupItem key={v} value={v} className="uppercase">
									{v}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					</div>

					{showNamespace && (
						<>
							<div className="space-y-2">
								<Label htmlFor="namespace">Namespace</Label>
								<Select
									value={namespace}
									onValueChange={(val) => setNamespace(val as NamespaceName)}
								>
									<SelectTrigger id="namespace" className="w-40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="DNS">DNS</SelectItem>
										<SelectItem value="URL">URL</SelectItem>
										<SelectItem value="OID">OID</SelectItem>
										<SelectItem value="X500">X500</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="ns-name">Name</Label>
								<Input
									id="ns-name"
									placeholder="e.g. example.com"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</>
					)}

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

			{uuids.length > 0 && (
				<Card>
					<CardContent className="pt-6 space-y-3">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">
								{uuids.length} UUIDs generated
							</p>
							<Button variant="outline" size="sm" onClick={copyAll}>
								{copied ? 'Copied!' : 'Copy all'}
							</Button>
						</div>
						<div className="rounded-md bg-muted p-3 space-y-1">
							{uuids.map((id) => (
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
