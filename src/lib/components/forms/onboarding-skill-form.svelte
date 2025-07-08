<script lang="ts">
	import { onboardingSkillsSchema } from '$lib/schema';
	import SuperDebug, {
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import FormInput from '../inputs/form-input.svelte';
	import FormCombobox from '../inputs/form-combobox.svelte';
	import { BadgeCheck, Plus, Save } from '@lucide/svelte';
	import { Separator } from '../ui/separator';
	import { Button } from '../ui/button';
	import { Slider } from '../ui/slider';
	import { loading } from '$lib/stores';
	import type { CarouselAPI } from '../ui/carousel/context';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let {
		data,
		skills,
		embla,
		completed = $bindable()
	}: {
		data: SuperValidated<Infer<typeof onboardingSkillsSchema>>;
		skills: { id: number; title: string }[];
		embla: CarouselAPI | undefined;
		completed: boolean;
	} = $props();

	const form = superForm(data, {
		validators: zod4Client(onboardingSkillsSchema),
		dataType: 'json',
		invalidateAll: false,
		onUpdate: ({ result }) => {
			const { status } = result.data;
			if (status === 200) {
				toast.success(`Skill tersimpan`);
				completed = true;
				goto('/');
			} else {
				toast.error('Gagal menyimpan data');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	$effect(() => {
		if ($delayed) {
			loading.start();
		} else {
			loading.end();
		}
	});

	// $formData.skills.push({
	// 	skillId: 0,
	// 	experienceYears: null,
	// 	level: 0
	// });
</script>

<form action="?/onboardingSkills" use:enhance method="POST">
	<div class="flex items-center justify-between">
		<h1
			class="flex items-center gap-2 text-lg font-bold tracking-widest uppercase lg:text-xl"
		>
			Skill 🔥
			{#if completed}
				<BadgeCheck class="size-5 text-green-400 dark:text-green-600" />
			{/if}
		</h1>

		<Form.Button><Save />Simpan</Form.Button>
	</div>

	<p class="text-muted-foreground mt-2 max-w-[350px] text-sm">
		Tunjukkan jurus andalanmu! 💻 Tulis skill yang kamu kuasai, dari HTML sampai
		Rust 🔥
	</p>
	<p class="text-muted-foreground mt-2 max-w-[350px] text-sm">
		Jangan lupa klik <span class="font-bold">💾 Simpan</span> untuk menyimpan
		data <span></span>
	</p>

	<!-- <div class="">
		<SuperDebug data={$formData} />
	</div> -->

	<div class="grid grid-cols-1 gap-8">
		<FormInput {form} name="userId" bind:value={$formData.userId} hidden />
		{#each $formData.skills as skl, i}
			<Card.Root>
				<Card.Content>
					<div class="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-4">
						<FormCombobox
							{form}
							name="skills"
							bind:value={$formData.skills[i].skillId}
							class="lg:col-span-3"
							data={skills}
							labelKey="title"
							valueKey="id"
							label="Skill"
							placeholder="Javascript, Figma, Git"
						/>
						<FormInput
							{form}
							name="skills"
							bind:value={$formData.skills[i].experienceYears}
							type="number"
							label="Pengalaman (tahun)"
							placeholder="... tahun"
						/>
						<Form.Field {form} name="skills" class="lg:col-span-4">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label class="mb-2"
										>Level <span class="font-bold"
											>{$formData.skills[i].level}</span
										></Form.Label
									>
									<Slider
										type="single"
										bind:value={$formData.skills[i].level}
										class="my-4 w-full"
										max={10}
										step={1}
									/>
								{/snippet}
							</Form.Control>
						</Form.Field>
						<Button
							variant="destructive"
							class="lg:col-span-4"
							onclick={() => {
								$formData.skills = $formData.skills.filter(
									(_, index) => index !== i
								);
							}}>Hapus</Button
						>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
		<div class="flex items-center justify-between gap-4">
			<div class="w-full">
				<Separator />
			</div>
			<Button
				class="rounded-full"
				size="icon"
				onclick={() => {
					$formData.skills = [
						...$formData.skills,
						{
							skillId: 0,
							level: 0,
							experienceYears: null
						}
					];
				}}><Plus /></Button
			>
			<div class="w-full">
				<Separator />
			</div>
		</div>
	</div>
</form>
