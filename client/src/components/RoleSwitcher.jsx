import PropTypes from 'prop-types';

function RoleSwitcher({ roles, value, onChange, description }) {
  return (
    <div className="role-switcher">
      <label htmlFor="role-select">Role</label>
      <select
        id="role-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {roles.map((role) => (
          <option key={role.role} value={role.role}>
            {role.role}
          </option>
        ))}
      </select>
      {description && <p className="role-description">{description}</p>}
    </div>
  );
}

RoleSwitcher.propTypes = {
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.string
};

RoleSwitcher.defaultProps = {
  roles: [],
  description: ''
};

export default RoleSwitcher;
