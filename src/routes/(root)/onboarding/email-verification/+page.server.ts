import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { askOTPEmailSchema, verifyOTPEmailSchema } from '$lib/schema';
import { fail } from '@sveltejs/kit';
import { getRandomSixDigitNumber } from '$lib/utils';
import { otpEmail } from '$lib/template';
import { transporter } from '$lib/server/mailer';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema/tables';
import { eq } from 'drizzle-orm';

export const load = (async ({ locals }) => {
	return {
		askOTPForm: await superValidate(
			{ email: locals.user?.email },
			zod4(askOTPEmailSchema)
		),
		verifyOTPForm: await superValidate(zod4(verifyOTPEmailSchema))
	};
}) satisfies PageServerLoad;

export const actions = {
	askCode: async ({ request, cookies }) => {
		const askOTPForm = await superValidate(request, zod4(askOTPEmailSchema));

		if (!askOTPForm.valid) return fail(400, { askOTPForm });

		const otp = getRandomSixDigitNumber();
		const html = otpEmail
			.replace('[email address]', askOTPForm.data.email)
			.replace('[OTP]', otp);

		await transporter.sendMail({
			from: '"SkillPort" <skillport@februari.id>',
			to: askOTPForm.data.email,
			subject: 'Verifikasi email anda',
			html
		});

		cookies.set('otp_token', otp, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/onboarding/email-verification',
			maxAge: 60 * 5 // 5 minutes in seconds
		});

		return message({ ...askOTPForm, data: { ...askOTPForm.data } }, 'OTP Sent');
	},
	verifyCode: async ({ request, locals, cookies }) => {
		const verifyOTPFOrm = await superValidate(
			request,
			zod4(verifyOTPEmailSchema)
		);

		console.log(verifyOTPFOrm);

		if (!verifyOTPFOrm.valid || !verifyOTPFOrm.data.otp)
			return fail(400, { verifyOTPFOrm });

		console.log(verifyOTPFOrm.data);

		const otp = cookies.get('otp_token');
		console.log(otp);

		if (otp === verifyOTPFOrm.data.otp.toString()) {
			await db
				.update(users)
				.set({ verifiedEmail: true })
				.where(eq(users.id, locals.user!.id));
			cookies.delete('otp_token', { path: '/onboarding/email-verification' });

			return message(verifyOTPFOrm, 'OTP Verified');
		}
	}
} satisfies Actions;
