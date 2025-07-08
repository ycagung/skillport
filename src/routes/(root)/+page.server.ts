import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ locals }) => {
	if (
		!(await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, locals.user!.id),
			columns: { boarded: true }
		}))!.boarded
	)
		return redirect(302, '/onboarding');
}) satisfies PageServerLoad;
