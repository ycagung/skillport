import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	onboardingEducationsSchema,
	onboardingExperiencesSchema,
	onboardingSkillsSchema,
	onboardingUserSchema
} from '$lib/schema';
import {
	userEducations,
	userExperiences,
	users,
	userSkills
} from '$lib/server/db/schema/tables';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, locals.user!.id),
		columns: {
			id: true,
			email: true,
			name: true,
			dob: true,
			bio: true,
			title: true,
			verifiedEmail: true
		},
		with: {
			educations: {
				columns: {
					id: true,
					educationId: true,
					major: true,
					institution: true,
					startYear: true,
					endYear: true,
					notes: true
				}
			},
			experiences: {
				columns: {
					id: true,
					position: true,
					company: true,
					startDate: true,
					endDate: true,
					description: true
				}
			},
			skills: {
				columns: {
					id: true,
					skillId: true,
					level: true,
					experienceYears: true
				}
			}
		}
	});

	console.log(user?.educations);
	console.log(user?.experiences);
	console.log(user?.skills);

	return {
		skills: await db.query.skillsMaster.findMany({
			columns: { id: true, title: true }
		}),
		educations: await db.query.educationsMaster.findMany({
			columns: { id: true, title: true, major: true }
		}),
		user,
		onboardingUserForm: await superValidate(user, zod4(onboardingUserSchema)),
		onboardingEducationsForm: await superValidate(
			{ userId: locals.user!.id, educations: [...user!.educations] },
			zod4(onboardingEducationsSchema)
		),
		onboardingExperiencesForm: await superValidate(
			{ userId: locals.user!.id, experiences: [...user!.experiences] },
			zod4(onboardingExperiencesSchema)
		),
		onboardingSkillsForm: await superValidate(
			{ userId: locals.user!.id, skills: [...user!.skills] },
			zod4(onboardingSkillsSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	onboardingUser: async ({ request }) => {
		const form = await superValidate(request, zod4(onboardingUserSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { name, dob, title, bio } = form.data;

		try {
			await db
				.update(users)
				.set({ name, dob, title, bio })
				.where(eq(users.id, form.data.id));

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to update user data');
		}
	},
	onboardingEducations: async ({ request }) => {
		const form = await superValidate(request, zod4(onboardingEducationsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { userId, educations } = form.data;

		try {
			for await (const edu of educations) {
				if (!edu.id) {
					const { educationId, major, institution, startYear, endYear, notes } =
						edu;

					const [newEdu] = await db
						.insert(userEducations)
						.values({
							userId,
							educationId,
							major,
							institution,
							startYear,
							endYear,
							notes
						})
						.returning({ institution: userEducations.institution });

					console.log(`Inserted ${newEdu.institution}`);
				}
			}

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to insert educations');
		}
	},
	onboardingExperiences: async ({ request }) => {
		const form = await superValidate(
			request,
			zod4(onboardingExperiencesSchema)
		);

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { userId, experiences } = form.data;

		try {
			for await (const exp of experiences) {
				if (!exp.id) {
					const { position, company, startDate, endDate, description } = exp;

					const [newExp] = await db
						.insert(userExperiences)
						.values({
							userId,
							position,
							company,
							startDate,
							endDate,
							description
						})
						.returning({ company: userExperiences.company });

					console.log(`Inserted ${newExp.company}`);
				}
			}

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to insert experiences');
		}
	},
	onboardingSkills: async ({ request }) => {
		const form = await superValidate(request, zod4(onboardingSkillsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { userId, skills } = form.data;

		try {
			for await (const skl of skills) {
				if (!skl.id) {
					const { skillId, level, experienceYears } = skl;

					await db
						.insert(userSkills)
						.values({ userId, skillId, level, experienceYears });
				}
			}

			await db.update(users).set({ boarded: true }).where(eq(users.id, userId));

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to insert skills');
		}
	}
} satisfies Actions;
