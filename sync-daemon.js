require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { saveJobSheetPdfToFile } = require('./lib/nodePdfGenerator');

let lastHash = '';

async function sync(silent = false) {
  if (!silent) console.log('🔄 Checking for latest data from Supabase...');
  
  const { data, error } = await supabase
    .from('json_store')
    .select('id, data');

  if (error) {
    console.error('❌ Error fetching data:', error);
    return;
  }

  // Create a hash to see if data actually changed
  const currentHash = JSON.stringify(data);
  if (currentHash === lastHash) {
    return; // No changes
  }
  lastHash = currentHash;

  let bookingsData = { bookings: [] };

  data.forEach((row) => {
    // Save each row (data.json, users.json) to the local filesystem
    fs.writeFileSync(path.join(__dirname, row.id), JSON.stringify(row.data, null, 2));
    console.log(`✅ [${new Date().toLocaleTimeString()}] Successfully updated local ${row.id}`);

    if (row.id === 'data.json') {
      bookingsData = row.data;
    }
  });

  // Create/ensure the local 'jobsheets' folder on this laptop
  const jobSheetsDir = path.join(__dirname, 'jobsheets');
  if (!fs.existsSync(jobSheetsDir)) {
    fs.mkdirSync(jobSheetsDir, { recursive: true });
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
    console.log(`✅ [${new Date().toLocaleTimeString()}] Successfully updated local bookings.xlsx`);

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
    console.log(`📄 [${new Date().toLocaleTimeString()}] Successfully updated ${pdfCount} Job Sheet PDFs in: ${jobSheetsDir}`);
  }
}

console.log('🚀 Starting real-time sync daemon...');
sync(false); // Initial sync

// Poll every 5 seconds for changes
setInterval(() => {
  sync(true); // Silent sync, only logs when there is an actual update
}, 5000);
