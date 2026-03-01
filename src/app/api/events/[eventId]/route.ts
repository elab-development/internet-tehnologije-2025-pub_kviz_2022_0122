import { db } from '@/db';
import { eventRegistrations, eventResults, events, teams } from '@/db/schema';
import { and, desc, eq, gt, gte, lt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {

  try {

    const {eventId: eventStr} = await params;
    const eventId = parseInt(eventStr);

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const date = dateStr ? new Date(dateStr) : null;
    // console.log("date:", date);

    if(!date) {
      return NextResponse.json({ error: "Datum nije prosleđen" }, { status: 400 });
    }
    
    if(date >= new Date()) {
      //vracanje prijavljenih timova za nadolazeći event
      const result = await db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          registrationDate: eventRegistrations.registeredAt,
        })
        .from(eventRegistrations)
        .innerJoin(teams, eq(eventRegistrations.teamId, teams.id))
        .innerJoin(events, eq(eventRegistrations.eventId, events.id))
        .where(and(eq(eventRegistrations.eventId, eventId), gte(events.eventDate, sql`CURRENT_DATE`)));

      if (!result || result.length === 0) {
        return NextResponse.json({ error: "Event nije pronađen" }, { status: 404 });
      }
      return NextResponse.json(result, { status: 200 });
    }else{
      //vracanje rezultata za prosli event
      const result = await db
        .select({
          teamId: teams.id,
          teamName: teams.name,
          placement: eventResults.placement,
        })
        .from(eventResults)
        .innerJoin(teams, eq(eventResults.teamId, teams.id))
        .innerJoin(events, eq(eventResults.eventId, events.id))
        .where(and(eq(eventResults.eventId, eventId), lt(events.eventDate, sql`CURRENT_DATE`)))
        .orderBy(desc(eventResults.placement));

      if (!result || result.length === 0) {
        return NextResponse.json({ error: "Event nije pronađen" }, { status: 404 });
      }
      return NextResponse.json(result, { status: 200 });
    }
      
    
  } catch (error) {
    console.error("Error fetching event details:", error);
    return NextResponse.json({ error: "Greška pri dohvatanju detalja događaja" }, { status: 500 });
  }

}