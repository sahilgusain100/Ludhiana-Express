import { useState, useEffect } from "react";
import api from "../api/axios";
import { SERVICES } from "../data/servicesData";

function BookingModal({ isOpen, onClose, user, cart, onUpdateCart, onClearCart, onOpenOrders }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM - 12:00 PM");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (!isOpen) {
      setConfirmedOrder(null);
      setErrorMsg("");
      return;
    }

    setAddress(user?.address || "");

    // Set default pickup date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);

    // Populate selectedItems from cart, or default to Wash and Fold if empty
    const itemsFromCart = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([serviceId, qty]) => {
        const s = SERVICES.find((srv) => srv.id === serviceId);
        return {
          id: serviceId,
          service: s ? s.name : serviceId,
          quantity: qty,
          price: s ? s.price : 150,
        };
      });

    if (itemsFromCart.length > 0) {
      setSelectedItems(itemsFromCart);
    } else {
      // Default to Wash & Fold
      setSelectedItems([
        {
          id: "wash-and-fold",
          service: "Wash and Fold",
          quantity: 1,
          price: 150,
        },
      ]);
    }
  }, [isOpen, cart, user]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleQuantityChange = (serviceId, newQty) => {
    if (newQty < 1) {
      // Remove item
      setSelectedItems((prev) => prev.filter((item) => item.id !== serviceId));
      onUpdateCart(serviceId, 0);
    } else {
      setSelectedItems((prev) =>
        prev.map((item) => (item.id === serviceId ? { ...item, quantity: newQty } : item))
      );
      onUpdateCart(serviceId, newQty);
    }
  };

  const handleAddService = (serviceId) => {
    const service = SERVICES.find((s) => s.id === serviceId);
    if (!service) return;

    const existing = selectedItems.find((item) => item.id === serviceId);
    if (existing) {
      handleQuantityChange(serviceId, existing.quantity + 1);
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          id: service.id,
          service: service.name,
          quantity: 1,
          price: service.price,
        },
      ]);
      onUpdateCart(service.id, 1);
    }
  };

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (selectedItems.length === 0) {
      setErrorMsg("Please select at least one laundry service.");
      return;
    }

    if (!address.trim()) {
      setErrorMsg("Please provide your complete pickup address.");
      return;
    }

    if (!date) {
      setErrorMsg("Please select a pickup date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: selectedItems.map((item) => ({
          service: item.service,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
        pickupAddress: address.trim(),
        pickupDate: date,
        pickupTime: time,
      };

      const res = await api.post("/orders", payload);

      if (res.data && res.data.order) {
        setConfirmedOrder(res.data.order);
        onClearCart();
      } else {
        setErrorMsg("Order received, but confirmation details were missing.");
      }
    } catch (error) {
      console.error("Order submission failed:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Could not place order. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card booking-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="order-confirmation-view">
            <div className="confirmation-badge-icon">🎉</div>
            <h2 className="confirmation-title">Order Placed Successfully!</h2>
            <p className="confirmation-subtitle">
              Thank you, <strong>{user?.name || "Customer"}</strong>! Your pickup has been booked in our system.
            </p>

            <div className="confirmation-details-card">
              <div className="conf-detail-row">
                <span className="conf-label">Order Reference ID:</span>
                <span className="conf-value conf-id">#{confirmedOrder._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="conf-detail-row">
                <span className="conf-label">Scheduled Pickup:</span>
                <span className="conf-value">
                  📅 {new Date(confirmedOrder.pickupDate).toLocaleDateString()} at {confirmedOrder.pickupTime}
                </span>
              </div>
              <div className="conf-detail-row">
                <span className="conf-label">Pickup Address:</span>
                <span className="conf-value">{confirmedOrder.pickupAddress}</span>
              </div>
              <div className="conf-detail-row">
                <span className="conf-label">Initial Status:</span>
                <span className="status-badge status-placed">{confirmedOrder.status}</span>
              </div>

              <div className="conf-items-list">
                <h4>Booked Items:</h4>
                {confirmedOrder.items?.map((item, idx) => (
                  <div key={idx} className="conf-item-row">
                    <span>{item.service} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="conf-item-row conf-total-row">
                  <strong>Total Bill:</strong>
                  <strong>₹{confirmedOrder.totalAmount}</strong>
                </div>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onOpenOrders();
                }}
              >
                📋 View in My Orders
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form View */
          <>
            <div className="booking-modal-header">
              <span className="header-icon">📅</span>
              <div>
                <h2 className="modal-title">Schedule a Laundry Pickup</h2>
                <p className="modal-subtitle">Review your selected services and choose a pickup slot.</p>
              </div>
            </div>

            {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

            <form onSubmit={handleSubmit} className="booking-form">
              {/* Selected Services Section */}
              <div className="booking-section-box">
                <div className="booking-section-title-row">
                  <h4>1. Selected Laundry Services</h4>
                  <div className="add-service-quick-dropdown">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddService(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Add another service...
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedItems.length === 0 ? (
                  <p className="empty-items-warning">
                    No services selected yet. Choose a service from the dropdown above.
                  </p>
                ) : (
                  <div className="booking-items-table">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="booking-item-row">
                        <div className="booking-item-name">
                          <strong>{item.service}</strong>
                          <span className="unit-price">@ ₹{item.price} each</span>
                        </div>

                        <div className="booking-item-qty-controls">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            –
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="booking-item-subtotal">
                          ₹{item.quantity * item.price}
                        </div>

                        <button
                          type="button"
                          className="booking-item-remove"
                          onClick={() => handleQuantityChange(item.id, 0)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pickup Information Section */}
              <div className="booking-section-box">
                <h4>2. Pickup Schedule & Location</h4>

                <div className="form-group">
                  <label>Pickup Address in Ludhiana *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street, house number, area / landmark"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Date *</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pickup Time Slot *</label>
                    <select value={time} onChange={(e) => setTime(e.target.value)}>
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM (Morning)</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Noon)</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon)</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening)</option>
                      <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM (Night)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Instructions (Optional)</label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Ring bell, separate silks, call on arrival"
                  />
                </div>
              </div>

              {/* Order Bill Summary */}
              <div className="booking-bill-card">
                <div className="bill-row">
                  <span>Services Subtotal:</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="bill-row">
                  <span>Doorstep Pickup & Delivery:</span>
                  <span className="free-badge">FREE</span>
                </div>
                <hr className="bill-divider" />
                <div className="bill-row bill-grand-total">
                  <span>Grand Total:</span>
                  <span className="total-price">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-place-order"
                disabled={loading || selectedItems.length === 0}
              >
                {loading ? (
                  <span className="btn-spinner-text">
                    <span className="spinner"></span> Confirming with Ludhiana Express...
                  </span>
                ) : (
                  `Confirm Booking (₹${totalAmount})`
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;

