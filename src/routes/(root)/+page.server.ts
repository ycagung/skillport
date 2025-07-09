import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ locals }) => {
	const { boarded, verifiedEmail } = (await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, locals.user!.id),
		columns: { boarded: true, verifiedEmail: true }
	}))!;

	if (!verifiedEmail) return redirect(302, '/onboarding/email-verification');

	if (!boarded) return redirect(302, '/onboarding');

	return redirect(302, '/home');
}) satisfies PageServerLoad;
