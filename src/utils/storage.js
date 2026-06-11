/**
 * storage.js
 * ----------------------------------------------------
 * Data layer for the Request Tracker.
 *
 * For this assessment I'm using localStorage so the app
 * works fully offline with zero setup. Everything is wrapped
 * behind these functions (getRequests, addRequest,
 * updateRequestStatus) on purpose — if I later swap localStorage
 * for a real database (e.g. MongoDB through a small Express API),
 * I'd only need to rewrite the insides of these functions and make
 * them async. The React components call these the same way either way.
 * ----------------------------------------------------
 */

const STORAGE_KEY = "photomed.requestTracker.requests";

/** Get all requests from storage. */
export function getRequests() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Couldn't parse stored requests, resetting.", err);
    return [];
  }
}

/** Overwrite all requests in storage. */
export function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

/**
 * Add a new request to storage.
 * @param {Object} requestData - form data (without id/status/date)
 * @returns {Object} the full request object that was saved
 */
export function addRequest(requestData) {
  const requests = getRequests();

  const newRequest = {
    id: generateId(),
    ...requestData,
    status: "New",
    createdAt: new Date().toISOString(),
  };

  const updated = [newRequest, ...requests]; // newest first
  saveRequests(updated);
  return updated;
}

/**
 * Update the status of an existing request.
 * @param {string} id
 * @param {string} newStatus
 * @returns {Array} the updated list of requests
 */
export function updateRequestStatus(id, newStatus) {
  const requests = getRequests();
  const updated = requests.map((r) =>
    r.id === id ? { ...r, status: newStatus } : r
  );
  saveRequests(updated);
  return updated;
}

/** Generate a reasonably unique id. */
function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
