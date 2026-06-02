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

const navItems = [
	{ label: 'Dashboard', href: '#' },
	{ label: 'Analytics', href: '#' },
	{ label: 'Settings', href: '#' },
];

function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<span className="px-2 text-lg font-semibold">Dev Tools</span>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild>
										<a href={item.href}>{item.label}</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<span className="px-2 py-1 text-xs text-muted-foreground">v0.0.0</span>
			</SidebarFooter>
		</Sidebar>
	);
}

export default function App() {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-14 items-center gap-2 border-b px-4">
						<SidebarTrigger />
						<h1 className="text-sm font-medium">Dashboard</h1>
					</header>
					<main className="flex-1 p-6">
						<p className="text-muted-foreground">Main content goes here.</p>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</TooltipProvider>
	);
}
