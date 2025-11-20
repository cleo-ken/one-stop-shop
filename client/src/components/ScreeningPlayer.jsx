import PropTypes from 'prop-types';

function ScreeningPlayer({ streamUrl }) {
  if (!streamUrl) {
    return null;
  }

  return (
    <div className="screening-player">
      <h3>Internal Screening</h3>
      <video controls src={streamUrl} poster="/assets/images/skybound-keyart.svg" />
    </div>
  );
}

ScreeningPlayer.propTypes = {
  streamUrl: PropTypes.string
};

ScreeningPlayer.defaultProps = {
  streamUrl: ''
};

export default ScreeningPlayer;
