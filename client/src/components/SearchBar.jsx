import PropTypes from 'prop-types';

function SearchBar({ value, onChange, loading }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search titles"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="ghost-button" onClick={() => onChange('')}>
          Clear
        </button>
      )}
      <span className="status-chip">{loading ? 'Searching...' : 'Ready'}</span>
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

SearchBar.defaultProps = {
  loading: false
};

export default SearchBar;
