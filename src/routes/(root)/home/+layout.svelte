<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import AppSidebar from '$lib/components/nav/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Alert from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';
	import { AlertCircle, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let { data, children } = $props();

	let alert = $state<boolean>(true);
</script>

<Sidebar.Provider>
	<AppSidebar user={{ ...data.user }} />
	<Sidebar.Inset>
		{#if !data.user.verifiedEmail && alert}
			<div class="p-2">
				<Alert.Root variant="destructive">
					<AlertCircle />
					<Alert.Title>
						<div class="flex items-center justify-between">
							<p>
								Kamu belum verifikasi email. Klik di <Button
									variant="link"
									href="/onboarding/email-verification"
									class="text-foreground h-fit px-0 py-0 font-bold">sini</Button
								> untuk verifikasi.
							</p>
							<Button
								variant="ghost"
								class="h-fit p-0"
								onclick={() => (alert = false)}><X /></Button
							>
						</div>
					</Alert.Title>
				</Alert.Root>
			</div>
		{/if}
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

		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>

<Toaster />
