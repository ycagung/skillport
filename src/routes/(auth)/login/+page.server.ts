import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema';
import { fail } from '@sveltejs/kit';
import { validatePassword } from '$lib/utils';
import { db } from '$lib/server/db';
import { verify } from '@node-rs/argon2';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth';

export const load = (async () => {
	return {
		form: await superValidate(zod4(loginSchema))
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(loginSchema));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);
		const { email, password } = form.data;

		if (!validatePassword(password)) {
			return fail(400, {
				message: 'Invalid password (min 6, max 255 characters)'
			});
		}

		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email)
		});

		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return { form, status: 200 };
	}
} satisfies Actions;
