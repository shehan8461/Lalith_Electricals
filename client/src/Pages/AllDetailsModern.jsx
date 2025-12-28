import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import certificate1 from '../components/images/cetificate1_page-0002.jpg';
import certificate2 from '../components/images/cetificate2_page-0001.jpg';
import bgImg1 from '../components/images/BackgroundImages/bg4.jpg';
import bgImg2 from '../components/images/BackgroundImages/lalith1.jpeg';
import bgImg3 from '../components/images/BackgroundImages/logo.jpeg';
import bgImg4 from '../components/images/1.jpeg';
import bgImg5 from '../components/images/2.jpeg';
import bgImg6 from '../components/images/3.jpeg';

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
  FaExpand
} from 'react-icons/fa';

export default function AllDetailsModern() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState('');
  const [fullscreenImageAlt, setFullscreenImageAlt] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    showFeatured: false,
    showOnSale: false,
    showAll: true
  });
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search') || '';

  const backgroundImages = [bgImg1, bgImg2, bgImg3, bgImg4, bgImg5, bgImg6];

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
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = `-${scrollX}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      const scrollY = document.body.style.top;
      const scrollX = document.body.style.left;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(parseInt(scrollX || '0') * -1, parseInt(scrollY) * -1);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
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

  const handleImageClick = (imageSrc, imageAlt) => {
    setFullscreenImageSrc(imageSrc);
    setFullscreenImageAlt(imageAlt);
    setShowFullscreenImage(true);
  };

  const closeFullscreenImage = () => {
    setShowFullscreenImage(false);
    setFullscreenImageSrc('');
    setFullscreenImageAlt('');
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
    <div className="modern-page-wrapper">
      <style>{`
        /* Modern Professional Styling */
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Montserrat:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        .modern-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 50%, #e8eff5 100%);
          padding-top: 320px;
          position: relative;
          overflow-x: hidden;
        }

        .modern-page-wrapper::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url(${bgImg1}) center/cover no-repeat;
          opacity: 0.05;
          z-index: 0;
        }

        /* Hero Section Title */
        .modern-hero-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 800;
          text-align: center;
          background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #1e40af 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 30px;
          padding: 20px;
          position: relative;
          animation: titleFloat 3s ease-in-out infinite;
        }

        .modern-hero-title::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          border-radius: 2px;
        }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        /* Modern Filter Tabs */
        .modern-filter-container {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          padding: 0 20px;
        }

        .modern-filter-btn {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modern-filter-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .modern-filter-btn.active-all {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-color: #3b82f6;
        }

        .modern-filter-btn.active-featured {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border-color: #f59e0b;
        }

        .modern-filter-btn.active-sale {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-color: #10b981;
        }

        /* Modern Product Cards Grid */
        .modern-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          padding: 0 20px 60px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .modern-product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          border: 2px solid transparent;
        }

        .modern-product-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 50px rgba(59,130,246,0.3);
          border-color: #3b82f6;
        }

        .modern-product-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modern-product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          transition: transform 0.5s ease;
          padding: 10px;
          background: transparent;
          image-rendering: -webkit-optimize-contrast;
        }

        .modern-product-card:hover .modern-product-image {
          transform: scale(1.05);
        }

        /* High quality image support */
        @media (min-width: 768px) {
          .modern-product-image {
            object-fit: cover;
            padding: 0;
          }
          
          .modern-product-card:hover .modern-product-image {
            transform: scale(1.1);
          }
        }

        .modern-product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modern-product-card:hover .modern-product-overlay {
          opacity: 1;
        }

        /* Badge Styles */
        .modern-badge-featured {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 15px rgba(245,158,11,0.4);
          z-index: 2;
          animation: badgePulse 2s ease-in-out infinite;
        }

        .modern-badge-sale {
          position: absolute;
          top: 55px;
          right: 15px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 15px rgba(16,185,129,0.4);
          z-index: 2;
          animation: badgePulse 2s ease-in-out infinite 0.5s;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Card Content */
        .modern-product-content {
          padding: 20px;
        }

        .modern-product-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .modern-product-subtitle {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 12px;
          font-weight: 500;
        }

        .modern-product-description {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .modern-product-date {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #94a3b8;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }

        /* Modern Footer */
        .modern-footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 60px 20px 30px;
          margin-top: 80px;
          position: relative;
          z-index: 1;
        }

        .modern-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6 0%, #f59e0b 50%, #10b981 100%);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto 40px;
        }

        .footer-section h5 {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #60a5fa;
        }

        .footer-section p, .footer-section a {
          color: #cbd5e1;
          text-decoration: none;
          margin-bottom: 10px;
          display: block;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #3b82f6;
        }

        .footer-certificates {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .footer-certificate-img {
          max-width: 120px;
          max-height: 100px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: transform 0.3s ease;
          object-fit: contain;
          object-position: center;
          background: white;
          padding: 5px;
          image-rendering: -webkit-optimize-contrast;
        }

        .footer-certificate-img:hover {
          transform: scale(1.1);
        }

        .footer-badge {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 10px 20px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          margin-top: 15px;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 30px;
          text-align: center;
          color: #94a3b8;
        }

        /* Loading State */
        .modern-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 20px;
        }

        .modern-spinner {
          width: 60px;
          height: 60px;
          border: 5px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error State */
        .modern-error {
          background: white;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          max-width: 600px;
          margin: 40px auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .modern-error-icon {
          font-size: 4rem;
          color: #ef4444;
          margin-bottom: 20px;
        }

        .modern-error-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 15px;
        }

        .modern-error-message {
          color: #64748b;
          margin-bottom: 25px;
        }

        .modern-retry-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modern-retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.4);
        }

        /* Modal Styles */
        .modern-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4000;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .modern-modal {
          background: white;
          border-radius: 25px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: modalSlideIn 0.4s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modern-modal-header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          padding: 25px 30px;
          border-radius: 25px 25px 0 0;
          position: relative;
        }

        .modern-modal-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .modern-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modern-modal-close:hover {
          background: rgba(255,255,255,0.3);
          transform: rotate(90deg);
        }

        .modern-modal-body {
          padding: 30px;
        }

        .modern-modal-gallery {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }

        .modern-modal-gallery::-webkit-scrollbar {
          height: 8px;
        }

        .modern-modal-gallery::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }

        .modern-modal-media-item {
          min-width: 200px;
          height: 200px;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modern-modal-media-item:hover {
          transform: scale(1.05);
        }

        .modern-modal-media-item img,
        .modern-modal-media-item video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          padding: 5px;
          image-rendering: -webkit-optimize-contrast;
        }

        /* Better quality for larger screens */
        @media (min-width: 768px) {
          .modern-modal-media-item img,
          .modern-modal-media-item video {
            object-fit: cover;
            padding: 0;
          }
        }

        .modern-modal-description {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #3b82f6;
        }

        .modern-modal-description-title {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        .modern-modal-description-text {
          color: #475569;
          line-height: 1.8;
        }

        .modern-modal-date {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          color: #64748b;
          font-size: 1rem;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }

        /* Fullscreen Image Viewer */
        .modern-fullscreen-viewer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5000;
          padding: 20px;
        }

        .modern-fullscreen-image {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          object-position: center;
          border-radius: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          background: transparent;
          image-rendering: -webkit-optimize-contrast;
        }

        .modern-fullscreen-close {
          position: absolute;
          top: 30px;
          right: 30px;
          background: rgba(239,68,68,0.9);
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modern-fullscreen-close:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modern-page-wrapper {
            padding-top: 220px;
          }

          .modern-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .modern-product-image-container {
            height: 200px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .modern-filter-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .modern-products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero Title */}
      <div className="container">
        <h1 className="modern-hero-title">
          <FaBolt /> Generator Sales & Repair Services <FaTools />
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="modern-filter-container">
        <button
          className={`modern-filter-btn ${filterOptions.showAll ? 'active-all' : ''}`}
          onClick={() => handleFilterChange('showAll')}
        >
          All Products
        </button>
        <button
          className={`modern-filter-btn ${filterOptions.showFeatured ? 'active-featured' : ''}`}
          onClick={() => handleFilterChange('showFeatured')}
        >
          <FaStar /> Featured
        </button>
        <button
          className={`modern-filter-btn ${filterOptions.showOnSale ? 'active-sale' : ''}`}
          onClick={() => handleFilterChange('showOnSale')}
        >
          <FaTag /> On Sale
        </button>
      </div>

      {/* Search Status */}
      {searchParam && (
        <div className="text-center mb-4">
          <div className="badge" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '12px 25px',
            fontSize: '1rem',
            borderRadius: '20px'
          }}>
            Searching for: <strong>"{searchParam}"</strong>
            <button 
              onClick={() => navigate('/')}
              style={{
                marginLeft: '10px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="modern-loading">
          <div className="modern-spinner"></div>
          <h4 style={{color: '#3b82f6', fontWeight: 600}}>Loading Products...</h4>
          <p style={{color: '#64748b'}}>Please wait while we fetch the latest products</p>
        </div>
      ) : error ? (
        <div className="modern-error">
          <div className="modern-error-icon">⚠️</div>
          <h3 className="modern-error-title">Connection Error</h3>
          <p className="modern-error-message">{error}</p>
          <button className="modern-retry-btn" onClick={() => fetchOrders()}>
            Try Again
          </button>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="modern-products-grid">
          {filteredOrders.map((order) => (
            <div 
              key={order.itemId} 
              className="modern-product-card"
              onClick={() => { setSelectedOrder(order); setShowModal(true); }}
            >
              {/* Product Image */}
              <div className="modern-product-image-container">
                {order.profilePicture && (
                  <img 
                    src={getFullUrl(order.profilePicture)} 
                    alt={order.Name}
                    className="modern-product-image"
                  />
                )}
                <div className="modern-product-overlay"></div>
                
                {/* Badges */}
                {order.featured && (
                  <div className="modern-badge-featured">
                    <FaStar /> Featured
                  </div>
                )}
                {order.onSale && (
                  <div className="modern-badge-sale">
                    <FaTag /> On Sale
                  </div>
                )}
              </div>

              {/* Product Content */}
              <div className="modern-product-content">
                <h3 className="modern-product-title">{order.Name || order.Title}</h3>
                {order.Title && order.Name && (
                  <p className="modern-product-subtitle">{order.Title}</p>
                )}
                <p className="modern-product-description">
                  {order.Description ? 
                    (order.Description.length > 120 ? 
                      order.Description.substring(0, 120) + '...' : 
                      order.Description
                    ) : 
                    'Contact us for more details'
                  }
                </p>
                <div className="modern-product-date">
                  <FaCalendar />
                  <span>{new Date(order.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit' 
                  })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="modern-error">
          <div className="modern-error-icon">🔍</div>
          <h3 className="modern-error-title">No Products Found</h3>
          <p className="modern-error-message">
            {searchParam 
              ? `No products found for "${searchParam}"` 
              : 'No matching items found!'
            }
          </p>
          {searchParam && (
            <button className="modern-retry-btn" onClick={() => navigate('/')}>
              Show All Products
            </button>
          )}
        </div>
      )}

      {/* Modern Footer */}
      <footer className="modern-footer">
        <div className="footer-grid">
          {/* Contact Section */}
          <div className="footer-section">
            <h5><FaPhone /> Contact Us</h5>
            <a href="tel:0779189558">
              <FaPhone style={{marginRight: '8px'}} />
              077-918-9558
            </a>
            <a href="mailto:lalithabesingha@gmail.com">
              <FaEnvelope style={{marginRight: '8px'}} />
              lalithabesingha@gmail.com
            </a>
            <p style={{marginTop: '10px'}}>
              <FaMapMarkerAlt style={{marginRight: '8px'}} />
              8 Family Point, Thoraya, Kurunegala
            </p>
            <button 
              onClick={() => setShowMap(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                marginTop: '10px'
              }}
            >
              <FaMapMarkerAlt /> View on Map
            </button>
          </div>

          {/* Certifications */}
          <div className="footer-section text-center">
            <h5><FaCertificate /> Certified & Trusted</h5>
            <div className="footer-certificates">
              <img src={certificate1} alt="Certificate 1" className="footer-certificate-img" />
              <img src={certificate2} alt="Certificate 2" className="footer-certificate-img" />
            </div>
            <div className="footer-badge">
              <FaAward /> 28+ Years Experience
            </div>
          </div>

          {/* Service Hours */}
          <div className="footer-section">
            <h5><FaClock /> Service Hours</h5>
            <p><strong>Monday - Saturday:</strong> 8:00 AM - 6:00 PM</p>
            <p style={{color: '#ef4444'}}><strong>Sunday:</strong> Closed</p>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              padding: '10px 15px',
              borderRadius: '15px',
              marginTop: '15px',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              🚨 24/7 Emergency Available
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{marginBottom: '10px'}}>
            <FaShieldAlt style={{marginRight: '8px'}} />
            Trusted • Professional • Reliable
          </p>
          <p>&copy; {new Date().getFullYear()} <strong>Lalith Electricals</strong>. All rights reserved.</p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modern-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modern-modal-header">
              <h2 className="modern-modal-title">{selectedOrder.Title || selectedOrder.Name}</h2>
              <button className="modern-modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modern-modal-body">
              {/* Media Gallery */}
              <div className="modern-modal-gallery">
                {selectedOrder.productVideo && (
                  <div className="modern-modal-media-item">
                    <video src={getFullUrl(selectedOrder.productVideo)} controls />
                  </div>
                )}
                {selectedOrder.profilePicture && (
                  <div className="modern-modal-media-item" onClick={() => handleImageClick(getFullUrl(selectedOrder.profilePicture), 'Image 1')}>
                    <img src={getFullUrl(selectedOrder.profilePicture)} alt="Image 1" />
                  </div>
                )}
                {selectedOrder.alternateProfilePicture && (
                  <div className="modern-modal-media-item" onClick={() => handleImageClick(getFullUrl(selectedOrder.alternateProfilePicture), 'Image 2')}>
                    <img src={getFullUrl(selectedOrder.alternateProfilePicture)} alt="Image 2" />
                  </div>
                )}
                {selectedOrder.thirdProfilePicture && (
                  <div className="modern-modal-media-item" onClick={() => handleImageClick(getFullUrl(selectedOrder.thirdProfilePicture), 'Image 3')}>
                    <img src={getFullUrl(selectedOrder.thirdProfilePicture)} alt="Image 3" />
                  </div>
                )}
                {selectedOrder.fourthProfilePicture && (
                  <div className="modern-modal-media-item" onClick={() => handleImageClick(getFullUrl(selectedOrder.fourthProfilePicture), 'Image 4')}>
                    <img src={getFullUrl(selectedOrder.fourthProfilePicture)} alt="Image 4" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="modern-modal-description">
                <div className="modern-modal-description-title">Description</div>
                <div className="modern-modal-description-text">
                  {selectedOrder.Description || 'No description available'}
                </div>
              </div>

              {/* Date */}
              <div className="modern-modal-date">
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
      )}

      {/* Map Modal */}
      {showMap && (
        <div className="modern-modal-overlay" onClick={() => setShowMap(false)}>
          <div style={{maxWidth: '90vw', width: '90vw', height: '80vh'}} onClick={e => e.stopPropagation()}>
            <div className="modern-modal" style={{height: '100%', maxHeight: '80vh'}}>
              <div className="modern-modal-header">
                <h2 className="modern-modal-title">
                  <FaMapMarkerAlt /> Our Location
                </h2>
                <button className="modern-modal-close" onClick={() => setShowMap(false)}>
                  ×
                </button>
              </div>
              <iframe
                title="Lalith Electricals Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.568019672046!2d80.3804812749553!3d7.292928592716584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3397984852029%3A0xb3631f4523d45c58!2sLalith%20Electricals!5e0!3m2!1sen!2slk!4v1"
                width="100%"
                height="calc(100% - 80px)"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {showFullscreenImage && (
        <div className="modern-fullscreen-viewer" onClick={closeFullscreenImage}>
          <img 
            src={fullscreenImageSrc} 
            alt={fullscreenImageAlt}
            className="modern-fullscreen-image"
            onClick={e => e.stopPropagation()}
          />
          <button className="modern-fullscreen-close" onClick={closeFullscreenImage}>
            ×
          </button>
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            padding: '10px 20px',
            borderRadius: '20px',
            color: 'white'
          }}>
            Press ESC to close
          </div>
        </div>
      )}
    </div>
  );
}
