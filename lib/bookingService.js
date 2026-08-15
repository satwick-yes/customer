const PRICES = { AC: 499, Fridge: 299 };

function generateJobId(appliance) {
  const prefix = appliance === 'AC' ? 'AC' : 'FR';
  const random = Math.floor(10000 + Math.random() * 90000);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}-${random}${letter}`;
}

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function createBooking(formData) {
  const jobId = generateJobId(formData.appliance);
  const price = PRICES[formData.appliance];
  const otp = generateOtp();
  const bookingData = {
    jobId,
    name: formData.name,
    phone: formData.phone,
    address: formData.address,
    appliance: formData.appliance,
    issue: formData.issue,
    price,
    status: 'Pending',
    otp,
    statusHistory: [{ status: 'Pending', timestamp: new Date().toISOString() }],
    feedback: null,
  };

  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  
  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
}

export async function getBookingByPhone(phone) {
  const response = await fetch(`/api/bookings?phone=${encodeURIComponent(phone)}`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
}

export async function getBookingByJobId(jobId) {
  const response = await fetch(`/api/bookings/${encodeURIComponent(jobId)}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch booking');
  }
  return response.json();
}

// Since we no longer have Firestore's onSnapshot, we simulate real-time updates via polling.
// The consumer will pass a callback that gets called whenever data changes.
export function subscribeToBooking(jobId, callback) {
  let isCancelled = false;
  
  const poll = async () => {
    if (isCancelled) return;
    try {
      const data = await getBookingByJobId(jobId);
      if (data && !isCancelled) {
        callback(data);
      }
    } catch (e) {
      console.error('Polling error', e);
    }
    
    if (!isCancelled) {
      setTimeout(poll, 3000); // Poll every 3 seconds
    }
  };
  
  // Start polling
  poll();
  
  // Return unsubscribe function
  return () => {
    isCancelled = true;
  };
}

export async function submitFeedback(docId, rating, review) {
  const response = await fetch(`/api/bookings/${encodeURIComponent(docId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      feedback: { rating, review, submittedAt: new Date().toISOString() }
    }),
  });
  
  if (!response.ok) throw new Error('Failed to submit feedback');
  return response.json();
}
