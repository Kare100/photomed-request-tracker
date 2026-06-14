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
 * Seeds the activity log with a "created" event.
 * @param {Object} requestData - form data (without id/status/date)
 * @returns {Array} the updated list of requests
 */
export function addRequest(requestData) {
  const requests = getRequests();
  const similarTo = findSimilarRequest(requestData, requests);
  const now = new Date().toISOString();

  const newRequest = {
    id: generateId(),
    ...requestData,
    status: "New",
    createdAt: now,
    notes: [],
    activity: [
      {
        id: generateId(),
        type: "created",
        timestamp: now,
        detail: "Request submitted",
      },
    ],
    ...(similarTo && { similarTo }),
  };

  const updated = [newRequest, ...requests];
  saveRequests(updated);
  return updated;
}

/**
 * Update the status of an existing request.
 * Logs a "status_change" event to the activity timeline.
 * @param {string} id
 * @param {string} newStatus
 * @returns {Array} the updated list of requests
 */
export function updateRequestStatus(id, newStatus) {
  const requests = getRequests();
  const updated = requests.map((r) => {
    if (r.id !== id) return r;
    return {
      ...r,
      status: newStatus,
      activity: [
        ...(r.activity || []),
        {
          id: generateId(),
          type: "status_change",
          timestamp: new Date().toISOString(),
          detail: `Status changed from ${r.status} to ${newStatus}`,
        },
      ],
    };
  });
  saveRequests(updated);
  return updated;
}

/**
 * Delete a request by id.
 * @param {string} id
 * @returns {Array} the updated list of requests
 */
export function deleteRequest(id) {
  const requests = getRequests();
  const updated = requests.filter((r) => r.id !== id);
  saveRequests(updated);
  return updated;
}

/**
 * Add an internal note to an existing request.
 * Also logs a "note_added" event to the activity timeline.
 * @param {string} id - request id
 * @param {string} text - note content
 * @param {string} author - name of the admin adding the note
 * @returns {Array} the updated list of requests
 */
export function addNoteToRequest(id, text, author) {
  const requests = getRequests();
  const updated = requests.map((r) => {
    if (r.id !== id) return r;
    return {
      ...r,
      notes: [
        ...(r.notes || []),
        { id: generateId(), text, author, createdAt: new Date().toISOString() },
      ],
      activity: [
        ...(r.activity || []),
        {
          id: generateId(),
          type: "note_added",
          timestamp: new Date().toISOString(),
          detail: `Note added by ${author}`,
        },
      ],
    };
  });
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

/** Export all requests as a CSV file download. */
export function exportRequestsToCSV(requests) {
  if (requests.length === 0) return;

  const headers = ["Name", "Email", "Product/Company", "Type", "Priority", "Status", "Message", "Date"];
  const rows = requests.map((r) => [
    r.name, r.email, r.company, r.type, r.priority, r.status, r.message, formatDateForCSV(r.createdAt)
  ]);

  const escapeCell = (cell) => `"${String(cell).replace(/"/g, '""')}"`;

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `photomed-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Format a date for CSV export. */
function formatDateForCSV(isoString) {
  return new Date(isoString).toLocaleString();
}

/** Set of common words to ignore during similarity checking. */
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "to", "of", "in",
  "on", "for", "with", "this", "that", "it", "i", "my", "me", "we", "our", "you",
  "your", "have", "has", "had", "be", "been", "not", "can", "cant", "can't", "app",
  "please", "would", "like", "also", "just", "really", "very", "get", "getting"
]);

/** Extract meaningful words from a string for similarity comparison. */
function getSignificantWords(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => (w.length > 2 || w === "ui") && !STOPWORDS.has(w))
  );
}

/**
 * Score similarity between two strings based on shared significant words.
 * Returns a value between 0 (no match) and 1 (identical).
 */
function similarityScore(textA, textB) {
  const wordsA = getSignificantWords(textA);
  const wordsB = getSignificantWords(textB);
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let shared = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) shared++;
  }
  return shared / Math.min(wordsA.size, wordsB.size);
}

/**
 * Find an existing request that looks like a duplicate of the new one.
 * Triggers on same email OR message similarity above threshold.
 */
function findSimilarRequest(newData, existingRequests) {
  for (const existing of existingRequests) {
    const sameEmail = existing.email.toLowerCase() === newData.email.toLowerCase();
    const score = similarityScore(existing.message, newData.message);

    if (sameEmail || score >= 0.3) {
      return {
        id: existing.id,
        name: existing.name,
        createdAt: existing.createdAt,
        reason: sameEmail ? "email" : "message",
      };
    }
  }
  return null;
}