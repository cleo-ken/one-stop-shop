import { useState } from 'react';
import PropTypes from 'prop-types';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://oss-backend-ijrl.onrender.com/api';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
};

function PublishControl({ titleId, published, salesUrl, role, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canPublish = role === 'Admin' || role === 'Marketing';

  if (!canPublish) {
    return null;
  }

  const handlePublish = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchJson(`${API_BASE}/titles/${titleId}/publish?role=${encodeURIComponent(role)}`, {
        method: 'POST'
      });
      onUpdate({ published: true, sales_url: result.sales_url, published_at: result.published_at, published_by: result.published_by });
    } catch (err) {
      setError(err.message || 'Failed to publish title');
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setLoading(true);
    setError('');
    try {
      await fetchJson(`${API_BASE}/titles/${titleId}/unpublish?role=${encodeURIComponent(role)}`, {
        method: 'POST'
      });
      onUpdate({ published: false, sales_url: null, published_at: null, published_by: null });
    } catch (err) {
      setError(err.message || 'Failed to unpublish title');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-control">
      <h3>Publishing</h3>
      {error && <p className="error-text">{error}</p>}
      {published ? (
        <div className="published-status">
          <div className="status-badge published">
            <span>✓ Published</span>
          </div>
          {salesUrl && (
            <div className="sales-url">
              <label>Sales URL:</label>
              <a href={salesUrl} target="_blank" rel="noreferrer" className="url-link">
                {salesUrl}
              </a>
            </div>
          )}
          <button
            type="button"
            onClick={handleUnpublish}
            disabled={loading}
            className="unpublish-button"
          >
            {loading ? 'Unpublishing...' : 'Unpublish'}
          </button>
        </div>
      ) : (
        <div className="unpublished-status">
          <div className="status-badge unpublished">
            <span>Not Published</span>
          </div>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading}
            className="publish-button"
          >
            {loading ? 'Publishing...' : 'Publish to Sales Website'}
          </button>
        </div>
      )}
    </div>
  );
}

PublishControl.propTypes = {
  titleId: PropTypes.string.isRequired,
  published: PropTypes.bool.isRequired,
  salesUrl: PropTypes.string,
  role: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
};

PublishControl.defaultProps = {
  salesUrl: null
};

export default PublishControl;
