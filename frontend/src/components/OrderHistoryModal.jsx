import { useState, useEffect } from "react";
import api from "../api/axios";

function OrderHistoryModal({ isOpen, onClose, user, onBookNewOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch order history:", err);
      setErrorMsg(
        err.response?.data?.message || "Could not load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "status-placed";
      case "confirmed":
        return "status-confirmed";
      case "picked up":
        return "status-pickedup";
      case "in progress":
        return "status-inprogress";
      case "ready":
        return "status-ready";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-placed";
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card orders-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="orders-header">
          <div className="orders-title-row">
            <span className="orders-icon">📋</span>
            <div>
              <h2 className="modal-title">My Order History</h2>
              <p className="modal-subtitle">
                Logged in as <strong>{user?.name || user?.email}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-small btn-refresh"
            onClick={fetchOrders}
            disabled={loading}
            title="Refresh order history from MongoDB"
          >
            🔄 Refresh
          </button>
        </div>

        {errorMsg && (
          <div className="alert-box alert-error">
            {errorMsg}
            <button type="button" className="retry-link" onClick={fetchOrders}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="orders-loading-state">
            <span className="spinner spinner-large"></span>
            <p>Fetching your verified orders from database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-state">
            <span className="empty-icon">🧺</span>
            <h3>No Orders Placed Yet</h3>
            <p>You haven’t scheduled any laundry or dry cleaning pickups yet.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onBookNewOrder();
              }}
            >
              Book Your First Pickup
            </button>
          </div>
        ) : (
          <div className="orders-list">
            <div className="orders-count-bar">
              Showing <strong>{orders.length}</strong> {orders.length === 1 ? "order" : "orders"}
            </div>

            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const pickupDateStr = new Date(order.pickupDate).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={order._id} className="order-item-card">
                  <div className="order-card-header">
                    <div className="order-id-group">
                      <span className="order-tag">Order ID</span>
                      <strong className="order-id-text">
                        #{order._id?.slice(-8).toUpperCase()}
                      </strong>
                    </div>

                    <div className="order-status-group">
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        ● {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="order-meta-info">
                    <div className="order-meta-item">
                      <span className="meta-label">Placed On:</span>
                      <span className="meta-val">{formattedDate}</span>
                    </div>

                    <div className="order-meta-item">
                      <span className="meta-label">Pickup Schedule:</span>
                      <span className="meta-val highlight-val">
                        📅 {pickupDateStr} ({order.pickupTime})
                      </span>
                    </div>

                    <div className="order-meta-item">
                      <span className="meta-label">Pickup Address:</span>
                      <span className="meta-val">📍 {order.pickupAddress}</span>
                    </div>
                  </div>

                  {/* Itemized Services Breakdown */}
                  <div className="order-services-table">
                    <div className="table-header-row">
                      <span>Service</span>
                      <span className="text-center">Qty</span>
                      <span className="text-right">Rate</span>
                      <span className="text-right">Subtotal</span>
                    </div>

                    {order.items?.map((it, idx) => (
                      <div key={idx} className="table-data-row">
                        <span className="item-name">{it.service}</span>
                        <span className="item-qty text-center">{it.quantity}</span>
                        <span className="item-price text-right">₹{it.price}</span>
                        <span className="item-subtotal text-right">
                          ₹{it.price * it.quantity}
                        </span>
                      </div>
                    ))}

                    <div className="table-total-row">
                      <span>Total Amount:</span>
                      <span className="table-total-num">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryModal;

