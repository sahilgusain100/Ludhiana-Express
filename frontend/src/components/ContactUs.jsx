import { useState, useEffect } from "react";
import api from "../api/axios";

function ContactUs({ user, onOpenAuth, onOpenMessages }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submittedMessage, setSubmittedMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync form with authenticated user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in to send a message and track it in your Message History.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/messages", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSubmittedMessage(res.data.data);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err) {
      console.error("Message submission error:", err);
      setError(
        err.response?.data?.message ||
          "Could not send your message. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">GET IN TOUCH</span>
          <h2 className="section-title">We’re Here to Help</h2>
          <p className="section-subtitle">
            Have questions about specialized garment care or need help with a custom order? Reach out anytime!
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="contact-info-col">
            <div className="info-card">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h4>Location</h4>
                  <p>Main Market, Ludhiana, Punjab - 141001</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Phone / WhatsApp</h4>
                  <p><a href="tel:6239203782">+91 62392 03782</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:Sahilgusain100@gmail.com">Sahilgusain100@gmail.com</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <h4>Working Hours</h4>
                  <p>Monday – Saturday: 8:00 AM – 8:00 PM</p>
                  <p className="text-muted">Sunday: Closed for maintenance</p>
                </div>
              </div>

              {user && (
                <div className="info-item info-history-shortcut">
                  <span className="info-icon">📋</span>
                  <div>
                    <h4>My Inquiries</h4>
                    <p>Track your previously submitted messages and responses.</p>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={onOpenMessages}
                      style={{ marginTop: "4px" }}
                    >
                      View Message History →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h3>Send us a Message</h3>
              <p className="form-subtext">
                Your inquiry will be logged directly into our system and saved to your customer history.
              </p>

              {!user && (
                <div className="guest-login-notice">
                  <span>🔒</span>
                  <div>
                    <strong>Login Required to Send Messages</strong>
                    <p>Sign in so we can securely tie your message to your account and history.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={onOpenAuth}
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}

              {submittedMessage ? (
                <div className="contact-success-box">
                  <span className="success-icon">✓</span>
                  <h4>Message Sent Successfully!</h4>
                  <p>
                    Thank you, <strong>{submittedMessage.name}</strong>! Your inquiry regarding{" "}
                    <strong>"{submittedMessage.subject}"</strong> has been logged (Ref:{" "}
                    <code>#{submittedMessage._id?.slice(-8)}</code>).
                  </p>
                  <div className="contact-success-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={onOpenMessages}
                    >
                      💬 View in Message History
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-small"
                      onClick={() => setSubmittedMessage(null)}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  {error && <div className="form-error-banner alert-box alert-error">{error}</div>}

                  <div className="form-group">
                    <label>Inquiry Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Pricing & Package Query">Pricing & Package Query</option>
                      <option value="Pickup & Delivery Question">Pickup & Delivery Question</option>
                      <option value="Special Fabric / Garment Care">Special Fabric / Garment Care</option>
                      <option value="Order Status Update">Order Status Update</option>
                      <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sahil Sharma"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Message Content *</label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message, query, or special care instructions here..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading || !user}
                  >
                    {loading ? (
                      <span className="btn-spinner-text">
                        <span className="spinner"></span> Sending Message...
                      </span>
                    ) : (
                      "Send Message ✉️"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
