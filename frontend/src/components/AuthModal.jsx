import { useState } from "react";
import api from "../api/axios";

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setAddress("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSwitchMode = (loginMode) => {
    setIsLogin(loginMode);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/users/login", {
          email: email.trim().toLowerCase(),
          password,
        });

        const { token, user } = response.data;
        onLoginSuccess(token, user);
        resetForm();
        onClose();
      } else {
        // Register user
        await api.post("/users/register", {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          address: address.trim(),
        });

        // Automatically login the newly registered user
        const loginRes = await api.post("/users/login", {
          email: email.trim().toLowerCase(),
          password,
        });

        const { token, user } = loginRes.data;
        onLoginSuccess(token, user);
        resetForm();
        onClose();
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Operation failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="auth-header">
          <div className="auth-icon-badge">🧺</div>
          <h2 className="modal-title">{isLogin ? "Welcome Back!" : "Create an Account"}</h2>
          <p className="modal-subtitle">
            {isLogin
              ? "Sign in to manage your bookings and order history."
              : "Join Ludhiana Express for hassle-free doorstep laundry."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => handleSwitchMode(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => handleSwitchMode(false)}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}
        {successMsg && <div className="alert-box alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sahil Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Default Pickup Address</label>
                  <input
                    type="text"
                    placeholder="House/Street, Ludhiana"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (min 6 characters) *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-auth-submit" disabled={loading}>
            {loading ? (
              <span className="btn-spinner-text">
                <span className="spinner"></span> Please wait...
              </span>
            ) : isLogin ? (
              "Login to Account"
            ) : (
              "Create Account & Proceed"
            )}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {isLogin ? "Don't have an account yet?" : "Already registered?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => handleSwitchMode(!isLogin)}
          >
            {isLogin ? "Sign Up now" : "Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;

