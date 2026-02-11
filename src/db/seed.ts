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
} from "@/db/schema";
import { db } from "@/db/index";
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("admin", 10);

await db.transaction(async (tx) => {
  console.log("🗑️  Brisanje postojećih podataka...");

  await tx.delete(eventResults);
  await tx.delete(eventRegistrations);
  await tx.delete(events);
  await tx.delete(seasons);
  await tx.delete(leagues);
  await tx.delete(teamJoinRequests);
  await tx.delete(teamMembers);
  await tx.delete(teams);
  await tx.delete(users);

  console.log("✅ Svi podaci su obrisani!");

  const insertedUsers = await tx
    .insert(users)
    .values([
      {
        email: "admin@example.com",
        passwordHash: hash,
        name: "Marko Administrator",
        role: "ADMIN",
      },
      {
        email: "organizator@example.com",
        passwordHash: hash,
        name: "Jelena Organizator",
        role: "ORGANIZER",
      },
      {
        email: "nikola@example.com",
        passwordHash: hash,
        name: "Nikola Petrović",
        role: "PLAYER",
      },
      {
        email: "milica@example.com",
        passwordHash: hash,
        name: "Milica Jovanović",
        role: "PLAYER",
      },
      {
        email: "stefan@example.com",
        passwordHash: hash,
        name: "Stefan Đorđević",
        role: "PLAYER",
      },
      {
        email: "ana@example.com",
        passwordHash: hash,
        name: "Ana Ilić",
        role: "PLAYER",
      },
      {
        email: "dušan@example.com",
        passwordHash: hash,
        name: "Dušan Lukić",
        role: "PLAYER",
      },
      {
        email: "jovana@example.com",
        passwordHash: hash,
        name: "Jovana Kostić",
        role: "PLAYER",
      },
    ])
    .returning();

  console.log("✅ Korisnici su uspešno uneti!");

  const insertedTeams = await tx
    .insert(teams)
    .values([
      {
        name: "Beogradski Fantom",
        captainId: insertedUsers[2].id,
      },
      {
        name: "Zoki i ekipa",
        captainId: insertedUsers[5].id,
      },
      {
        name: "Maxbet premium partner evrolige",
        captainId: insertedUsers[7].id,
      },
    ])
    .returning();

  console.log("✅ Timovi su uspešno uneti!");

  await tx.insert(teamMembers).values([

    { teamId: insertedTeams[0].id, userId: insertedUsers[2].id },
    { teamId: insertedTeams[0].id, userId: insertedUsers[3].id },
    { teamId: insertedTeams[0].id, userId: insertedUsers[4].id },
    
    { teamId: insertedTeams[1].id, userId: insertedUsers[5].id },
    { teamId: insertedTeams[1].id, userId: insertedUsers[6].id },
    
    { teamId: insertedTeams[2].id, userId: insertedUsers[7].id },
  ]);

  console.log("✅ Članovi timova su uspešno uneti!");

  const insertedLeagues = await tx
    .insert(leagues)
    .values([
      { name: "Srpska Pab Kviz Liga" },
      { name: "Studentska Kviz Liga" },
    ])
    .returning();

  const insertedSeasons = await tx
    .insert(seasons)
    .values([
      {
        leagueId: insertedLeagues[0].id,
        name: "Proleće 2026",
        isActive: true,
      },
      {
        leagueId: insertedLeagues[0].id,
        name: "Zima 2025",
        isActive: false,
      },
    ])
    .returning();

  const insertedEvents = await tx
    .insert(events)
    .values([
      {
        seasonId: insertedSeasons[0].id,
        name: "Novogodišnje zagrevanje",
        theme: "Opšte znanje",
        location: "Kafana Druga kuća",
        eventDate: new Date("2026-03-08T19:00:00"),
        capacity: 40,
      },
      {
        seasonId: insertedSeasons[0].id,
        name: "Filmsko veče",
        theme: "Domaća i strana kinematografija",
        location: "Pub Lazino Tele",
        eventDate: new Date("2026-03-22T20:00:00"),
        capacity: 30,
      },
      {
        seasonId: insertedSeasons[0].id,
        name: "Sportski maraton",
        theme: "Istorija sporta i Olimpijske igre",
        location: "Sport Caffe",
        eventDate: new Date("2026-04-05T19:30:00"),
        capacity: 50,
      },
    ])
    .returning();

  console.log("✅ Događaji su uspešno uneti!");

  await tx.insert(eventRegistrations).values([
    {
      eventId: insertedEvents[0].id,
      teamId: insertedTeams[0].id,
      price: "1500.00",
    },
    {
      eventId: insertedEvents[0].id,
      teamId: insertedTeams[1].id,
      price: "1500.00",
    },
    {
      eventId: insertedEvents[1].id,
      teamId: insertedTeams[2].id,
      price: "1200.00",
    },
  ]);

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
  ]);

  console.log("🎉 Sve tabele su uspešno popunjene!");
});

process.exit(0);