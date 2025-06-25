import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, NavDropdown, Image, Badge } from 'react-bootstrap';
import { 
  FaUserCircle, 
  FaHome, 
  FaInfoCircle, 
  FaShoppingCart,
  FaBell,
  FaStore,
  FaBolt,
  FaLightbulb,
  FaTools,
  FaSearch,
  FaPhone
} from 'react-icons/fa';
import { RiFlashlightFill } from 'react-icons/ri';
import img1 from './images/1.jpeg';
import img2 from './images/2.jpeg';
import img3 from './images/3.jpeg';
import img4 from './images/4.jpeg';
import img5 from './images/5.jpeg';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <style>{`
        /* Import Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        /* Global Styles */
        * {
          box-sizing: border-box;
        }
        
        body { 
          padding-top: 180px !important; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Top Brand Section */
        .brand-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .brand-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('../components/images/1.jpeg') center/cover;
          opacity: 0.05;
          z-index: -1;
        }

        /* Brand Name Animation */
        .animated-brand-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          font-size: clamp(2.5rem, 5vw, 4rem);
          letter-spacing: 0.15em;
          background: linear-gradient(45deg, #ffffff, #60a5fa, #fbbf24, #ffffff);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
          animation: gradientShift 4s ease-in-out infinite, gentleFloat 3s ease-in-out infinite;
          text-align: center;
          position: relative;
        }

        .animated-brand-name::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #60a5fa, #fbbf24, transparent);
          border-radius: 2px;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        /* Brand Images */
        .brand-showcase {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px 0;
          margin-top: 20px;
          overflow: hidden;
          position: relative;
        }

        .brand-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .marquee-container {
          overflow: hidden;
          width: 100%;
        }

        .marquee-track {
          display: flex;
          animation: smoothMarquee 25s linear infinite;
          gap: 2rem;
          align-items: center;
          min-width: calc(100% * 4);
        }

        @keyframes smoothMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }

        .brand-img {
          height: 60px;
          width: 60px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.9);
          padding: 4px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .brand-img:hover {
          transform: scale(1.1) rotate(2deg);
          border-color: #60a5fa;
          box-shadow: 0 8px 25px rgba(96, 165, 250, 0.4);
        }

        /* Main Navbar */
        .main-navbar {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          padding: 1rem 0 !important;
        }

        .navbar-brand {
          font-weight: 600;
          color: #1e293b !important;
          transition: color 0.3s ease;
        }

        .navbar-brand:hover {
          color: #3b82f6 !important;
        }

        /* Search Bar */
        .search-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 50px;
          overflow: hidden;
          transition: all 0.3s ease;
          min-width: 300px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .search-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #ffffff;
        }

        .search-input {
          border: none !important;
          background: transparent !important;
          padding: 12px 20px !important;
          font-size: 14px;
          color: #374151;
        }

        .search-input:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        .search-btn {
          background: #3b82f6 !important;
          border: none !important;
          padding: 12px 16px !important;
          transition: background 0.3s ease;
        }

        .search-btn:hover {
          background: #2563eb !important;
        }

        /* Navigation Links */
        .nav-link-custom {
          color: #374151 !important;
          font-weight: 500;
          padding: 8px 12px !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          display: inline-flex !important;
          align-items: center;
          white-space: nowrap;
          min-width: fit-content;
        }

        .nav-link-custom:hover {
          color: #3b82f6 !important;
          background: rgba(59, 130, 246, 0.08);
        }

        /* User Dropdown */
        .dropdown-toggle {
          display: inline-flex !important;
          align-items: center;
          white-space: nowrap;
          padding: 8px 12px !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
          background: transparent;
          color: #374151 !important;
          font-weight: 500;
        }

        .dropdown-toggle:hover {
          background: rgba(59, 130, 246, 0.08);
          color: #3b82f6 !important;
        }

        .dropdown-toggle::after {
          margin-left: 8px;
        }

        .dropdown-menu {
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          padding: 8px 0;
          margin-top: 8px;
        }

        .dropdown-item {
          padding: 10px 20px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: #f8fafc;
          color: #3b82f6;
        }

        /* Phone Button */
        .phone-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
        }

        .phone-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .phone-btn:hover::before {
          left: 100%;
        }

        .phone-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          color: white;
          text-decoration: none;
        }

        /* Sign In Button */
        .signin-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          font-size: 14px;
        }

        .signin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          color: white;
          text-decoration: none;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .animated-brand-name {
            font-size: 2rem;
            letter-spacing: 0.1em;
          }

          .search-container {
            min-width: auto;
            width: 100%;
            margin: 10px 0;
          }

          .brand-showcase {
            margin-top: 15px;
          }

          .brand-img {
            height: 50px;
            width: 50px;
          }

          .phone-btn {
            font-size: 13px;
            padding: 8px 16px;
          }
        }

        @media (max-width: 576px) {
          .animated-brand-name {
            font-size: 1.8rem;
          }
          
          body {
            padding-top: 160px !important;
          }
        }
      `}</style>

      {/* Top Brand Header */}
      <div className="brand-header position-fixed w-100 d-flex flex-column justify-content-center align-items-center" 
           style={{zIndex: 2000, minHeight: '140px', top: 0, left: 0}}>
        
        {/* Animated Brand Name */}
        <div className="animated-brand-name">
          Lalith Electricals
        </div>

        {/* Brand Showcase Images */}
        <div className="brand-showcase container-fluid">
          <div className="marquee-container">
            <div className="marquee-track">
              <img src={img1} alt="Brand 1" className="brand-img" />
              <img src={img2} alt="Brand 2" className="brand-img" />
              <img src={img3} alt="Brand 3" className="brand-img" />
              <img src={img4} alt="Brand 4" className="brand-img" />
              <img src={img5} alt="Brand 5" className="brand-img" />
              <img src={img1} alt="Brand 1" className="brand-img" />
              <img src={img2} alt="Brand 2" className="brand-img" />
              <img src={img3} alt="Brand 3" className="brand-img" />
              <img src={img4} alt="Brand 4" className="brand-img" />
              <img src={img5} alt="Brand 5" className="brand-img" />
              <img src={img1} alt="Brand 1" className="brand-img" />
              <img src={img2} alt="Brand 2" className="brand-img" />
              <img src={img3} alt="Brand 3" className="brand-img" />
              <img src={img4} alt="Brand 4" className="brand-img" />
              <img src={img5} alt="Brand 5" className="brand-img" />
              <img src={img1} alt="Brand 1" className="brand-img" />
              <img src={img2} alt="Brand 2" className="brand-img" />
              <img src={img3} alt="Brand 3" className="brand-img" />
              <img src={img4} alt="Brand 4" className="brand-img" />
              <img src={img5} alt="Brand 5" className="brand-img" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navbar expand="lg" sticky="top" className="main-navbar">
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FaStore className="text-primary me-2" size={28} />
            <span className="fs-4">Lalith Electricals</span>
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle aria-controls="navbar-nav" className="border-0 shadow-none">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="navbar-nav">
            {/* Search Bar - Desktop */}
            <div className="d-none d-lg-flex align-items-center mx-auto">
              <div className="search-container d-flex">
                <input 
                  type="text" 
                  placeholder="Search electrical products..." 
                  className="form-control search-input"
                />
                <button className="btn search-btn">
                  <FaSearch size={14} />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <Nav className="ms-auto align-items-center gap-2">
              <Nav.Link as={Link} to="/" className="nav-link-custom d-flex align-items-center">
                <FaHome className="me-1" size={16} />
                <span>Home</span>
              </Nav.Link>

              {/* Search Bar - Mobile */}
              <div className="d-lg-none w-100 my-2">
                <div className="search-container d-flex">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="form-control search-input"
                  />
                  <button className="btn search-btn">
                    <FaSearch size={14} />
                  </button>
                </div>
              </div>

              {/* User Account Section */}
              {currentUser ? (
                <NavDropdown
                  title={
                    <div className="d-inline-flex align-items-center">
                      {currentUser.profilePicture ? (
                        <Image 
                          src={currentUser.profilePicture} 
                          alt="Profile" 
                          roundedCircle 
                          width="28"
                          height="28"
                          className="me-2 border border-2 border-primary"
                        />
                      ) : (
                        <FaUserCircle className="me-2 text-primary" size={20} />
                      )}
                      <span className="fw-medium text-dark">{currentUser.username || 'Account'}</span>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <FaUserCircle className="me-2" /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/orders">
                    <FaShoppingCart className="me-2" /> My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/logout" className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/profile" className="signin-btn">
                  <FaUserCircle size={14} />
                  <span>Sign In</span>
                </Nav.Link>
              )}

              {/* Phone Button */}
              <a href="tel:0779189558" className="phone-btn">
                <FaPhone size={12} />
                <span>077-918-9558</span>
              </a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}