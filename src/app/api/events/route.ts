import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../../../lib/jwt';

// Helper function to get user ID from token
function getUserIdFromToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  return payload ? payload.userId : null;
}

// GET: Fetch all events for the authenticated user
export async function GET(request: Request) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('Events');
    const events = await db.collection('events').find({ userId: userId }).toArray();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch events', error }, { status: 500 });
  }
}

// POST: Add a new event for the authenticated user
export async function POST(request: Request) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    console.log('Unauthorized to add because: ', userId);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('Events');

    const newEvent = await request.json();
    newEvent.userId = userId; // Add the user ID to the event
    const result = await db.collection('events').insertOne(newEvent);

    const createdEvent = { ...newEvent, _id: result.insertedId };
    return NextResponse.json(createdEvent);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add event', error }, { status: 500 });
  }
}

// Similar changes for DELETE and PUT methods...
// Make sure to check if the event belongs to the authenticated user before updating or deleting

export async function DELETE(request: Request) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('Events');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id), userId: userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete event', error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('Events');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    const updatedEvent = await request.json();
    delete updatedEvent._id;

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(id), userId: userId },
      { $set: updatedEvent }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Event not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event updated successfully', event: { _id: id, ...updatedEvent } });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update event', error }, { status: 500 });
  }
}