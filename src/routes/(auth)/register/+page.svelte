<script lang="ts">
	import FormDatepicker from '$lib/components/inputs/form-datepicker.svelte';
	import FormInput from '$lib/components/inputs/form-input.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { registerSchema } from '$lib/schema.js';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(registerSchema)
	});

	const { form: formData, enhance } = form;
</script>

<main class="flex h-screen w-screen items-center justify-center">
	<div class="w-[250px] space-y-12">
		<div class="text-center">
			<h1 class="text-2xl font-black tracking-widest">SKILLPORT</h1>
			<p class="font-bold">Daftar</p>
		</div>
		<!-- <div class="">
			<SuperDebug data={$formData} />
		</div> -->
		<form method="POST" use:enhance class="space-y-2">
			<FormInput {form} name="email" bind:value={$formData.email} placeholder="Email" />
			<FormInput
				{form}
				name="password"
				bind:value={$formData.password}
				type="password"
				placeholder="Kata sandi"
			/>
			<FormInput {form} name="name" bind:value={$formData.name} placeholder="Nama lengkap" />
			<FormDatepicker {form} name="dob" bind:value={$formData.dob} placeholder="Tanggal Lahir" />
			<Form.Button type="submit" class="mt-4 w-full">Daftar</Form.Button>
			<p class="text-center text-sm">
				Sudah punya akun? <Button variant="link" href="/login" class="px-0 font-bold">Masuk</Button>
			</p>
		</form>
	</div>
</main>
