export const TECHNICIANS = [
  {
    id: 'TECH-101',
    name: 'Rajesh Sharma',
    email: 'rajesh@coolfix.in',
    phone: '+91 98765 43210',
    specialty: 'AC & Refrigeration Master',
    rating: 4.9,
    experience: '8 years',
    avatar: '👨‍🔧'
  },
  {
    id: 'TECH-102',
    name: 'Amit Verma',
    email: 'amit@coolfix.in',
    phone: '+91 98765 43211',
    specialty: 'Inverter AC Specialist',
    rating: 4.8,
    experience: '6 years',
    avatar: '🛠️'
  },
  {
    id: 'TECH-103',
    name: 'Suresh Kumar',
    email: 'suresh@coolfix.in',
    phone: '+91 98765 43212',
    specialty: 'Smart Refrigerator Expert',
    rating: 4.9,
    experience: '10 years',
    avatar: '🧊'
  },
  {
    id: 'TECH-104',
    name: 'Vikram Singh',
    email: 'vikram@coolfix.in',
    phone: '+91 98765 43213',
    specialty: 'PCB & Gas Refill Pro',
    rating: 4.7,
    experience: '5 years',
    avatar: '⚡'
  },
  {
    id: 'TECH-105',
    name: 'Rahul Das',
    email: 'rahul@coolfix.in',
    phone: '+91 98765 43214',
    specialty: 'Commercial & Home Cooling',
    rating: 4.9,
    experience: '7 years',
    avatar: '❄️'
  }
];

export function getTechnicianByEmail(email) {
  if (!email) return null;
  return TECHNICIANS.find(t => t.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getTechnicianById(id) {
  if (!id) return null;
  return TECHNICIANS.find(t => t.id === id) || null;
}
