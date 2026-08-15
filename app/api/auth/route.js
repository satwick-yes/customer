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

import { TECHNICIANS } from '@/lib/technicians';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check technician accounts
    const tech = TECHNICIANS.find(t => t.email.toLowerCase() === email.trim().toLowerCase());
    if (role === 'worker' || tech) {
      if (tech) {
        if (password === 'worker123') {
          return NextResponse.json({
            message: 'Technician login successful',
            user: { email: tech.email, name: tech.name, role: 'worker', techId: tech.id, tech }
          }, { status: 200 });
        } else {
          return NextResponse.json({ error: 'Invalid technician password. (Default is worker123)' }, { status: 401 });
        }
      }
    }

    // Check admin
    if (role === 'admin' || email.toLowerCase() === 'admin@coolfix.in') {
      if (password === 'admin123') {
        return NextResponse.json({
          message: 'Admin login successful',
          user: { email: 'admin@coolfix.in', name: 'Super Admin', role: 'admin' }
        }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
      }
    }

    const data = await readUsers();
    
    // Check if user exists
    let user = data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (user) {
      // Login
      if (user.password !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
      return NextResponse.json({ message: 'Login successful', user: { email: user.email, name: user.name || user.email.split('@')[0], role: user.role || 'customer' } }, { status: 200 });
    } else {
      // Auto-signup for customer
      const newUser = { email, password, role: 'customer', createdAt: new Date().toISOString() };
      data.users.push(newUser);
      await writeUsers(data);
      return NextResponse.json({ message: 'Account created and logged in', user: { email, role: 'customer' } }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
