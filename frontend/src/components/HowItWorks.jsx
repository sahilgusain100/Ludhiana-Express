function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: "📦",
      title: "Schedule Pickup",
      desc: "Select your required services, choose a pickup date & time slot, and tell us your Ludhiana address.",
    },
    {
      step: "02",
      icon: "🧺",
      title: "Gentle Washing & Care",
      desc: "Our garment specialists sort clothes by fabric and color, applying eco-friendly detergents and expert stain treatment.",
    },
    {
      step: "03",
      icon: "✨",
      title: "Steam Press & Check",
      desc: "Clothes receive crisp steam pressing followed by an individual quality inspection for missing buttons and neat finishing.",
    },
    {
      step: "04",
      icon: "🚚",
      title: "Doorstep Delivery",
      desc: "Fresh, hygienically packed clothes are promptly delivered back to your home, ready to wear.",
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-tag">SIMPLE & HASSLE-FREE</span>
          <h2 className="section-title">How Ludhiana Express Works</h2>
          <p className="section-subtitle">
            From your laundry basket to crisp, freshly pressed clothes in 4 simple steps.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((item, idx) => (
            <div key={idx} className="step-card">
              <div className="step-badge">{item.step}</div>
              <div className="step-icon">{item.icon}</div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;

