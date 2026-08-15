import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  const db = readDb();
  
  if (phone) {
    const results = db.bookings.filter(b => b.phone === phone);
    return NextResponse.json(results);
  }
  
  return NextResponse.json(db.bookings);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = readDb();
    
    // Add unique docId and createdAt
    const newDocId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const newBooking = {
      ...data,
      docId: newDocId,
      createdAt: new Date().toISOString()
    };
    
    db.bookings.push(newBooking);
    writeDb(db);
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}
