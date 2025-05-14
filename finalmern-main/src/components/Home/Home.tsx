import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  MapPin,
  Car,
  Facebook,
  Twitter,
  Instagram,
  Linkedin as LinkedIn,
} from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    setIsLoggedIn(!!userToken);
  }, []);

  const handleSearch = () => {
    const locationInput = document.querySelector('input[placeholder="Enter location"]') as HTMLInputElement;
    const location = locationInput?.value || '';
    navigate('/booking', {
      state: { location },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <Car className="logo-icon" />
          <span>InstaPark</span>
        </div>
        <nav className="nav">
          <a href="#home" className="active">Home</a>
          <a href="/booking">Bookings</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          {!isLoggedIn ? (
            <a href="/login">Login</a>
          ) : (
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Parking Spot</h1>
          <p>Book secure parking spaces in advance, save time and money</p>

          <div className="search-box">
            <div className="search-input">
              <MapPin size={20} />
              <input type="text" placeholder="Enter location" />
            </div>
            <div className="search-input">
              <Clock size={20} />
              <input type="datetime-local" />
            </div>
            <button className="btn-primary" onClick={handleSearch}>
              Find Parking
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <Search size={24} />
            </div>
            <h3>Search</h3>
            <p>Find parking spots near your destination</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Clock size={24} />
            </div>
            <h3>Book</h3>
            <p>Reserve your spot in advance</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Car size={24} />
            </div>
            <h3>Park</h3>
            <p>Follow directions and park with ease</p>
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="featured-locations">
        <h2>Featured Parking Locations</h2>
        <div className="locations-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="location-card">
              <img
                src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8lyodtnfKwGItVxB2GsEyGAYn1vVEHLMchA&s=${i}`}
                alt={`Featured parking location ${i}`}
              />
              <div className="location-info">
                <h3>City Center Parking {i}</h3>
                <p>
                  <MapPin size={16} /> Downtown Area
                </p>
                <div className="availability">
                  <span className="available">12 spots available</span>
                  <span className="price">₹10/hr</span>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/booking')}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          {[
            {
              name: 'Sarah Johnson',
              role: 'Regular User',
              text: 'InstaPark made finding parking so much easier! No more circling blocks looking for spots.',
              image: 'https://media.istockphoto.com/id/1466995518/photo/business-woman-and-worker-portrait-at-office-desk-as-administration-executive-company-manager.jpg?s=612x612&w=0&k=20&c=NvKeG6Fh0_VVfH_N0Ka-5j8284XJhL2VTJfe6IwDkWQ=',
            },
            {
              name: 'Michael Chen',
              role: 'Business Traveler',
              text: 'The convenience of booking parking in advance has saved me countless hours.',
              image: 'https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww',
            },
            {
              name: 'Emily Davis',
              role: 'City Resident',
              text: 'Great prices and even better service. I use InstaPark for all my parking needs now.',
              image: 'https://source.unsplash.com/200x200/?portrait,woman&sig=3',
            },
          ].map((testimonial, i) => (
            <div key={i} className="testimonial-card">
              <img src={testimonial.image} alt={testimonial.name} />
              <div className="testimonial-content">
                <p>"{testimonial.text}"</p>
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Car className="logo-icon" />
              <span>InstaPark</span>
            </div>
            <p>Making parking easier, faster, and more convenient for everyone.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="/booking">Bookings</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li>1234 Parking Avenue</li>
              <li>City, State 12345</li>
              <li>contact@instapark.com</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="LinkedIn"><LinkedIn size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 InstaPark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
