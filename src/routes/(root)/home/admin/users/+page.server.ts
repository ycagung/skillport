import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		users: await db.query.users.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				phoneNumber: true,
				verifiedEmail: true,
				boarded: true
			}
		})
	};
}) satisfies PageServerLoad;
