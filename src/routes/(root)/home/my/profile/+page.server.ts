import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	educationsSchema,
	experiencesSchema,
	skillsSchema,
	profileSchema
} from '$lib/schema';
import {
	userEducations,
	userExperiences,
	users,
	userSkills
} from '$lib/server/db/schema/tables';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals, parent }) => {
	const { user } = await parent();

	return {
		skills: await db.query.skillsMaster.findMany({
			columns: { id: true, title: true }
		}),
		educations: await db.query.educationsMaster.findMany({
			columns: { id: true, title: true, major: true }
		}),
		profileForm: await superValidate(user, zod4(profileSchema)),
		profileEducationsForm: await superValidate(
			{ userId: locals.user!.id, educations: [...user!.educations] },
			zod4(educationsSchema)
		),
		profileExperiencesForm: await superValidate(
			{ userId: locals.user!.id, experiences: [...user!.experiences] },
			zod4(experiencesSchema)
		),
		profileSkillsForm: await superValidate(
			{ userId: locals.user!.id, skills: [...user!.skills] },
			zod4(skillsSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions = {
	profileUser: async ({ request }) => {
		const form = await superValidate(request, zod4(profileSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { name, dob, title, bio, phoneNumber } = form.data;

		try {
			await db
				.update(users)
				.set({ name, dob, title, bio, phoneNumber })
				.where(eq(users.id, form.data.id));

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to update user data');
		}
	},
	profileEducations: async ({ request }) => {
		const form = await superValidate(request, zod4(educationsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { userId, educations, deleted } = form.data;

		try {
			for await (const edu of educations) {
				const {
					id,
					educationId,
					major,
					institution,
					startYear,
					endYear,
					notes
				} = edu;

				if (!id) {
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
				} else {
					await db
						.update(userEducations)
						.set({
							educationId,
							major,
							institution,
							startYear,
							endYear,
							notes
						})
						.where(eq(userEducations.id, id));
				}
			}

			if (deleted.length > 0) {
				for await (const id of deleted) {
					await db.delete(userEducations).where(eq(userEducations.id, id));
				}
			}

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to insert educations');
		}
	},
	profileExperiences: async ({ request }) => {
		const form = await superValidate(request, zod4(experiencesSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { userId, experiences, deleted } = form.data;

		try {
			for await (const exp of experiences) {
				const { id, position, company, startDate, endDate, description } = exp;

				if (!id) {
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
				} else {
					await db
						.update(userExperiences)
						.set({
							position,
							company,
							startDate,
							endDate,
							description
						})
						.where(eq(userExperiences.id, id));
				}
			}

			if (deleted.length > 0) {
				for await (const id of deleted) {
					await db.delete(userExperiences).where(eq(userExperiences.id, id));
				}
			}

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to insert experiences');
		}
	},
	profileSkills: async ({ request }) => {
		const form = await superValidate(request, zod4(skillsSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		const { userId, skills, deleted } = form.data;

		try {
			for await (const skl of skills) {
				const { id, skillId, level, experienceYears } = skl;

				if (!id) {
					await db
						.insert(userSkills)
						.values({ userId, skillId, level, experienceYears });
				} else {
					await db
						.update(userSkills)
						.set({ skillId, level, experienceYears })
						.where(eq(userSkills.id, id));
				}
			}

			if (deleted.length > 0) {
				for await (const id of deleted) {
					await db.delete(userSkills).where(eq(userSkills.id, id));
				}
			}

			return { form, status: 200, data: form.data };
		} catch (error) {
			console.log(error);
			return message(form, 'Failed to insert skills');
		}
	}
} satisfies Actions;
