import { useState } from "react";
import { SERVICES } from "../data/servicesData";

function ServicesSection({ cart, onUpdateQuantity, onProceedToBooking }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Everyday Laundry", "Dry Cleaning", "Pressing", "Special Care"];

  const filteredServices =
    selectedCategory === "All"
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  const cartTotal = Object.entries(cart).reduce((sum, [serviceId, qty]) => {
    const service = SERVICES.find((s) => s.id === serviceId);
    return sum + (service ? service.price * qty : 0);
  }, 0);

  const totalItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <section id="services" className="services-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">OUR SERVICES & PRICING</span>
          <h2 className="section-title">Tailored Garment Care for Every Fabric</h2>
          <p className="section-subtitle">
            Choose your services, adjust quantities, and let us handle the rest.
            Transparent pricing with no hidden charges.
          </p>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="services-grid">
          {filteredServices.map((service) => {
            const currentQty = cart[service.id] || 0;
            const itemSubtotal = currentQty * service.price;

            return (
              <div
                key={service.id}
                className={`service-card ${currentQty > 0 ? "service-card-selected" : ""}`}
              >
                <div className="service-card-top">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-turnaround">⏱ {service.turnaround}</span>
                </div>

                <h3 className="service-name">{service.name}</h3>
                <p className="service-desc">{service.description}</p>

                <div className="service-price-row">
                  <div className="service-price-col">
                    <span className="service-price-amount">₹{service.price}</span>
                    <span className="service-price-unit">/{service.unit}</span>
                  </div>

                  {currentQty > 0 && (
                    <div className="service-item-subtotal">
                      Subtotal: <strong>₹{itemSubtotal}</strong>
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="service-card-action">
                  {currentQty === 0 ? (
                    <button
                      type="button"
                      className="btn btn-add-service"
                      onClick={() => onUpdateQuantity(service.id, 1)}
                    >
                      + Add to Order
                    </button>
                  ) : (
                    <div className="quantity-control-wrapper">
                      <button
                        type="button"
                        className="qty-btn qty-decrease"
                        onClick={() => onUpdateQuantity(service.id, currentQty - 1)}
                        title="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="qty-number">{currentQty}</span>
                      <button
                        type="button"
                        className="qty-btn qty-increase"
                        onClick={() => onUpdateQuantity(service.id, currentQty + 1)}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating / Sticky Cart Summary Bar when items selected */}
        {totalItemsCount > 0 && (
          <div className="cart-summary-bar">
            <div className="cart-summary-content">
              <div className="cart-summary-info">
                <span className="cart-badge">🛒 {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected</span>
                <div className="cart-total-text">
                  Total Bill: <span className="cart-total-num">₹{cartTotal}</span>
                </div>
              </div>

              <div className="cart-summary-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-proceed"
                  onClick={onProceedToBooking}
                >
                  Confirm & Schedule Pickup →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesSection;

