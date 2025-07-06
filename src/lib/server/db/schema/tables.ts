// tables.ts
import {
	pgTable,
	text,
	uuid,
	serial,
	integer,
	timestamp,
	boolean,
	date,
	jsonb,
	char
} from 'drizzle-orm/pg-core';

export const userRoles = pgTable('user_roles', {
	id: char('id', { length: 1 }).primaryKey(),
	title: text('title').notNull(),
	description: text('description')
});

export const users = pgTable('users', {
	id: text('id').primaryKey(), // Lucia user ID
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name'),
	dob: date('date_of_birth'),
	roleId: char('role_id', { length: 1 }).references(() => userRoles.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const skillsMaster = pgTable('skills_master', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	level: integer('level')
});

export const educationsMaster = pgTable('educations_master', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	major: text('major')
});

export const userSkills = pgTable('user_skills', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	skillId: integer('skill_id')
		.notNull()
		.references(() => skillsMaster.id),
	experienceYears: integer('experience_years'),
	lastUsed: timestamp('last_used', { withTimezone: true })
});

export const userExperiences = pgTable('user_experiences', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	position: text('position'),
	company: text('company'),
	startDate: date('start_date'),
	endDate: date('end_date'),
	description: text('description')
});

export const userEducations = pgTable('user_educations', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	educationId: integer('education_id')
		.notNull()
		.references(() => educationsMaster.id),
	major: text('major'),
	startYear: integer('start_year'),
	endYear: integer('end_year'),
	notes: text('notes')
});

export const skillTests = pgTable('skill_tests', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title').notNull(),
	description: text('description'),
	skillCategory: text('skill_category'),
	difficulty: text('difficulty'),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const testQuestions = pgTable('test_questions', {
	id: uuid('id').primaryKey().defaultRandom(),
	testId: uuid('test_id')
		.notNull()
		.references(() => skillTests.id),
	questionType: text('question_type'),
	questionText: text('question_text').notNull(),
	options: jsonb('options'),
	correctAnswer: jsonb('correct_answer'),
	points: integer('points').default(1)
});

export const testAttempts = pgTable('test_attempts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	testId: uuid('test_id')
		.notNull()
		.references(() => skillTests.id),
	startedAt: timestamp('started_at', { withTimezone: true }),
	submittedAt: timestamp('submitted_at', { withTimezone: true }),
	score: integer('score'),
	status: text('status').default('in_progress')
});

export const testAnswers = pgTable('test_answers', {
	id: uuid('id').primaryKey().defaultRandom(),
	attemptId: uuid('attempt_id')
		.notNull()
		.references(() => testAttempts.id),
	questionId: uuid('question_id')
		.notNull()
		.references(() => testQuestions.id),
	userAnswer: jsonb('user_answer'),
	isCorrect: boolean('is_correct'),
	awardedPoints: integer('awarded_points')
});
