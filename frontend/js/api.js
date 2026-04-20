const BASE_URL = "https://airline-management-system-production-ea33.up.railway.app/api";

// ==================
// FLIGHTS API
// ==================

async function getFlights() {
  const res = await fetch(`${BASE_URL}/flights`);
  return await res.json();
}

async function addFlight(data) {
  const res = await fetch(`${BASE_URL}/flights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function updateFlight(id, data) {
  const res = await fetch(`${BASE_URL}/flights/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function deleteFlight(id) {
  const res = await fetch(`${BASE_URL}/flights/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// ==================
// PASSENGERS API
// ==================

async function getPassengers() {
  const res = await fetch(`${BASE_URL}/passengers`);
  return await res.json();
}

async function addPassenger(data) {
  const res = await fetch(`${BASE_URL}/passengers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function updatePassenger(id, data) {
  const res = await fetch(`${BASE_URL}/passengers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function deletePassenger(id) {
  const res = await fetch(`${BASE_URL}/passengers/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// ==================
// BOOKINGS API
// ==================

async function getBookings() {
  const res = await fetch(`${BASE_URL}/bookings`);
  return await res.json();
}

async function addBooking(data) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function deleteBooking(id) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// ==================
// NOTIFICATIONS API
// ==================

async function sendBookingNotification(data) {
  try {
    const res = await fetch(`${BASE_URL}/notifications/booking-confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.log('Notification error:', err);
  }
}

async function sendFlightStatusNotification(data) {
  try {
    const res = await fetch(`${BASE_URL}/notifications/flight-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.log('Notification error:', err);
  }
}