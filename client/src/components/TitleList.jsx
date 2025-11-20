import PropTypes from 'prop-types';

function TitleList({ titles, onSelect, loading }) {
  if (loading) {
    return (
      <div className="title-table-container">
        <p className="muted">Loading discovery results...</p>
      </div>
    );
  }

  if (!titles.length) {
    return (
      <div className="title-table-container">
        <p className="muted">No titles match the current filters.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="title-table-container">
      <table className="title-table">
        <thead>
          <tr>
            <th className="col-thumbnail">Image</th>
            <th className="col-id">ID</th>
            <th className="col-name">Title</th>
            <th className="col-tx-date">TX Date</th>
            <th className="col-episodes">Episodes</th>
            <th className="col-badges">Status</th>
            <th className="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {titles.map((title) => (
            
              <tr key={title.title_id} className="title-row" onClick={() => onSelect(title.title_id)}>
                <td className="col-thumbnail">
                  <div className="thumbnail-wrapper">
                    <img src={title.hero_image || '/assets/images/default-card.svg'} alt={`${title.title_name} artwork`} />
                  </div>
                </td>
                <td className="col-id">
                  <code>{title.title_id}</code>
                </td>
                <td className="col-name">
                  <div className="title-name-cell">
                    <strong>{title.title_name}</strong>
                    <span className="synopsis-preview">{title.synopsis}</span>
                  </div>
                </td>
                <td className="col-tx-date">
                  {formatDate(title.tx_date)}
                </td>
                <td className="col-episodes">
                  <span className="episode-badge">{title.episode_count}</span>
                </td>
                <td className="col-badges">
                  <div className="status-badges">
                    {title.published && (
                      <span className="badge badge-published" title="Published to Sales Website">✓ Published</span>
                    )}
                    {title.has_assets && (
                      <span className="badge badge-assets" title="Has Marketing Assets">Assets</span>
                    )}
                    {title.has_opportunities && (
                      <span className="badge badge-opps" title="Has Opportunities">Opps</span>
                    )}
                    {!title.published && !title.has_assets && !title.has_opportunities && (
                      <span className="badge-empty">—</span>
                    )}
                  </div>
                </td>
                <td className="col-action">
                  <button
                    type="button"
                    className="view-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(title.title_id);
                    }}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

TitleList.propTypes = {
  titles: PropTypes.arrayOf(
    PropTypes.shape({
      title_id: PropTypes.string.isRequired,
      title_name: PropTypes.string.isRequired,
      synopsis: PropTypes.string.isRequired,
      tx_date: PropTypes.string,
      episode_count: PropTypes.number.isRequired,
      has_assets: PropTypes.bool,
      has_opportunities: PropTypes.bool,
      hero_image: PropTypes.string,
      published: PropTypes.bool,
      sales_url: PropTypes.string
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

TitleList.defaultProps = {
  loading: false,
};

export default TitleList;
