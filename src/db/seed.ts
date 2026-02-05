import "dotenv/config";
import {
  users,
  teams,
  teamMembers,
  teamJoinRequests,
  leagues,
  seasons,
  events,
  eventRegistrations,
  eventResults,
} from "./schema";
import { db } from "./index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("admin", 10);

await db.transaction(async (tx) => {
  // Delete all data in reverse order of dependencies
  console.log("🗑️  Deleting existing data...");
  
  await tx.delete(eventResults);
  await tx.delete(eventRegistrations);
  await tx.delete(events);
  await tx.delete(seasons);
  await tx.delete(leagues);
  await tx.delete(teamJoinRequests);
  await tx.delete(teamMembers);
  await tx.delete(teams);
  await tx.delete(users);
  
  console.log("✅ All existing data deleted!");

  // 1. Seed Users
  const insertedUsers = await tx
    .insert(users)
    .values([
      {
        email: "admin@example.com",
        passwordHash: hash,
        name: "Admin User",
        role: "ADMIN",
      },
      {
        email: "organizer@example.com",
        passwordHash: hash,
        name: "John Organizer",
        role: "ORGANIZER",
      },
      {
        email: "player1@example.com",
        passwordHash: hash,
        name: "Alice Player",
        role: "PLAYER",
      },
      {
        email: "player2@example.com",
        passwordHash: hash,
        name: "Bob Player",
        role: "PLAYER",
      },
      {
        email: "player3@example.com",
        passwordHash: hash,
        name: "Carol Player",
        role: "PLAYER",
      },
      {
        email: "player4@example.com",
        passwordHash: hash,
        name: "David Player",
        role: "PLAYER",
      },
      {
        email: "player5@example.com",
        passwordHash: hash,
        name: "Eve Player",
        role: "PLAYER",
      },
      {
        email: "player6@example.com",
        passwordHash: hash,
        name: "Frank Player",
        role: "PLAYER",
      },
    ])
    .returning();

  console.log("✅ Users seeded successfully!");

  // 2. Seed Teams (captains are players)
  const insertedTeams = await tx
    .insert(teams)
    .values([
      {
        name: "The Quiz Masters",
        captainId: insertedUsers[2].id, // Alice
      },
      {
        name: "Brain Busters",
        captainId: insertedUsers[3].id, // Bob
      },
      {
        name: "Trivia Titans",
        captainId: insertedUsers[4].id, // Carol
      },
    ])
    .returning();

  console.log("✅ Teams seeded successfully!");

  // 3. Seed Team Members
  await tx.insert(teamMembers).values([
    // Team 1: Alice (captain), Bob, Carol
    { teamId: insertedTeams[0].id, userId: insertedUsers[2].id },
    { teamId: insertedTeams[0].id, userId: insertedUsers[3].id },
    { teamId: insertedTeams[0].id, userId: insertedUsers[4].id },
    // Team 2: Bob (captain), David, Eve
    { teamId: insertedTeams[1].id, userId: insertedUsers[3].id },
    { teamId: insertedTeams[1].id, userId: insertedUsers[5].id },
    { teamId: insertedTeams[1].id, userId: insertedUsers[6].id },
    // Team 3: Carol (captain), Frank
    { teamId: insertedTeams[2].id, userId: insertedUsers[4].id },
    { teamId: insertedTeams[2].id, userId: insertedUsers[7].id },
  ]);

  console.log("✅ Team Members seeded successfully!");

  // 4. Seed Team Join Requests
  await tx.insert(teamJoinRequests).values([
    {
      teamId: insertedTeams[0].id,
      userId: insertedUsers[5].id, // David requesting to join Team 1
      status: "NA_CEKANJU",
    },
    {
      teamId: insertedTeams[1].id,
      userId: insertedUsers[7].id, // Frank requesting to join Team 2
      status: "PRIHVACEN",
    },
    {
      teamId: insertedTeams[2].id,
      userId: insertedUsers[6].id, // Eve requesting to join Team 3
      status: "ODBIJEN",
    },
  ]);

  console.log("✅ Team Join Requests seeded successfully!");

  // 5. Seed Leagues
  const insertedLeagues = await tx
    .insert(leagues)
    .values([
      { name: "Premier Pub Quiz League" },
      { name: "Championship Quiz League" },
      { name: "Local Trivia League" },
    ])
    .returning();

  console.log("✅ Leagues seeded successfully!");

  // 6. Seed Seasons
  const insertedSeasons = await tx
    .insert(seasons)
    .values([
      {
        leagueId: insertedLeagues[0].id,
        name: "Spring 2024",
        isActive: true,
      },
      {
        leagueId: insertedLeagues[0].id,
        name: "Fall 2023",
        isActive: false,
      },
      {
        leagueId: insertedLeagues[1].id,
        name: "Winter 2024",
        isActive: true,
      },
    ])
    .returning();

  console.log("✅ Seasons seeded successfully!");

  // 7. Seed Events
  const insertedEvents = await tx
    .insert(events)
    .values([
      {
        seasonId: insertedSeasons[0].id,
        name: "Spring Kickoff Quiz",
        theme: "General Knowledge",
        location: "The Crown Pub",
        eventDate: new Date("2024-03-15T19:00:00"),
        capacity: 50,
      },
      {
        seasonId: insertedSeasons[0].id,
        name: "Movies & Music Night",
        theme: "Pop Culture",
        location: "The Red Lion",
        eventDate: new Date("2024-04-20T19:00:00"),
        capacity: 40,
      },
      {
        seasonId: insertedSeasons[2].id,
        name: "History & Geography Challenge",
        theme: "History & Geography",
        location: "The Kings Arms",
        eventDate: new Date("2024-02-10T19:00:00"),
        capacity: 60,
      },
    ])
    .returning();

  console.log("✅ Events seeded successfully!");

  // 8. Seed Event Registrations
  await tx.insert(eventRegistrations).values([
    {
      eventId: insertedEvents[0].id,
      teamId: insertedTeams[0].id,
      price: "25.00",
    },
    {
      eventId: insertedEvents[0].id,
      teamId: insertedTeams[1].id,
      price: "25.00",
    },
    {
      eventId: insertedEvents[1].id,
      teamId: insertedTeams[0].id,
      price: "30.00",
    },
    {
      eventId: insertedEvents[1].id,
      teamId: insertedTeams[2].id,
      price: "30.00",
    },
    {
      eventId: insertedEvents[2].id,
      teamId: insertedTeams[1].id,
      price: "20.00",
    },
  ]);

  console.log("✅ Event Registrations seeded successfully!");

  // 9. Seed Event Results
  await tx.insert(eventResults).values([
    {
      eventId: insertedEvents[0].id,
      teamId: insertedTeams[0].id,
      placement: 1,
    },
    {
      eventId: insertedEvents[0].id,
      teamId: insertedTeams[1].id,
      placement: 2,
    },
    {
      eventId: insertedEvents[1].id,
      teamId: insertedTeams[0].id,
      placement: 2,
    },
    {
      eventId: insertedEvents[1].id,
      teamId: insertedTeams[2].id,
      placement: 1,
    },
  ]);

  console.log("✅ Event Results seeded successfully!");
  console.log("🎉 All tables seeded successfully!");
});

process.exit(0);
