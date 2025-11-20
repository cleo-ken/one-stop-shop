import PropTypes from 'prop-types';

function MarketingAssets({ assets }) {
  if (!assets?.length) {
    return <p className="muted">No marketing assets attached.</p>;
  }

  return (
    <div className="marketing-assets">
      <h3>Marketing Assets</h3>
      <ul>
        {assets.map((asset) => (
          <li key={asset.asset_id}>
            <div>
              <strong>{asset.label}</strong>
              <p className="muted">{asset.type.toUpperCase()}</p>
            </div>
            <a href={asset.url} target="_blank" rel="noreferrer" download>
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

MarketingAssets.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      asset_id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  )
};

MarketingAssets.defaultProps = {
  assets: []
};

export default MarketingAssets;
