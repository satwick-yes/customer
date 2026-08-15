import './globals.css';

export const metadata = {
  title: 'CoolFix — AC & Fridge Repair Booking',
  description: 'Book expert AC and Fridge repair services at your doorstep. Fast, reliable, and affordable. AC repair at ₹499 | Fridge repair at ₹299.',
  keywords: 'AC repair, fridge repair, appliance repair, home service, book technician',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;700;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
