import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../redux/User/userSlice';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUserCircle, 
  FaHome, 
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaBars,
  FaSearch,
  FaTimes,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaInstagram,
  FaBolt,
  FaPlus,
  FaSignOutAlt
} from 'react-icons/fa';
import logo from './images/BackgroundImages/logo1.png';
import ownerImg from './images/owner.jpeg';
import certificate1 from './images/cetificate1_page-0002.jpg';
import certificate2 from './images/cetificate2_page-0001.jpg';
import bgImg1 from './images/BackgroundImages/repair7.webp';
import bgImg2 from './images/BackgroundImages/repair.webp';
import bgImg3 from './images/BackgroundImages/repair3.jpg';
import bgImg4 from './images/BackgroundImages/repair5.jpg';
import bgImg5 from './images/BackgroundImages/repair4.jpg';
import bgImg6 from './images/BackgroundImages/repair6.avif';
import bgImg7 from './images/BackgroundImages/repair1.avif';
import bgImg8 from './images/BackgroundImages/bb.png';
import lalithWorkplace from './images/BackgroundImages/lalith1.jpeg';
import img1 from './images/1.jpeg';
import img2 from './images/2.jpeg';
import img3 from './images/3.jpeg';
import img4 from './images/4.jpeg';
import img5 from './images/5.jpeg';

export default function HeaderModern() {
  const backgroundImages = [bgImg8,bgImg7,bgImg1, bgImg2, bgImg3, bgImg4, bgImg5, bgImg6];
  const [currentBgIndex, setCurrentBgIndex] = React.useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [showOwner, setShowOwner] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
    }, 300);
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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --primary-color: #1a1a2e;
          --secondary-color: #16213e;
          --accent-color: #0f3460;
          --highlight-color: #e94560;
          --light-bg: #f8f9fa;
          --white: #ffffff;
          --text-dark: #2d3436;
          --text-light: #636e72;
          --shadow-sm: 0 2px 10px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.12);
          --shadow-lg: 0 8px 30px rgba(0,0,0,0.15);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Top Info Bar */
        .top-info-bar {
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98), rgba(15, 52, 96, 0.98));
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          color: var(--white);
          padding: 14px 0;
          font-size: 14px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1050;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          position: relative;
          overflow: hidden;
          border-bottom: 2px solid rgba(233, 69, 96, 0.3);
        }

        .top-info-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(233, 69, 96, 0.2) 30%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(233, 69, 96, 0.2) 70%,
            transparent 100%);
          animation: shimmerEffect 4s ease-in-out infinite;
        }

        .top-info-bar::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--highlight-color) 50%, 
            transparent 100%);
          animation: borderGlow 3s ease-in-out infinite;
        }

        @keyframes shimmerEffect {
          0% { 
            left: -100%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% { 
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes borderGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scaleX(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(233, 69, 96, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(233, 69, 96, 0.6);
          }
        }

        .top-info-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          position: relative;
          z-index: 1;
        }

        .top-info-left {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          align-items: center;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.95);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 8px 15px;
          border-radius: 25px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(5px);
          position: relative;
          overflow: hidden;
        }

        .info-text-mobile-about {
          display: none;
        }

        .info-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }

        .info-item:hover::before {
          left: 100%;
        }

        .info-item:hover {
          color: var(--white);
          background: rgba(233, 69, 96, 0.2);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
        }

        .info-item svg {
          color: var(--highlight-color);
          filter: drop-shadow(0 0 3px rgba(233, 69, 96, 0.5));
          transition: all 0.3s ease;
          animation: iconPulse 2s ease-in-out infinite;
        }

        .info-item:hover svg {
          transform: scale(1.2) rotate(5deg);
          filter: drop-shadow(0 0 8px rgba(233, 69, 96, 0.8));
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .info-item a {
          color: inherit;
          text-decoration: none;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--white);
          position: relative;
          overflow: hidden;
          border: 2px solid rgba(233, 69, 96, 0.3);
        }

        .social-icon::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(233, 69, 96, 0.4);
          transition: all 0.5s ease;
          transform: translate(-50%, -50%);
        }

        .social-icon:hover::before {
          width: 100%;
          height: 100%;
        }

        .social-icon:hover {
          background: var(--highlight-color);
          transform: translateY(-3px) rotate(360deg);
          box-shadow: 0 6px 20px rgba(233, 69, 96, 0.5);
          border-color: var(--highlight-color);
        }

        .social-icon svg {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .social-icon:hover svg {
          transform: scale(1.2);
        }

        /* Facebook Icon Specific Styling */
        .social-icon.facebook {
          background: linear-gradient(135deg, rgba(24, 119, 242, 0.2), rgba(66, 103, 178, 0.2));
          border-color: rgba(24, 119, 242, 0.5);
        }

        .social-icon.facebook::before {
          background: linear-gradient(135deg, #1877f2, #4267B2);
        }

        .social-icon.facebook:hover {
          background: linear-gradient(135deg, #1877f2, #4267B2);
          border-color: #1877f2;
          box-shadow: 0 6px 25px rgba(24, 119, 242, 0.6);
        }

        .social-icon.facebook svg {
          color: #1877f2;
          filter: drop-shadow(0 0 4px rgba(24, 119, 242, 0.6));
        }

        .social-icon.facebook:hover svg {
          color: var(--white);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }

        /* WhatsApp Icon Specific Styling */
        .social-icon.whatsapp {
          background: linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(18, 140, 126, 0.2));
          border-color: rgba(37, 211, 102, 0.5);
        }

        .social-icon.whatsapp::before {
          background: linear-gradient(135deg, #25D366, #128C7E);
        }

        .social-icon.whatsapp:hover {
          background: linear-gradient(135deg, #25D366, #128C7E);
          border-color: #25D366;
          box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
        }

        .social-icon.whatsapp svg {
          color: #25D366;
          filter: drop-shadow(0 0 4px rgba(37, 211, 102, 0.6));
          animation: whatsappPulse 2s ease-in-out infinite;
        }

        .social-icon.whatsapp:hover svg {
          color: var(--white);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
        }

        @keyframes whatsappPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        /* Main Header */
        .main-header {
          position: fixed;
          top: 48px;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: var(--shadow-md);
          z-index: 1040;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .main-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url(${lalithWorkplace}) center/cover no-repeat;
          opacity: 0.03;
          z-index: -1;
        }

        .main-header.scrolled {
          top: 0;
          box-shadow: var(--shadow-lg);
          background: rgba(255, 255, 255, 0.95);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        /* Logo Section */
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
          text-decoration: none;
        }

        .logo-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--accent-color);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          background: var(--white);
        }

        .logo-img:hover {
          transform: scale(1.05);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
          margin: 0;
        }

        .logo-subtitle {
          font-family: 'Raleway', sans-serif;
          font-size: 12px;
          color: var(--highlight-color);
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Navigation */
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 35px;
          list-style: none;
        }

        .nav-link {
          font-family: 'Raleway', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-dark);
          text-decoration: none;
          padding: 8px 0;
          position: relative;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--highlight-color);
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: var(--highlight-color);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Search Bar */
        .search-wrapper {
          position: relative;
          width: 300px;
        }

        .search-input-modern {
          width: 100%;
          padding: 12px 45px 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 50px;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: 'Raleway', sans-serif;
        }

        .search-input-modern:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
        }

        .search-icon-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--highlight-color);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-icon-btn:hover {
          background: var(--accent-color);
          transform: translateY(-50%) scale(1.05);
        }

        .clear-search-btn {
          position: absolute;
          right: 45px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 5px;
        }

        /* Action Buttons */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .action-btn {
          padding: 12px 24px;
          border-radius: 50px;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          white-space: nowrap;
        }

        .btn-primary-modern {
          background: linear-gradient(135deg, var(--highlight-color), #ff6b7a);
          color: var(--white);
          box-shadow: var(--shadow-sm);
        }

        .btn-primary-modern:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .btn-secondary-modern {
          background: var(--white);
          color: var(--accent-color);
          border: 2px solid var(--accent-color);
        }

        .btn-secondary-modern:hover {
          background: var(--accent-color);
          color: var(--white);
        }

        .user-menu-btn {
          background: var(--light-bg);
          color: var(--text-dark);
          padding: 10px 18px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .user-menu-btn:hover {
          background: var(--accent-color);
          color: var(--white);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-color);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          background: var(--white);
        }

        /* User Dropdown */
        .user-dropdown-container {
          position: relative;
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--white);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          overflow: hidden;
          z-index: 1000;
          animation: dropdownSlide 0.3s ease-out;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          color: var(--text-dark);
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Raleway', sans-serif;
          font-weight: 500;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: var(--light-bg);
          color: var(--highlight-color);
        }

        .dropdown-item.logout {
          color: var(--highlight-color);
          border-top: 1px solid var(--light-bg);
        }

        .dropdown-item.logout:hover {
          background: rgba(233, 69, 96, 0.1);
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          background: var(--primary-color);
          color: var(--white);
          border: none;
          width: 45px;
          height: 45px;
          border-radius: 8px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          background: var(--highlight-color);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 300px;
          height: 100vh;
          background: var(--white);
          box-shadow: var(--shadow-lg);
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1060;
          overflow-y: auto;
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-menu-header {
          padding: 20px;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: var(--white);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-menu-close {
          background: rgba(255,255,255,0.2);
          border: none;
          color: var(--white);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-menu-body {
          padding: 20px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          color: var(--text-dark);
          text-decoration: none;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
        }

        .mobile-nav-link:hover {
          background: var(--light-bg);
          color: var(--highlight-color);
        }

        /* Modal Styles */
        .modal-overlay-modern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1070;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .modal-content-modern {
          background: var(--white);
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
          animation: modalSlideUp 0.3s ease-out;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header-modern {
          padding: 25px 30px;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: var(--white);
          border-radius: 20px 20px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title-modern {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .modal-close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: var(--white);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: rotate(90deg);
        }

        .modal-body-modern {
          padding: 30px;
        }

        .owner-info {
          text-align: center;
        }

        .owner-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--accent-color);
          margin-bottom: 20px;
          box-shadow: var(--shadow-md);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          background: var(--white);
        }

        .owner-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .owner-credentials {
          text-align: left;
          margin-top: 25px;
        }

        .credential-item {
          padding: 15px;
          background: var(--light-bg);
          border-radius: 10px;
          margin-bottom: 12px;
          font-size: 15px;
          color: var(--text-dark);
          line-height: 1.6;
          border-left: 4px solid var(--highlight-color);
        }

        .certificates-section {
          margin-top: 30px;
          text-align: center;
        }

        .certificates-title {
          font-family: 'Raleway', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .certificate-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.05) 0%, rgba(233, 69, 96, 0.05) 100%);
          padding: 8px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .certificate-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s ease;
        }

        .certificate-wrapper:hover::before {
          left: 100%;
        }

        .certificate-wrapper:hover {
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.08) 0%, rgba(233, 69, 96, 0.08) 100%);
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(15, 52, 96, 0.2);
        }

        .certificates-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          padding: 10px;
          position: relative;
        }

        .certificates-grid::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, rgba(15, 52, 96, 0.03) 0%, transparent 70%);
          z-index: -1;
          border-radius: 15px;
        }

        .certificate-img {
          width: 100%;
          height: auto;
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          background: var(--white);
          padding: 5px;
          border: 2px solid transparent;
        }

        .certificate-img:hover {
          transform: scale(1.08) rotate(1deg);
          box-shadow: 0 10px 40px rgba(15, 52, 96, 0.3);
          border-color: var(--accent-color);
        }

        /* Map Container */
        .map-container {
          width: 100%;
          height: 500px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        /* Brand Showcase Section */
        .brand-showcase {
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.05) 0%, rgba(22, 33, 62, 0.05) 100%);
          padding: 30px 0;
          margin-top: 100px;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
        }

        .brand-showcase::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: showcaseShimmer 3s infinite;
        }

        @keyframes showcaseShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .showcase-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary-dark);
          text-align: center;
          margin-bottom: 25px;
        }

        .brand-images-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
        }

        .brand-images-wrapper::before,
        .brand-images-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100px;
          z-index: 2;
          pointer-events: none;
        }

        .brand-images-wrapper::before {
          left: 0;
          background: linear-gradient(to right, rgba(248, 249, 250, 1), transparent);
        }

        .brand-images-wrapper::after {
          right: 0;
          background: linear-gradient(to left, rgba(248, 249, 250, 1), transparent);
        }

        .brand-images-track {
          display: flex;
          gap: 30px;
          animation: scrollBrands 20s linear infinite;
          width: max-content;
        }

        .brand-images-track:hover {
          animation-play-state: paused;
        }

        @keyframes scrollBrands {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .brand-item {
          background: var(--white);
          border-radius: 12px;
          padding: 5px;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-width: 150px;
          height: 150px;
          flex-shrink: 0;
        }

        .brand-item:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .brand-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .brand-item:hover .brand-img {
          transform: scale(1.1);
        }

        /* Dynamic Background Section */
        .dynamic-bg-section {
          position: relative;
          height: 400px;
          overflow: hidden;
          margin: 40px 0;
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
        }

        .bg-slide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
        }

        .bg-slide.active {
          opacity: 1;
        }

        .bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.7) 0%, rgba(22, 33, 62, 0.7) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--white);
          padding: 40px;
        }

        .bg-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .bg-subtitle {
          font-size: clamp(1rem, 2vw, 1.3rem);
          text-align: center;
          max-width: 600px;
          text-shadow: 1px 1px 5px rgba(0,0,0,0.3);
        }

        .bg-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: var(--accent-red);
          transform: scale(1.2);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .nav-menu {
            display: none;
          }
          
          .mobile-menu-toggle {
            display: flex;
          }

          .search-wrapper {
            width: 200px;
          }
        }

        @media (max-width: 768px) {
          .top-info-bar {
            font-size: 11px;
            padding: 24px 0;
          }

          .top-info-content {
            justify-content: center;
            align-items: center;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 14px;
          }

          .top-info-left {
            justify-content: center;
            flex-wrap: nowrap;
            gap: 14px;
          }

          .info-item {
            font-size: 10px;
            padding: 16px 18px;
          }

          .info-item-email {
            display: none;
          }

          .info-text-desktop {
            display: none;
          }

          .info-text-mobile-about {
            display: inline;
          }

          .social-links {
            justify-content: center;
            gap: 16px;
          }

          .main-header {
            top: 0;
          }

          .main-header.scrolled {
            top: 0;
          }

          .header-content {
            padding: 15px;
            gap: 15px;
          }

          .logo-img {
            width: 50px;
            height: 50px;
          }

          .logo-title {
            font-size: 20px;
          }

          .logo-subtitle {
            font-size: 10px;
          }

          .search-wrapper {
            display: none;
          }

          .header-actions {
            gap: 10px;
          }

          .action-btn {
            padding: 10px 18px;
            font-size: 13px;
          }

          .mobile-menu-body .search-wrapper {
            display: block;
            width: 100%;
            margin-bottom: 20px;
          }

          .map-container {
            height: 400px;
          }

          .dynamic-bg-section {
            height: 300px;
            margin: 20px 10px !important;
            border-radius: 15px;
          }

          /* Adjust main content padding for mobile since header is at top */
          body {
            padding-top: 0;
          }

          .bg-title {
            font-size: 2rem;
          }

          .bg-subtitle {
            font-size: 1rem;
          }

          .brand-showcase {
            margin: 20px 0 !important;
            padding: 20px 0;
            border-radius: 0;
          }

          .showcase-title {
            font-size: 1.4rem;
            padding: 0 20px;
            margin-bottom: 20px;
          }

          .brand-images-wrapper {
            padding: 20px 0;
            overflow: visible;
          }

          .brand-images-wrapper::before,
          .brand-images-wrapper::after {
            display: none;
          }

          .brand-images-track {
            gap: 20px;
            padding: 0 20px;
          }

          .brand-item {
            min-width: 150px;
            height: 150px;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }

          .social-links {
            gap: 10px;
          }

          .social-icon {
            width: 28px;
            height: 28px;
            font-size: 14px;
          }

          .certificates-grid {
            grid-template-columns: 1fr;
          }

          .dynamic-bg-section {
            height: 250px;
          }

          .brand-images-wrapper::before,
          .brand-images-wrapper::after {
            display: none;
          }

          .brand-images-track {
            gap: 15px;
            padding: 0 15px;
          }

          .brand-item {
            min-width: 140px;
            height: 140px;
          }
        }
      `}</style>

      {/* Top Info Bar */}
      <div className="top-info-bar">
        <div className="top-info-content">
          <div className="top-info-left">
            <div className="info-item">
              <FaPhone size={14} />
              <a href="tel:0779189558">077-918-9558</a>
            </div>
            <div className="info-item info-item-email">
              <FaEnvelope size={14} />
              <a href="mailto:lalithabesingha@gmail.com">lalithabesingha@gmail.com</a>
            </div>
            <div className="info-item">
              <FaUserCircle size={14} />
              <span className="info-text-desktop">Mon-Sat: 8AM-6PM</span>
              <span
                className="info-text-mobile-about"
                onClick={() => setShowOwner(true)}
                style={{ cursor: 'pointer' }}
              >
                About Owner
              </span>
            </div>
          </div>
          <div className="social-links">
            <a href="https://www.facebook.com/groups/generatorhelp" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
              <FaFacebook size={16} />
            </a>
            <a href="https://wa.me/94779189558" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
              <FaWhatsapp size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo-section">
            <img src={logo} alt="Lalith Electricals Logo" className="logo-img" />
            <div className="logo-text">
              <h1 className="logo-title">Lalith Electricals</h1>
              <p className="logo-subtitle">28+ Years Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav>
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-link">
                  <FaHome size={16} />
                  Home
                </Link>
              </li>
              <li>
                <button onClick={() => setShowOwner(true)} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                  <FaUserCircle size={16} />
                  About Owner
                </button>
              </li>
              <li>
                <button onClick={() => setShowMap(true)} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>
                  <FaMapMarkerAlt size={16} />
                  Location
                </button>
              </li>
            </ul>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input-modern"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={handleClearSearch}>
                <FaTimes size={14} />
              </button>
            )}
            <button className="search-icon-btn">
              <FaSearch size={14} />
            </button>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            <a href="tel:0779189558" className="action-btn btn-primary-modern">
              <FaPhone size={14} />
              Call Now
            </a>
            
            {currentUser ? (
              <div className="user-dropdown-container" ref={dropdownRef}>
                <button 
                  className="user-menu-btn" 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {currentUser.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="Profile" className="user-avatar" />
                  ) : (
                    <FaUserCircle size={20} />
                  )}
                  <span>{currentUser.username}</span>
                </button>
                
                {userDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <Link 
                      to="/additem" 
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FaPlus size={16} />
                      Add Orders
                    </Link>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FaUserCircle size={16} />
                      Profile
                    </Link>
                    <button 
                      className="dropdown-item logout"
                      onClick={() => {
                        handleSignOut();
                        setUserDropdownOpen(false);
                      }}
                    >
                      <FaSignOutAlt size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/profile" className="action-btn btn-secondary-modern">
                <FaUserCircle size={16} />
                Sign In
              </Link>
            )}

            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
              <FaBars size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Background Showcase Section */}
      <div style={{paddingTop: '120px', background: 'var(--light-bg)'}}>
        <div className="dynamic-bg-section" style={{maxWidth: '1400px', margin: '0 auto 40px', marginLeft: '20px', marginRight: '20px'}}>
          {backgroundImages.map((bg, index) => (
            <div
              key={index}
              className={`bg-slide ${index === currentBgIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${bg})` }}
            />
          ))}
          <div className="bg-overlay">
            <h2 className="bg-title">
              <FaBolt /> Lalith Electricals
            </h2>
            <p className="bg-subtitle">
              Professional Generator Sales & Electrical Services - 28+ Years of Trusted Excellence
            </p>
          </div>
          <div className="bg-indicators">
            {backgroundImages.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentBgIndex ? 'active' : ''}`}
                onClick={() => setCurrentBgIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Brand Showcase Section */}
        <div className="brand-showcase" style={{maxWidth: '1400px', margin: '0 auto'}}>
          <h3 className="showcase-title">Our Premium Electrical Equipment & Brands</h3>
          <div className="brand-images-wrapper">
            <div className="brand-images-track">
              {/* First set of images */}
              <div className="brand-item">
                <img src={img1} alt="Brand 1" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img2} alt="Brand 2" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img3} alt="Brand 3" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img4} alt="Brand 4" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img5} alt="Brand 5" className="brand-img" />
              </div>
              {/* Duplicate set for infinite scroll effect */}
              <div className="brand-item">
                <img src={img1} alt="Brand 1" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img2} alt="Brand 2" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img3} alt="Brand 3" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img4} alt="Brand 4" className="brand-img" />
              </div>
              <div className="brand-item">
                <img src={img5} alt="Brand 5" className="brand-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3 style={{margin: 0, fontFamily: 'Playfair Display, serif'}}>Menu</h3>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>
        <div className="mobile-menu-body">
          {/* Search Bar - Mobile */}
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              className="search-input-modern"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={handleClearSearch}>
                <FaTimes size={14} />
              </button>
            )}
            <button className="search-icon-btn">
              <FaSearch size={14} />
            </button>
          </div>

          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FaHome size={18} />
            Home
          </Link>
          <button onClick={() => { setShowOwner(true); setMobileMenuOpen(false); }} className="mobile-nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none'}}>
            <FaUserCircle size={18} />
            About Owner
          </button>
          <button onClick={() => { setShowMap(true); setMobileMenuOpen(false); }} className="mobile-nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none'}}>
            <FaMapMarkerAlt size={18} />
            Location
          </button>
          
          {currentUser ? (
            <>
              <Link to="/additem" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FaPlus size={18} />
                Add Orders
              </Link>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FaUserCircle size={18} />
                Profile
              </Link>
              <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="mobile-nav-link" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--highlight-color)'}}>
                <FaSignOutAlt size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              <FaUserCircle size={18} />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Owner Details Modal */}
      {showOwner && (
        <div className="modal-overlay-modern" onClick={() => setShowOwner(false)}>
          <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h2 className="modal-title-modern">Meet Our Expert</h2>
              <button className="modal-close-btn" onClick={() => setShowOwner(false)}>
                <FaTimes size={18} />
              </button>
            </div>
            <div className="modal-body-modern">
              <div className="owner-info">
                <img src={ownerImg} alt="Mr. Lalith Abeysinghe" className="owner-avatar" />
                <h3 className="owner-name">Mr. Lalith Abeysinghe</h3>
                <p style={{color: 'var(--text-light)', fontSize: '16px', marginBottom: '25px'}}>
                  Certified Electrical Technician with 28+ Years of Experience
                </p>
                
                <div className="owner-credentials">
                  <div className="credential-item">
                    <strong>✓</strong> Successfully completed 3-year Vocational Training Technician Course offered by National Apprentice and Industrial Training Authority (NAITA)
                  </div>
                  <div className="credential-item">
                    <strong>✓</strong> Successfully completed Boiler Operation and Maintenance
                  </div>
                  <div className="credential-item">
                    <strong>✓</strong> Obtained Certificate of Competency – Class III (Boiler)
                  </div>
                  <div className="credential-item">
                    <strong>✓</strong> Also completed courses in Electronics, Generators, and Motors
                  </div>
                </div>

                <div className="certificates-section">
                  <h4 className="certificates-title">Professional Certifications</h4>
                  <div className="certificates-grid">
                    <div className="certificate-wrapper">
                      <img src={certificate1} alt="Certificate 1" className="certificate-img" />
                    </div>
                    <div className="certificate-wrapper">
                      <img src={certificate2} alt="Certificate 2" className="certificate-img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="modal-overlay-modern" onClick={() => setShowMap(false)}>
          <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h2 className="modal-title-modern">
                <FaMapMarkerAlt /> Our Location
              </h2>
              <button className="modal-close-btn" onClick={() => setShowMap(false)}>
                <FaTimes size={18} />
              </button>
            </div>
            <div className="modal-body-modern">
              <div style={{marginBottom: '20px'}}>
                <p style={{fontSize: '16px', color: 'var(--text-dark)', marginBottom: '10px'}}>
                  <strong>Address:</strong> 8 Family Point, Thoraya, Kurunegala
                </p>
                <p style={{fontSize: '16px', color: 'var(--text-dark)'}}>
                  <strong>Contact:</strong> 077-918-9558
                </p>
              </div>
              <div className="map-container">
                <iframe
                  title="Lalith Electricals Location"
                  src="https://www.google.com/maps?q=Lalith+Electricals+Kurunegala&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1055,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
