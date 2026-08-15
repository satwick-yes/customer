import fs from 'fs';
import path from 'path';
import * as xlsx from 'xlsx';

// Path to our local database file
const dbFilePath = path.join(process.cwd(), 'data.json');

// Initialize the database file if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({ bookings: [] }, null, 2));
  }
};

// Read all data from the file
export const readDb = () => {
  initDb();
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { bookings: [] };
  }
};

// Write data back to the file
export const writeDb = (data) => {
  initDb();
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
    
    // Also write to Excel
    try {
      const excelPath = path.join(process.cwd(), 'bookings.xlsx');
      
      // Flatten or format the data for Excel if needed
      const excelData = data.bookings.map(b => ({
        'Job ID': b.jobId,
        'Date': new Date(b.createdAt).toLocaleDateString(),
        'Name': b.name,
        'Phone': b.phone,
        'Address': b.address,
        'Appliance': b.appliance,
        'Issue': b.issue,
        'Status': b.status,
        'Price': b.price,
        'Rating': b.feedback?.rating || '',
        'Review': b.feedback?.review || ''
      }));

      const worksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Bookings");
      
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      fs.writeFileSync(excelPath, buffer);
    } catch (excelError) {
      console.error('Error writing to Excel:', excelError);
    }
    
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};
