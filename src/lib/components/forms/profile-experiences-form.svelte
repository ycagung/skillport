<script lang="ts">
	import { experiencesSchema } from '$lib/schema';
	import SuperDebug, {
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import FormInput from '../inputs/form-input.svelte';
	import FormDatepicker from '../inputs/form-datepicker.svelte';
	import FormTextarea from '../inputs/form-textarea.svelte';
	import { BadgeCheck, Pen, Plus, Save } from '@lucide/svelte';
	import { Separator } from '../ui/separator';
	import { Button } from '../ui/button';
	import { loading } from '$lib/stores';
	import type { CarouselAPI } from '../ui/carousel/context';
	import { toast } from 'svelte-sonner';
	import { Checkbox } from '../ui/checkbox';
	import { Label } from '../ui/label';
	import { cn } from '$lib/utils';

	let {
		data
	}: {
		data: SuperValidated<Infer<typeof experiencesSchema>>;
	} = $props();

	const form = superForm(data, {
		validators: zod4Client(experiencesSchema),
		dataType: 'json',
		invalidateAll: 'force',
		onUpdate: ({ form, result }) => {
			console.log(form.data);
			const { status, data } = result.data;
			if (status === 200) {
				toast.success(`Pengalaman kerja tersimpan`);
				editing = false;
			} else {
				toast.error('Gagal menyimpan data');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	let editing = $state<boolean>(false);
	let currentlyWorking = $state<boolean[]>(
		$formData.experiences.map((d) => false)
	);

	$effect(() => {
		if ($delayed) {
			loading.start();
		} else {
			loading.end();
		}
	});

	$inspect(currentlyWorking);
</script>

<form action="?/profileExperiences" use:enhance method="POST">
	<div class="flex items-center justify-between">
		<h1
			class="flex items-center gap-2 text-lg font-bold tracking-widest uppercase lg:text-xl"
		>
			Pengalaman Kerja 🏢
		</h1>

		{#if editing}
			<Form.Button><Save />Simpan</Form.Button>
		{:else}
			<Button onclick={() => (editing = true)} variant="outline"
				><Pen />Ubah</Button
			>
		{/if}
	</div>

	<p class="text-muted-foreground mt-2 max-w-[350px] text-sm">
		Pernah magang? Freelance? Atau proyek bareng teman? Ceritakan di sini ya! 🚀
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
		{#each $formData.experiences as exp, i}
			<Card.Root>
				<Card.Content>
					<div class="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-4">
						<FormInput
							{form}
							name="experiences"
							bind:value={$formData.experiences[i].company}
							class="lg:col-span-2"
							label="Nama Perusahaan"
							placeholder="PT/CV ..."
							disabled={!editing}
						/>
						<FormInput
							{form}
							name="experiences"
							bind:value={$formData.experiences[i].position}
							class="lg:col-span-2"
							label="Jabatan"
							placeholder="Staff Back End ..."
							disabled={!editing}
						/>
						<FormDatepicker
							{form}
							name="dob"
							bind:value={$formData.experiences[i].startDate}
							label="Tanggal Bergabung"
							class="lg:col-span-2"
							disabled={!editing}
						/>
						<div
							class={cn(
								'mb-2 lg:col-span-2',
								currentlyWorking[i] &&
									'lg:flex lg:h-[72px] lg:flex-col lg:justify-center lg:px-8'
							)}
						>
							<FormDatepicker
								{form}
								name="dob"
								bind:value={$formData.experiences[i].endDate}
								label="Tanggal Keluar"
								class="lg:col-span-2"
								hidden={currentlyWorking[i]}
								disabled={!editing}
							/>
							{#if editing}
								<div class="flex gap-2">
									<Checkbox
										bind:checked={currentlyWorking[i]}
										onCheckedChange={(v) => {
											if (v) $formData.experiences[i].endDate = null;
										}}
										id={`currently-working-${i}`}
									/>
									<Label for={`currently-working-${i}`}
										>Sedang bekerja di sini</Label
									>
								</div>
							{/if}
						</div>
						<FormTextarea
							{form}
							name="experiences"
							bind:value={$formData.experiences[i].description}
							label="Keterangan"
							class="lg:col-span-4"
							placeholder="Adakah yang berkesan di perusahaan ini? 🏆"
							disabled={!editing}
						/>
						<Button
							variant="destructive"
							class="lg:col-span-4"
							onclick={() => {
								$formData.experiences = $formData.experiences.filter(
									(_, index) => index !== i
								);
								currentlyWorking = currentlyWorking.filter(
									(_, index) => index !== i
								);
								if (exp.id) {
									$formData.deleted = [...$formData.deleted, exp.id];
								}
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
			{#if editing}
				<Button
					class="rounded-full"
					size="icon"
					onclick={() => {
						$formData.experiences = [
							...$formData.experiences,
							{
								company: '',
								position: '',
								startDate: '',
								endDate: null,
								description: null
							}
						];
						currentlyWorking = [...currentlyWorking, false];
					}}><Plus /></Button
				>
			{/if}
			<div class="w-full">
				<Separator />
			</div>
		</div>
	</div>
</form>
