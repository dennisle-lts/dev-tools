import { ChevronDown, KeyRound, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import Bcrypt from '@/features/crypto/Bcrypt';
import TokenGenerator from '@/features/crypto/TokenGenerator';

type FeatureId = 'token-generator' | 'bcrypt';

interface NavItem {
	id: FeatureId;
	label: string;
	icon: React.ElementType;
}

interface NavSection {
	label: string;
	items: NavItem[];
}

const NAV: NavSection[] = [
	{
		label: 'Crypto',
		items: [
			{ id: 'token-generator', label: 'Token Generator', icon: KeyRound },
			{ id: 'bcrypt', label: 'Bcrypt', icon: LockKeyhole },
		],
	},
];

const FEATURES: Record<FeatureId, React.ReactNode> = {
	'token-generator': <TokenGenerator />,
	bcrypt: <Bcrypt />,
};

function AppSidebar({
	active,
	onSelect,
}: {
	active: FeatureId;
	onSelect: (id: FeatureId) => void;
}) {
	return (
		<Sidebar>
			<SidebarHeader>
				<span className="px-2 text-lg font-semibold">Dev Tools</span>
			</SidebarHeader>
			<SidebarContent>
				{NAV.map((section) => (
					<Collapsible
						key={section.label}
						defaultOpen
						className="group/collapsible"
					>
						<SidebarGroup>
							<SidebarGroupLabel asChild>
								<CollapsibleTrigger className="flex w-full items-center justify-between">
									{section.label}
									<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
								</CollapsibleTrigger>
							</SidebarGroupLabel>
							<CollapsibleContent>
								<SidebarGroupContent>
									<SidebarMenu className="pl-3">
										{section.items.map((item) => (
											<SidebarMenuItem key={item.id}>
												<SidebarMenuButton
													isActive={active === item.id}
													onClick={() => onSelect(item.id)}
												>
													<item.icon />
													{item.label}
												</SidebarMenuButton>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</CollapsibleContent>
						</SidebarGroup>
					</Collapsible>
				))}
			</SidebarContent>
			<SidebarFooter>
				<span className="px-2 py-1 text-xs text-muted-foreground">v0.0.0</span>
			</SidebarFooter>
		</Sidebar>
	);
}

export default function App() {
	const [active, setActive] = useState<FeatureId>('token-generator');

	const activeLabel =
		NAV.flatMap((s) => s.items).find((i) => i.id === active)?.label ?? '';

	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar active={active} onSelect={setActive} />
				<SidebarInset>
					<header className="flex h-14 items-center gap-2 border-b px-4">
						<SidebarTrigger />
						<span className="text-sm font-medium">{activeLabel}</span>
					</header>
					<main className="flex-1 p-6">{FEATURES[active]}</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
