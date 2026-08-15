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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
