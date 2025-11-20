import PropTypes from 'prop-types';

function DiscoveryFilters({ filters, onToggle, onSortChange }) {
  return (
    <div className="discovery-filters">
      <div className="filter-chips">
        <button
          type="button"
          className={`chip ${filters.hasAssets ? 'active' : ''}`}
          onClick={() => onToggle('hasAssets')}
        >
          Has Assets
        </button>
        <button
          type="button"
          className={`chip ${filters.hasOpportunities ? 'active' : ''}`}
          onClick={() => onToggle('hasOpportunities')}
        >
          Has Opportunities
        </button>
      </div>
      <div className="sort-control">
        <label htmlFor="sort-select">Sort</label>
        <select id="sort-select" value={filters.sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="alpha">A → Z</option>
          <option value="episodes_desc">Most Episodes</option>
          <option value="tx_date_desc">TX Date (Newest)</option>
          <option value="tx_date_asc">TX Date (Oldest)</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>
    </div>
  );
}

DiscoveryFilters.propTypes = {
  filters: PropTypes.shape({
    hasAssets: PropTypes.bool,
    hasOpportunities: PropTypes.bool,
    sort: PropTypes.string
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired
};

export default DiscoveryFilters;
