import PropTypes from 'prop-types';

function DiscoveryStats({ total, aggregates }) {
  const safeAggregates = aggregates || {
    withAssets: 0,
    withOpportunities: 0,
    readyEpisodes: 0
  };

  return (
    <div className="discovery-stats">
      <div className="stat-card">
        <p className="stat-label">Total Titles</p>
        <p className="stat-value">{total.toLocaleString()}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">With Assets</p>
        <p className="stat-value">{safeAggregates.withAssets.toLocaleString()}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">With Opportunities</p>
        <p className="stat-value">{safeAggregates.withOpportunities.toLocaleString()}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Ready Episodes</p>
        <p className="stat-value">{safeAggregates.readyEpisodes.toLocaleString()}</p>
      </div>
    </div>
  );
}

DiscoveryStats.propTypes = {
  total: PropTypes.number.isRequired,
  aggregates: PropTypes.shape({
    withAssets: PropTypes.number,
    withOpportunities: PropTypes.number,
    readyEpisodes: PropTypes.number
  })
};

DiscoveryStats.defaultProps = {
  aggregates: null
};

export default DiscoveryStats;
