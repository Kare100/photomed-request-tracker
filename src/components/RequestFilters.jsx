import { STATUSES, REQUEST_TYPES } from "../data/options";

export default function RequestFilters({ filters, onFilterChange }) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="filterStatus">Status</label>
        <select
          id="filterStatus"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filterType">Type</label>
        <select
          id="filterType"
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
        >
          <option value="all">All types</option>
          {REQUEST_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group search-group">
        <label htmlFor="searchInput">Search</label>
        <input
          type="text"
          id="searchInput"
          placeholder="Search name, email, message…"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>
    </div>
  );
}
