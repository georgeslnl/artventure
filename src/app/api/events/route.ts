// src/app/api/events/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

// GET: Fetch all events
export async function GET() {
    try {
      const client = await clientPromise;
      const db = client.db('Events'); // Replace with your MongoDB database name
      const events = await db.collection('events').find({}).toArray();
      return NextResponse.json(events);
    } catch (error) {
      return NextResponse.json({ message: 'Failed to fetch events', error }, { status: 500 });
    }
  }

// POST: Add a new event
export async function POST(request: Request) {
    try {
      const client = await clientPromise;
      const db = client.db('Events');
  
      const newEvent = await request.json();
      const result = await db.collection('events').insertOne(newEvent);
  
      // Return the newly created event with its _id
      const createdEvent = { ...newEvent, _id: result.insertedId };
      return NextResponse.json(createdEvent);
    } catch (error) {
      return NextResponse.json({ message: 'Failed to add event', error }, { status: 500 });
    }
  }
