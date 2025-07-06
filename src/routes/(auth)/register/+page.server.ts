import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { registerSchema } from '$lib/schema';
import { fail, redirect } from '@sveltejs/kit';
import { generateUserId, validatePassword } from '$lib/utils';
import { hash } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/tables';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';

export const load = (async () => {
	return {
		form: await superValidate(zod4(registerSchema))
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(registerSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
		const { email, password, name, dob } = form.data;

		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = generateUserId();

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(users).values({ id: userId, email, passwordHash, name, dob });

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, userId);
			setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/onboarding');
	}
} satisfies Actions;
