import { useState, useEffect, useMemo } from "react";
import RequestForm from "./components/RequestForm";
import RequestFilters from "./components/RequestFilters";
import RequestList from "./components/RequestList";
import { getRequests, addRequest, updateRequestStatus, deleteRequest, exportRequestsToCSV, addNoteToRequest } from "./utils/storage";

const initialFilters = {
  status: "all",
  type: "all",
  search: "",
};

export default function App() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  // Load requests from storage on first render
  useEffect(() => {
    setRequests(getRequests());
  }, []);

  function handleAddRequest(formData) {
    const updated = addRequest(formData);
    setRequests(updated);
  }

  function handleStatusChange(id, newStatus) {
    const updated = updateRequestStatus(id, newStatus);
    setRequests(updated);
  }

  function handleDeleteRequest(id) {
    const updated = deleteRequest(id);
    setRequests(updated);
  }
  /**
 * Add an internal note to a request.
 * @param {string} id - request id
 * @param {string} text - note content
 * @param {string} author - name of the admin adding the note
 */
  function handleAddNote(id, text, author) {
    const updated = addNoteToRequest(id, text, author);
    setRequests(updated);
  }
  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.type !== "all" && r.type !== filters.type) return false;
      if (filters.search) {
        const haystack = `${r.name} ${r.email} ${r.message} ${r.company}`.toLowerCase();
        if (!haystack.includes(filters.search.toLowerCase())) return false;
      }
      return true;
    });
  }, [requests, filters]);

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">🌿</span>
          <h1>PhotoMed Request Tracker</h1>
        </div>
        <p className="tagline">
          Got a bug, idea, or shoutout about PhotoMed? Drop it below, we're listening.
        </p>
      </header>

      <main className="layout">
        <RequestForm onSubmit={handleAddRequest} />

        <section className="list-section" aria-labelledby="list-heading">
          <div className="list-header">
            <h2 id="list-heading">Submitted requests</h2>
            <span className="count-pill">{filteredRequests.length}</span>
          </div>

          <div className="stats-bar">
            <div className="stats-numbers">
              <span>Total: <strong>{requests.length}</strong></span>
              <span>New: <strong>{requests.filter(r => r.status === "New").length}</strong></span>
              <span>In Review: <strong>{requests.filter(r => r.status === "In Review").length}</strong></span>
              <span>Resolved: <strong>{requests.filter(r => r.status === "Resolved").length}</strong></span>
              <span>Rejected: <strong>{requests.filter(r => r.status === "Rejected").length}</strong></span>
            </div>
            <button
              className="export-btn"
              onClick={() => exportRequestsToCSV(requests)}
              disabled={requests.length === 0}
            >
              Export CSV
            </button>
          </div>



          <RequestFilters filters={filters} onFilterChange={handleFilterChange} />

          <RequestList
            requests={filteredRequests}
            allRequestsCount={requests.length}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRequest}
            onAddNote={handleAddNote}
          />
        </section>
      </main>

      <footer className="site-footer">
        <p>Made for the PhotoMed attachment assessment · Your requests stay saved on this device</p>
      </footer>
    </>
  );
}