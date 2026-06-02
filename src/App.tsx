import { useState } from 'react';
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
import TokenGenerator from '@/features/crypto/TokenGenerator';

type FeatureId = 'token-generator';

interface NavItem {
	id: FeatureId;
	label: string;
}

interface NavSection {
	label: string;
	items: NavItem[];
}

const NAV: NavSection[] = [
	{
		label: 'Crypto',
		items: [{ id: 'token-generator', label: 'Token Generator' }],
	},
];

const FEATURES: Record<FeatureId, React.ReactNode> = {
	'token-generator': <TokenGenerator />,
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
				<span className='px-2 text-lg font-semibold'>Dev Tools</span>
			</SidebarHeader>
			<SidebarContent>
				{NAV.map((section) => (
					<SidebarGroup key={section.label}>
						<SidebarGroupLabel>{section.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{section.items.map((item) => (
									<SidebarMenuItem key={item.id}>
										<SidebarMenuButton
											isActive={active === item.id}
											onClick={() => onSelect(item.id)}
										>
											{item.label}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<span className='px-2 py-1 text-xs text-muted-foreground'>v0.0.0</span>
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
					<header className='flex h-14 items-center gap-2 border-b px-4'>
						<SidebarTrigger />
						<span className='text-sm font-medium'>{activeLabel}</span>
					</header>
					<main className='flex-1 p-6'>{FEATURES[active]}</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
