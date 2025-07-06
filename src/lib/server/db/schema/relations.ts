// relations.ts
import { relations } from 'drizzle-orm';
import {
	users,
	userRoles,
	sessions,
	skillsMaster,
	userSkills,
	educationsMaster,
	userEducations,
	userExperiences,
	skillTests,
	testQuestions,
	testAttempts,
	testAnswers
} from './tables';

export const userRoleRelations = relations(userRoles, ({ many }) => ({
	users: many(users)
}));

export const userRelations = relations(users, ({ one, many }) => ({
	role: one(userRoles, {
		fields: [users.roleId],
		references: [userRoles.id]
	}),
	sessions: many(sessions),
	skills: many(userSkills),
	educations: many(userEducations),
	experiences: many(userExperiences),
	attempts: many(testAttempts)
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const skillMasterRelations = relations(skillsMaster, ({ many }) => ({
	userSkills: many(userSkills)
}));

export const userSkillRelations = relations(userSkills, ({ one }) => ({
	user: one(users, {
		fields: [userSkills.userId],
		references: [users.id]
	}),
	skill: one(skillsMaster, {
		fields: [userSkills.skillId],
		references: [skillsMaster.id]
	})
}));

export const educationMasterRelations = relations(educationsMaster, ({ many }) => ({
	userEducations: many(userEducations)
}));

export const userEducationRelations = relations(userEducations, ({ one }) => ({
	user: one(users, {
		fields: [userEducations.userId],
		references: [users.id]
	}),
	education: one(educationsMaster, {
		fields: [userEducations.educationId],
		references: [educationsMaster.id]
	})
}));

export const userExperienceRelations = relations(userExperiences, ({ one }) => ({
	user: one(users, {
		fields: [userExperiences.userId],
		references: [users.id]
	})
}));

export const skillTestRelations = relations(skillTests, ({ many }) => ({
	questions: many(testQuestions),
	attempts: many(testAttempts)
}));

export const testQuestionRelations = relations(testQuestions, ({ one }) => ({
	test: one(skillTests, {
		fields: [testQuestions.testId],
		references: [skillTests.id]
	})
}));

export const testAttemptRelations = relations(testAttempts, ({ one, many }) => ({
	user: one(users, {
		fields: [testAttempts.userId],
		references: [users.id]
	}),
	test: one(skillTests, {
		fields: [testAttempts.testId],
		references: [skillTests.id]
	}),
	answers: many(testAnswers)
}));

export const testAnswerRelations = relations(testAnswers, ({ one }) => ({
	attempt: one(testAttempts, {
		fields: [testAnswers.attemptId],
		references: [testAttempts.id]
	}),
	question: one(testQuestions, {
		fields: [testAnswers.questionId],
		references: [testQuestions.id]
	})
}));
