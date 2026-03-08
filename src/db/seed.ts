import "dotenv/config";
import {
  users,
  teams,
  teamJoinRequests,
  leagues,
  seasons,
  events,
  eventRegistrations,
  eventResults,
} from "./schema"; 
import { db } from "./index"; 
import bcrypt from "bcryptjs";

async function main() {
  console.log("🚀 Pokretanje seed procesa...");

  const hash = await bcrypt.hash("admin", 10);

  await db.transaction(async (tx) => {
    console.log("🗑️  Brisanje postojećih podataka...");

    await tx.delete(eventResults);
    await tx.delete(eventRegistrations);
    await tx.delete(teamJoinRequests);
    await tx.delete(events);
    await tx.delete(seasons);
    await tx.delete(users);
    await tx.delete(teams);
    await tx.delete(leagues);

    console.log("✅ Svi podaci su obrisani!");

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

    const insertedTeams = await tx
      .insert(teams)
      .values([
        {
          name: "Beogradski Fantom",
          leagueId: insertedLeagues[0].id,
        },
        {
          name: "Zoki i ekipa",
          leagueId: insertedLeagues[0].id,
        },
        {
          name: "Maxbet premium partner evrolige",
          leagueId: insertedLeagues[0].id,
        },
        {
          name: "Team Priboj",
          leagueId: insertedLeagues[0].id,
        },
        {
          name: "Team Cacak",
          leagueId: insertedLeagues[0].id,
        },
      ])
      .returning();

    console.log("✅ Timovi su uspešno uneti!");

    const insertedUsers = await tx
      .insert(users)
      .values([
        {
          email: "admin@example.com",
          passwordHash: hash,
          name: "Marko Administrator",
          role: "ADMIN",
          captain: false,
        },
        {
          email: "organizator@example.com",
          passwordHash: hash,
          name: "Jelena Organizator",
          role: "ORGANIZER",
          captain: false,
        },
        {
          email: "nikola@example.com",
          passwordHash: hash,
          name: "Nikola Petrović",
          role: "PLAYER",
          teamId: insertedTeams[0].id,
          captain: true,
        },
        {
          email: "milica@example.com",
          passwordHash: hash,
          name: "Milica Jovanović",
          role: "PLAYER",
          teamId: insertedTeams[0].id,
          captain: false,
        },
        {
          email: "stefan@example.com",
          passwordHash: hash,
          name: "Stefan Đorđević",
          role: "PLAYER",
          teamId: insertedTeams[0].id,
          captain: false,
        },
        {
          email: "ana@example.com",
          passwordHash: hash,
          name: "Ana Ilić",
          role: "PLAYER",
          teamId: insertedTeams[1].id,
          captain: true,
        },
        {
          email: "dušan@example.com",
          passwordHash: hash,
          name: "Dušan Lukić",
          role: "PLAYER",
          teamId: insertedTeams[1].id,
          captain: false,
        },
        {
          email: "jovana@example.com",
          passwordHash: hash,
          name: "Jovana Kostić",
          role: "PLAYER",
          teamId: insertedTeams[2].id,
          captain: true,
        },
        {
          email: "luka@example.com",
          passwordHash: hash,
          name: "Luka Matić",
          role: "PLAYER",
          captain: false,
        },
      ])
      .returning();

    console.log("✅ Korisnici su uspešno uneti!");

    const insertedEvents = await tx
      .insert(events)
      .values([
        // Proleće 2026 events (current season)
        {
          seasonId: insertedSeasons[0].id,
          name: "Novogodišnje zagrevanje",
          theme: "Opšte znanje",
          location: "Kafana Druga kuća",
          eventDate: new Date("2026-03-08T19:00:00"),
          capacity: 40,
          price: "500",
        },
        {
          seasonId: insertedSeasons[0].id,
          name: "Filmsko veče",
          theme: "Domaća i strana kinematografija",
          location: "Pub Lazino Tele",
          eventDate: new Date("2026-03-22T20:00:00"),
          capacity: 30,
          price: "800",
        },
        {
          seasonId: insertedSeasons[0].id,
          name: "Sportski maraton",
          theme: "Istorija sporta i Olimpijske igre",
          location: "Sport Caffe",
          eventDate: new Date("2026-04-05T19:30:00"),
          capacity: 50,
          price: "600",
        },
        {
          seasonId: insertedSeasons[0].id,
          name: "Estradni kviz",
          theme: "Aktuelna muzika i poznate ličnosti",
          location: "Sport Caffe",
          eventDate: new Date("2026-02-15T19:30:00"),
          capacity: 50,
          price: "650",
        },
        {
          seasonId: insertedSeasons[0].id,
          name: "Skolski kviz",
          theme: "Opšte znanje",
          location: "Sky Caffe",
          eventDate: new Date("2026-02-22T18:30:00"),
          capacity: 50,
          price: "750",
        },
        // Zima 2025 events (past season)
        {
          seasonId: insertedSeasons[1].id,
          name: "Zimski početak",
          theme: "Opšte znanje",
          location: "Kafana Druga kuća",
          eventDate: new Date("2025-11-08T19:00:00"),
          capacity: 40,
          price: "450",
        },
        {
          seasonId: insertedSeasons[1].id,
          name: "Muzički izazov",
          theme: "Rok i pop muzika 80-ih i 90-ih",
          location: "Pub Lazino Tele",
          eventDate: new Date("2025-11-22T20:00:00"),
          capacity: 35,
          price: "500",
        },
        {
          seasonId: insertedSeasons[1].id,
          name: "Naučna fantastika",
          theme: "Sci-fi filmovi i serije",
          location: "Cinema Caffe",
          eventDate: new Date("2025-12-06T19:30:00"),
          capacity: 45,
          price: "550",
        },
        {
          seasonId: insertedSeasons[1].id,
          name: "Istorijski maraton",
          theme: "Svetska istorija",
          location: "Sport Caffe",
          eventDate: new Date("2025-12-13T19:00:00"),
          capacity: 50,
          price: "600",
        },
        {
          seasonId: insertedSeasons[1].id,
          name: "Novogodišnji finale",
          theme: "Miks kategorija",
          location: "Grand Hall",
          eventDate: new Date("2025-12-28T20:00:00"),
          capacity: 60,
          price: "800",
        },
      ])
      .returning();

    console.log("✅ Događaji su uspešno uneti!");

    await tx.insert(eventRegistrations).values([
      {
        eventId: insertedEvents[0].id,
        teamId: insertedTeams[0].id,
      },
      {
        eventId: insertedEvents[0].id,
        teamId: insertedTeams[1].id,
      },
      {
        eventId: insertedEvents[1].id,
        teamId: insertedTeams[2].id,
      },
    ]);

    await tx.insert(eventResults).values([
      // Proleće 2026 results (Estradni kviz - event index 3)
      {
        eventId: insertedEvents[3].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 48,
      },
      {
        eventId: insertedEvents[3].id,
        teamId: insertedTeams[1].id, // Zoki i ekipa
        points: 42,
      },
      {
        eventId: insertedEvents[3].id,
        teamId: insertedTeams[2].id, // Maxbet
        points: 35,
      },
      // Proleće 2026 results (Skolski kviz - event index 4)
      {
        eventId: insertedEvents[4].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 45,
      },
      {
        eventId: insertedEvents[4].id,
        teamId: insertedTeams[1].id, // Zoki i ekipa
        points: 38,
      },
      {
        eventId: insertedEvents[4].id,
        teamId: insertedTeams[2].id, // Maxbet
        points: 31,
      },
      // Zima 2025 results (Zimski početak - event index 5)
      {
        eventId: insertedEvents[5].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 50,
      },
      {
        eventId: insertedEvents[5].id,
        teamId: insertedTeams[1].id, // Zoki i ekipa
        points: 44,
      },
      {
        eventId: insertedEvents[5].id,
        teamId: insertedTeams[2].id, // Maxbet
        points: 37,
      },
      {
        eventId: insertedEvents[5].id,
        teamId: insertedTeams[3].id, // Team Priboj
        points: 28,
      },
      // Zima 2025 results (Muzički izazov - event index 6)
      {
        eventId: insertedEvents[6].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 43,
      },
      {
        eventId: insertedEvents[6].id,
        teamId: insertedTeams[1].id, // Zoki i ekipa
        points: 47,
      },
      {
        eventId: insertedEvents[6].id,
        teamId: insertedTeams[3].id, // Team Priboj
        points: 39,
      },
      {
        eventId: insertedEvents[6].id,
        teamId: insertedTeams[4].id, // Team Cacak
        points: 22,
      },
      // Zima 2025 results (Naučna fantastika - event index 7)
      {
        eventId: insertedEvents[7].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 49,
      },
      {
        eventId: insertedEvents[7].id,
        teamId: insertedTeams[2].id, // Maxbet
        points: 41,
      },
      {
        eventId: insertedEvents[7].id,
        teamId: insertedTeams[3].id, // Team Priboj
        points: 33,
      },
      {
        eventId: insertedEvents[7].id,
        teamId: insertedTeams[4].id, // Team Cacak
        points: 26,
      },
      // Zima 2025 results (Istorijski maraton - event index 8)
      {
        eventId: insertedEvents[8].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 40,
      },
      {
        eventId: insertedEvents[8].id,
        teamId: insertedTeams[1].id, // Zoki i ekipa
        points: 46,
      },
      {
        eventId: insertedEvents[8].id,
        teamId: insertedTeams[2].id, // Maxbet
        points: 44,
      },
      {
        eventId: insertedEvents[8].id,
        teamId: insertedTeams[4].id, // Team Cacak
        points: 19,
      },
      // Zima 2025 results (Novogodišnji finale - event index 9)
      {
        eventId: insertedEvents[9].id,
        teamId: insertedTeams[0].id, // Beogradski Fantom
        points: 47,
      },
      {
        eventId: insertedEvents[9].id,
        teamId: insertedTeams[1].id, // Zoki i ekipa
        points: 42,
      },
      {
        eventId: insertedEvents[9].id,
        teamId: insertedTeams[2].id, // Maxbet
        points: 38,
      },
      {
        eventId: insertedEvents[9].id,
        teamId: insertedTeams[3].id, // Team Priboj
        points: 34,
      },
      {
        eventId: insertedEvents[9].id,
        teamId: insertedTeams[4].id, // Team Cacak
        points: 25,
      },
    ]);

    console.log("🎉 Sve tabele su uspešno popunjene!");
  });
}

main()
  .then(() => {
    console.log("✅ Seed završen uspešno.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Greška tokom seedovanja:", err);
    process.exit(1);
  });