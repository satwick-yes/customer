import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TECHNICIANS } from '@/lib/technicians';

async function readUsers() {
  try {
    const { data, error } = await supabase
      .from('json_store')
      .select('data')
      .eq('id', 'users.json')
      .single();

    if (error || !data || !data.data || !data.data.users) return { users: [] };
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
    const body = await request.json();
    const { action = 'login', email, phone, password, name, role } = body;

    const identifier = (email || phone || '').trim().toLowerCase();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email/Phone and password are required' }, { status: 400 });
    }

    // 1. Check Technician Accounts
    const tech = TECHNICIANS.find(t => 
      t.email.toLowerCase() === identifier || 
      t.id.toLowerCase() === identifier ||
      (t.phone && t.phone.replace(/\D/g, '') === identifier.replace(/\D/g, ''))
    );

    if (role === 'worker' || tech) {
      if (tech) {
        if (password === 'worker123') {
          return NextResponse.json({
            message: 'Technician login successful',
            user: { email: tech.email, name: tech.name, role: 'worker', techId: tech.id, tech }
          }, { status: 200 });
        } else {
          return NextResponse.json({ error: 'Invalid technician password. (Default: worker123)' }, { status: 401 });
        }
      }
    }

    // 2. Check Admin Account
    if (role === 'admin' || identifier === 'admin@coolfix.in' || identifier === 'admin') {
      if (password === 'admin123') {
        return NextResponse.json({
          message: 'Admin login successful',
          user: { email: 'admin@coolfix.in', name: 'Super Admin', role: 'admin' }
        }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Invalid admin credentials. (Default: admin123)' }, { status: 401 });
      }
    }

    const data = await readUsers();
    
    // Check existing customer by email or phone
    const existingUser = data.users.find(u => 
      (email && u.email && u.email.toLowerCase() === email.trim().toLowerCase()) ||
      (phone && u.phone && u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) ||
      (u.email && u.email.toLowerCase() === identifier) ||
      (u.phone && u.phone.replace(/\D/g, '') === identifier.replace(/\D/g, ''))
    );

    if (action === 'signup') {
      if (existingUser) {
        return NextResponse.json({ error: 'An account with this email/phone already exists. Please Sign In.' }, { status: 409 });
      }

      const newUser = {
        id: 'CUST-' + Math.floor(10000 + Math.random() * 90000),
        name: name || (email ? email.split('@')[0] : 'Customer'),
        email: email ? email.trim().toLowerCase() : '',
        phone: phone ? phone.replace(/\D/g, '') : '',
        password,
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      data.users.push(newUser);
      await writeUsers(data);

      return NextResponse.json({
        message: 'Account registered successfully!',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: 'customer' }
      }, { status: 201 });
    }

    // Sign In (Login)
    if (!existingUser) {
      return NextResponse.json({ error: 'No account found with these credentials. Please Sign Up first.' }, { status: 404 });
    }

    if (existingUser.password !== password) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        role: existingUser.role || 'customer'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
