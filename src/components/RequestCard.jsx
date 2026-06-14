import { STATUSES } from "../data/options";
import { useState } from "react";
import { createPortal } from "react-dom";
import { formatDate, getAutoReplyEmail } from "../utils/validation";

export default function RequestCard({ request, onStatusChange, onDelete, onAddNote }) {
  const [showImage, setShowImage] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("");
  const [collapsed, setCollapsed] = useState(true);
  const statusClass = `status-${request.status.replace(" ", "-")}`;
  const autoReply = getAutoReplyEmail(request);
  const showNotes = request.type !== "General Feedback";

  /**
   * Submit a new internal note for this request.
   * Clears the input after submission.
   */
  function handleNoteSubmit() {
    if (!noteText.trim()) return;
    onAddNote(request.id, noteText.trim(), noteAuthor.trim());
    setNoteText("");
    setNoteAuthor("");
  }

  return (
    <li className="request-card" data-status={request.status}>
      <div className="card-tab" />
      <div className="card-body">

        {/* Card header — always visible */}
        <div className="card-top">
          <div>
            <h3 className="card-name">{request.name}</h3>
            <p className="card-meta">
              {request.email} · {request.company}
            </p>
          </div>
          <div className="card-top-right">
            <span className="badge type-badge">{request.type}</span>
            <button
              className="collapse-btn"
              onClick={() => setCollapsed((prev) => !prev)}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? "▾" : "▴"}
            </button>
            <button
              className="delete-btn"
              onClick={() => {
                if (window.confirm("Delete this request?")) onDelete(request.id);
              }}
              title="Delete request"
            >
              ×
            </button>
          </div>
        </div>

        {/* Duplicate notice — always visible if flagged */}
        {request.similarTo && (
          <p className="duplicate-notice">
            Possibly similar to a request from <strong>{request.similarTo.name}</strong> ({formatDate(request.similarTo.createdAt)}) — matched by {request.similarTo.reason === "email" ? "same email" : "similar message"}
          </p>
        )}

        {/* Message — always visible */}
        <p className="card-message">{request.message}</p>

        {/* Footer — always visible (priority, status, date) */}
        <div className="card-footer">
          <span className={`badge priority-badge priority-${request.priority}`}>
            {request.priority} priority
          </span>

          <label className="status-label">
            Status
            <select
              className={`status-select ${statusClass}`}
              value={request.status}
              onChange={(e) => onStatusChange(request.id, e.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <span className="card-date">{formatDate(request.createdAt)}</span>
        </div>

        {/* Expandable section — attachment, email preview, notes, activity */}
        {!collapsed && (
          <>
            {/* Attachment thumbnail — only shown when expanded */}
            {request.attachment && (
              <>
                <img
                  src={request.attachment}
                  alt="Attachment"
                  className="card-attachment"
                  onClick={() => setShowImage(true)}
                />
                {showImage && createPortal(
                  <div className="image-modal" onClick={() => setShowImage(false)}>
                    <img src={request.attachment} alt="Attachment full size" />
                  </div>,
                  document.body
                )}
              </>
            )}

            {/* Auto-reply email preview — only shown when status is Resolved */}
            {autoReply && (
              <div className="email-preview">
                <p className="email-preview-label">Auto-reply preview (to {request.email}):</p>
                <p className="email-subject"><strong>Subject:</strong> {autoReply.subject}</p>
                <p className="email-body">{autoReply.body}</p>
              </div>
            )}

            {/* Internal notes — hidden for General Feedback requests */}
            {showNotes && (
              <div className="notes-section">
                <p className="notes-label">Internal notes</p>

                {(request.notes || []).length === 0 && (
                  <p className="notes-empty">No notes yet.</p>
                )}

                <ul className="notes-list">
                  {(request.notes || []).map((note) => (
                    <li key={note.id} className="note-item">
                      <p className="note-text">{note.text}</p>
                      <span className="note-date">{note.author} · {formatDate(note.createdAt)}</span>
                    </li>
                  ))}
                </ul>

                <div className="note-input-row">
                  <input
                    type="text"
                    className="note-input note-author-input"
                    placeholder="Your name"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="note-input"
                    placeholder="Add an internal note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleNoteSubmit(); }}
                  />
                  <button className="note-submit-btn" onClick={handleNoteSubmit}>
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Activity timeline — chronological log of all events on this request */}
            {(request.activity || []).length > 0 && (
              <div className="activity-section">
                <p className="activity-label">Activity</p>
                <ul className="activity-list">
                  {(request.activity || []).map((event) => (
                    <li key={event.id} className="activity-item">
                      <span className="activity-dot" />
                      <div className="activity-content">
                        <p className="activity-detail">{event.detail}</p>
                        <span className="activity-time">{formatDate(event.timestamp)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

      </div>
    </li>
  );
}