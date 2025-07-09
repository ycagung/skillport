<script lang="ts">
	import { profileSchema } from '$lib/schema';
	import {
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import FormInput from '../inputs/form-input.svelte';
	import FormDatepicker from '../inputs/form-datepicker.svelte';
	import FormTextarea from '../inputs/form-textarea.svelte';
	import { Pen, Save } from '@lucide/svelte';
	import { loading } from '$lib/stores';
	import { toast } from 'svelte-sonner';
	import { Button } from '../ui/button';

	let {
		data
	}: {
		data: SuperValidated<Infer<typeof profileSchema>>;
	} = $props();

	const form = superForm(data, {
		validators: zod4Client(profileSchema),
		invalidateAll: 'force',
		onUpdate: ({ form, result }) => {
			const { status } = result.data;
			if (status === 200) {
				toast.success(`Data ${form.data.name} tersimpan`);
				editing = false;
			} else {
				toast.error('Gagal menyimpan data pengguna');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	let editing = $state<boolean>(false);

	$effect(() => {
		if ($delayed) {
			loading.start();
		} else {
			loading.end();
		}
	});
</script>

<form action="?/profileUser" use:enhance method="POST">
	<div class="flex items-center justify-between">
		<h1
			class="flex items-center gap-2 text-lg font-bold tracking-widest uppercase lg:text-xl"
		>
			Data Pengguna 👤
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
		Sedikit perkenalan dulu yuk! ✨ Masukkan nama, tanggal lahir, dan
		pekerjaanmu biar kami bisa kenal lebih dekat 👋
	</p>
	<p class="text-muted-foreground mt-2 max-w-[350px] text-sm">
		Jangan lupa klik <span class="font-bold">💾 Simpan</span> untuk menyimpan
		data <span></span>
	</p>

	<FormInput {form} name="id" bind:value={$formData.id} hidden />
	<div class="my-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
		<FormInput
			{form}
			name="email"
			bind:value={$formData.email}
			disabled
			label="Email"
			verified={$formData.verifiedEmail || false}
			class="lg:col-span-2"
		/>
		<FormInput
			{form}
			name="phoneNumber"
			bind:value={$formData.phoneNumber}
			label="PhoneNumber"
			class="lg:col-span-2"
			placeholder="08123456..."
			disabled={!editing}
		/>
		<FormInput
			{form}
			name="name"
			bind:value={$formData.name}
			label="Nama"
			class="lg:col-span-4"
			disabled={!editing}
		/>
		<FormDatepicker
			{form}
			name="dob"
			bind:value={$formData.dob}
			placeholder="Tanggal Lahir"
			label="Tanggal Lahir"
			class="lg:col-span-2"
			disabled={!editing}
		/>
		<FormInput
			{form}
			name="title"
			bind:value={$formData.title}
			label="Pekerjaan"
			class="lg:col-span-2"
			placeholder="Full Stack Developer"
			disabled={!editing}
		/>
		<FormTextarea
			{form}
			name="bio"
			bind:value={$formData.bio}
			label="Bio"
			class="lg:col-span-4"
			placeholder="Ceritakan sedikit tentangmu ✌️"
			disabled={!editing}
		/>
	</div>
</form>
