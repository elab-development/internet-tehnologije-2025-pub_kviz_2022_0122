import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "PLAYER",
  "ORGANIZER",
  "ADMIN",
]);

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  leagueId: integer("league_id")
    .notNull()
    .references(() => leagues.id),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  teamId: integer("team_id")
    .references(() => teams.id),
  captain: boolean("captain").notNull().default(false),
});

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id")
    .notNull()
    .references(() => leagues.id),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

import { numeric, primaryKey } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id")
    .notNull()
    .references(() => seasons.id),
  name: varchar("name", { length: 150 }).notNull(),
  theme: varchar("theme", { length: 150 }),
  location: varchar("location", { length: 150 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  capacity: integer("capacity").notNull(),
});

export const eventRegistrations = pgTable(
  "event_registrations",
  {
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.teamId] }),
  }),
);

export const eventResults = pgTable("event_results", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  placement: integer("placement").notNull(),
});

export const teamJoinRequests = pgTable("team_join_requests", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
