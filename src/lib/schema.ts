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

export const askOTPEmailSchema = z.object({
	email: z.email()
});

export const verifyOTPEmailSchema = z.object({
	otp: z.string().min(6)
});

export const educationsSchema = z.object({
	userId: z.string(),
	educations: z.array(
		z.object({
			id: z.string().optional(),
			educationId: z.number(),
			major: z.string().nullable(),
			institution: z.string(),
			startYear: z.number().nullable(),
			endYear: z.number().nullable(),
			notes: z.string().nullable()
		})
	),
	deleted: z.array(z.string())
});

export const experiencesSchema = z.object({
	userId: z.string(),
	experiences: z.array(
		z.object({
			id: z.string().optional(),
			position: z.string(),
			company: z.string(),
			startDate: z.string(),
			endDate: z.string().nullable(),
			description: z.string().nullable()
		})
	),
	deleted: z.array(z.string())
});

export const skillsSchema = z.object({
	userId: z.string(),
	skills: z.array(
		z.object({
			id: z.string().optional(),
			skillId: z.number(),
			level: z.number().max(10),
			experienceYears: z.number().max(99).nullable()
		})
	),
	deleted: z.array(z.string())
});

export const profileSchema = z.object({
	id: z.string(),
	title: z.string().nullable(),
	name: z.string().nullable(),
	email: z.string(),
	dob: z.string().nullable(),
	bio: z.string().nullable(),
	phoneNumber: z.string().nullable(),
	verifiedEmail: z.boolean().nullable()
});
