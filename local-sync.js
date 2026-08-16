require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { saveJobSheetPdfToFile } = require('./lib/nodePdfGenerator');

async function sync() {
  console.log('🔄 Fetching latest data from Supabase...');
  
  const { data, error } = await supabase
    .from('json_store')
    .select('id, data');

  if (error) {
    console.error('❌ Error fetching data:', error);
    return;
  }

  let bookingsData = { bookings: [] };

  data.forEach((row) => {
    // Save each row (data.json, users.json) to the local filesystem
    fs.writeFileSync(path.join(__dirname, row.id), JSON.stringify(row.data, null, 2));
    console.log(`✅ Successfully updated local ${row.id}`);

    if (row.id === 'data.json') {
      bookingsData = row.data;
    }
  });

  // Create/ensure the local 'jobsheets' folder on this laptop
  const jobSheetsDir = path.join(__dirname, 'jobsheets');
  if (!fs.existsSync(jobSheetsDir)) {
    fs.mkdirSync(jobSheetsDir, { recursive: true });
    console.log(`📁 Created local folder: ${jobSheetsDir}`);
  }

  // Now create the Excel file and Job Sheet PDFs
  if (bookingsData.bookings && bookingsData.bookings.length > 0) {
    const flatBookings = bookingsData.bookings.map(b => ({
      Job_ID: b.jobId,
      Date: new Date(b.createdAt).toLocaleDateString(),
      Customer: b.name,
      Phone: b.phone,
      Address: b.address,
      Appliance: b.appliance,
      Issue: b.issue,
      Price: b.price,
      Status: b.status,
      Rating: b.feedback ? b.feedback.rating : 'N/A',
      Review: b.feedback ? b.feedback.review : 'N/A'
    }));

    const worksheet = xlsx.utils.json_to_sheet(flatBookings);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    
    xlsx.writeFile(workbook, path.join(__dirname, 'bookings.xlsx'));
    console.log('✅ Successfully updated local bookings.xlsx');

    // Generate and download all Job Sheet PDFs locally onto this laptop
    let pdfCount = 0;
    bookingsData.bookings.forEach(b => {
      try {
        const savedPath = saveJobSheetPdfToFile(b, jobSheetsDir);
        if (savedPath) {
          pdfCount++;
        }
      } catch (pdfErr) {
        console.error(`❌ Error generating PDF for ${b.jobId}:`, pdfErr);
      }
    });
    console.log(`📄 Successfully saved ${pdfCount} Job Sheet PDFs into: ${jobSheetsDir}`);
  } else {
    console.log('⚠️ No bookings found to create bookings.xlsx or Job Sheet PDFs');
  }

  console.log('🎉 Sync complete! All data and Job Sheet PDFs are up-to-date on your laptop.');
}

sync();
