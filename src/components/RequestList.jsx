import RequestCard from "./RequestCard";

export default function RequestList({ requests, allRequestsCount, onStatusChange, onDelete }) {
  if (allRequestsCount === 0) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">🌿</p>
        <p>No requests yet. Be the first to submit one above!</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-emoji">🔍</p>
        <p>Nothing matches those filters. Try clearing them.</p>
      </div>
    );
  }

  return (
    <ul className="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
