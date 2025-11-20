import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import EpisodeList from '../components/EpisodeList.jsx';
import MarketingAssets from '../components/MarketingAssets.jsx';
import DealsPanel from '../components/DealsPanel.jsx';
import ScreeningPlayer from '../components/ScreeningPlayer.jsx';
import PublishControl from '../components/PublishControl.jsx';
import PublishedStatus from '../components/PublishedStatus.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response.json();
};

function TitleDetailPage({ role }) {
  const { titleId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: '' });

  const handlePublishUpdate = (publishData) => {
    setTitle((prev) => (prev ? { ...prev, ...publishData } : null));
  };

  useEffect(() => {
    if (!titleId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- set error state immediately when ID missing
      setStatus({ loading: false, error: 'No title ID provided' });
      return;
    }

    const controller = new AbortController();
    setStatus({ loading: true, error: '' });

    fetchJson(`${API_BASE}/titles/${titleId}?role=${encodeURIComponent(role)}`, {
      signal: controller.signal
    })
      .then((data) => {
        setTitle(data);
        setStatus({ loading: false, error: '' });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setStatus({ loading: false, error: error.message || 'Unable to load title details' });
        setTitle(null);
      });

    return () => controller.abort();
  }, [titleId, role]);

  if (status.loading) {
    return (
      <div className="title-detail-page">
        <p className="muted">Loading title details...</p>
      </div>
    );
  }

  if (status.error || !title) {
    return (
      <div className="title-detail-page">
        <p className="error-text">{status.error || 'Title not found'}</p>
        <button type="button" onClick={() => navigate('/')} className="back-button">
          ← Back to Discovery
        </button>
      </div>
    );
  }

  const heroImage = title.hero_image || '/assets/images/default-card.svg';
  const investmentBlock = title.investment ? (
    <div className="metadata-section">
      <h3>Investment</h3>
      <div className="metadata-card">
        <div className="metadata-row">
          <span className="metadata-label">Budget</span>
          <span className="metadata-value">GBP {title.investment.budget_million}M</span>
        </div>
        {title.investment.sensitive && (
          <div className="metadata-row">
            <span className="metadata-label">Sensitive Notes</span>
            <span className="metadata-value sensitive">{title.investment.sensitive}</span>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="metadata-section">
      <h3>Investment</h3>
      <div className="metadata-card muted">Investment data hidden for the {role} role.</div>
    </div>
  );

  return (
    <div className="title-detail-page">
      <button type="button" onClick={() => navigate('/')} className="back-button">
        ← Back to Discovery
      </button>

      <div className="title-hero">
        <img src={heroImage} alt={`${title.title_name} artwork`} />
      </div>

      <div className="title-header">
        <div className="title-meta-header">
          <p className="role-pill">{role} view</p>
          <h1>{title.title_name}</h1>
          <p className="title-id">ID: {title.title_id}</p>
        </div>
        <p className="synopsis">{title.synopsis}</p>
      </div>

      <div className="metadata-grid">
        {investmentBlock}

        <div className="metadata-section">
          <h3>Episodes ({title.episodes?.length || 0})</h3>
          <EpisodeList episodes={title.episodes || []} />
        </div>

        <div className="metadata-section">
          <h3>Credits ({title.credits?.length || 0})</h3>
          <div className="metadata-card">
            {(title.credits || []).map((credit) => (
              <div key={`${credit.role}-${credit.name}`} className="metadata-row">
                <span className="metadata-label">{credit.role}</span>
                <span className="metadata-value">{credit.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metadata-section">
          <h3>Marketing Assets ({title.marketing_assets?.length || 0})</h3>
          <MarketingAssets assets={title.marketing_assets || []} />
        </div>

        {title.opportunities && title.opportunities.length > 0 && (
          <div className="metadata-section">
            <h3>Salesforce Opportunities ({title.opportunities.length})</h3>
            <DealsPanel opportunities={title.opportunities} />
          </div>
        )}

        {(role === 'Admin' || role === 'Marketing') ? (
          <div className="metadata-section">
            <PublishControl
              titleId={title.title_id}
              published={title.published || false}
              salesUrl={title.sales_url}
              role={role}
              onUpdate={handlePublishUpdate}
            />
          </div>
        ) : (
          <div className="metadata-section">
            <PublishedStatus
              published={title.published || false}
              salesUrl={title.sales_url}
              publishedAt={title.published_at}
              publishedBy={title.published_by}
            />
          </div>
        )}

        {title.internal_screening?.stream_url && (
          <div className="metadata-section">
            <h3>Internal Screening</h3>
            <ScreeningPlayer streamUrl={title.internal_screening.stream_url} />
          </div>
        )}
      </div>
    </div>
  );
}

TitleDetailPage.propTypes = {
  role: PropTypes.string.isRequired
};

export default TitleDetailPage;
