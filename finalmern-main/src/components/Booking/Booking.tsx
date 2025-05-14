import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Car, MapPin, Clock, CreditCard, Calendar, Check, AlertCircle, X } from 'lucide-react';
import { format, isAfter, isBefore, addHours } from 'date-fns';
import './Booking.css';

interface BookingState {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  vehicleType: string;
  selectedSlot: string;
  userDetails: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

interface Alert {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ExtendSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: (newEndTime: string) => void;
  currentEndTime: string;
}

const ExtendSessionModal: React.FC<ExtendSessionModalProps> = ({
  isOpen,
  onClose,
  onExtend,
  currentEndTime,
}) => {
  const [newEndTime, setNewEndTime] = useState(currentEndTime);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Extend Parking Session</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label>New End Time</label>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              min={currentEndTime}
            />
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              className="btn-primary"
              onClick={() => {
                onExtend(newEndTime);
                onClose();
              }}
            >
              Extend Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [bookingData, setBookingData] = useState<BookingState>({
    location: location.state?.location || '',
    date: format(new Date(), 'MM-dd-yyyy'),
    startTime: '',
    endTime: '',
    vehicleType: 'sedan',
    selectedSlot: '',
    userDetails: {
      name: '',
      email: '',
      phone: '',
    },
    status: 'upcoming',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const parkingSlots = [
    { id: 'A1', available: true },
    { id: 'A2', available: true },
    { id: 'A3', available: false },
    { id: 'B1', available: true },
    { id: 'B2', available: true },
    { id: 'B3', available: true },
    { id: 'C1', available: false },
    { id: 'C2', available: true },
    { id: 'C3', available: true },
  ];

  useEffect(() => {
    // Check and update session status
    const checkSessionStatus = () => {
      if (bookingData.status === 'upcoming') {
        const startDateTime = new Date(`${bookingData.date}T${bookingData.startTime}`);
        const endDateTime = new Date(`${bookingData.date}T${bookingData.endTime}`);
        const now = new Date();

        if (isAfter(now, startDateTime) && isBefore(now, endDateTime)) {
          setBookingData(prev => ({ ...prev, status: 'active' }));
          showAlert('success', 'Your parking session has started!');
        } else if (isAfter(now, endDateTime)) {
          setBookingData(prev => ({ ...prev, status: 'completed' }));
          showAlert('info', 'Your parking session has ended.');
        }
      }
    };

    const interval = setInterval(checkSessionStatus, 60000); // Check every minute
    checkSessionStatus(); // Initial check

    return () => clearInterval(interval);
  }, [bookingData.date, bookingData.startTime, bookingData.endTime, bookingData.status]);

  const showAlert = (type: Alert['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const calculatePrice = () => {
    try {
      const basePrice = 2.5; // per hour
      if (!bookingData.startTime || !bookingData.endTime) return 0;
      
      const start = new Date(`2024-01-01T${bookingData.startTime}`);
      const end = new Date(`2024-01-01T${bookingData.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return basePrice * hours;
    } catch (error) {
      showAlert('error', 'Error calculating price. Please try again.');
      return 0;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNetworkError(false);
    console.log("Submitted Booking Data:", JSON.stringify(bookingData, null, 2));

    try {
      const response = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setCurrentStep(currentStep + 1);
        showAlert("success", "Booking successful!");
        // navigate("/");
      } else {
        showAlert("error", data.message || "Booking failed");
      }
  
    } catch (error) {
      console.error("API Error:", error);
      setNetworkError(true);
      showAlert("error", "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleExtendSession = (newEndTime: string) => {
    try {
      setBookingData(prev => ({ ...prev, endTime: newEndTime }));
      showAlert('success', 'Session extended successfully!');
    } catch (error) {
      showAlert('error', 'Failed to extend session. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingData(prev => ({ ...prev, status: 'cancelled' }));
      showAlert('info', 'Booking cancelled successfully.');
      navigate('/');
    } catch (error) {
      showAlert('error', 'Failed to cancel booking.Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateSlotSelection = (slotId: string) => {
    const slot = parkingSlots.find(s => s.id === slotId);
    if (!slot?.available) {
      showAlert('error', 'This slot is not available.');
      return false;
    }
    return true;
  };

  return (
    <div className="booking-page">
      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'error' && <AlertCircle size={20} />}
          {alert.type === 'success' && <Check size={20} />}
          {alert.message}
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <Car className="logo-icon" />
          <span>InstaPark</span>
        </div>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/booking" className="active">Bookings</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <main className="booking-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Select Slot</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Details</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Payment</span>
          </div>
        </div>

        {networkError && (
          <div className="error-message">
            <AlertCircle size={20} />
            Network error occurred. Please check your connection and try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="booking-section">
              <h2>Select Your Parking Slot</h2>
              
              <div className="form-group">
                <label>
                  <MapPin size={20} />
                  Location
                </label>
                <select
                  value={bookingData.location}
                  onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
                  required
                >
                  <option value="">Select location</option>
                  <option value="downtown">Downtown Parking</option>
                  <option value="mall">Shopping Mall</option>
                  <option value="airport">Airport Terminal</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Calendar size={20} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Clock size={20} />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Clock size={20} />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={bookingData.endTime}
                    onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Car size={20} />
                  Vehicle Type
                </label>
                <select
                  value={bookingData.vehicleType}
                  onChange={(e) => setBookingData({...bookingData, vehicleType: e.target.value})}
                  required
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <div className="parking-layout">
                <h3>Available Parking Slots</h3>
                <div className="slots-grid">
                  {parkingSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`slot ${!slot.available ? 'occupied' : ''} ${bookingData.selectedSlot === slot.id ? 'selected' : ''}`}
                      disabled={!slot.available}
                      onClick={() => {
                        if (validateSlotSelection(slot.id)) {
                          setBookingData({...bookingData, selectedSlot: slot.id});
                        }
                      }}
                    >
                      {slot.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="booking-section">
              <h2>Your Details</h2>
              
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={bookingData.userDetails.name}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    userDetails: {...bookingData.userDetails, name: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={bookingData.userDetails.email}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    userDetails: {...bookingData.userDetails, email: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={bookingData.userDetails.phone}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    userDetails: {...bookingData.userDetails, phone: e.target.value}
                  })}
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="booking-section">
              <h2>Payment</h2>
              
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-item">
                  <span>Location:</span>
                  <span>{bookingData.location}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{bookingData.date}</span>
                </div>
                <div className="summary-item">
                  <span>Time:</span>
                  <span>{bookingData.startTime} - {bookingData.endTime}</span>
                </div>
                <div className="summary-item">
                  <span>Slot:</span>
                  <span>{bookingData.selectedSlot}</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>${calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" value="card" defaultChecked />
                    <CreditCard size={20} />
                    <span>Credit Card</span>
                  </label>
                </div>
              </div>

              {bookingData.status === 'active' && (
                <div className="session-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsExtendModalOpen(true)}
                  >
                    Extend Session
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelBooking}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Continue'}
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </form>
      </main>

      <ExtendSessionModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        onExtend={handleExtendSession}
        currentEndTime={bookingData.endTime}
      />
    </div>
  );
};

export default Booking;