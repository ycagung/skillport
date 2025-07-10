import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		user: await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, params.userId),
			columns: {
				id: true,
				email: true,
				name: true,
				dob: true,
				bio: true,
				title: true,
				phoneNumber: true,
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
					},
					with: {
						education: { columns: { title: true } }
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
					},
					with: { skill: { columns: { title: true } } }
				}
			}
		})
	};
}) satisfies PageServerLoad;
