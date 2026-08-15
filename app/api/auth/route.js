import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function readUsers() {
  try {
    const { data, error } = await supabase
      .from('json_store')
      .select('data')
      .eq('id', 'users.json')
      .single();

    if (error || !data) return { users: [] };
    return data.data;
  } catch (err) {
    return { users: [] };
  }
}

async function writeUsers(newData) {
  await supabase
    .from('json_store')
    .upsert({ id: 'users.json', data: newData });
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const data = await readUsers();
    
    // Check if user exists
    let user = data.users.find(u => u.email === email);

    if (user) {
      // Login
      if (user.password !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
      return NextResponse.json({ message: 'Login successful', user: { email: user.email } }, { status: 200 });
    } else {
      // Auto-signup
      const newUser = { email, password, createdAt: new Date().toISOString() };
      data.users.push(newUser);
      await writeUsers(data);
      return NextResponse.json({ message: 'Account created and logged in', user: { email } }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
