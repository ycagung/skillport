<script lang="ts">
	import { educationsSchema } from '$lib/schema';
	import SuperDebug, {
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import FormInput from '../inputs/form-input.svelte';
	import FormTextarea from '../inputs/form-textarea.svelte';
	import { BadgeCheck, Pen, Plus, Save } from '@lucide/svelte';
	import { Separator } from '../ui/separator';
	import { Button } from '../ui/button';
	import FormSelect from '../inputs/form-select.svelte';
	import { loading } from '$lib/stores';
	import type { CarouselAPI } from '../ui/carousel/context';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';
	import { Checkbox } from '../ui/checkbox';
	import { Label } from '../ui/label';

	let {
		data,
		educations
	}: {
		data: SuperValidated<Infer<typeof educationsSchema>>;
		educations: {
			id: number;
			title: string;
			major: string | null;
		}[];
	} = $props();

	const form = superForm(data, {
		validators: zod4Client(educationsSchema),
		dataType: 'json',
		invalidateAll: 'force',
		onUpdate: ({ result }) => {
			const { status } = result.data;
			if (status === 200) {
				toast.success(`Pendidikan tersimpan`);
				editing = false;
			} else {
				toast.error('Gagal menyimpan data');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	let editing = $state<boolean>(false);
	let currentlyStudying = $state<boolean[]>(
		$formData.educations.map((d) => false)
	);

	$effect(() => {
		if ($delayed) {
			loading.start();
		} else {
			loading.end();
		}
	});

	// $formData.educations.push({
	// 	educationId: 0,
	// 	major: null,
	// 	institution: '',
	// 	// @ts-ignore
	// 	startYear: null,
	// 	endYear: null,
	// 	notes: null
	// });
</script>

<form action="?/profileEducations" use:enhance method="POST">
	<div class="flex items-center justify-between">
		<h1
			class="flex items-center gap-2 text-lg font-bold tracking-widest uppercase lg:text-xl"
		>
			Pendidikan 🎓
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
		Ceritain kamu belajar di mana aja 📚 Dari SD sampai S2 (atau bootcamp juga
		boleh!) 💡
	</p>
	<p class="text-muted-foreground mt-2 max-w-[350px] text-sm">
		Jangan lupa klik <span class="font-bold">💾 Simpan</span> untuk menyimpan
		data <span></span>
	</p>

	<div class="grid grid-cols-1 gap-8">
		<FormInput {form} name="userId" bind:value={$formData.userId} hidden />
		{#each $formData.educations as edu, i}
			<Card.Root>
				<Card.Content>
					<div class="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-4">
						<FormSelect
							{form}
							name="educations"
							bind:value={$formData.educations[i].educationId}
							class="lg:col-span-2"
							data={educations}
							labelKey="title"
							valueKey="id"
							onValueChange={(v) => {
								const val = parseInt(v);
								console.log(val);
								if (val) {
									$formData.educations[i].educationId = val;

									$formData.educations[i].major = educations.find(
										(e) => e.id === val
									)!.major;
								}
							}}
							label="Jenjang"
							placeholder="S1 Teknik ..."
							disabled={!editing}
						/>
						<FormInput
							{form}
							name="educations"
							bind:value={$formData.educations[i].major}
							class="lg:col-span-2"
							label="Jurusan"
							placeholder="Teknik ..."
							disabled={!editing}
						/>
						<FormInput
							{form}
							name="educations"
							bind:value={$formData.educations[i].institution}
							class="lg:col-span-4"
							label="Nama Institusi"
							placeholder="Universitas ..."
							disabled={!editing}
						/>
						<FormInput
							{form}
							name="educations"
							bind:value={$formData.educations[i].startYear}
							type="number"
							class="lg:col-span-2"
							label="Tahun Mulai"
							placeholder="20..."
							disabled={!editing}
						/>

						<div
							class={cn(
								'mb-2 lg:col-span-2',
								currentlyStudying[i] &&
									'lg:flex lg:h-[72px] lg:flex-col lg:justify-center lg:px-8'
							)}
						>
							<FormInput
								{form}
								name="educations"
								bind:value={$formData.educations[i].endYear}
								type="number"
								class="lg:col-span-2"
								label="Tahun Lulus"
								placeholder="20..."
								hidden={currentlyStudying[i]}
								disabled={!editing}
							/>
							{#if editing}
								<div class="flex gap-2">
									<Checkbox
										bind:checked={currentlyStudying[i]}
										onCheckedChange={(v) => {
											if (v) $formData.educations[i].endYear = null;
										}}
										id={`currently-studying-${i}`}
									/>
									<Label for={`currently-studying-${i}`}
										>Sedang belajar di sini</Label
									>
								</div>
							{/if}
						</div>
						<FormTextarea
							{form}
							name="educations"
							bind:value={$formData.educations[i].notes}
							label="Keterangan"
							class="lg:col-span-4"
							placeholder="Adakah yang berkesan di jenjang ini? 🏆"
							disabled={!editing}
						/>
						<Button
							variant="destructive"
							class="lg:col-span-4"
							onclick={() => {
								$formData.educations = $formData.educations.filter(
									(_, index) => index !== i
								);
								currentlyStudying = currentlyStudying.filter(
									(_, index) => index !== i
								);
								if (edu.id) {
									$formData.deleted = [...$formData.deleted, edu.id];
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
						$formData.educations = [
							// @ts-ignore
							...$formData.educations,
							{
								educationId: 0,
								major: null,
								institution: '',
								// @ts-ignore
								startYear: null,
								endYear: null,
								notes: null
							}
						];
						currentlyStudying = [...currentlyStudying, false];
					}}><Plus /></Button
				>
			{/if}
			<div class="w-full">
				<Separator />
			</div>
		</div>
	</div>
</form>
