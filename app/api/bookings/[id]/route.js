import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';

export async function GET(request, { params }) {
  const { id } = await params;
  
  const db = readDb();
  const booking = db.bookings.find(b => b.jobId === id);
  
  if (booking) {
    return NextResponse.json(booking);
  }
  
  return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    const db = readDb();
    const index = db.bookings.findIndex(b => b.docId === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    // Update the booking
    db.bookings[index] = { ...db.bookings[index], ...updates };
    writeDb(db);
    
    return NextResponse.json(db.bookings[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
