<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Carousel from '$lib/components/ui/carousel';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import OnboardingUserForm from '$lib/components/forms/onboarding-user-form.svelte';
	import OnboardingEducationForm from '$lib/components/forms/onboarding-education-form.svelte';
	import OnboardingExperienceForm from '$lib/components/forms/onboarding-experience-form.svelte';
	import OnboardingSkillForm from '$lib/components/forms/onboarding-skill-form.svelte';
	import { type CarouselAPI } from '$lib/components/ui/carousel/context.js';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils.js';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let embla = $state<CarouselAPI>();
	let completed = $state<{
		user: boolean;
		educations: boolean;
		experiences: boolean;
		skills: boolean;
	}>({ user: false, educations: false, experiences: false, skills: false });

	$inspect(completed);
</script>

<div
	class="flex h-screen w-screen flex-col items-center justify-center gap-4 p-4"
>
	<Carousel.Root class="w-full max-w-[750px]" setApi={(api) => (embla = api)}>
		<Carousel.Content>
			<!-- User Form -->
			<Carousel.Item class={cn(completed.user && 'hidden')}>
				<div class="h-full p-1">
					<Card.Root>
						<Card.Content
							class="flex h-[80vh] items-center justify-center px-4 py-0 lg:px-8"
						>
							<ScrollArea class="h-full w-full">
								<OnboardingUserForm
									{embla}
									data={data.onboardingUserForm}
									bind:completed={completed.user}
								/>
							</ScrollArea>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>

			<!-- Educations Form -->
			<Carousel.Item class={cn(completed.educations && 'hidden')}>
				<div class="h-full p-1">
					<Card.Root>
						<Card.Content
							class="flex h-[80vh] items-center justify-center px-4 py-0 lg:px-8"
						>
							<ScrollArea class="h-full w-full">
								<OnboardingEducationForm
									{embla}
									data={data.onboardingEducationsForm}
									educations={data.educations}
									bind:completed={completed.educations}
								/>
							</ScrollArea>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>

			<!-- Experiences Form -->
			<Carousel.Item class={cn(completed.experiences && 'hidden')}>
				<div class="h-full p-1">
					<Card.Root>
						<Card.Content
							class="flex h-[80vh] items-center justify-center px-4 py-0 lg:px-8"
						>
							<ScrollArea class="h-full w-full">
								<OnboardingExperienceForm
									{embla}
									data={data.onboardingExperiencesForm}
									bind:completed={completed.experiences}
								/>
							</ScrollArea>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>

			<!-- Skills Form -->
			<Carousel.Item>
				<div class="h-full p-1">
					<Card.Root>
						<Card.Content
							class="flex h-[80vh] items-center justify-center px-4 py-0 lg:px-8"
						>
							<ScrollArea class="h-full w-full">
								<OnboardingSkillForm
									{embla}
									data={data.onboardingSkillsForm}
									skills={data.skills}
									bind:completed={completed.skills}
								/>
							</ScrollArea>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		</Carousel.Content>
	</Carousel.Root>
	<p class="text-muted-foreground text-sm">
		Data yang tersimpan bisa dirubah lagi di dashboard
	</p>
</div>
