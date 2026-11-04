function Footer({ onOpenBooking, onOpenServices }) {
  return (
    <footer className="footer-main">
      <div className="section-container">
        <div className="footer-top-grid">
          <div className="footer-col-brand">
            <div className="footer-brand-title">
              <span className="footer-brand-icon">🧺</span> Ludhiana Express
            </div>
            <p className="footer-brand-tagline">
              Premium Laundry & Dry Cleaning Services Delivered to Your Doorstep.
              Fresh clothes, fresh confidence, every single time.
            </p>
            <div className="footer-location-chip">
              📍 Serving Ludhiana, Punjab & Nearby Areas
            </div>
          </div>

          <div className="footer-col-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services & Pricing</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>

          <div className="footer-col-services">
            <h4>Popular Services</h4>
            <ul>
              <li><span>🧺 Wash & Fold (up to 5kg)</span></li>
              <li><span>👔 Steam Ironing & Press</span></li>
              <li><span>✨ Formal & Suit Dry Cleaning</span></li>
              <li><span>👗 Wedding Dress Preservation</span></li>
              <li><span>🧥 Leather & Suede Care</span></li>
            </ul>
          </div>

          <div className="footer-col-contact">
            <h4>Contact Details</h4>
            <p><strong>Address:</strong> Main Market, Ludhiana, Punjab</p>
            <p><strong>Phone:</strong> +91 62392 03782</p>
            <p><strong>Email:</strong> Sahilgusain100@gmail.com</p>
            <p><strong>Hours:</strong> Mon - Sat: 8:00 AM - 8:00 PM</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Ludhiana Express. All Rights Reserved.</p>
          <p className="footer-subtext">Crafted with care for Ludhiana's fabric lovers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

