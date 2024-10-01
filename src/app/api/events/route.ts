// src/app/api/events/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function DELETE(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db('Events');

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
        }

        const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete event', error }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
      const client = await clientPromise;
      const db = client.db('Events');
  
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
      }
  
      const updatedEvent = await request.json();
      delete updatedEvent._id; // Remove _id from the update object
  
      const result = await db.collection('events').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedEvent }
      );
  
      if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Event not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Event updated successfully', event: { _id: id, ...updatedEvent } });
    } catch (error) {
      return NextResponse.json({ message: 'Failed to update event', error }, { status: 500 });
    }
  }
