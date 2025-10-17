import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { signout } from '../redux/User/userSlice';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

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
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook
} from 'react-icons/fa';
import { RiFlashlightFill } from 'react-icons/ri';
import img1 from './images/1.jpeg';
import img2 from './images/2.jpeg';
import img3 from './images/3.jpeg';
import img4 from './images/4.jpeg';
import img5 from './images/5.jpeg';
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

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signout());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Prevent default form submission, search happens in real-time
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search for better performance
    searchTimeoutRef.current = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
      } else {
        // If empty search, show all items
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

  // Cleanup timeout on component unmount
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        /* Global Styles */
        * {
          box-sizing: border-box;
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
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.98) 50%, rgba(224, 242, 254, 0.98) 100%) !important;
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-top: 1px solid rgba(59, 130, 246, 0.15);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 1.2rem 0 !important;
          position: fixed;
          top: 140px;
          left: 0;
          right: 0;
          z-index: 1030;
          animation: navbarSlideIn 0.8s ease-out;
        }

        @keyframes navbarSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .main-navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.02) 0%, transparent 50%, rgba(16, 185, 129, 0.02) 100%);
          pointer-events: none;
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
          cursor: default !important;
        }

        .search-btn:hover {
          background: #2563eb !important;
        }

        .search-btn.searching {
          background: #10b981 !important;
        }

        .search-btn.searching:hover {
          background: #059669 !important;
        }

        /* Navigation Links */
        .nav-link-custom {
          color: #374151 !important;
          font-weight: 500;
          padding: 8px 12px !important;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
          display: inline-flex !important;
          align-items: center;
          white-space: nowrap;
          min-width: fit-content;
          overflow: hidden;
        }

        .nav-link-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s;
        }

        .nav-link-custom:hover::before {
          left: 100%;
        }

        .nav-link-custom:hover {
          color: #3b82f6 !important;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25), 0 0 20px rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        /* User Dropdown */
        .dropdown-toggle {
          display: inline-flex !important;
          align-items: center;
          white-space: nowrap;
          padding: 8px 12px !important;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          border: none;
          background: transparent;
          color: #374151 !important;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .dropdown-toggle::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s;
        }

        .dropdown-toggle:hover::before {
          left: 100%;
        }

        .dropdown-toggle:hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.1));
          color: #3b82f6 !important;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25), 0 0 20px rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .dropdown-toggle::after {
          margin-left: 8px;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border-radius: 12px;
          padding: 8px 0;
          margin-top: 8px;
          position: absolute;
          z-index: 1060;
          top: 100%;
          left: auto;
          right: 0;
          min-width: 200px;
          max-height: 400px;
          overflow-y: auto;
        }

        /* Custom desktop modal positioning: show near top (below fixed header) on desktop, centered on mobile */
        .custom-modal-overlay {
          position: fixed !important;
          left: 0;
          right: 0;
          width: 100%;
          display: flex !important;
          justify-content: center !important;
          background: rgba(0,0,0,0.5);
          z-index: 3000;
          box-sizing: border-box;
          overflow-y: auto;
        }
        /* Desktop: place overlay below the top header (brand + navbar). Adjust the top offset as needed. */
        @media (min-width: 769px) {
          .custom-modal-overlay {
            top: 200px !important; /* start overlay below header */
            height: calc(100vh - 200px) !important;
            align-items: flex-start !important; /* push modal to top of overlay */
            padding-top: 1rem !important;
          }
          .custom-modal-overlay .modal-dialog { margin-top: 8px !important; }
        }
        /* Mobile: full-screen overlay and vertically centered dialog */
        @media (max-width: 768px) {
          .custom-modal-overlay {
            top: 0 !important;
            height: 100vh !important;
            align-items: center !important;
            padding-top: 0 !important;
            background: rgba(0,0,0,0.6) !important;
          }
          .custom-modal-overlay .modal-dialog {
            margin: 12px !important;
            width: 96vw !important;
            max-width: 96vw !important;
          }
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

        .facebook-icon-link:hover {
          transform: scale(1.1) rotate(5deg);
          filter: drop-shadow(0 4px 12px rgba(24, 119, 243, 0.3));
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

          .brand-header {
            min-height: 120px !important;
          }

          .main-navbar {
            top: 120px !important;
          }
        }

        @media (max-width: 576px) {
          .animated-brand-name {
            font-size: 1.8rem;
          }
          
          .brand-header {
            min-height: 100px !important;
          }

          .main-navbar {
            top: 100px !important;
          }

          .dropdown-menu {
            position: fixed !important;
            top: auto !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            max-height: 40vh !important;
            overflow-y: auto !important;
            border-radius: 12px 12px 0 0 !important;
            margin-top: 0 !important;
          }

          .modal-body {
            padding-left: 5vw !important;
            padding-right: 5vw !important;
          }
        }
      `}</style>

      {/* Top Brand Header */}
      <div className="brand-header position-fixed w-100 d-flex flex-column justify-content-center align-items-center" 
           style={{
             zIndex: 2000,
             minHeight: '140px',
             top: 0,
             left: 0,
             background: `linear-gradient(135deg, #0f172aee 0%, #1e293bee 50%, #334155ee 100%), url(${lalithWorkplace}) right center/contain no-repeat`,
             position: 'fixed',
             backgroundBlendMode: 'overlay',
             overflow: 'hidden',
           }}>
        {/* Animated Brand Name */}
        <div className="animated-brand-name mb-2">
          Lalith Electricals
        </div>
        {/* Actual Workplace Image (hidden, now used as background) */}
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
  <Navbar expand="lg" className="main-navbar" style={{ top: '140px' }} expanded={navExpanded} onToggle={(next) => setNavExpanded(next)}>
        <Container>
          {/* Brand Logo and Facebook Icon with Owner Details Button in between */}
          <Navbar.Brand className="d-flex align-items-center ps-0" style={{marginLeft: 0, paddingLeft: 0}} onClick={() => setNavExpanded(false)}>
            {/* Logo */}
            <img
              src={logo}
              alt="Lalith Electricals Logo"
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: 32,
                marginTop:10, // Reduced to fit button
                border: '1px solid #3b82f6',
                background: '#fff',
                boxShadow: '0 8px 32px rgba(59,130,246,0.18)'
              }}
            />

            {/* Owner Details Button */}
            <button
              className="btn owner-details-btn mx-2 d-flex align-items-center gap-2"
              style={{
                height: 38,
                minWidth: 110,
                fontSize: 15,
                borderRadius: 18,
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(59,130,246,0.13)',
                fontWeight: 600,
                letterSpacing: '0.4px',
                marginRight: 40,
                padding: '0 14px',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                textShadow: '0 1px 4px rgba(59,130,246,0.08)',
                outline: 'none',
              }}
              onClick={() => setShowOwner(true)}
              title="View Owner Details"
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #60a5fa 0%, #2563eb 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.13"/>
                <path d="M12 12c1.933 0 3.5-1.567 3.5-3.5S13.933 5 12 5s-3.5 1.567-3.5 3.5S10.067 12 12 12zm0 2c-2.33 0-7 1.167-7 3.5V20h14v-2.5c0-2.333-4.67-3.5-7-3.5z" fill="#fff"/>
              </svg>
              <span>Owner</span>
            </button>
  {/* Owner Details Popup */}
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
                width: 50,
                height: 50,
                justifyContent: 'center',
                transition: 'box-shadow 0.2s',
                textDecoration: 'none',
              }}
              className="facebook-icon-link"
              title="Join our Facebook Group"
            >
              <FaFacebook size={40} />
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
                  style={{fontSize: '0.8rem', minWidth: 'auto'}}
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
                      style={{fontSize: '0.8rem', minWidth: 'auto'}}
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

      {/* Location Modal */}
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
                  src="https://www.google.com/maps?q=Lalith+Electricals+Kurunegala&output=embed"
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
