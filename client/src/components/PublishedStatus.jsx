import PropTypes from 'prop-types';

function PublishedStatus({ published, salesUrl, publishedAt, publishedBy }) {
  if (!published) {
    return (
      <div className="published-status-view">
        <h3>Publishing Status</h3>
        <div className="status-badge unpublished">
          <span>Not Published</span>
        </div>
        <p className="muted">This title is not currently published to the sales website.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="published-status-view">
      <h3>Publishing Status</h3>
      <div className="status-badge published">
        <span>✓ Published</span>
      </div>
      {publishedBy && (
        <div className="metadata-row">
          <span className="metadata-label">Published By</span>
          <span className="metadata-value">{publishedBy}</span>
        </div>
      )}
      {publishedAt && (
        <div className="metadata-row">
          <span className="metadata-label">Published At</span>
          <span className="metadata-value">{formatDate(publishedAt)}</span>
        </div>
      )}
      {salesUrl && (
        <div className="sales-url">
          <label>Sales URL:</label>
          <a href={salesUrl} target="_blank" rel="noreferrer" className="url-link">
            {salesUrl}
          </a>
        </div>
      )}
    </div>
  );
}

PublishedStatus.propTypes = {
  published: PropTypes.bool.isRequired,
  salesUrl: PropTypes.string,
  publishedAt: PropTypes.string,
  publishedBy: PropTypes.string
};

PublishedStatus.defaultProps = {
  salesUrl: null,
  publishedAt: null,
  publishedBy: null
};

export default PublishedStatus;
