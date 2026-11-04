import { useState } from "react";

function Navbar({
  theme,
  onToggleTheme,
  user,
  onOpenAuth,
  onOpenBooking,
  onOpenOrders,
  onOpenMessages,
  onOpenProfile,
  onLogout,
  cartCount,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#home" className="nav-brand" onClick={closeMobile}>
          <span className="brand-icon">🧺</span>
          <div className="brand-text">
            <span className="brand-title">Ludhiana Express</span>
            <span className="brand-subtitle">Premium Laundry & Dry Cleaning</span>
          </div>
        </a>

        {/* Action controls on the right (Mobile toggle & Quick Theme toggle) */}
        <div className="nav-right-bar">
          {/* Quick theme toggle for quick tap */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            <span className="theme-toggle-icon">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className="theme-toggle-text">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          {cartCount > 0 && (
            <button
              type="button"
              className="nav-cart-indicator nav-cart-mobile"
              onClick={() => {
                closeMobile();
                onOpenBooking();
              }}
              title="Cart Items"
            >
              🛒 <span>{cartCount}</span>
            </button>
          )}

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? "nav-links-mobile-open" : ""}`}>
          <a href="#home" onClick={closeMobile}>Home</a>
          <a href="#services" onClick={closeMobile}>Services</a>
          <a href="#how-it-works" onClick={closeMobile}>How It Works</a>
          <a href="#about" onClick={closeMobile}>About Us</a>
          <a href="#contact" onClick={closeMobile}>Contact</a>

          {user ? (
            <div className="nav-user-actions">
              <button
                type="button"
                className="nav-btn nav-btn-orders"
                onClick={() => {
                  closeMobile();
                  onOpenOrders();
                }}
              >
                📋 Orders
              </button>

              <button
                type="button"
                className="nav-btn nav-btn-messages"
                onClick={() => {
                  closeMobile();
                  onOpenMessages();
                }}
              >
                💬 Messages
              </button>

              <button
                type="button"
                className="nav-user-chip"
                onClick={() => {
                  closeMobile();
                  onOpenProfile();
                }}
                title="View Profile"
              >
                <img
                  src="/user.png"
                  alt="User"
                  className="user-avatar-icon"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span>Hi, {user.name?.split(" ")[0] || "User"}</span>
              </button>

              <button
                type="button"
                className="nav-btn nav-btn-logout"
                onClick={() => {
                  closeMobile();
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-guest-actions">
              <button
                type="button"
                className="nav-btn nav-btn-login"
                onClick={() => {
                  closeMobile();
                  onOpenAuth();
                }}
              >
                Login / Sign Up
              </button>
            </div>
          )}

          {cartCount > 0 && (
            <button
              type="button"
              className="nav-cart-indicator nav-cart-desktop"
              onClick={() => {
                closeMobile();
                onOpenBooking();
              }}
              title="Cart Items"
            >
              🛒 <span>{cartCount}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
