import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Users, Target, Shield, Award, MapPin } from 'lucide-react';
import './About.css';
import vineetImg from '../images/vineet.jpeg'; 
import AartibhImg from '../images/Aartibh.jpeg'; 
import vanshikaImg from '../images/vanshika.jpeg'; 
const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <Car className="logo-icon" />
          <span>InstaPark</span>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/booking" className="nav-link">Bookings</a>
          <a href="/about" className="nav-link active">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <a href="/login" className="nav-link">Login</a>
        
        </nav>
      </header>

      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <Car className="hero-icon" />
            <h1>About InstaPark</h1>
            <p>Revolutionizing Urban Parking Since 2020</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At InstaPark, we're dedicated to transforming the urban parking experience. 
              Our mission is to eliminate parking stress by providing real-time availability, 
              seamless bookings, and smart navigation to help drivers find the perfect spot.
            </p>
          </div>
          <div className="mission-image"></div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Parking Spots</p>
            </div>
            <div className="stat-item">
              <h3>25+</h3>
              <p>Cities Covered</p>
            </div>
            <div className="stat-item">
              <h3>100,000+</h3>
              <p>Happy Users</p>
            </div>
            <div className="stat-item">
              <h3>99%</h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <Target className="value-icon" />
              <h3>Innovation</h3>
              <p>Continuously improving our technology to provide the best parking solutions</p>
            </div>
            <div className="value-card">
              <Shield className="value-icon" />
              <h3>Security</h3>
              <p>Ensuring safe and secure parking spaces for all our users</p>
            </div>
            <div className="value-card">
              <Users className="value-icon" />
              <h3>Community</h3>
              <p>Building better cities through smart parking solutions</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Leadership Team</h2>
          <div className="team-grid">
            {[
              {
                name: 'Vineet Tiwari',
                role: 'CEO & Founder',
                image: vineetImg, 
                bio: 'Former urban planning expert with 15 years of experience in smart city solutions.'
              },
              {
                name: 'Aartibh',
                role: 'Chief Technology Officer',
                image: AartibhImg,
                bio: 'Tech innovator with extensive experience in IoT and smart parking systems.'
              },
              {
                name: 'Vanshika',
                role: 'Operations Director',
                image: vanshikaImg,
                bio: 'Specialized in scaling operations across multiple cities and regions.'
              }
            ].map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <span className="role">{member.role}</span>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Locations Section */}
        <section className="locations-section">
          <h2>Where We Operate</h2>
          <div className="locations-content">
            <div className="locations-text">
              <h3>Growing Nationwide</h3>
              <p>
                Currently operating in 25+ major cities across the country, 
                with plans to expand to 50+ cities by the end of 2024.
              </p>
              <ul className="cities-list">
                {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'].map((city, index) => (
                  <li key={index}>
                    <MapPin size={16} />
                    {city}
                  </li>
                ))}
              </ul>
            </div>
            <div className="locations-map"></div>
          </div>
        </section>

        {/* Awards Section */}
        <section className="awards-section">
          <h2>Recognition & Awards</h2>
          <div className="awards-grid">
            {[
              'Best Smart Parking Solution 2025',
              'Urban Innovation Award 2025',
              'Customer Excellence Award 2025',
              'Smart City Initiative Winner 5'
            ].map((award, index) => (
              <div key={index} className="award-card">
                <Award className="award-icon" />
                <p>{award}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
