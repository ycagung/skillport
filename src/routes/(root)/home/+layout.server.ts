import { db } from '$lib/server/db';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		user: (await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, locals.user!.id),
			columns: {
				name: true,
				email: true,
				avatar: true,
				boarded: true,
				verifiedEmail: true
			}
		}))!
	};
}) satisfies LayoutServerLoad;
