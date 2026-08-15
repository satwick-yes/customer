import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/localDb';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { text, author } = await request.json();
    
    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
    }

    const data = readDb();
    const idx = data.bookings.findIndex(b => b.jobId === id);

    
    if (idx === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const newComment = {
      text: text.trim(),
      author: author || 'Customer',
      timestamp: new Date().toISOString()
    };
    
    if (!data.bookings[idx].comments) {
      data.bookings[idx].comments = [];
    }
    
    data.bookings[idx].comments.push(newComment);
    writeDb(data);
    
    return NextResponse.json({ message: 'Comment added', comment: newComment }, { status: 200 });
  } catch (err) {
    console.error('Error adding comment:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
