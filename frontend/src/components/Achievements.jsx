function Achievements() {
  const stats = [
    { number: "15+", label: "Laundry & Care Services", icon: "🧺" },
    { number: "240+", label: "Happy Regular Customers", icon: "⭐" },
    { number: "2+ Yrs", label: "Years in Ludhiana", icon: "🏆" },
    { number: "99.4%", label: "On-Time Doorstep Delivery", icon: "🚚" },
  ];

  return (
    <section className="achievements-section">
      <div className="section-container">
        <div className="achievements-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="achievement-card">
              <span className="achievement-icon">{stat.icon}</span>
              <h3 className="achievement-number">{stat.number}</h3>
              <p className="achievement-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Achievements;

