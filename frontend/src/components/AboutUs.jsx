function AboutUs() {
  const promises = [
    {
      icon: "🫧",
      title: "Quality Fabric Care",
      desc: "Every garment is cleaned using commercial-grade, fabric-safe solutions that preserve fibers, color brightness, and texture.",
    },
    {
      icon: "⏰",
      title: "Punctual Delivery",
      desc: "We strictly honor pickup and delivery slots so you never have to wait around for your laundry.",
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      desc: "Clear per-piece and per-load prices with zero hidden charges. What you see is what you pay.",
    },
  ];

  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">ABOUT LUDHIANA EXPRESS</span>
          <h2 className="section-title">Committed to Quality, Care & Convenience</h2>
          <p className="section-subtitle">
            Born and raised in Ludhiana, bringing modern garment care to busy households and professionals.
          </p>
        </div>

        <div className="about-content-row">
          <div className="about-image-box">
            <img
              src="/laundry.jpg"
              alt="Ludhiana Express Laundry Service"
              className="about-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="about-text-box">
            <h3 className="about-subtitle">Who We Are</h3>
            <p>
              <strong>Ludhiana Express</strong> is a dedicated laundry and dry-cleaning service
              built to take the chore out of everyday life. We combine cutting-edge laundry
              machinery with traditional attention to detail, handling everyday apparel, fine
              silks, festive wear, and home linen.
            </p>
            <p>
              Whether it’s regular wash & fold for your family or emergency stain removal for your
              favorite formal wear, we treat every single piece of clothing with absolute respect.
            </p>
          </div>
        </div>

        <div className="about-content-row about-reverse">
          <div className="about-text-box">
            <h3 className="about-subtitle">Our Journey & Standards</h3>
            <p>
              Starting as a small neighborhood service in Ludhiana, our passion for high hygiene
              standards, punctual turnarounds, and honest customer service enabled us to expand
              into a premier doorstep laundry solution.
            </p>
            <p>
              Today, hundreds of households and professionals across Ludhiana trust us week after
              week for spotless clothes and unmatched peace of mind.
            </p>
          </div>
          <div className="about-image-box">
            <img
              src="/story.jpg"
              alt="Our Story and Growth"
              className="about-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Customer Promise Cards */}
        <div className="promise-section">
          <h3 className="promise-heading">Our Customer Promise</h3>
          <div className="promise-grid">
            {promises.map((p, idx) => (
              <div key={idx} className="promise-card">
                <span className="promise-icon">{p.icon}</span>
                <h4 className="promise-title">{p.title}</h4>
                <p className="promise-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;

