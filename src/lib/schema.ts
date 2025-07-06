import { z } from 'zod/v4';

export const loginSchema = z.object({
	email: z.email(),
	password: z.string()
});

export const registerSchema = z.object({
	email: z.email(),
	password: z.string(),
	name: z.string(),
	dob: z.string()
});
