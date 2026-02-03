import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";

/* =========================================================
   ENUMS
   ========================================================= */
// Enum za uloge korisnika
export const UserRole = pgEnum("user_role", ["PLAYER", "ORGANIZER", "ADMIN"]);

// Enum za status zahteva za pridruživanje timu
export const JoinRequestStatus = pgEnum("join_request_status", [
  "NA_CEKANJU",
  "ODBIJEN",
  "PRIHVACEN",
]);

/* =========================================================
   USERS
   ========================================================= */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: UserRole("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================================================
   TEAMS
   ========================================================= */
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  captainId: integer("captain_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================================================
   TEAM_MEMBERS
   ========================================================= */
export const teamMembers = pgTable(
  "team_members",
  {
    teamId: integer("team_id")
      .references(() => teams.id)
      .notNull(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.userId] }),
  })
);

/* =========================================================
   TEAM_JOIN_REQUESTS
   ========================================================= */
export const teamJoinRequests = pgTable("team_join_requests", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: JoinRequestStatus("status").default("NA_CEKANJU").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================================================
   LEAGUES
   ========================================================= */
export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

/* =========================================================
   SEASONS
   ========================================================= */
export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id")
    .references(() => leagues.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

/* =========================================================
   EVENTS
   ========================================================= */
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id")
    .references(() => seasons.id)
    .notNull(),
  name: varchar("name", { length: 150 }).notNull(),
  theme: varchar("theme", { length: 150 }),
  location: varchar("location", { length: 150 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  capacity: integer("capacity").notNull(),
});

/* =========================================================
   EVENT_REGISTRATIONS
   ========================================================= */
export const eventRegistrations = pgTable(
  "event_registrations",
  {
    eventId: integer("event_id")
      .references(() => events.id)
      .notNull(),
    teamId: integer("team_id")
      .references(() => teams.id)
      .notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.teamId] }),
  })
);

/* =========================================================
   EVENT_RESULTS
   ========================================================= */
export const eventResults = pgTable("event_results", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .references(() => events.id)
    .notNull(),
  teamId: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  placement: integer("placement").notNull(),
});

/* =========================================================
   PLAYER_STATS
   ========================================================= */
