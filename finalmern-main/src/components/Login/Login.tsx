import React, { useState, ChangeEvent, FormEvent } from "react";
import { Car, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

// Mock Google Login Button
const GoogleLogin = ({ onSuccess, onError }: { 
  onSuccess: (response: { credential: string }) => void, 
  onError: () => void 
}) => (
  <button 
    onClick={() => onSuccess({ credential: "mock-token" })} 
    className="google-btn"
  >
    <div className="google-icon-wrapper">
      <img 
        className="google-icon" 
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
        alt="Google logo" 
      />
    </div>
    <p className="btn-text">Sign in with Google</p>
  </button>
);

interface FormData {
  username: string;
  email: string;
  password: string;
}

function Login(): JSX.Element {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "" });
  const [loginData, setLoginData] = useState<{ username: string; password: string }>({ username: "", password: "" });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, isLoginForm = false): void => {
    const { name, value } = e.target;
    if (isLoginForm) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        alert("Registration successful!");
        setIsLogin(true);
      } else {
        alert("Registration failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Login failed: " + (data.message || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSuccess = (response: { credential: string }): void => {
    try {
      const decodedToken = jwtDecode<FormData>(response.credential);
      console.log("Google User:", decodedToken);
      alert(`Welcome, ${decodedToken.username}!`);
    } catch (error) {
      console.error("Failed to decode Google token:", error);
      alert("Google Login failed due to token error.");
    }
  };
  
  const handleGoogleFailure = (): void => {
    console.log("Google Login Failed!");
    alert("Google Login Failed. Try again.");
  };

  return (
    <>
      <header className="header">
        <div className="logo-section">
          <Car size={28} />
          <h1>InstaPark</h1>
        </div>
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/booking" className="nav-link">Bookings</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <a href="/login" className="nav-link active">Login</a>
        </nav>
      </header>

      <div className="login-container">
        <div className="login-branding">
          <div className="logo">
            <Car size={32} />
            <h1>InstaPark</h1>
          </div>
          <div className="tagline">
            <h2>Smart Parking Solution</h2>
            <p>Find and reserve parking spots with ease</p>
          </div>
        </div>

        <div className="login-form-container">
          <div className={`form-toggle ${isLogin ? 'login-active' : 'register-active'}`}>
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <div className="form-wrapper">
            {isLogin ? (
              <form onSubmit={handleLogin} className="login-form">
                <h2>Welcome Back</h2>
                <p>Please login to continue</p>

                <div className="input-group">
                  <User size={20} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                </div>

                <div className="input-group">
                  <Lock size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => handleChange(e, true)}
                    required
                  />
                </div>

                <div className="remember-forgot">
                  <label>
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#forgot">Forgot Password?</a>
                </div>

                <button type="submit" className="submit-btn">Login</button>

                <div className="divider">
                  <span>OR</span>
                </div>

                <div className="social-login">
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess} 
                    onError={handleGoogleFailure} 
                  />
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="register-form">
                <h2>Create Account</h2>
                <p>Register to start finding parking spots</p>

                <div className="input-group">
                  <User size={20} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Mail size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <Lock size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="terms">
                  <label>
                    <input type="checkbox" required /> I agree to the 
                    <a href="#terms"> Terms & Conditions</a>
                  </label>
                </div>

                <button type="submit" className="submit-btn">Register</button>

                <div className="divider">
                  <span>OR</span>
                </div>

                <div className="social-login">
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess} 
                    onError={handleGoogleFailure} 
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
