import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { signout } from '../redux/User/userSlice';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { 
  FaUserCircle, 
  FaHome, 
  FaShoppingCart,
  FaMapMarkerAlt,
  FaSearch,
  FaPhone,
  FaFacebook
} from 'react-icons/fa';

// List of available images for the slideshow
const SLIDESHOW_IMAGES = [
  require('./images/1.jpeg'),
  require('./images/2.jpeg'),
  require('./images/3.jpeg'),
  require('./images/4.jpeg'),
  require('./images/5.jpeg')
];

// Re-import images for static use (like logo, owner img)
import lalithWorkplace from './images/BackgroundImages/lalith1.jpeg';
import logo from './images/BackgroundImages/logo.jpeg';
import ownerImg from './images/owner.jpeg';


export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [showOwner, setShowOwner] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = useRef(null);

  // --- NEW SLIDESHOW LOGIC ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Cycles the image index every 5 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % SLIDESHOW_IMAGES.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);
  // ---------------------------

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signout());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
      } else {
        navigate('/');
      }
    }, 300); // 300ms delay
  };

  const handleClearSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setSearchQuery('');
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        /* Import Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        
        /* Global Styles */
        * {
          box-sizing: border-box;
        }

        /* --- 1. Top Brand Section (Fixed Header) --- */
        .brand-header {
          /* Clean, dark, semi-transparent background for high contrast */
          background: rgba(15, 23, 42, 0.95); 
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          min-height: 230px !important; /* Increased height for slideshow */
          padding-top: 10px;
        }

        /* Animated Brand Name - Simpler, high-impact glow effect */
        .animated-brand-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 800; 
          font-size: clamp(2rem, 5vw, 4rem);
          letter-spacing: 0.1em;
          color: #ffffff; 
          text-shadow: 0 0 8px #60a5fa, 0 0 15px rgba(96, 165, 250, 0.5); 
          animation: gentleFloat 3s ease-in-out infinite;
          text-align: center;
          position: relative;
          margin-bottom: 15px !important; 
        }

        .animated-brand-name::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #93c5fd, transparent);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        /* --- New Slideshow Styles --- */
        .brand-slideshow-container {
            width: 90%;
            max-width: 1200px;
            height: 100px; /* Slideshow height */
            position: relative;
            overflow: hidden;
            margin: 0 auto 10px auto;
            border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.4);
            transition: height 0.3s ease;
        }
        
        .slideshow-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 1.5s ease-in-out; /* Cross-fade transition */
        }

        .slideshow-image.active {
            opacity: 1;
        }
        /* --- End Slideshow Styles --- */


        /* --- 2. Main Navbar (Glass Effect) --- */
        .main-navbar {
          background: rgba(255, 255, 255, 0.95) !important; 
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0.8rem 0 !important; 
          position: fixed;
          top: 230px; /* ADJUSTED: Sits below the larger header */
          left: 0;
          right: 0;
          z-index: 1030;
          animation: navbarSlideIn 0.8s ease-out;
        }

        @keyframes navbarSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Search Bar */
        .search-container {
          background: #f1f5f9; 
          border: 1px solid #e2e8f0;
          border-radius: 25px; 
          overflow: hidden;
          transition: all 0.3s ease;
          min-width: 250px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        /* Navigation Links - Subtle Hover */
        .nav-link-custom {
          color: #374151 !important;
          font-weight: 500;
          padding: 10px 14px !important;
          border-radius: 8px;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link-custom:hover {
          color: #3b82f6 !important;
          background: rgba(59, 130, 246, 0.1) !important;
          transform: translateY(-1px); 
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
          border: none;
        }

        /* Phone Button - Cleaned up */
        .phone-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 9px 18px; 
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .phone-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
        }

        /* --- 3. Mobile Responsiveness --- */
        @media (max-width: 768px) {
          .brand-header {
            min-height: 150px !important; /* Reduced height for mobile */
          }

          .main-navbar {
            top: 150px !important; /* Adjusted fixed position to match header height */
            padding: 0.5rem 0 !important; 
          }

          .animated-brand-name {
            font-size: 1.6rem;
            margin-bottom: 5px !important;
          }
          
          .brand-slideshow-container {
            height: 50px; /* Smaller height on mobile */
            width: 95%;
            margin-top: 5px;
          }

          /* Mobile Menu Dropdown style fix */
          .dropdown-menu {
            position: fixed !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            max-height: 50vh !important;
            overflow-y: auto !important;
            border-radius: 12px 12px 0 0 !important;
            margin-top: 0 !important;
            box-shadow: 0 -5px 20px rgba(0,0,0,0.15);
          }
        }
      `}</style>

      {/* Top Brand Header */}
      <div className="brand-header position-fixed w-100 d-flex flex-column justify-content-center align-items-center" 
           style={{
             zIndex: 2000,
             top: 0,
             left: 0,
             background: `linear-gradient(135deg, #0f172aee 0%, #1e293bee 100%), url(${lalithWorkplace}) right center/cover no-repeat`,
             backgroundBlendMode: 'overlay',
             position: 'fixed',
             overflow: 'hidden',
           }}>
        
        {/* Animated Brand Name */}
        <div className="animated-brand-name">
          Lalith Electricals
        </div>
        
        {/* --- New Image Slideshow/Banner --- */}
        <div className="brand-slideshow-container">
            {SLIDESHOW_IMAGES.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`Promotional image ${index + 1}`}
                    className={`slideshow-image ${index === currentImageIndex ? 'active' : ''}`}
                />
            ))}
        </div>
        {/* ------------------------------------- */}
      </div>

      {/* Main Navigation */}
  <Navbar expand="lg" className="main-navbar" style={{ top: '230px' }} expanded={navExpanded} onToggle={(next) => setNavExpanded(next)}>
        <Container>
          {/* Brand Logo and Buttons */}
          <Navbar.Brand className="d-flex align-items-center ps-0" style={{marginLeft: 0, paddingLeft: 0, gap: '20px'}} onClick={() => setNavExpanded(false)}>
            {/* Logo */}
            <img
              src={logo}
              alt="Lalith Electricals Logo"
              style={{
                width: 55, 
                height: 55,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #3b82f6',
                background: '#fff',
                boxShadow: '0 4px 15px rgba(59,130,246,0.18)'
              }}
            />

            {/* Owner Details Button */}
            <button
              className="btn owner-details-btn d-flex align-items-center gap-2"
              style={{
                height: 38,
                minWidth: 100,
                fontSize: 14,
                borderRadius: 18,
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(59,130,246,0.2)',
                fontWeight: 600,
                letterSpacing: '0.4px',
                padding: '0 14px',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                outline: 'none',
              }}
              onClick={() => setShowOwner(true)}
              title="View Owner Details"
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #60a5fa 0%, #2563eb 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)'}
            >
              <FaUserCircle size={15} />
              <span>Owner</span>
            </button>
  {/* Owner Details Popup (Kept for completeness) */}
      {showOwner && (
        <div className="modal fade show custom-modal-overlay d-flex justify-content-center"
          tabIndex="-1" role="dialog" onClick={() => setShowOwner(false)}
        >
          <div className="modal-dialog"
            style={{ maxWidth: 400, width: '85vw', margin: '20px auto' }}
            role="document" onClick={e => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg p-0" style={{ overflow: 'hidden', background: '#fff' }}>
              <div className="modal-header border-0 pb-0 align-items-start d-flex justify-content-between"
                style={{ background: '#2563eb', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', minHeight: '0', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                <h5 className="modal-title text-white fw-bold m-0" style={{ letterSpacing: '1px', fontSize: '1.3rem' }}>Owner Details</h5>
                <button type="button" className="btn-close btn-close-white ms-2" aria-label="Close"
                  style={{ filter: 'brightness(2)', fontSize: '1.2rem' }} onClick={() => setShowOwner(false)}></button>
                </div>
                <div className="modal-body p-4 d-flex flex-column align-items-center justify-content-center" style={{width: '100%', maxWidth: 600, minHeight: 0, justifyContent: 'center'}}>
                <div className="w-100 d-flex flex-column align-items-center justify-content-center" style={{height: '100%'}}>
                  <img
                    src={ownerImg}
                    alt="Owner"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #3b82f6',
                      boxShadow: '0 2px 12px rgba(59,130,246,0.13)',
                      marginBottom: 18
                    }}
                  />
                  <div className="fw-bold fs-4 text-center mb-3" style={{color:'#2563eb'}}>Mr.Lalith Abeysinghe</div>
                  <ul className="list-unstyled text-center mb-0" style={{fontSize: '1.18rem', color: '#222', maxWidth: 500, wordBreak: 'break-word', whiteSpace: 'normal'}}>
                    <li className="mb-2">Successfully completed <b>3 year Vocational Training Technician Course</b> offered by <b>National Apprentice and Industrial Training Authority (NAITA)</b>.</li>
                    <li className="mb-2">Successfully completed <b>Boiler Operation and Maintenance</b>.</li>
                    <li className="mb-2">Obtained <b>Certificate of Competency – Class III (Boiler)</b>.</li>
                    <li className="mb-2" style={{wordBreak: 'break-word', whiteSpace: 'normal'}}>Also completed courses in <b>Electronics, Generators, and Motors</b>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* Facebook Icon */}
            <a
              href="https://www.facebook.com/groups/generatorhelp/?ref=share&mibextid=NSMWBT"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#1877f3',
                width: 45,
                height: 45,
                justifyContent: 'center',
                textDecoration: 'none',
              }}
              className="facebook-icon-link"
              title="Join our Facebook Group"
            >
              <FaFacebook size={35} />
            </a>
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle aria-controls="navbar-nav" className="border-0 shadow-none">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="navbar-nav">
            {/* Search Bar - Desktop */}
            <div className="d-none d-lg-flex align-items-center ms-auto me-3 search-container">
              <input
                type="text"
                placeholder="Search products..."
                className="form-control search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="btn btn-link text-muted p-1 me-1" 
                  onClick={handleClearSearch}
                  style={{fontSize: '0.9rem', minWidth: 'auto'}}
                >
                  ✕
                </button>
              )}
              <div className={`btn search-btn d-flex align-items-center ${searchQuery ? 'searching' : ''}`} style={{cursor: 'default'}}>
                <FaSearch />
              </div>
            </div>

            {/* Navigation Links */}
            <Nav className="ms-auto align-items-center gap-2">
              <Nav.Link
                className="nav-link-custom d-flex align-items-center"
                style={{ fontWeight: 600, color: '#2563eb' }}
                onClick={() => { setShowMap(true); setNavExpanded(false); }}
              >
                <FaMapMarkerAlt className="me-1" /> View Location
              </Nav.Link>
              <Nav.Link as={Link} to="/" className="nav-link-custom d-flex align-items-center" onClick={() => setNavExpanded(false)}>
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
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      className="btn btn-link text-muted p-1 me-1" 
                      onClick={handleClearSearch}
                      style={{fontSize: '0.9rem', minWidth: 'auto'}}
                    >
                      ✕
                    </button>
                  )}
                  <div className={`btn search-btn d-flex align-items-center ${searchQuery ? 'searching' : ''}`} style={{cursor: 'default'}}>
                    <FaSearch />
                  </div>
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
                  <NavDropdown.Item as={Link} to="/profile" onClick={() => setNavExpanded(false)}>
                    <FaUserCircle className="me-2" /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/items" onClick={() => setNavExpanded(false)}>
                    <FaShoppingCart className="me-2" /> My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => { handleSignOut(); setNavExpanded(false); }} className="text-danger" style={{ cursor: 'pointer' }}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/profile" className="signin-btn" onClick={() => setNavExpanded(false)}>
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

      {/* Location Modal (Kept for completeness) */}
      {showMap && (
        <div className="modal fade show d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, width: '100%', height: '100%',
            display: 'flex', background: 'rgba(0,0,0,0.5)', zIndex: 2000, overflowY: 'auto'
          }}
          tabIndex="-1" role="dialog" onClick={() => setShowMap(false)}
        >
          <div className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: '90vw', width: '90vw', height: '80vh', margin: 'auto' }}
            role="document" onClick={e => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg p-0" style={{ height: '80vh', width: '100%', overflow: 'hidden' }}>
              <div className="modal-header border-0 pb-0 align-items-start d-flex justify-content-between"
                style={{ background: '#2563eb', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', minHeight: '0', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                <h5 className="modal-title text-white fw-bold m-0" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>Lalith Electricals Location</h5>
                <button type="button" className="btn-close btn-close-white ms-2" aria-label="Close"
                  style={{ filter: 'brightness(2)', fontSize: '1.2rem' }} onClick={() => setShowMap(false)}></button>
              </div>
              <div className="modal-body p-0" style={{ height: 'calc(80vh - 48px)', width: '100%' }}>
                <iframe
                  title="Lalith Electricals Kurunegala Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.568019672046!2d80.3804812749553!3d7.292928592716584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3397984852029%3A0xb3631f4523d45c58!2sLalith%20Electricals!5e0!3m2!1sen!2slk!4b1!4m6!3m5!1s0x3ae3397984852029%3A0xb3631f4523d45c58!2sLalith%20Electricals!4sChIJKeAhh9gL4joRWAxT5VlYQ48!8m2!3d7.2929286!4d80.3830562"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}