ALTER TABLE "user_skills" ALTER COLUMN "level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phoneNumber" text;