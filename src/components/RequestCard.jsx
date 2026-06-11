import { STATUSES } from "../data/options";
import { formatDate } from "../utils/validation";

export default function RequestCard({ request, onStatusChange }) {
  const statusClass = `status-${request.status.replace(" ", "-")}`;

  return (
    <li className="request-card" data-status={request.status}>
      <div className="card-tab" />
      <div className="card-body">
        <div className="card-top">
          <div>
            <h3 className="card-name">{request.name}</h3>
            <p className="card-meta">
              {request.email} · {request.company}
            </p>
          </div>
          <span className="badge type-badge">{request.type}</span>
        </div>

        <p className="card-message">{request.message}</p>

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
      </div>
    </li>
  );
}
