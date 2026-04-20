const API_BASE = "https://airline-management-system-production-ea33.up.railway.app/api";

// ==================
// FLIGHTS API
// ==================

async function getFlights() {
  const res = await fetch(`${API_BASE}/flights`);
  return await res.json();
}

async function addFlight(data) {
  const res = await fetch(`${API_BASE}/flights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function updateFlight(id, data) {
  const res = await fetch(`${API_BASE}/flights/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

async function deleteFlight(id) {
  const res = await fetch(`${API_BASE}/flights/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}