<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import AppSidebar from '$lib/components/nav/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Alert from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';
	import { AlertCircle, X, type IconProps } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import type { Component } from 'svelte';

	let { data, children } = $props();

	let alerts = $state<
		{
			variant: 'default' | 'destructive';
			icon: Component<IconProps, {}, ''>;
			condition: boolean;
			state: boolean;
			content: string;
		}[]
	>([
		{
			variant: 'destructive',
			icon: AlertCircle,
			condition: !data.user.verifiedEmail,
			state: true,
			content: `<p>
								Kamu belum verifikasi email. Klik di <Button
								variant="link"
								href="/onboarding/email-verification"
								class="text-foreground h-fit px-0 py-0 font-bold">sini</Button
								> untuk verifikasi.
								</p>`
		},
		{
			variant: 'default',
			icon: AlertCircle,
			condition: true,
			state: true,
			content: `<p class='text-muted-foreground'>
								<span class='text-foreground font-bold'>[FITUR BARU]</span> 
								Silakan klik <span class='text-foreground font-semibold'>Profil Saya</span> 
								untuk melihat, atau merubah profil, pendidikan, pengalaman, dan skillmu
								</p>`
		}
	]);
	let inset = $state<HTMLElement | null>(null);
	let height = $state<number>(0);

	$inspect(height);

	$effect(() => {
		height = inset ? inset?.offsetHeight - 64 : 0;
	});
</script>

<Sidebar.Provider>
	<AppSidebar user={{ ...data.user }} />
	<Sidebar.Inset bind:ref={inset}>
		{#each alerts as alert, i}
			{#if alert.condition && alert.state}
				<div class="p-2">
					<Alert.Root variant={alert.variant}>
						<alert.icon />
						<Alert.Title>
							<div class="flex items-center justify-between">
								{@html alert.content}

								<Button
									variant="ghost"
									class="h-fit p-0"
									onclick={() => (alerts[i].state = false)}><X /></Button
								>
							</div>
						</Alert.Title>
					</Alert.Root>
				</div>
			{/if}
		{/each}
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator
					orientation="vertical"
					class="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>

		<ScrollArea class="px-4 pb-2" style="height: {height}px">
			<div class="mx-auto max-w-[1000px]">
				{@render children()}
			</div>
		</ScrollArea>
	</Sidebar.Inset>
</Sidebar.Provider>

<Toaster />
