import PropTypes from 'prop-types';

function EpisodeList({ episodes }) {
  if (!episodes?.length) {
    return <p className="muted">No episodes available.</p>;
  }

  return (
    <div className="episode-list">
      <h3>Episodes</h3>
      <ul>
        {episodes.map((episode) => (
          <li key={episode.episode_id}>
            <div>
              <strong>{episode.name}</strong>
              <p className="muted">{episode.availability}</p>
            </div>
            <span>{episode.duration_min} min</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

EpisodeList.propTypes = {
  episodes: PropTypes.arrayOf(
    PropTypes.shape({
      episode_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      duration_min: PropTypes.number.isRequired,
      availability: PropTypes.string
    })
  )
};

EpisodeList.defaultProps = {
  episodes: []
};

export default EpisodeList;
