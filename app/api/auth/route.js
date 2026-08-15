import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'users.json');

function readUsers() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ users: [] }, null, 2));
  }
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw);
}

function writeUsers(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const data = readUsers();
    
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
      writeUsers(data);
      return NextResponse.json({ message: 'Account created and logged in', user: { email } }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
