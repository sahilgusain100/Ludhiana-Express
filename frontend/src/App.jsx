import { useState, useEffect } from "react";
import api from "./api/axios";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Achievements from "./components/Achievements";
import ServicesSection from "./components/ServicesSection";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import BookingModal from "./components/BookingModal";
import OrderHistoryModal from "./components/OrderHistoryModal";
import MessageHistoryModal from "./components/MessageHistoryModal";
import ProfileModal from "./components/ProfileModal";
import "./App.css";

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Theme state: "light" or "dark" with persistent storage & system preference fallback
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("le_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  // Apply theme to HTML root element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("le_theme", theme);
    } catch (e) {
      console.warn("Could not save theme to localStorage:", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // User state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Cart state: { [serviceId]: quantity }
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("temporaryCart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch {
      return {};
    }
  });

  // Verify stored token on mount with the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/users/me")
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Token is expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    }

    const handleAuthExpired = () => {
      setUser(null);
      setShowOrders(false);
      setShowMessages(false);
      setShowBooking(false);
      setShowProfile(false);
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, []);

  // Sync temporary cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("temporaryCart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart:", e);
    }
  }, [cart]);

  const handleUpdateQuantity = (serviceId, qty) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[serviceId];
      } else {
        updated[serviceId] = qty;
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart({});
    localStorage.removeItem("temporaryCart");
  };

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowOrders(false);
    setShowMessages(false);
    setShowBooking(false);
    setShowProfile(false);
  };

  const handleOpenBooking = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowBooking(true);
    }
  };

  const handleOpenOrders = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowOrders(true);
    }
  };

  const handleOpenMessages = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowMessages(true);
    }
  };

  const handleOpenProfile = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowProfile(true);
    }
  };

  const totalCartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  return (
    <div className={`app-layout theme-${theme}`}>
      {/* Navigation Bar with Theme Toggle & Messages */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        cartCount={totalCartCount}
        onOpenAuth={() => setShowAuth(true)}
        onOpenBooking={handleOpenBooking}
        onOpenOrders={handleOpenOrders}
        onOpenMessages={handleOpenMessages}
        onOpenProfile={handleOpenProfile}
        onLogout={handleLogout}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onBookClick={handleOpenBooking} />

        <Achievements />

        <ServicesSection
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onProceedToBooking={handleOpenBooking}
        />

        <HowItWorks />

        <AboutUs />

        <ContactUs
          user={user}
          onOpenAuth={() => setShowAuth(true)}
          onOpenMessages={handleOpenMessages}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenServices={() => {
          const el = document.getElementById("services");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        user={user}
        cart={cart}
        onUpdateCart={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOpenOrders={() => setShowOrders(true)}
      />

      <OrderHistoryModal
        isOpen={showOrders}
        onClose={() => setShowOrders(false)}
        user={user}
        onBookNewOrder={handleOpenBooking}
      />

      <MessageHistoryModal
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
        user={user}
        onOpenContact={() => {
          const el = document.getElementById("contact");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onOpenOrders={() => setShowOrders(true)}
        onOpenMessages={handleOpenMessages}
        onOpenBooking={() => setShowBooking(true)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
