import { useState } from "react";
import api from "./api/axios";

function Booking({ user, onClose }) {
  const [service, setService] = useState("Wash and Fold");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(user.address || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const prices = {
    "Wash and Fold": 150,
    Ironing: 100,
    "Dry Cleaning": 200,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/orders",
        {
          items: [
            {
              service,
              quantity: Number(quantity),
              price: prices[service],
            },
          ],
          pickupAddress: address,
          pickupDate: date,
          pickupTime: time,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Order placed successfully!");
      setTimeout(() => onClose(), 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <button type="button" className="auth-close" onClick={onClose}>
          ✕
        </button>

        <h2>Book a Pickup</h2>

        <form onSubmit={handleSubmit}>
          <label>Laundry Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="Wash and Fold">Wash & Fold — ₹150</option>
            <option value="Ironing">Ironing — ₹100</option>
            <option value="Dry Cleaning">Dry Cleaning — ₹200</option>
          </select>

          <label>Quantity</label>
          <input
            type="number"
            min="1"
            max="50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <label>Pickup Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your pickup address"
            required
          />

          <label>Pickup Date</label>
          <input
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Pickup Time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option>10:00 AM</option>
            <option>12:00 PM</option>
            <option>2:00 PM</option>
            <option>4:00 PM</option>
          </select>

          <h3>Total: ₹{prices[service] * Number(quantity)}</h3>

          <button type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Confirm Booking"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Booking;