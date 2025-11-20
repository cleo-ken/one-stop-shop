import PropTypes from 'prop-types';
import EpisodeList from './EpisodeList.jsx';
import MarketingAssets from './MarketingAssets.jsx';
import DealsPanel from './DealsPanel.jsx';
import ScreeningPlayer from './ScreeningPlayer.jsx';

function TitleDetail({ title, role }) {
  const heroImage = title.hero_image || '/assets/images/default-card.svg';
  const investmentBlock = title.investment ? (
    <div className="investment-card">
      <h3>Investment</h3>
      <p className="budget">Budget: GBP {title.investment.budget_million}M</p>
      {title.investment.sensitive && <p className="sensitive-note">{title.investment.sensitive}</p>}
    </div>
  ) : (
    <div className="investment-card muted">Investment data hidden for the {role} role.</div>
  );

  return (
    <div className="title-detail">
      <div className="title-hero">
        <img src={heroImage} alt={`${title.title_name} artwork`} />
      </div>
      <div className="title-header">
        <div>
          <p className="role-pill">{role} view</p>
          <h2>{title.title_name}</h2>
          <p className="synopsis">{title.synopsis}</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="left-stack">
          {investmentBlock}
          <EpisodeList episodes={title.episodes || []} />
          <div className="credits-block">
            <h3>Credits</h3>
            <ul>
              {(title.credits || []).map((credit) => (
                <li key={`${credit.role}-${credit.name}`}>
                  <span>{credit.role}</span>
                  <strong>{credit.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right-stack">
          <MarketingAssets assets={title.marketing_assets || []} />
          <DealsPanel opportunities={title.opportunities || []} />
          <ScreeningPlayer streamUrl={title.internal_screening?.stream_url} />
        </div>
      </div>
    </div>
  );
}

TitleDetail.propTypes = {
  title: PropTypes.shape({
    title_id: PropTypes.string.isRequired,
    title_name: PropTypes.string.isRequired,
    synopsis: PropTypes.string.isRequired,
    episodes: PropTypes.array,
    credits: PropTypes.array,
    investment: PropTypes.shape({
      budget_million: PropTypes.number,
      sensitive: PropTypes.string
    }),
    marketing_assets: PropTypes.array,
    opportunities: PropTypes.array,
    internal_screening: PropTypes.shape({
      stream_url: PropTypes.string
    }),
    hero_image: PropTypes.string
  }).isRequired,
  role: PropTypes.string.isRequired
};

export default TitleDetail;
