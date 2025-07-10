<script lang="ts">
	import {
		Circle,
		CircleCheckBig,
		CircleDot,
		Copy,
		Minus,
		Sparkle
	} from '@lucide/svelte';
	import dayjs from 'dayjs';
	import { Button } from '../ui/button';
	import { toast } from 'svelte-sonner';

	let {
		user
	}: {
		user:
			| {
					id: string;
					title: string | null;
					name: string | null;
					email: string;
					dob: string | null;
					bio: string | null;
					verifiedEmail: boolean | null;
					phoneNumber: string | null;
					skills: {
						id: string;
						skillId: number;
						level: number;
						experienceYears: number | null;
						skill: { title: string };
					}[];
					educations: {
						id: string;
						major: string | null;
						educationId: number;
						institution: string;
						startYear: number | null;
						endYear: number | null;
						notes: string | null;
						education: { title: string };
					}[];
					experiences: {
						id: string;
						description: string | null;
						position: string;
						company: string;
						startDate: string;
						endDate: string | null;
					}[];
			  }
			| undefined;
	} = $props();
</script>

{#if user}
	<main class="flex flex-col items-center gap-12 p-8">
		<div class="flex flex-col items-center justify-center">
			<p class="text-3xl font-bold">
				{user.name}
			</p>
			<p class="font-bold italic">{user.title}</p>
			<p class="text-muted-foreground text-sm">
				{dayjs().diff(user.dob, 'year')} tahun
			</p>
			<div
				class="mt-4 flex items-center gap-4 px-4 py-2 text-sm font-semibold tracking-wider"
			>
				<div class="flex items-center">
					{user.email}
					<Button
						variant="link"
						class="h-fit"
						onclick={() => {
							navigator.clipboard.writeText(user.email);
							toast.success('Email tersalin');
						}}><Copy class="size-4" /></Button
					>
				</div>
				{#if user.phoneNumber}
					<div class="flex items-center">
						{user.phoneNumber}
						<Button
							variant="link"
							class="h-fit"
							onclick={() => {
								navigator.clipboard.writeText(user.email);
								toast.success('Nomor telepon tersalin');
							}}><Copy class="size-4" /></Button
						>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex flex-col items-start gap-4 lg:w-[500px]">
			<p class="w-full text-center text-2xl font-bold">Pendidikan</p>
			{#each user.educations as edu}
				<div class="flex items-start justify-start gap-2">
					<div class="flex h-full flex-col items-center gap-2 pt-2">
						{#if edu.endYear}
							<CircleCheckBig class="size-3" />
						{:else}
							<Circle class="size-3" />
						{/if}
						<div class="h-full w-full bg-white"></div>
					</div>
					<div>
						<p class="font-bold">{edu.institution}</p>
						<p class="text-muted-foreground text-sm font-semibold">
							{edu.education.title}
						</p>
						<p class="text-muted-foreground text-sm italic">
							{edu.startYear}
							{edu.endYear && ' - '}
							{edu.endYear}
						</p>
						<p class="text-muted-foreground text-sm">{edu.notes}</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col items-start gap-4 lg:w-[500px]">
			<p class="w-full text-center text-2xl font-bold">Pengalaman Kerja</p>
			{#each user.experiences as exp}
				<div class="flex items-start justify-start gap-2">
					<div class="flex h-full flex-col items-center gap-2 pt-2">
						{#if exp.endDate}
							<CircleDot class="size-3" />
						{:else}
							<Circle class="size-3" />
						{/if}
						<div class="bg-muted h-full w-0.5"></div>
					</div>
					<div>
						<p class="font-bold">{exp.company}</p>
						<p class="text-muted-foreground text-sm font-semibold">
							{exp.position}
						</p>
						<p class="text-muted-foreground text-sm italic">
							{dayjs(exp.startDate).format('MMMM YYYY')}
							{exp.endDate && ` - ${dayjs(exp.endDate).format('MMM YYYY')}`}
						</p>
						<p class="text-muted-foreground text-sm">
							{exp.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col items-start gap-4 lg:w-[500px]">
			<p class="w-full text-center text-2xl font-bold">Skill</p>
			<div class="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
				{#each user.skills as skl}
					{@const level = Array.from({ length: skl.level }, (_, i) => i + 1)}
					{@const levelRemaining = Array.from(
						{ length: 10 - skl.level },
						(_, i) => i + 1
					)}

					<div class="flex flex-col items-start justify-start gap-2">
						<p class="font-semibold">
							{skl.skill.title}
							{#if skl.experienceYears}
								<span class="text-muted-foreground ml-2 text-sm font-normal">
									{skl.experienceYears} tahun
								</span>
							{/if}
						</p>
						<div class="flex gap-2">
							{#each level as point}
								<CircleDot class="size-3 text-black dark:text-white" />
							{/each}
							{#each levelRemaining as point}
								<Minus class="text-muted-foreground size-3" />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</main>
{/if}
