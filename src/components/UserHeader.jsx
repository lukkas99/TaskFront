import "./Auth.css";

/**
 * Componente de header do usuário
 */
function UserHeader({ user, onLogout }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-header">
      <div className="user-info">
        <div className="user-avatar">{getInitials(user.name)}</div>
        <div className="user-details">
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
      <button onClick={onLogout} className="logout-button">
        Sair
      </button>
    </div>
  );
}

export default UserHeader;
