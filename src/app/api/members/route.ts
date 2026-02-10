import { db } from '@/db';
import { teamMembers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const requestedTeamId = searchParams.get("id"); 
    const idNumber = Number(requestedTeamId);
    if (!idNumber) {
        return NextResponse.json(
            { error: 'teamId query parameter is required' },
            { status: 400 }
        );
    }

    try {
        // Replace with your actual data source (database, API, etc.)
        const members = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role
        }).from(users)
        .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
        .where(eq(teamMembers.teamId, idNumber));     

        if (members.length === 0) {
            return NextResponse.json({ error: "Tim nema ni jednog clana" }, { status: 404 });
        }
        
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch members' },
            { status: 500 }
        );
    }
}

