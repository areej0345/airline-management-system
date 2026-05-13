const BASE_URL = 'https://airline-management-system-xx2z.onrender.com/api';
console.log("UPDATED API FILE WORKING 🔥");

// ==================
// COMMON FETCH HANDLER
// ==================
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} - ${text}`);
  }
  return res.json();
}

// ==================
// FLIGHTS API
// ==================
async function getFlights() {
  try {
    const res = await fetch(`${API_BASE}/flights`);
    return await handleResponse(res);
  } catch (err) {
    console.error("Error fetching flights:", err);
    return [];
  }
}

async function addFlight(data) {
  try {
    const res = await fetch(`${API_BASE}/flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Error adding flight:", err);
    return { error: true, message: err.message };
  }
}

async function updateFlight(id, data) {
  try {
    const res = await fetch(`${API_BASE}/flights/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Error updating flight:", err);
    return { error: true, message: err.message };
  }
}

async function deleteFlight(id) {
  try {
    const res = await fetch(`${API_BASE}/flights/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Error deleting flight:", err);
    return { error: true, message: err.message };
  }
}

// ==================
// PASSENGERS API
// ==================
async function getPassengers() {
  try {
    const res = await fetch(`${API_BASE}/passengers`);
    return await handleResponse(res);
  } catch (err) {
    console.error("Error fetching passengers:", err);
    return [];
  }
}

async function addPassenger(data) {
  try {
    const res = await fetch(`${API_BASE}/passengers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Error adding passenger:", err);
    return { error: true, message: err.message };
  }
}

// ==================
// BOOKINGS API
// ==================
async function getBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    return await handleResponse(res);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}

async function addBooking(data) {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await handleResponse(res);
  } catch (err) {
    console.error("Error adding booking:", err);
    return { error: true, message: err.message };
  }
}