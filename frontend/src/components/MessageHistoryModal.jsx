import { useState, useEffect } from "react";
import api from "../api/axios";

function MessageHistoryModal({ isOpen, onClose, user, onOpenContact }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchMessages = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.get("/messages/my-messages");
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to fetch message history:", err);
      setErrorMsg(
        err.response?.data?.message || "Could not load message history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedMessage(null);
      fetchMessages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredMessages =
    statusFilter === "All"
      ? messages
      : messages.filter((m) => m.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="status-badge status-msg-pending">⏳ Pending</span>;
      case "Reviewed":
        return <span className="status-badge status-msg-reviewed">👀 Reviewed</span>;
      case "Resolved":
        return <span className="status-badge status-msg-resolved">✓ Resolved</span>;
      default:
        return <span className="status-badge status-msg-pending">{status || "Pending"}</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card messages-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {selectedMessage ? (
          /* PHASE 4: MESSAGE DETAILS VIEW */
          <div className="message-details-view">
            <button
              type="button"
              className="btn btn-outline btn-small btn-back-messages"
              onClick={() => setSelectedMessage(null)}
            >
              ← Back to Message History
            </button>

            <div className="message-detail-header">
              <div className="message-detail-title-col">
                <span className="message-detail-tag">Message Details</span>
                <h2 className="modal-title">{selectedMessage.subject || "General Inquiry"}</h2>
              </div>
              <div className="message-detail-status">
                {getStatusBadge(selectedMessage.status)}
              </div>
            </div>

            <div className="message-detail-meta-box">
              <div className="detail-meta-item">
                <span className="meta-label">Sent Date:</span>
                <span className="meta-val">
                  📅 {new Date(selectedMessage.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="detail-meta-item">
                <span className="meta-label">From:</span>
                <span className="meta-val">
                  👤 {selectedMessage.name} ({selectedMessage.email})
                </span>
              </div>

              <div className="detail-meta-item">
                <span className="meta-label">Message ID:</span>
                <span className="meta-val monospace-val">
                  #{selectedMessage._id}
                </span>
              </div>
            </div>

            <div className="message-detail-body">
              <h4>Your Message:</h4>
              <div className="message-text-bubble">
                {selectedMessage.message}
              </div>
            </div>

            <div className="message-status-card">
              <div className="status-card-icon">
                {selectedMessage.status === "Resolved"
                  ? "✅"
                  : selectedMessage.status === "Reviewed"
                  ? "🔍"
                  : "🕒"}
              </div>
              <div className="status-card-text">
                <h5>Status: {selectedMessage.status}</h5>
                <p>
                  {selectedMessage.status === "Resolved"
                    ? "This query has been marked as resolved by our customer care team."
                    : selectedMessage.status === "Reviewed"
                    ? "Our staff in Ludhiana has reviewed your inquiry and is processing your request."
                    : "Your message has been safely received in our queue. A representative will contact you via email or phone."}
                </p>
              </div>
            </div>

            <div className="message-detail-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedMessage(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        ) : (
          /* PHASE 3: MESSAGE HISTORY LIST VIEW */
          <>
            <div className="messages-header">
              <div className="messages-title-row">
                <span className="messages-icon">💬</span>
                <div>
                  <h2 className="modal-title">My Message History</h2>
                  <p className="modal-subtitle">
                    Inquiries & messages sent by <strong>{user?.name || user?.email}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-small btn-refresh"
                onClick={fetchMessages}
                disabled={loading}
                title="Refresh messages from MongoDB"
              >
                🔄 Refresh
              </button>
            </div>

            {errorMsg && (
              <div className="alert-box alert-error">
                {errorMsg}
                <button type="button" className="retry-link" onClick={fetchMessages}>
                  Retry
                </button>
              </div>
            )}

            {/* Status Filter Tabs */}
            <div className="msg-filter-tabs">
              {["All", "Pending", "Reviewed", "Resolved"].map((tab) => {
                const count =
                  tab === "All"
                    ? messages.length
                    : messages.filter((m) => m.status === tab).length;
                return (
                  <button
                    key={tab}
                    type="button"
                    className={`msg-filter-tab ${statusFilter === tab ? "active" : ""}`}
                    onClick={() => setStatusFilter(tab)}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="orders-loading-state">
                <span className="spinner spinner-large"></span>
                <p>Fetching your verified messages from database...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="orders-empty-state">
                <span className="empty-icon">✉️</span>
                <h3>No Messages Found</h3>
                <p>
                  {statusFilter === "All"
                    ? "You haven’t sent any messages or inquiries yet."
                    : `No messages currently with status "${statusFilter}".`}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                >
                  Send a New Message
                </button>
              </div>
            ) : (
              <div className="messages-list">
                {filteredMessages.map((msg) => {
                  const sentDate = new Date(msg.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg._id}
                      className="message-card"
                      onClick={() => setSelectedMessage(msg)}
                      title="Click to view full message details"
                    >
                      <div className="message-card-header">
                        <div className="message-subject-group">
                          <h4 className="message-subject">{msg.subject || "General Inquiry"}</h4>
                          <span className="message-date">📅 {sentDate}</span>
                        </div>
                        <div className="message-status-badge-wrap">
                          {getStatusBadge(msg.status)}
                        </div>
                      </div>

                      <p className="message-snippet">
                        {msg.message.length > 130
                          ? `${msg.message.slice(0, 130)}...`
                          : msg.message}
                      </p>

                      <div className="message-card-footer">
                        <span className="message-id-tag">ID: #{msg._id?.slice(-8)}</span>
                        <span className="message-view-btn">View Details →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MessageHistoryModal;

