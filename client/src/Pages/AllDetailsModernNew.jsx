import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signout } from '../redux/User/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBolt, 
  FaTools, 
  FaCertificate, 
  FaStar, 
  FaTag, 
  FaCalendar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaAward,
  FaFacebook,
  FaWhatsapp,
  FaShieldAlt,
  FaCheckCircle,
  FaPlay,
  FaExpand,
  FaTimes,
  FaSearch,
  FaFilter,
  FaHeart,
  FaCog,
  FaLightbulb,
  FaExternalLinkAlt
} from 'react-icons/fa';
import certificate1 from '../components/images/cetificate1_page-0002.jpg';
import certificate2 from '../components/images/cetificate2_page-0001.jpg';

export default function AllDetailsModernNew() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState('');
  const [fullscreenImageAlt, setFullscreenImageAlt] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allMedia, setAllMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    showFeatured: false,
    showOnSale: false,
    showAll: true
  });
  const [activeVideoId, setActiveVideoId] = useState(null);
  
  // Counter animation states
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [supportCount, setSupportCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search') || '';

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchParam && orders.length > 0) {
      const filtered = orders.filter(order =>
        order.Name && order.Name.toLowerCase().includes(searchParam.toLowerCase())
      );
      applyFilters(filtered);
    } else {
      applyFilters(orders);
    }
  }, [searchParam, orders, filterOptions, location.search]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showFullscreenImage) {
        closeFullscreenImage();
      }
    };

    if (showFullscreenImage) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showFullscreenImage]);

  const applyFilters = (ordersToFilter) => {
    let filtered = ordersToFilter;
    
    if (!filterOptions.showAll) {
      if (filterOptions.showFeatured && filterOptions.showOnSale) {
        filtered = ordersToFilter.filter(order => order.featured || order.onSale);
      } else if (filterOptions.showFeatured) {
        filtered = ordersToFilter.filter(order => order.featured);
      } else if (filterOptions.showOnSale) {
        filtered = ordersToFilter.filter(order => order.onSale);
      }
    }
    
    setFilteredOrders(filtered);
  };

  const handleFilterChange = (filterType) => {
    setFilterOptions(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'showAll') {
        newFilters.showAll = true;
        newFilters.showFeatured = false;
        newFilters.showOnSale = false;
      } else {
        newFilters.showAll = false;
        newFilters[filterType] = !prev[filterType];
        
        if (!newFilters.showFeatured && !newFilters.showOnSale) {
          newFilters.showAll = true;
        }
      }
      
      return newFilters;
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(`https://api.lalithelectrical.com/api/auth/users/items`, {
        signal: controller.signal, 
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      let data = await response.json();
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your internet connection and try again.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Please check if the server is running.');
      } else {
        setError(`Error loading data: ${error.message}`);
      }
      console.error('Error fetching orders:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signout());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageClick = (imageSrc, imageAlt, mediaType = 'image', allMediaItems = [], clickedIndex = 0) => {
    setFullscreenImageSrc(imageSrc);
    setFullscreenImageAlt(imageAlt);
    setAllMedia(allMediaItems);
    setCurrentMediaIndex(clickedIndex);
    setShowFullscreenImage(true);
  };

  const closeFullscreenImage = () => {
    setShowFullscreenImage(false);
    setFullscreenImageSrc('');
    setFullscreenImageAlt('');
    setAllMedia([]);
    setCurrentMediaIndex(0);
  };

  const handleNextMedia = () => {
    if (allMedia.length > 0) {
      const nextIndex = (currentMediaIndex + 1) % allMedia.length;
      setCurrentMediaIndex(nextIndex);
      setFullscreenImageSrc(allMedia[nextIndex].src);
      setFullscreenImageAlt(allMedia[nextIndex].alt);
    }
  };

  const handlePrevMedia = () => {
    if (allMedia.length > 0) {
      const prevIndex = (currentMediaIndex - 1 + allMedia.length) % allMedia.length;
      setCurrentMediaIndex(prevIndex);
      setFullscreenImageSrc(allMedia[prevIndex].src);
      setFullscreenImageAlt(allMedia[prevIndex].alt);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentMediaIndex(index);
    setFullscreenImageSrc(allMedia[index].src);
    setFullscreenImageAlt(allMedia[index].alt);
  };

  const API_HOST = import.meta.env.VITE_API_HOST || 'https://api.lalithelectrical.com';
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('https://')) return url;
    if (url.startsWith('http://')) return url.replace('http://', 'https://');
    if (url.startsWith('//')) return 'https:' + url;
    return `${API_HOST.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="renovation-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --primary-dark: #1a1a2e;
          --secondary-dark: #16213e;
          --accent-blue: #0f3460;
          --accent-red: #e94560;
          --light-bg: #f8f9fa;
          --white: #ffffff;
          --text-dark: #2d3436;
          --text-light: #636e72;
          --border-light: #e0e0e0;
          --shadow-sm: 0 2px 10px rgba(0,0,0,0.08);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.12);
          --shadow-lg: 0 8px 30px rgba(0,0,0,0.15);
          --gradient-primary: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          --gradient-accent: linear-gradient(135deg, #e94560 0%, #ff6b7a 100%);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .renovation-page {
          font-family: 'Raleway', sans-serif;
          background: var(--light-bg);
          padding-top: 120px;
          min-height: 100vh;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%);
          padding: 80px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(233, 69, 96, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(15, 52, 96, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        @keyframes heroGlow {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .hero-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
          opacity: 0.4;
          animation: particleFloat 20s linear infinite;
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(0) translateX(0);
          }
          100% {
            transform: translateY(-100px) translateX(50px);
          }
        }

        /* Floating Elements */
        .hero-floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-icon {
          position: absolute;
          color: rgba(233, 69, 96, 0.3);
          font-size: 2rem;
          animation: floatUpDown 6s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 7s;
        }

        .floating-icon:nth-child(2) {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
          animation-duration: 8s;
        }

        .floating-icon:nth-child(3) {
          bottom: 15%;
          left: 15%;
          animation-delay: 2s;
          animation-duration: 6s;
        }

        .floating-icon:nth-child(4) {
          bottom: 25%;
          right: 10%;
          animation-delay: 1.5s;
          animation-duration: 7.5s;
        }

        .floating-icon:nth-child(5) {
          top: 40%;
          left: 5%;
          animation-delay: 0.5s;
          animation-duration: 9s;
        }

        .floating-icon:nth-child(6) {
          top: 60%;
          right: 8%;
          animation-delay: 2.5s;
          animation-duration: 6.5s;
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) rotate(10deg);
            opacity: 0.6;
          }
        }

        /* Animated Light Beam */
        .hero-light-beam {
          position: absolute;
          top: -50%;
          left: -10%;
          width: 120%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(233, 69, 96, 0.1) 45%,
            rgba(233, 69, 96, 0.2) 50%,
            rgba(233, 69, 96, 0.1) 55%,
            transparent 100%
          );
          animation: lightBeamSweep 8s ease-in-out infinite;
          pointer-events: none;
          transform: rotate(-45deg);
        }

        @keyframes lightBeamSweep {
          0%, 100% {
            transform: translateX(-100%) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) rotate(-45deg);
            opacity: 0;
          }
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-badge {
          display: inline-block;
          background: linear-gradient(135deg, rgba(233, 69, 96, 0.2), rgba(255, 107, 122, 0.2));
          border: 2px solid rgba(233, 69, 96, 0.5);
          padding: 10px 25px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent-red);
          margin-bottom: 25px;
          animation: badgePulse 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(233, 69, 96, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(233, 69, 96, 0); }
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 25px;
          line-height: 1.2;
          animation: titleSlideIn 1s ease-out;
          position: relative;
        }

        @keyframes titleSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title-icon {
          display: inline-block;
          color: var(--accent-red);
          animation: iconFloat 3s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(233, 69, 96, 0.5));
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: rgba(255,255,255,0.95);
          max-width: 700px;
          margin: 0 auto 50px;
          line-height: 1.8;
          font-weight: 400;
          animation: subtitleFadeIn 1s ease-out 0.3s backwards;
        }

        @keyframes subtitleFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 60px;
          animation: ctaFadeIn 1s ease-out 0.6s backwards;
        }

        @keyframes ctaFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-cta-btn {
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .hero-cta-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .hero-cta-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .hero-cta-btn span {
          position: relative;
          z-index: 1;
        }

        .btn-primary-hero {
          background: var(--gradient-accent);
          color: var(--white);
          border: none;
          box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4);
        }

        .btn-primary-hero:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(233, 69, 96, 0.6);
        }

        .btn-secondary-hero {
          background: transparent;
          color: var(--white);
          border: 2px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .btn-secondary-hero:hover {
          background: rgba(255,255,255,0.1);
          border-color: var(--white);
          transform: translateY(-3px);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
          margin-top: 50px;
        }

        .stat-item {
          text-align: center;
          padding: 20px 30px;
          background: rgba(255,255,255,0.05);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.4s ease;
          animation: statFadeIn 1s ease-out backwards;
          min-width: 180px;
        }

        .stat-item:nth-child(1) { animation-delay: 0.8s; }
        .stat-item:nth-child(2) { animation-delay: 1s; }
        .stat-item:nth-child(3) { animation-delay: 1.2s; }

        @keyframes statFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-item:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .stat-number {
          font-family: 'Montserrat', sans-serif;
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent-red) 0%, #ff6b7a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          line-height: 1;
          margin-bottom: 10px;
          text-shadow: 0 0 30px rgba(233, 69, 96, 0.5);
        }

        .stat-label {
          font-size: 1rem;
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-top: 50px;
          animation: featuresFadeIn 1s ease-out 1.4s backwards;
        }

        @keyframes featuresFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.9);
          font-size: 1rem;
          font-weight: 500;
        }

        .hero-feature-icon {
          color: var(--accent-red);
          font-size: 1.2rem;
        }

        .hero-loading-wrapper {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          color: rgba(255,255,255,0.95);
          animation: subtitleFadeIn 0.8s ease-out;
        }

        .hero-loading-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-loading-subtitle {
          font-size: 1.05rem;
          color: rgba(241,245,249,0.9);
          max-width: 600px;
          margin: 0 auto;
        }

        .hero-loading-steps {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .hero-loading-step {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(15,23,42,0.75);
          border: 1px solid rgba(148,163,184,0.4);
          box-shadow: 0 10px 30px rgba(15,23,42,0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          opacity: 0;
          transform: translateY(15px);
          animation: heroLoadingStepFade 0.8s ease-out forwards;
        }

        .hero-loading-step:nth-child(1) { animation-delay: 0.1s; }
        .hero-loading-step:nth-child(2) { animation-delay: 0.4s; }
        .hero-loading-step:nth-child(3) { animation-delay: 0.7s; }

        .hero-loading-step-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, rgba(255,255,255,0.2) 40%, transparent 70%);
          border: 2px solid rgba(233,69,96,0.8);
          color: var(--accent-red);
          box-shadow: 0 0 20px rgba(233,69,96,0.5);
        }

        .hero-loading-step-text-title {
          font-weight: 700;
          font-size: 0.98rem;
          color: rgba(248,250,252,0.95);
        }

        .hero-loading-step-text-subtitle {
          font-size: 0.88rem;
          color: rgba(148,163,184,0.95);
        }

        @keyframes heroLoadingStepFade {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-loading-progress {
          position: relative;
          max-width: 420px;
          height: 6px;
          margin: 0 auto;
          border-radius: 999px;
          background: rgba(15,23,42,0.75);
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(148,163,184,0.5);
        }

        .hero-loading-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 0;
          background: linear-gradient(90deg, #e94560, #ff6b7a, #fbbf24);
          animation: heroLoadingProgress 2.4s ease-in-out infinite;
        }

        @keyframes heroLoadingProgress {
          0% {
            width: 0%;
            transform: translateX(-10%);
          }
          50% {
            width: 70%;
            transform: translateX(10%);
          }
          100% {
            width: 100%;
            transform: translateX(0%);
          }
        }

        .hero-loading-hint {
          margin-top: 18px;
          font-size: 0.9rem;
          color: rgba(148,163,184,0.95);
        }

        /* Filter Section */
        .filter-section {
          background: var(--white);
          padding: 30px 20px;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 100px;
          z-index: 100;
        }

        .filter-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 12px 30px;
          border: 2px solid var(--border-light);
          background: var(--white);
          border-radius: 50px;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-dark);
        }

        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .filter-btn.active {
          background: var(--gradient-accent);
          color: var(--white);
          border-color: var(--accent-red);
        }

        .filter-btn.active-all {
          background: var(--gradient-primary);
          color: var(--white);
          border-color: var(--primary-dark);
        }

        /* Products Section */
        .products-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 15px;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 35px;
        }

        .product-card {
          background: var(--white);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg);
        }

        .product-image-wrapper {
          position: relative;
          height: 280px;
          overflow: hidden;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .overlay-btn {
          background: var(--white);
          color: var(--primary-dark);
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .overlay-btn:hover {
          background: var(--accent-red);
          color: var(--white);
        }

        /* Badges */
        .product-badges {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 2;
        }

        .badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: var(--shadow-sm);
          animation: badgeFloat 3s ease-in-out infinite;
        }

        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .badge-featured {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: var(--white);
        }

        .badge-sale {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: var(--white);
        }

        /* Product Content */
        .product-content {
          padding: 25px;
        }

        .product-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 10px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description {
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid var(--border-light);
        }

        .product-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        /* Loading State */
        .loading-container {
          min-height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid var(--border-light);
          border-top-color: var(--accent-red);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 1.2rem;
          color: var(--text-dark);
          font-weight: 600;
        }

        /* Error State */
        .error-container {
          max-width: 600px;
          margin: 60px auto;
          padding: 40px;
          background: var(--white);
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          text-align: center;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .error-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 15px;
        }

        .error-message {
          color: var(--text-light);
          font-size: 1.1rem;
          margin-bottom: 25px;
        }

        .retry-btn {
          background: var(--gradient-accent);
          color: var(--white);
          padding: 14px 35px;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .modal-container {
          background: var(--white);
          border-radius: 25px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-lg);
          animation: modalSlideUp 0.4s ease-out;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          background: var(--gradient-primary);
          color: var(--white);
          padding: 30px;
          border-radius: 25px 25px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .modal-close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: var(--white);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.5rem;
        }

        .modal-close-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 35px;
        }

        .modal-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .gallery-item {
          position: relative;
          height: 200px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover {
          transform: scale(1.05);
        }

        .gallery-item img,
        .gallery-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
        }

        .modal-description {
          background: var(--light-bg);
          padding: 25px;
          border-radius: 15px;
          margin-bottom: 25px;
          border-left: 4px solid var(--accent-red);
        }

        .description-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--primary-dark);
          margin-bottom: 12px;
        }

        .description-text {
          color: var(--text-dark);
          line-height: 1.8;
          font-size: 1rem;
        }

        /* Fullscreen Image Viewer */
        .fullscreen-viewer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          padding: 20px;
        }

        .fullscreen-main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          padding: 20px 80px;
        }

        .fullscreen-image,
        .fullscreen-video {
          max-width: 90%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: high-quality;
        }

        .fullscreen-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(233, 69, 96, 0.9);
          border: none;
          color: var(--white);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .fullscreen-nav-btn:hover {
          background: var(--accent-red);
          transform: translateY(-50%) scale(1.1);
        }

        .fullscreen-nav-btn.prev {
          left: 20px;
        }

        .fullscreen-nav-btn.next {
          right: 20px;
        }

        .fullscreen-close {
          position: absolute;
          top: 30px;
          right: 30px;
          background: var(--accent-red);
          border: none;
          color: var(--white);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.8rem;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .fullscreen-close:hover {
          transform: scale(1.1);
          background: var(--primary-dark);
        }

        .fullscreen-counter {
          position: absolute;
          top: 30px;
          left: 30px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          color: var(--white);
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          z-index: 10;
        }

        .fullscreen-thumbnails {
          width: 100%;
          max-width: 1200px;
          padding: 20px;
          display: flex;
          gap: 15px;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-red) rgba(255,255,255,0.1);
        }

        .fullscreen-thumbnails::-webkit-scrollbar {
          height: 8px;
        }

        .fullscreen-thumbnails::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .fullscreen-thumbnails::-webkit-scrollbar-thumb {
          background: var(--accent-red);
          border-radius: 4px;
        }

        .fullscreen-thumbnails::-webkit-scrollbar-thumb:hover {
          background: #ff6b7a;
        }

        .thumbnail-item {
          flex: 0 0 120px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
        }

        .thumbnail-item:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.3);
        }

        .thumbnail-item.active {
          border-color: var(--accent-red);
          box-shadow: 0 0 20px rgba(233, 69, 96, 0.6);
        }

        .thumbnail-item img,
        .thumbnail-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-video-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0,0,0,0.7);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
          pointer-events: none;
        }

        /* Footer */
        .footer-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          color: var(--white);
          padding: 80px 20px 30px;
          margin-top: 100px;
          position: relative;
          overflow: hidden;
        }

        .footer-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 10% 20%, rgba(233, 69, 96, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(15, 52, 96, 0.1) 0%, transparent 50%);
          animation: footerGlow 10s ease-in-out infinite;
        }

        @keyframes footerGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .footer-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, var(--accent-red), transparent);
          animation: footerLine 3s ease-in-out infinite;
        }

        @keyframes footerLine {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 60px;
          margin-bottom: 60px;
        }

        .footer-column {
          animation: footerFadeIn 0.8s ease-out backwards;
        }

        .footer-column:nth-child(1) { animation-delay: 0.2s; }
        .footer-column:nth-child(2) { animation-delay: 0.4s; }
        .footer-column:nth-child(3) { animation-delay: 0.6s; }

        @keyframes footerFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-column h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          margin-bottom: 25px;
          background: linear-gradient(135deg, var(--accent-red) 0%, #ff6b7a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
        }

        .footer-column p,
        .footer-column a {
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          transition: all 0.3s ease;
          font-size: 1rem;
          padding: 8px 0;
        }

        .footer-column a:hover {
          color: var(--white);
          transform: translateX(5px);
          text-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }

        .footer-contact-item:hover {
          border-color: var(--accent-red);
          padding-left: 10px;
        }

        .footer-icon {
          width: 40px;
          height: 40px;
          background: rgba(233, 69, 96, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-red);
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .footer-contact-item:hover .footer-icon {
          background: var(--accent-red);
          color: var(--white);
          transform: rotate(360deg);
        }

        .footer-certificates {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        .certificate-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          transition: all 0.4s ease;
          background: var(--white);
          padding: 10px;
          max-width: 200px;
        }

        .certificate-wrapper:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 20px 50px rgba(233, 69, 96, 0.4);
        }

        .certificate-img {
          width: 100%;
          height: auto;
          max-height: 150px;
          object-fit: cover;
          border-radius: 10px;
          transition: transform 0.4s ease;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        .certificate-wrapper:hover .certificate-img {
          transform: scale(1.05);
        }

        .certification-badge {
          background: linear-gradient(135deg, rgba(233, 69, 96, 0.3), rgba(255, 107, 122, 0.3));
          border: 2px solid var(--accent-red);
          padding: 16px 28px;
          border-radius: 50px;
          margin-top: 25px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.1rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 5px 20px rgba(233, 69, 96, 0.3);
          animation: badgePulse 3s ease-in-out infinite;
        }

        .hours-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .hours-item {
          background: rgba(255,255,255,0.05);
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }

        .hours-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: var(--accent-red);
          transform: translateX(5px);
        }

        .hours-day {
          font-weight: 600;
          color: rgba(255,255,255,0.9);
        }

        .hours-time {
          color: rgba(255,255,255,0.7);
        }

        .emergency-badge {
          background: var(--gradient-accent);
          padding: 20px 30px;
          border-radius: 15px;
          margin-top: 25px;
          text-align: center;
          font-weight: 700;
          font-size: 1.2rem;
          box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4);
          animation: emergencyPulse 2s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        @keyframes emergencyPulse {
          0%, 100% { 
            box-shadow: 0 10px 30px rgba(233, 69, 96, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 15px 40px rgba(233, 69, 96, 0.6);
            transform: scale(1.02);
          }
        }

        .emergency-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: emergencyShine 2s infinite;
        }

        @keyframes emergencyShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .location-btn {
          background: linear-gradient(135deg, var(--accent-red), #ff6b7a);
          border: none;
          padding: 16px 35px;
          border-radius: 50px;
          color: var(--white);
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          margin-top: 20px;
          transition: all 0.4s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
          position: relative;
          overflow: hidden;
        }

        .location-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .location-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .location-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(233, 69, 96, 0.6);
        }

        .location-btn span {
          position: relative;
          z-index: 1;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          margin: 50px 0 30px;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
        }

        .footer-badges {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }

        .footer-trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 1.1rem;
          font-weight: 600;
          padding: 10px 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 50px;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }

        .footer-trust-badge:hover {
          background: rgba(255,255,255,0.1);
          color: var(--white);
          transform: translateY(-3px);
        }

        .footer-copyright {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
          margin-top: 20px;
        }

        .footer-copyright strong {
          color: var(--accent-red);
          font-weight: 700;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .renovation-page {
            padding-top: 80px;
          }

          .hero-section {
            padding: 40px 20px;
            min-height: 400px;
          }

          .hero-badge {
            font-size: 0.75rem;
            padding: 8px 18px;
          }

          .hero-title {
            font-size: clamp(1.8rem, 7vw, 2.5rem);
            margin-bottom: 20px;
          }

          .hero-subtitle {
            font-size: 0.95rem;
            margin-bottom: 30px;
            line-height: 1.6;
          }

          .hero-cta-buttons {
            gap: 12px;
            margin-bottom: 35px;
          }

          .hero-cta-btn {
            padding: 12px 26px;
            font-size: 0.85rem;
          }

          .hero-stats {
            gap: 20px;
            margin-top: 30px;
          }

          .stat-item {
            padding: 12px 18px;
            min-width: 130px;
          }

          .stat-number {
            font-size: 2.2rem;
            margin-bottom: 8px;
          }

          .stat-label {
            font-size: 0.8rem;
          }

          .hero-features {
            gap: 18px;
            margin-top: 30px;
          }

          .hero-feature-item {
            font-size: 0.85rem;
          }

          .hero-feature-icon {
            font-size: 1.1rem;
          }

          .filter-section {
            top: 80px;
            padding: 20px;
          }

          .fullscreen-main-content {
            padding: 20px 60px;
          }

          .fullscreen-nav-btn {
            width: 45px;
            height: 45px;
            font-size: 1.3rem;
          }

          .fullscreen-nav-btn.prev {
            left: 15px;
          }

          .fullscreen-nav-btn.next {
            right: 15px;
          }

          .fullscreen-counter {
            top: 20px;
            left: 20px;
            font-size: 0.9rem;
            padding: 8px 16px;
          }

          .fullscreen-close {
            top: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 1.5rem;
          }

          .fullscreen-thumbnails {
            padding: 15px;
            gap: 10px;
          }

          .thumbnail-item {
            flex: 0 0 100px;
            height: 70px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
          }

          .product-image-wrapper {
            height: 220px;
          }

          .modal-title {
            font-size: 1.5rem;
          }

          .modal-gallery {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .footer-column h3 {
            font-size: 1.3rem;
          }

          .footer-column p,
          .footer-column a {
            font-size: 0.9rem;
          }

          .footer-contact-item {
            padding: 10px 0;
          }

          .footer-icon {
            width: 35px;
            height: 35px;
            font-size: 1rem;
          }

          .footer-certificates {
            gap: 15px;
            justify-content: center;
          }

          .certificate-wrapper {
            max-width: 150px;
          }

          .certificate-img {
            max-height: 120px;
          }

          .certification-badge {
            padding: 12px 20px;
            font-size: 0.95rem;
          }

          .hours-item {
            padding: 12px 15px;
            font-size: 0.9rem;
          }

          .emergency-badge {
            padding: 15px 20px;
            font-size: 1rem;
          }

          .location-btn {
            padding: 14px 28px;
            font-size: 0.9rem;
          }

          .footer-badges {
            gap: 20px;
          }

          .footer-trust-badge {
            font-size: 0.95rem;
            padding: 8px 16px;
          }
        }

        @media (max-width: 480px) {
          .renovation-page {
            padding-top: 70px;
          }

          .hero-section {
            padding: 30px 15px;
            min-height: 350px;
          }

          .hero-badge {
            font-size: 0.7rem;
            padding: 6px 15px;
            margin-bottom: 20px;
          }

          .hero-title {
            font-size: clamp(1.5rem, 6vw, 2rem);
            margin-bottom: 15px;
          }

          .hero-subtitle {
            font-size: 0.85rem;
            margin-bottom: 25px;
            line-height: 1.5;
          }

          .hero-cta-buttons {
            flex-direction: column;
            width: 100%;
            gap: 10px;
            margin-bottom: 30px;
          }

          .hero-cta-btn {
            width: 100%;
            justify-content: center;
            padding: 11px 24px;
            font-size: 0.8rem;
          }

          .hero-features {
            flex-direction: column;
            gap: 12px;
            margin-top: 25px;
          }

          .hero-feature-item {
            justify-content: center;
            font-size: 0.8rem;
          }

          .hero-feature-icon {
            font-size: 1rem;
          }

          .hero-stats {
            gap: 15px;
            margin-top: 25px;
          }

          .stat-item {
            min-width: 110px;
            padding: 10px 15px;
          }

          .stat-number {
            font-size: 1.8rem;
            margin-bottom: 6px;
          }

          .stat-label {
            font-size: 0.75rem;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .fullscreen-main-content {
            padding: 20px 50px;
          }

          .fullscreen-nav-btn {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }

          .fullscreen-nav-btn.prev {
            left: 10px;
          }

          .fullscreen-nav-btn.next {
            right: 10px;
          }

          .fullscreen-counter {
            top: 15px;
            left: 15px;
            font-size: 0.8rem;
            padding: 6px 12px;
          }

          .fullscreen-close {
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            font-size: 1.3rem;
          }

          .fullscreen-thumbnails {
            padding: 10px;
            gap: 8px;
          }

          .thumbnail-item {
            flex: 0 0 80px;
            height: 60px;
          }

          .product-card {
            border-radius: 12px;
          }

          .product-image-wrapper {
            height: 180px;
          }

          .product-content {
            padding: 15px;
          }

          .product-title {
            font-size: 1.1rem;
            -webkit-line-clamp: 2;
          }

          .product-description {
            font-size: 0.85rem;
            -webkit-line-clamp: 2;
            margin-bottom: 15px;
          }

          .product-meta {
            padding-top: 10px;
          }

          .product-date {
            font-size: 0.8rem;
          }

          .badge {
            padding: 6px 12px;
            font-size: 11px;
          }

          .filter-btn {
            padding: 10px 20px;
            font-size: 14px;
          }

          .footer-column h3 {
            font-size: 1.2rem;
          }

          .footer-column p,
          .footer-column a {
            font-size: 0.85rem;
          }

          .footer-icon {
            width: 32px;
            height: 32px;
            font-size: 0.9rem;
          }

          .certificate-wrapper {
            max-width: 130px;
          }

          .certificate-img {
            max-height: 100px;
          }

          .certification-badge {
            padding: 10px 16px;
            font-size: 0.85rem;
          }

          .hours-item {
            padding: 10px 12px;
            font-size: 0.85rem;
          }

          .hours-day,
          .hours-time {
            font-size: 0.85rem;
          }

          .emergency-badge {
            padding: 12px 18px;
            font-size: 0.9rem;
          }

          .location-btn {
            padding: 12px 24px;
            font-size: 0.85rem;
            width: 100%;
            justify-content: center;
          }

          .footer-badges {
            gap: 15px;
          }

          .footer-trust-badge {
            font-size: 0.85rem;
            padding: 6px 12px;
          }

          .footer-copyright {
            font-size: 0.85rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Background Elements */}
        <div className="hero-floating-elements">
          <FaBolt className="floating-icon" />
          <FaTools className="floating-icon" />
          <FaCog className="floating-icon" />
          <FaLightbulb className="floating-icon" />
          <FaShieldAlt className="floating-icon" />
          <FaAward className="floating-icon" />
        </div>

        {/* Animated Light Beam */}
        <div className="hero-light-beam"></div>

        <div className="hero-content">
          {loading ? (
            <div className="hero-loading-wrapper">
              <div className="hero-loading-title">
                Getting things ready for you...
              </div>
              <p className="hero-loading-subtitle">
                We are fetching the latest products and services from Lalith Electricals. This will only take a moment.
              </p>

              <div className="hero-loading-steps">
                <div className="hero-loading-step">
                  <div className="hero-loading-step-icon">
                    <FaSearch />
                  </div>
                  <div>
                    <div className="hero-loading-step-text-title">Step 1 - Discovering items</div>
                    <div className="hero-loading-step-text-subtitle">Scanning our catalogue of generators and electrical services.</div>
                  </div>
                </div>
                <div className="hero-loading-step">
                  <div className="hero-loading-step-icon">
                    <FaFilter />
                  </div>
                  <div>
                    <div className="hero-loading-step-text-title">Step 2 - Applying filters</div>
                    <div className="hero-loading-step-text-subtitle">Organizing items to match your viewing preferences.</div>
                  </div>
                </div>
                <div className="hero-loading-step">
                  <div className="hero-loading-step-icon">
                    <FaTools />
                  </div>
                  <div>
                    <div className="hero-loading-step-text-title">Step 3 - Final checks</div>
                    <div className="hero-loading-step-text-subtitle">Making sure everything is ready to power up your experience.</div>
                  </div>
                </div>
              </div>

              <div className="hero-loading-progress">
                <div className="hero-loading-progress-bar"></div>
              </div>

              <div className="hero-loading-hint">
                Tip: You can call us anytime for urgent services while the page is loading.
              </div>
            </div>
          ) : (
            <>
              <div className="hero-badge">
                <FaAward style={{marginRight: '5px'}} />
                Certified Electrical Professionals Since 1997
              </div>
              
              <h1 className="hero-title">
                <span className="hero-title-icon"><FaBolt /></span> Professional Electrical Services
              </h1>
              
              <p className="hero-subtitle">
                Quality generator sales, repairs, and electrical solutions with over 28 years of trusted expertise. 
                We bring power to your life with certified excellence and 24/7 emergency support.
              </p>

              <div className="hero-cta-buttons">
                <a href="tel:0779189558" className="hero-cta-btn btn-primary-hero">
                  <span><FaPhone /> Call Us Now</span>
                </a>
                <a href="#products" className="hero-cta-btn btn-secondary-hero">
                  <span><FaTools /> View Services</span>
                </a>
              </div>

              <div className="hero-features">
                <div className="hero-feature-item">
                  <FaCheckCircle className="hero-feature-icon" />
                  Certified & Licensed
                </div>
                <div className="hero-feature-item">
                  <FaCheckCircle className="hero-feature-icon" />
                  24/7 Emergency Service
                </div>
                <div className="hero-feature-item">
                  <FaCheckCircle className="hero-feature-icon" />
                  Quality Guaranteed
                </div>
                <div className="hero-feature-item">
                  <FaCheckCircle className="hero-feature-icon" />
                  Trusted by 1000+ Clients
                </div>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">28+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Happy Clients</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support Available</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <button
            className={`filter-btn ${filterOptions.showAll ? 'active-all' : ''}`}
            onClick={() => handleFilterChange('showAll')}
          >
            <FaFilter /> All Products
          </button>
          <button
            className={`filter-btn ${filterOptions.showFeatured ? 'active' : ''}`}
            onClick={() => handleFilterChange('showFeatured')}
          >
            <FaStar /> Featured
          </button>
          <button
            className={`filter-btn ${filterOptions.showOnSale ? 'active' : ''}`}
            onClick={() => handleFilterChange('showOnSale')}
          >
            <FaTag /> On Sale
          </button>
        </div>
      </div>

      {/* Search Status */}
      {searchParam && (
        <div className="products-section">
          <div className="section-header">
            <p style={{fontSize: '1.1rem', color: 'var(--text-light)'}}>
              Searching for: <strong style={{color: 'var(--accent-red)'}}>"{searchParam}"</strong>
              <button 
                onClick={() => navigate('/')}
                style={{
                  marginLeft: '15px',
                  background: 'var(--accent-red)',
                  color: 'var(--white)',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Clear Search
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section className="products-section">
        {!searchParam && (
          <div className="section-header">
            <h2 className="section-title">Our Products & Services</h2>
            <p className="section-subtitle">
              Browse our comprehensive range of electrical solutions and generator services
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading Products...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Something Went Wrong</h3>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={fetchOrders}>
              <FaTools style={{marginRight: '8px'}} />
              Try Again
            </button>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="products-grid">
            {filteredOrders.map((order) => (
              <div 
                key={order.itemId} 
                className="product-card"
                onClick={() => { setSelectedOrder(order); setShowModal(true); }}
              >
                <div className="product-image-wrapper">
                  {order.profilePicture && (
                    <img 
                      src={getFullUrl(order.profilePicture)} 
                      alt={order.Name}
                      className="product-image"
                    />
                  )}
                  <div className="product-overlay">
                    <button className="overlay-btn">
                      <FaExpand /> View Details
                    </button>
                  </div>
                  
                  <div className="product-badges">
                    {order.featured && (
                      <div className="badge badge-featured">
                        <FaStar /> Featured
                      </div>
                    )}
                    {order.onSale && (
                      <div className="badge badge-sale">
                        <FaTag /> On Sale
                      </div>
                    )}
                  </div>
                </div>

                <div className="product-content">
                  <h3 className="product-title">{order.Name || order.Title}</h3>
                  <p className="product-description">
                    {order.Description ? 
                      (order.Description.length > 120 ? 
                        order.Description.substring(0, 120) + '...' : 
                        order.Description
                      ) : 
                      'Contact us for more information about this product'
                    }
                  </p>
                  <div className="product-meta">
                    <div className="product-date">
                      <FaCalendar />
                      {new Date(order.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="error-container">
            <div className="error-icon">🔍</div>
            <h3 className="error-title">No Products Found</h3>
            <p className="error-message">
              {searchParam 
                ? `No products found matching "${searchParam}"` 
                : 'No products available at the moment'
              }
            </p>
            {searchParam && (
              <button className="retry-btn" onClick={() => navigate('/')}>
                <FaSearch style={{marginRight: '8px'}} />
                Show All Products
              </button>
            )}
          </div>
        )}
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-grid">
            {/* Contact Column */}
            <div className="footer-column">
              <h3>
                <FaPhone /> Contact Us
              </h3>
              
              <div className="footer-contact-item">
                <div className="footer-icon">
                  <FaPhone />
                </div>
                <a href="tel:0779189558">077-918-9558</a>
              </div>

              <div className="footer-contact-item">
                <div className="footer-icon">
                  <FaEnvelope />
                </div>
                <a href="mailto:lalithabesingha@gmail.com">lalithabesingha@gmail.com</a>
              </div>

              <div className="footer-contact-item">
                <div className="footer-icon">
                  <FaMapMarkerAlt />
                </div>
                <p>8 Family Point, Thoraya, Kurunegala</p>
              </div>

              <button 
                onClick={() => setShowMap(true)}
                className="location-btn"
              >
                <span><FaMapMarkerAlt /> View on Map</span>
              </button>
            </div>

            {/* Certifications Column */}
            <div className="footer-column">
              <h3>
                <FaCertificate /> Our Certifications
              </h3>
              
              <div className="footer-certificates">
                <div className="certificate-wrapper">
                  <img src={certificate1} alt="Professional Certificate 1" className="certificate-img" />
                </div>
                <div className="certificate-wrapper">
                  <img src={certificate2} alt="Professional Certificate 2" className="certificate-img" />
                </div>
              </div>

              <div className="certification-badge">
                <FaAward />
                Certified Professional
              </div>
            </div>

            {/* Business Hours Column */}
            <div className="footer-column">
              <h3>
                <FaClock /> Business Hours
              </h3>
              
              <div className="hours-grid">
                <div className="hours-item">
                  <span className="hours-day">Monday - Friday</span>
                  <span className="hours-time">8:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="hours-day">Saturday</span>
                  <span className="hours-time">8:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item" style={{borderColor: 'var(--accent-red)'}}>
                  <span className="hours-day">Sunday</span>
                  <span className="hours-time" style={{color: 'var(--accent-red)'}}>Closed</span>
                </div>
              </div>

              <div className="emergency-badge">
                🚨 24/7 Emergency Service Available
              </div>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <div className="footer-badges">
              <div className="footer-trust-badge">
                <FaShieldAlt />
                Trusted
              </div>
              <div className="footer-trust-badge">
                <FaCheckCircle />
                Professional
              </div>
              <div className="footer-trust-badge">
                <FaAward />
                Reliable
              </div>
              <div className="footer-trust-badge">
                <FaBolt />
                28+ Years
              </div>
            </div>
            
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} <strong>Lalith Electricals</strong>. All rights reserved. | Powered by Excellence
            </p>

            <div style={{
              marginTop: '10px',
              paddingTop: '15px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.7rem',
                marginBottom: '4px'
              }}>
                Website Developed by{' '}
                <a 
                  href="https://shein-freelanzeer.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--accent-red)',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#ff6b7a';
                    e.target.style.textShadow = '0 0 10px rgba(233, 69, 96, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'var(--accent-red)';
                    e.target.style.textShadow = 'none';
                  }}
                >
                  Shehan Salitha
                  <FaExternalLinkAlt style={{fontSize: '0.5rem'}} />
                </a>
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.7rem',
                margin: 0
              }}>
                Professional Freelance Web Developer
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedOrder.Title || selectedOrder.Name}</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-gallery">
                {(() => {
                  const mediaItems = [];
                  if (selectedOrder.productVideo) {
                    mediaItems.push({
                      src: getFullUrl(selectedOrder.productVideo),
                      alt: 'Product Video',
                      type: 'video'
                    });
                  }
                  if (selectedOrder.profilePicture) {
                    mediaItems.push({
                      src: getFullUrl(selectedOrder.profilePicture),
                      alt: 'Image 1',
                      type: 'image'
                    });
                  }
                  if (selectedOrder.alternateProfilePicture) {
                    mediaItems.push({
                      src: getFullUrl(selectedOrder.alternateProfilePicture),
                      alt: 'Image 2',
                      type: 'image'
                    });
                  }
                  if (selectedOrder.thirdProfilePicture) {
                    mediaItems.push({
                      src: getFullUrl(selectedOrder.thirdProfilePicture),
                      alt: 'Image 3',
                      type: 'image'
                    });
                  }
                  if (selectedOrder.fourthProfilePicture) {
                    mediaItems.push({
                      src: getFullUrl(selectedOrder.fourthProfilePicture),
                      alt: 'Image 4',
                      type: 'image'
                    });
                  }

                  return mediaItems.map((item, index) => (
                    <div key={index} className="gallery-item" onClick={() => item.type === 'image' && handleImageClick(item.src, item.alt, item.type, mediaItems, index)}>
                      {item.type === 'video' ? (
                        <video src={item.src} controls />
                      ) : (
                        <img src={item.src} alt={item.alt} />
                      )}
                    </div>
                  ));
                })()}
              </div>

              <div className="modal-description">
                <div className="description-title">Product Description</div>
                <div className="description-text">
                  {selectedOrder.Description || 'No detailed description available for this product.'}
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <div className="product-date">
                  <FaCalendar />
                  <strong>Posted:</strong>
                  {new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="modal-overlay" onClick={() => setShowMap(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FaMapMarkerAlt /> Our Location
              </h2>
              <button className="modal-close-btn" onClick={() => setShowMap(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div style={{marginBottom: '20px'}}>
                <p style={{fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '10px'}}>
                  <strong>Address:</strong> 8 Family Point, Thoraya, Kurunegala
                </p>
                <p style={{fontSize: '1.1rem', color: 'var(--text-dark)'}}>
                  <strong>Contact:</strong> 077-918-9558
                </p>
              </div>
              <iframe
                title="Lalith Electricals Location"
                src="https://www.google.com/maps?q=Lalith+Electricals+Kurunegala&output=embed"
                width="100%"
                height="450px"
                style={{ border: 0, borderRadius: '15px' }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer with Gallery Navigation */}
      {showFullscreenImage && (
        <div className="fullscreen-viewer" onClick={closeFullscreenImage}>
          {/* Counter */}
          {allMedia.length > 1 && (
            <div className="fullscreen-counter">
              {currentMediaIndex + 1} / {allMedia.length}
            </div>
          )}

          {/* Close Button */}
          <button className="fullscreen-close" onClick={closeFullscreenImage}>
            <FaTimes />
          </button>

          {/* Main Content Area with Navigation */}
          <div className="fullscreen-main-content">
            {/* Previous Button */}
            {allMedia.length > 1 && (
              <button 
                className="fullscreen-nav-btn prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevMedia();
                }}
              >
                ←
              </button>
            )}

            {/* Current Media */}
            {allMedia[currentMediaIndex]?.type === 'video' ? (
              <video 
                src={fullscreenImageSrc} 
                className="fullscreen-video"
                controls
                autoPlay
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <img 
                src={fullscreenImageSrc} 
                alt={fullscreenImageAlt}
                className="fullscreen-image"
                onClick={e => e.stopPropagation()}
              />
            )}

            {/* Next Button */}
            {allMedia.length > 1 && (
              <button 
                className="fullscreen-nav-btn next" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextMedia();
                }}
              >
                →
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {allMedia.length > 1 && (
            <div className="fullscreen-thumbnails" onClick={e => e.stopPropagation()}>
              {allMedia.map((item, index) => (
                <div 
                  key={index}
                  className={`thumbnail-item ${index === currentMediaIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  {item.type === 'video' ? (
                    <>
                      <video src={item.src} />
                      <div className="thumbnail-video-indicator">
                        <FaPlay />
                      </div>
                    </>
                  ) : (
                    <img src={item.src} alt={item.alt} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
