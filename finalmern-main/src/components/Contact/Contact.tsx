import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Clock, MapPin, Car, Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './ContactUs.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Failed to submit the form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Fixed Navigation */}
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <Car className="logo-icon" />
          <span>InstaPark</span>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/booking" className="nav-link">Bookings</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link active">Contact</a>
          <a href="/login" className="nav-link active">Login</a>
        </nav>
      </header>

      {/* Alert Messages */}
      {submitStatus === 'error' && (
        <div className="alert error">
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}

      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact InstaPark</h1>
          <p>Have questions about parking? We're here to assist you 24/7!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="info-item">
              <Mail className="info-icon" />
              <div className="info-text">
                <span className="label">Email</span>
                <span>support@instapark.com</span>
              </div>
            </div>
            <div className="info-item">
              <Phone className="info-icon" />
              <div className="info-text">
                <span className="label">Phone</span>
                <span>+91 88888 11111</span>
              </div>
            </div>
            <div className="info-item">
              <Clock className="info-icon" />
              <div className="info-text">
                <span className="label">Hours</span>
                <div className="hours">
                  <span>Mon–Fri: 9am–6pm</span>
                  <span>Sat–Sun: 10am–4pm EST</span>
                </div>
              </div>
            </div>
            <div className="info-item">
              <MapPin className="info-icon" />
              <div className="info-text">
                <span className="label">Address</span>
                <span>New Delhi</span>
              </div>
            </div>
          </div>

          <div className="form-container">
            {submitStatus === 'success' ? (
              <div className="success-message">
                <CheckCircle size={48} className="success-icon" />
                <h3>Thank you!</h3>
                <p>We've received your message and will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name*"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email*"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message*"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="spinner" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="send-icon" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;