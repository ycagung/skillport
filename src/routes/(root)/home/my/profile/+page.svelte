<script lang="ts">
	import { page } from '$app/stores';
	import ProfileEducationsForm from '$lib/components/forms/profile-educations-form.svelte';
	import ProfileExperiencesForm from '$lib/components/forms/profile-experiences-form.svelte';
	import ProfileForm from '$lib/components/forms/profile-form.svelte';
	import ProfileSkillsForm from '$lib/components/forms/profile-skills-form.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import type { Component } from 'svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const tabs: {
		value: string;
		title: string;
		component: any;
		props: any;
	}[] = [
		{
			value: 'profile',
			title: 'Profil',
			component: ProfileForm,
			props: {
				data: data.profileForm
			}
		},
		{
			value: 'educations',
			title: 'Pendidikan',
			component: ProfileEducationsForm,
			props: {
				data: data.profileEducationsForm,
				educations: data.educations
			}
		},
		{
			value: 'experiences',
			title: 'Pengalaman',
			component: ProfileExperiencesForm,
			props: {
				data: data.profileExperiencesForm
			}
		},
		{
			value: 'skills',
			title: 'Skill',
			component: ProfileSkillsForm,
			props: {
				data: data.profileSkillsForm,
				skills: data.skills
			}
		}
	];

	let active = $state<string>('profile');

	$effect(() => {
		if ($page.url.hash) {
			active = $page.url.hash.replace('#', '');
			return;
		}
		active = 'profile';
	});
</script>

<Tabs.Root bind:value={active}>
	<Tabs.List>
		{#each tabs as { value, title }}
			<Tabs.Trigger
				{value}
				class="capitalize"
				onclick={() =>
					goto(
						`/home/my/profile${value !== 'profile' ? '#' : ''}${value !== 'profile' ? value : ''}`
					)}>{title}</Tabs.Trigger
			>
		{/each}
	</Tabs.List>
	{#each tabs as tab}
		<Tabs.Content value={tab.value}>
			<Card.Root>
				<Card.Content>
					<tab.component {...tab.props} />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	{/each}
</Tabs.Root>
