<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/inputs/form-input.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { loginSchema } from '$lib/schema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(loginSchema),
		onResult: ({ result }) => {
			if (result.status === 200) {
				console.log(result);

				window.location.href = '/';
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<main class="flex h-screen w-screen items-center justify-center">
	<div class="w-[250px] space-y-12">
		<div class="text-center">
			<h1 class="text-2xl font-black tracking-widest">SKILLPORT</h1>
			<p class="font-bold">Masuk</p>
		</div>
		<form method="POST" use:enhance class="space-y-2">
			<FormInput
				{form}
				name="email"
				bind:value={$formData.email}
				placeholder="Email"
			/>
			<FormInput
				{form}
				name="password"
				bind:value={$formData.password}
				type="password"
				placeholder="Kata sandi"
			/>
			<Form.Button type="submit" class="mt-4 w-full">Masuk</Form.Button>
			<p class="text-center text-sm">
				Belum punya akun? <Button
					variant="link"
					href="/register"
					class="px-0 font-bold">Daftar</Button
				>
			</p>
		</form>
	</div>
</main>
