import PropTypes from 'prop-types';

function DealsPanel({ opportunities }) {
  if (!opportunities?.length) {
    return <p className="muted">No active opportunities for this role.</p>;
  }

  return (
    <div className="deals-panel">
      <h3>Salesforce Opportunities</h3>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Stage</th>
            <th className="numeric">Value (GBP)</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.opp_id}>
              <td>{opp.account}</td>
              <td>{opp.stage}</td>
              <td className="numeric">GBP {opp.value_gbp.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DealsPanel.propTypes = {
  opportunities: PropTypes.arrayOf(
    PropTypes.shape({
      opp_id: PropTypes.string.isRequired,
      account: PropTypes.string.isRequired,
      stage: PropTypes.string.isRequired,
      value_gbp: PropTypes.number.isRequired
    })
  )
};

DealsPanel.defaultProps = {
  opportunities: []
};

export default DealsPanel;
