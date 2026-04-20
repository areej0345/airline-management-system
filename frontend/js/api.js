const API_BASE = "https://airline-management-system-production-ea33.up.railway.app/api";

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