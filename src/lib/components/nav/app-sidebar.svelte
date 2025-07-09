<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavProjects from './nav-projects.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import {
		BriefcaseBusiness,
		ChartPieIcon,
		FrameIcon,
		LifeBuoyIcon,
		MapIcon,
		SendIcon,
		SquareTerminalIcon,
		User
	} from '@lucide/svelte';

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: {
			name: string | null;
			email: string;
			avatar: string | null;
		};
	} = $props();

	const data = {
		navMain: [
			// {
			// 	title: 'Screening',
			// 	url: '#',
			// 	icon: SquareTerminalIcon,
			// 	isActive: true,
			// 	items: [
			// 		{
			// 			title: 'Tes',
			// 			url: '#'
			// 		},
			// 		{
			// 			title: 'Hasil',
			// 			url: '#'
			// 		}
			// 	]
			// },
			// {
			// 	title: 'Pekerjaan',
			// 	url: '#',
			// 	icon: BriefcaseBusiness,
			// 	items: [
			// 		{
			// 			title: 'Lowongan',
			// 			url: '#'
			// 		},
			// 		{
			// 			title: 'Pekerjaan saya',
			// 			url: '#'
			// 		},
			// 		{
			// 			title: 'Laporan',
			// 			url: '#'
			// 		}
			// 	]
			// },
			{
				title: 'Profil Saya',
				url: '/home/profile',
				icon: User,
				items: [
					{
						title: 'Pendidikan',
						url: '/home/profile#educations'
					},
					{
						title: 'Pengalaman',
						url: '/home/profile#experiences'
					},
					{
						title: 'Skill',
						url: '/home/profile#skills'
					}
				]
			}
		],
		navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: LifeBuoyIcon
			},
			{
				title: 'Feedback',
				url: '#',
				icon: SendIcon
			}
		],
		projects: [
			// {
			// 	name: 'Bot WA - PT Dummy A',
			// 	url: '#',
			// 	icon: FrameIcon
			// },
		]
	};
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/home" {...props}>
							<img
								src="/skillport-logo.png"
								alt="Skillport logo"
								class="size-8"
							/>
							<div class="ml-2 grid flex-1 text-left text-sm leading-tight">
								<span class="truncate text-xl font-semibold tracking-wider"
									>SkillPort</span
								>
								<!-- <span class="truncate text-xs">Enterprise</span> -->
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
