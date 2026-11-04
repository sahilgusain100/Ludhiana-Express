function ProfileModal({
  isOpen,
  onClose,
  user,
  onOpenOrders,
  onOpenMessages,
  onOpenBooking,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="profile-header">
          <div className="profile-avatar-circle">
            <img
              src="/user.png"
              alt={user?.name || "Customer Profile"}
              className="profile-avatar-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="profile-avatar-initial">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>

          <h2 className="modal-title">{user?.name || "Customer Account"}</h2>
          <span className="profile-verified-badge">✓ Verified Customer</span>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-field-label">Email Address</span>
            <span className="profile-field-value">{user?.email || "—"}</span>
          </div>

          <div className="profile-info-item">
            <span className="profile-field-label">Phone Number</span>
            <span className="profile-field-value">{user?.phone || "Not specified"}</span>
          </div>

          <div className="profile-info-item profile-info-full">
            <span className="profile-field-label">Default Pickup Address</span>
            <span className="profile-field-value">
              {user?.address ? `📍 ${user.address}` : "Not specified (you can add one during checkout)"}
            </span>
          </div>
        </div>

        <div className="profile-quick-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onOpenOrders();
            }}
          >
            📋 My Orders
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              onClose();
              onOpenMessages();
            }}
          >
            💬 Message History
          </button>

          <button
            type="button"
            className="btn btn-outline profile-full-btn"
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
          >
            🧺 Book a Pickup
          </button>
        </div>

        <hr className="profile-divider" />

        <div className="profile-footer-row">
          <button
            type="button"
            className="btn btn-logout-danger"
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            🚪 Logout of Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
