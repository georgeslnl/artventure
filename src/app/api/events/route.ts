// src/app/api/events/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

// GET: Fetch all events
export async function GET() {
  const client = await clientPromise;
  const db = client.db('Events'); // Use your MongoDB database name
  const events = await db.collection('events').find({}).toArray();

  return NextResponse.json(events);
}

// POST: Add a new event
export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db('Events');

  const newEvent = await request.json();
  const result = await db.collection('events').insertOne(newEvent);

  return NextResponse.json(result);
}
