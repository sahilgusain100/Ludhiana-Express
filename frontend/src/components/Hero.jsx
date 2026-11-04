function Hero({ onBookClick }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-text-col">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            YOUR CLOTHES, OUR CARE • LUDHIANA
          </div>

          <h1 className="hero-heading">
            Fresh Clothes. <br />
            <span className="hero-highlight">Fresh Confidence.</span>
          </h1>

          <p className="hero-desc">
            Professional washing, gentle dry cleaning, and crisp steam pressing.
            We pick up right from your doorstep and deliver spotless freshness
            at affordable rates.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={onBookClick}
            >
              📅 Book a Pickup
            </button>
            <a href="#services" className="btn btn-outline btn-large">
              🧺 View Services & Pricing
            </a>
          </div>

          <div className="hero-perks">
            <div className="hero-perk-item">
              <span className="perk-icon">🚚</span>
              <span>Free Doorstep Pickup</span>
            </div>
            <div className="hero-perk-item">
              <span className="perk-icon">⚡</span>
              <span>24-48h Fast Turnaround</span>
            </div>
            <div className="hero-perk-item">
              <span className="perk-icon">🌿</span>
              <span>Eco-Friendly Detergents</span>
            </div>
          </div>
        </div>

        <div className="hero-image-col">
          <div className="hero-image-card">
            <img
              src="/Wm.jpg.png"
              alt="Ludhiana Express Laundry Care"
              className="hero-main-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="hero-floating-stat">
              <span className="floating-stat-num">100%</span>
              <span className="floating-stat-text">Fabric-safe Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

