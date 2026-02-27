ALTER TABLE "event_registrations" ADD COLUMN "registered_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "price" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "event_registrations" DROP COLUMN "price";