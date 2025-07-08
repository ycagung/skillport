import { fail, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';

export const POST = (async (event) => {
	if (!event.locals.session) {
		return fail(401);
	}

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	return json({ status: 200, message: 'Logged out successfully' });
}) satisfies RequestHandler;
