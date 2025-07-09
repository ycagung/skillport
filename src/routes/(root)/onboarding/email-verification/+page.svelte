<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/inputs/form-input.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { askOTPEmailSchema, verifyOTPEmailSchema } from '$lib/schema.js';
	import { loading } from '$lib/stores.js';
	import { ShieldCheck, ShieldQuestion } from '@lucide/svelte';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const askOTPForm = superForm(data.askOTPForm, {
		validators: zod4Client(askOTPEmailSchema),
		invalidateAll: false,
		onUpdated: ({ form }) => {
			if (form.message === 'OTP Sent') {
				otpSent = true;
			}
		}
	});

	const {
		form: askOTPFormData,
		enhance: askOTPFormEnhance,
		delayed: askOTPFormDelayed
	} = askOTPForm;

	const verifyOTPForm = superForm(data.verifyOTPForm, {
		validators: zod4Client(verifyOTPEmailSchema),
		invalidateAll: false,
		onUpdated: ({ form }) => {
			if (form.message === 'OTP Verified') {
				goto('/onboarding');
			}
		}
	});

	const {
		form: verifyOTPFormData,
		enhance: verifyOTPFormEnhance,
		delayed: verifyOTPFormDelayed,
		errors
	} = verifyOTPForm;

	let otpSent = $state<boolean>(false);

	$effect(() => {
		if ($askOTPFormDelayed || $verifyOTPFormDelayed) {
			loading.start();
		} else {
			loading.end();
		}
	});
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-4">
	<Card.Root class="max-w-[80vw] min-w-[300px]">
		<Card.Content class="flex flex-col items-center gap-4 lg:flex-row">
			<ShieldQuestion class="size-48 text-sky-300 dark:text-sky-700" />
			<div class="space-y-4">
				<!-- <div class="">
					<SuperDebug data={$verifyOTPFormData} />
				</div> -->
				<div
					class="flex flex-col items-center justify-center space-y-1 text-center"
				>
					<p class="text-lg font-bold">Selamat datang di SkillPort! 👋</p>
					{#if !otpSent}
						<p class="text-muted-foreground max-w-[275px] text-sm">
							Kami membutuhkan verifikasi email kamu. <br />
							Mohon klik
							<span class="text-foreground font-bold">"Kirimkan kode"</span>
							untuk mengirimkan kode ke alamat email berikut.
						</p>
					{:else}
						<p class="text-muted-foreground max-w-[275px] text-sm">
							Cek email kamu, ya (Cek spam folder juga) dan masukkan kode OTP
							yang kamu terima.
						</p>
					{/if}
				</div>
				{#if !otpSent}
					<form
						method="POST"
						use:askOTPFormEnhance
						class="flex w-full flex-col items-center gap-4"
					>
						<FormInput
							form={askOTPForm}
							name="email"
							bind:value={$askOTPFormData.email}
							class="min-w-[250px]"
							inputClass="text-center"
						/>
						<Form.Button
							formaction="?/askCode"
							type="submit"
							variant="outline"
							class="h-fit px-6 py-4 font-bold">Kirimkan kode ✈️</Form.Button
						>
					</form>
				{/if}

				{#if otpSent}
					<form
						method="POST"
						use:verifyOTPFormEnhance
						class="flex w-full flex-col items-center gap-4"
					>
						<Form.Field form={verifyOTPForm} name="otp">
							<Form.Control>
								{#snippet children({ props })}
									<InputOTP.Root
										maxlength={6}
										name="otp"
										bind:value={$verifyOTPFormData.otp}
									>
										{#snippet children({ cells })}
											<InputOTP.Group>
												{#each cells.slice(0, 3) as cell (cell)}
													<InputOTP.Slot aria-invalid {cell} />
												{/each}
											</InputOTP.Group>
											<InputOTP.Separator />
											<InputOTP.Group>
												{#each cells.slice(3, 6) as cell (cell)}
													<InputOTP.Slot aria-invalid {cell} />
												{/each}
											</InputOTP.Group>
										{/snippet}
									</InputOTP.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Button
							formaction="?/verifyCode"
							type="submit"
							class="h-fit px-6 py-4 font-bold">Verifikasi OTP ✅</Form.Button
						>
					</form>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
	<p class="text-muted-foreground w-[300px] text-center text-sm">
		Atau <Button
			variant="link"
			href="/onboarding"
			class="h-fit px-0 py-0 font-bold">lewati</Button
		> untuk langsung melanjutkan ke halaman Onboarding
	</p>
</div>
