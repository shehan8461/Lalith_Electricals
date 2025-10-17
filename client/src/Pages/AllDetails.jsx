import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import certificate1 from '../components/images/cetificate1_page-0002.jpg';
import certificate2 from '../components/images/cetificate2_page-0001.jpg';
import bgImg1 from '../components/images/BackgroundImages/bg4.jpg';

import { useDispatch } from 'react-redux';
import { signout } from '../redux/User/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AllDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [fullscreenImageSrc, setFullscreenImageSrc] = useState('');
  const [fullscreenImageAlt, setFullscreenImageAlt] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    showFeatured: false,
    showOnSale: false,
    showAll: true
  });
  // Track which video is active (clicked to play)
  const [activeVideoId, setActiveVideoId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search') || '';

  // Background images array for animation
  const backgroundImages = [bgImg1];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Static background - no animation needed since only one image
    setBgIndex(0);
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
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when fullscreen is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
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
        
        // If no filters are selected, default to showing all
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
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`https://api.lalithelectrical.com/api/auth/users/items`, {
        signal: controller.signal, 
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      let data = await response.json();
      // Sort by date descending (latest first)
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

  const handleSearch = () => {
    filterdata(searchQuery);
  };

  const filterdata = (query) => {
    const filtered = orders.filter(order =>
      order.petname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handlePriceFilter = () => {
    filterOrders(filterQuery, minPrice, maxPrice, colorFilter);
  };

  const handleColorFilterChange = (e) => {
    setColorFilter(e.target.value);
  };

  const filterOrders = (searchQuery, min, max, color) => {
    const updatedOrders = orders.filter(order =>
      order.petname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      order.price >= min && order.price <= max &&
      (color ? order.color.toLowerCase() === color.toLowerCase() : true)
    );
    setFilteredOrders(updatedOrders);
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
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ minHeight: '100vh' }}>
      {/* Blurred Background Layer */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: `url(${backgroundImages[bgIndex]}) center center/cover no-repeat`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          transition: 'background-image 1.5s cubic-bezier(0.4,0,0.2,1)',
          filter: 'blur(7px)',
          zIndex: -1,
          transform: 'scale(1.1)'
        }}
      ></div>
      
  {/* Content Layer */}
  <div className="d-flex flex-column min-vh-100 animated-bg" style={{paddingTop: '16rem'}}>
      {/* Logout Button Top Right */}
      
      {/* Top Heading Section - Full Top */}
      <div className="w-100 d-flex justify-content-center pt-3 pb-4">
        <div className="heading-container d-flex justify-content-center">
          <h2 className="text-center text-white fw-bold heading-with-bg px-3 py-2 mx-auto" style={{
            letterSpacing: '0.4px', 
            textShadow: '2px 2px 6px rgba(0,0,0,0.8)', 
            background: 'linear-gradient(135deg, rgba(75,85,99,0.95) 0%, rgba(107,114,128,0.95) 30%, rgba(156,163,175,0.95) 70%, rgba(209,213,219,0.95) 100%, rgba(255,255,255,0.95) 100%)',
            borderRadius: '20px',
            border: '2px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)',
            position: 'relative',
            overflow: 'hidden',
            fontSize: 'clamp(0.9rem, 4vw, 2rem)',
            maxWidth: '95%',
            width: 'fit-content',
            whiteSpace: 'nowrap',
            transform: 'perspective(1000px) rotateX(5deg)',
          // background: 'linear-gradient(135deg, rgba(75,85,99,0.95) 0%, rgba(107,114,128,0.95) 30%, rgba(156,163,175,0.95) 70%, rgba(255,255,255,0.1) 100%)'
          }}>
            ⚡ Expert Generator Repair & Maintenance Services ⚡
          </h2>
        </div>
      </div>
  
      <div className="container-fluid my-3 flex-grow-1" style={{minHeight: 'calc(100vh - 200px)', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}>
        
        {/* Search Status Indicator */}
        {searchParam && (
          <div className="mb-3 d-flex justify-content-center">
            <div className="d-flex align-items-center px-3 py-2 rounded-pill" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              color: 'white',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
            }}>
              <i className="bi bi-search me-2"></i>
              <span>Searching for: "<strong>{searchParam}</strong>"</span>
              <button 
                className="btn btn-link text-white p-0 ms-2"
                onClick={() => navigate('/')}
                style={{fontSize: '1.2rem', lineHeight: 1}}
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Filter Options - Full Width Tab Style */}
        <div className="mb-4 w-100">
          <div className="d-flex justify-content-center align-items-center w-100" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
            padding: '8px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div className="d-flex w-100 justify-content-center gap-1">
              <button
                className={`flex-fill btn fw-semibold transition-all border-0 ${filterOptions.showAll ? 'filter-tab-active' : 'filter-tab-inactive'}`}
                style={{
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.3px',
                  padding: '12px 20px',
                  background: filterOptions.showAll 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' 
                    : 'transparent',
                  color: filterOptions.showAll ? 'white' : '#64748b',
                  boxShadow: filterOptions.showAll ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                  transform: filterOptions.showAll ? 'translateY(-2px)' : 'translateY(0)',
                  fontWeight: filterOptions.showAll ? '600' : '500'
                }}
                onClick={() => handleFilterChange('showAll')}
                onMouseEnter={(e) => {
                  if (!filterOptions.showAll) {
                    e.target.style.background = 'rgba(59,130,246,0.1)';
                    e.target.style.color = '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterOptions.showAll) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                All
              </button>
              
              <button
                className={`flex-fill btn fw-semibold transition-all border-0 ${filterOptions.showFeatured ? 'filter-tab-active' : 'filter-tab-inactive'}`}
                style={{
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.3px',
                  padding: '12px 20px',
                  background: filterOptions.showFeatured 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' 
                    : 'transparent',
                  color: filterOptions.showFeatured ? 'white' : '#64748b',
                  boxShadow: filterOptions.showFeatured ? '0 4px 12px rgba(245,158,11,0.3)' : 'none',
                  transform: filterOptions.showFeatured ? 'translateY(-2px)' : 'translateY(0)',
                  fontWeight: filterOptions.showFeatured ? '600' : '500'
                }}
                onClick={() => handleFilterChange('showFeatured')}
                onMouseEnter={(e) => {
                  if (!filterOptions.showFeatured) {
                    e.target.style.background = 'rgba(245,158,11,0.1)';
                    e.target.style.color = '#f59e0b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterOptions.showFeatured) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                Featured
              </button>
              
              <button
                className={`flex-fill btn fw-semibold transition-all border-0 ${filterOptions.showOnSale ? 'filter-tab-active' : 'filter-tab-inactive'}`}
                style={{
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  letterSpacing: '0.3px',
                  padding: '12px 20px',
                  background: filterOptions.showOnSale 
                    ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' 
                    : 'transparent',
                  color: filterOptions.showOnSale ? 'white' : '#64748b',
                  boxShadow: filterOptions.showOnSale ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                  transform: filterOptions.showOnSale ? 'translateY(-2px)' : 'translateY(0)',
                  fontWeight: filterOptions.showOnSale ? '600' : '500'
                }}
                onClick={() => handleFilterChange('showOnSale')}
                onMouseEnter={(e) => {
                  if (!filterOptions.showOnSale) {
                    e.target.style.background = 'rgba(16,185,129,0.1)';
                    e.target.style.color = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!filterOptions.showOnSale) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                On Sale
              </button>
            </div>
          </div>
        </div>
        
        {/* Orders Display */}
        <div className="row g-2 g-md-3" style={{marginLeft: '0', marginRight: '0'}}>
          {loading ? (
            <div className="col-12 d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-primary">Loading Products...</h5>
                <p className="text-muted">Please wait while we fetch the latest products</p>
              </div>
            </div>
          ) : error ? (
            <div className="col-12 d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
              <div className="text-center">
                <div className="alert alert-danger d-inline-block" role="alert" style={{maxWidth: '500px'}}>
                  <h6 className="alert-heading">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Connection Error
                  </h6>
                  <p className="mb-3">{error}</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => fetchOrders()}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Try Again
                    </button>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => window.location.reload()}
                    >
                      <i className="bi bi-bootstrap-reboot me-1"></i>
                      Refresh Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div className="col-6 col-md-3" key={order.itemId} style={{paddingLeft: '0.15rem', paddingRight: '0.15rem', marginBottom: '1.5rem'}}>
                <div
                  className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden position-relative card-hover premium-post-border"
                  style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', boxShadow: '0 8px 32px rgba(59,130,246,0.10), 0 1.5px 8px rgba(16,185,129,0.10)', border: '2.5px solid', borderImage: 'linear-gradient(135deg, #3b82f6 0%, #f59e0b 50%, #10b981 100%) 1', transition: 'box-shadow 0.3s, border-color 0.3s' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(59,130,246,0.18), 0 2.5px 12px rgba(16,185,129,0.18)';
                    e.currentTarget.style.borderColor = '#f59e0b';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.10), 0 1.5px 8px rgba(16,185,129,0.10)';
                    e.currentTarget.style.borderColor = '';
                  }}
                  onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                >
      <style>{`
        .premium-post-border {
          border-radius: 1.5rem !important;
          border-width: 2.5px !important;
          border-style: solid !important;
          border-image: linear-gradient(135deg, #3b82f6 0%, #f59e0b 50%, #10b981 100%) 1 !important;
          box-shadow: 0 8px 32px rgba(59,130,246,0.10), 0 1.5px 8px rgba(16,185,129,0.10) !important;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%) !important;
          transition: box-shadow 0.3s, border-color 0.3s !important;
        }
        .premium-post-border:hover {
          box-shadow: 0 12px 36px rgba(59,130,246,0.18), 0 2.5px 12px rgba(16,185,129,0.18) !important;
          border-color: #f59e0b !important;
        }
      `}</style>
                  <div className="position-relative" style={{height: '200px', overflow: 'hidden'}}>
                    {order.productVideo && (order.profilePicture || order.alternateProfilePicture || order.thirdProfilePicture || order.fourthProfilePicture) ? (
                      <div className="d-flex w-100 h-100">
                        {activeVideoId === order.itemId ? (
                          <video
                            src={getFullUrl(order.productVideo)}
                            controls
                            autoPlay
                            className="w-75 h-100 object-fit-cover card-img-top transition"
                            style={{objectFit: 'cover', height: '100%', width: '75%', borderRadius: '0', background: '#000', position: 'relative', zIndex: 2, pointerEvents: 'auto'}}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <div
                            className="w-75 h-100 d-flex align-items-center justify-content-center card-img-top transition"
                            style={{objectFit: 'cover', height: '100%', width: '75%', borderRadius: '0', background: '#000', position: 'relative', zIndex: 2, cursor: 'pointer'}}
                            onClick={e => { e.stopPropagation(); setActiveVideoId(order.itemId); }}
                          >
                            <img
                              src={getFullUrl(order.profilePicture || order.alternateProfilePicture || order.thirdProfilePicture || order.fourthProfilePicture)}
                              alt="Video Thumbnail"
                              className="w-100 h-100 object-fit-cover"
                              style={{objectFit: 'cover', height: '100%', width: '100%', borderRadius: '0', opacity: 0.7}}
                            />
                            <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: 48, pointerEvents: 'none'}}>
                              <i className="bi bi-play-circle-fill"></i>
                            </div>
                          </div>
                        )}
                        <div className="d-flex flex-column w-25 h-100">
                          {[order.profilePicture, order.alternateProfilePicture, order.thirdProfilePicture, order.fourthProfilePicture].filter(Boolean).slice(0, 3).map((src, index) => (
                            <img
                              key={index}
                              src={getFullUrl(src)}
                              alt={`Product ${index + 1}`}
                              className="w-100 object-fit-cover card-img-top transition"
                              style={{objectFit: 'cover', height: `${100/3}%`, width: '100%', borderRadius: '0', borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.3)' : 'none'}}
                            />
                          ))}
                        </div>
                      </div>
                    ) : order.productVideo ? (
                      activeVideoId === order.itemId ? (
                        <video
                          src={getFullUrl(order.productVideo)}
                          controls
                          autoPlay
                          className="w-100 h-100 object-fit-cover card-img-top transition"
                          style={{objectFit: 'cover', height: '100%', width: '100%', borderRadius: '0', background: '#000', position: 'relative', zIndex: 2, pointerEvents: 'auto'}}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div
                          className="w-100 h-100 d-flex align-items-center justify-content-center card-img-top transition"
                          style={{objectFit: 'cover', height: '100%', width: '100%', borderRadius: '0', background: '#000', position: 'relative', zIndex: 2, cursor: 'pointer'}}
                          onClick={e => { e.stopPropagation(); setActiveVideoId(order.itemId); }}
                        >
                          <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontSize: 48, pointerEvents: 'none'}}>
                            <i className="bi bi-play-circle-fill"></i>
                          </div>
                        </div>
                      )
                    ) : (order.profilePicture || order.alternateProfilePicture || order.thirdProfilePicture || order.fourthProfilePicture) ? (
                      <div className="d-flex w-100 h-100">
                        {(() => {
                          const images = [order.profilePicture, order.alternateProfilePicture, order.thirdProfilePicture, order.fourthProfilePicture].filter(Boolean);
                          if (images.length === 1) {
                            return (
                              <img
                                src={images[0]}
                                alt="Product"
                                className="w-100 h-100 object-fit-cover card-img-top transition"
                                style={{objectFit: 'cover', height: '100%', width: '100%', borderRadius: '0'}}
                              />
                            );
                          } else {
                            return (
                              <>
                                <img
                                  src={images[0]}
                                  alt="Main Product"
                                  className="h-100 object-fit-cover card-img-top transition"
                                  style={{objectFit: 'cover', height: '100%', width: '75%', borderRadius: '0'}}
                                />
                                <div className="d-flex flex-column h-100" style={{width: '25%'}}>
                                  {images.slice(1, 4).map((src, index) => (
                                    <img
                                      key={index}
                                      src={src}
                                      alt={`Product ${index + 2}`}
                                      className="w-100 object-fit-cover card-img-top transition"
                                      style={{objectFit: 'cover', height: `${100/Math.min(3, images.length-1)}%`, width: '100%', borderRadius: '0', borderBottom: index < Math.min(2, images.length-2) ? '1px solid rgba(255,255,255,0.3)' : 'none'}}
                                    />
                                  ))}
                                </div>
                              </>
                            );
                          }
                        })()}
                      </div>
                    ) : null}
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(180deg,rgba(0,0,0,0.15) 60%,rgba(0,0,0,0.5) 100%)', pointerEvents: 'none'}}></div>
                    
                    {/* Featured and On Sale Badges */}
                    <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1" style={{zIndex: 3}}>
                      {order.featured && (
                        <span className="badge badge-featured d-flex align-items-center" style={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          borderRadius: '12px',
                          padding: '4px 8px',
                          boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <i className="bi bi-star-fill me-1" style={{fontSize: '0.6rem'}}></i>
                          Featured
                        </span>
                      )}
                      {order.onSale && (
                        <span className="badge badge-on-sale d-flex align-items-center" style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          borderRadius: '12px',
                          padding: '4px 8px',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <i className="bi bi-tag-fill me-1" style={{fontSize: '0.6rem'}}></i>
                          Sale
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="card-body p-3 premium-card-content">
                    <div className="card-title-wrapper mb-2">
                      <h5 className="card-title text-primary fw-bold mb-1 premium-title" style={{
                        fontSize: '1.2rem', 
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)', 
                        backgroundClip: 'text', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        textShadow: '0 2px 4px rgba(59,130,246,0.3)',
                        letterSpacing: '0.5px',
                        lineHeight: '1.3',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <span className="title-shimmer">{order.Name || order.Title}</span>
                      </h5>
                      <div className="title-underline"></div>
                    </div>
                    <h6 className="card-subtitle text-secondary mb-2 premium-subtitle" style={{fontSize: '0.9rem', fontWeight: '500', color: '#64748b'}}>{order.Title && order.Name ? order.Title : ''}</h6>
                    <div className="description-box mb-2">
                      <p className="card-text text-muted mb-0 premium-description" style={{minHeight: '32px', fontSize: '0.95rem', lineHeight: '1.5', color: '#475569'}}>
                        <span className="description-label"></span> <span className="description-text">{order.Description}</span>
                      </p>
                    </div>
                    <div className="date-section d-flex align-items-center justify-content-end">
                      <p className="card-text mb-0 premium-date" style={{fontSize: '0.65rem', fontWeight: '400', color: '#6b7280'}}>
                        <i className="bi bi-calendar-check me-1 text-muted" style={{fontSize: '0.6rem'}}></i>
                        <span className="date-value">{new Date(order.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: '2-digit' 
                        })}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-5">
              <p className="fs-5 text-danger mb-2">
                {searchParam 
                  ? `No products found for "${searchParam}"` 
                  : 'No matching items found!'
                }
              </p>
              {searchParam && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Show All Products
                </button>
              )}
            </div>
          )}
        </div>
        {/* Modal Popup */}
        {showModal && selectedOrder && (
          <div className="modal fade show d-flex align-items-center justify-content-center" style={{position:'fixed', top:'200px', left:0, right:0, width:'100%', height:'calc(100vh - 200px)', display:'flex', background:'rgba(0,0,0,0.5)', zIndex:1050, overflowY:'auto', alignItems:'flex-start'}} tabIndex="-1" role="dialog" onClick={()=>setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'480px', width:'96vw', margin:'32px auto'}} role="document" onClick={e => e.stopPropagation()}>
                <div className="modal-content rounded-5 border-0 shadow-lg premium-modal" style={{background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #e0e7ef 100%)', width:'100%', boxShadow:'0 25px 80px rgba(0,0,0,0.25), 0 10px 30px rgba(59,130,246,0.15)', border: '1px solid rgba(255,255,255,0.8)'}}>
                <div className="modal-header border-0 pb-0 align-items-start d-flex justify-content-between premium-modal-header" style={{background:'linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#60a5fa 100%)', borderTopLeftRadius:'2rem', borderTopRightRadius:'2rem', minHeight:'0', paddingTop:'1rem', paddingBottom:'1rem', position: 'relative', overflow: 'hidden'}}>
                  <div className="modal-header-bg"></div>
                  <h4 className="modal-title text-white fw-bold m-0 premium-modal-title" style={{letterSpacing:'0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', position: 'relative', zIndex: 2}}>{selectedOrder.Title}</h4>
                  <button type="button" className="btn-close btn-close-white ms-2 premium-close-btn" aria-label="Close" style={{filter:'brightness(2)', fontSize:'1.2rem', position: 'relative', zIndex: 2}} onClick={()=>setShowModal(false)}></button>
                </div>
                <div className="modal-body pt-4 pb-4 px-4 premium-modal-body">
                  <div className="mb-4 w-100 d-flex justify-content-flex-start align-items-center flex-nowrap overflow-auto media-scrollbar premium-media-section modal-media-section" style={{height:'240px', gap:'15px', whiteSpace:'nowrap', paddingBottom:'10px', background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.9) 100%)', borderRadius: '20px', padding: '15px', boxShadow: '0 8px 25px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)'}}>
                    {selectedOrder.productVideo && (
                      <div className="media-box flex-shrink-0 premium-media-item">
                        <video src={selectedOrder.productVideo} controls className="media-content" onClick={(e) => e.stopPropagation()} />
                        <div className="media-overlay">
                          <i className="bi bi-play-circle-fill text-white"></i>
                        </div>
                      </div>
                    )}
                    {selectedOrder.profilePicture && (
                      <div className="media-box flex-shrink-0 premium-media-item" onClick={() => handleImageClick(selectedOrder.profilePicture, 'Picture 1')}>
                        <img src={selectedOrder.profilePicture} alt="Picture 1" className="media-content" />
                        <div className="media-overlay">
                          <i className="bi bi-zoom-in text-white"></i>
                        </div>
                      </div>
                    )}
                    {selectedOrder.alternateProfilePicture && (
                      <div className="media-box flex-shrink-0 premium-media-item" onClick={() => handleImageClick(selectedOrder.alternateProfilePicture, 'Picture 2')}>
                        <img src={selectedOrder.alternateProfilePicture} alt="Picture 2" className="media-content" />
                        <div className="media-overlay">
                          <i className="bi bi-zoom-in text-white"></i>
                        </div>
                      </div>
                    )}
                    {selectedOrder.thirdProfilePicture && (
                      <div className="media-box flex-shrink-0 premium-media-item" onClick={() => handleImageClick(selectedOrder.thirdProfilePicture, 'Picture 3')}>
                        <img src={selectedOrder.thirdProfilePicture} alt="Picture 3" className="media-content" />
                        <div className="media-overlay">
                          <i className="bi bi-zoom-in text-white"></i>
                        </div>
                      </div>
                    )}
                    {selectedOrder.fourthProfilePicture && (
                      <div className="media-box flex-shrink-0 premium-media-item" onClick={() => handleImageClick(selectedOrder.fourthProfilePicture, 'Picture 4')}>
                        <img src={selectedOrder.fourthProfilePicture} alt="Picture 4" className="media-content" />
                        <div className="media-overlay">
                          <i className="bi bi-zoom-in text-white"></i>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-3 p-4 bg-white rounded-4 shadow border border-2 border-primary-subtle premium-description-box" style={{fontSize:'1rem', color:'#1e293b', wordBreak:'break-word', minHeight:'60px', maxHeight:'140px', overflowY:'auto', boxShadow:'0 8px 25px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.9)', background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)', border: '1px solid rgba(59,130,246,0.15)', position: 'relative'}}>
                    <div className="description-icon">
                      <i className="bi bi-card-text text-primary"></i>
                    </div>
                    <strong className="description-header">Description:</strong> 
                    <span className="description-content">{selectedOrder.Description}</span>
                  </div>
                  <div className="mb-2 text-end premium-date-section" style={{fontSize:'1.1rem', color:'#2563eb', fontWeight: '600'}}>
                    <i className="bi bi-calendar-check me-2 text-success"></i>
                    <span className="date-highlight">{new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: '2-digit' 
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Flexible, responsive footer placed as the last child of the flex column so it sits at the bottom */}
      <footer className="site-footer w-100 text-white" role="contentinfo" style={{background: 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 50%, rgba(15,23,42,0.95) 100%)', borderTop: '2px solid rgba(59,130,246,0.6)'}}>
        <div className="container d-flex flex-column flex-md-row align-items-start justify-content-between" style={{maxWidth: 1200, padding: '1.25rem'}}>
          <div className="footer-col d-flex flex-column" style={{flex: '1 1 0', minWidth: 200}}>
            <h6 className="fw-bold text-primary mb-2" style={{fontSize: '0.95rem'}}>Contact</h6>
            <a href="mailto:lalitabesinha@gmail.com" className="text-white text-decoration-none mb-1">lalitabesinha@gmail.com</a>
            <div className="text-white-50 mb-1">8 Family Point, Thoraya, Kurunegala</div>
            <button onClick={() => setShowMap(true)} className="btn btn-link p-0 m-0 text-info text-decoration-none" style={{maxWidth: 'fit-content'}}>📍 View on Google Maps</button>
          </div>

          <div className="footer-col d-flex flex-column align-items-center" style={{flex: '1 1 0', minWidth: 200}}>
            <h6 className="fw-bold text-warning mb-2" style={{fontSize: '0.95rem'}}>Certified & Trusted</h6>
            <div className="d-flex gap-2 align-items-center justify-content-center mb-2" style={{flexWrap: 'wrap'}}>
              <img src={certificate1} alt="Government" style={{maxHeight: 64, maxWidth: 120, objectFit: 'cover', borderRadius: 8}} />
              <img src={certificate2} alt="Award" style={{maxHeight: 64, maxWidth: 120, objectFit: 'cover', borderRadius: 8}} />
            </div>
            <span className="badge text-white" style={{background: 'linear-gradient(45deg, #f59e0b, #d97706)'}}>🏆 28+ Years Experience</span>
          </div>

          <div className="footer-col d-flex flex-column align-items-md-end align-items-start" style={{flex: '1 1 0', minWidth: 200}}>
            <h6 className="fw-bold text-success mb-2" style={{fontSize: '0.95rem'}}>Service Hours</h6>
            <div className="text-white-50 mb-1"><strong>Mon - Sat:</strong> 8:00 AM - 6:00 PM</div>
            <div className="text-white-50 mb-1"><strong className="text-danger">Sunday:</strong> Closed</div>
            <div><span className="badge bg-danger">🚨 24/7 Available</span></div>
          </div>
        </div>

        <div style={{borderTop: '1px solid rgba(255,255,255,0.04)'}} />
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center" style={{maxWidth: 1200, padding: '0.75rem 1.25rem'}}>
          <div className="text-muted" style={{fontSize: '0.85rem'}}>&copy; {new Date().getFullYear()} <strong className="text-primary">Lalith Electricals</strong>. All rights reserved.</div>
          <div className="text-muted" style={{fontSize: '0.85rem'}}> <i className="bi bi-shield-check me-1 text-success"></i> Trusted • Professional • Reliable</div>
        </div>

        {/* Small CSS overrides to keep footer flexible and avoid overflow */}
        <style>{`
          .site-footer img { max-width: 100%; height: auto; display: block; }
          .site-footer .footer-col { box-sizing: border-box; padding: 0.25rem 0.5rem; }
          @media (max-width: 767px) {
            .site-footer .container { padding-left: 1rem !important; padding-right: 1rem !important; }
            .site-footer { text-align: left; }
            .site-footer .footer-col { width: 100%; }
          }
        `}</style>
      </footer>
      {/* Google Maps Popup */}
      {showMap && (
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{position:'fixed', top:0, left:0, right:0, width:'100%', height:'100%', display:'flex', background:'rgba(0,0,0,0.5)', zIndex:2000}} tabIndex="-1" role="dialog" onClick={()=>setShowMap(false)}>
          <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'90vw', width:'90vw', height:'80vh', margin:'auto'}} role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4 border-0 shadow-lg p-0" style={{height:'80vh', width:'100%', overflow:'hidden'}}>
              <div className="modal-header border-0 pb-0 align-items-start d-flex justify-content-between" style={{background:'#2563eb', borderTopLeftRadius:'1.5rem', borderTopRightRadius:'1.5rem', minHeight:'0', paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                <h5 className="modal-title text-white fw-bold m-0" style={{letterSpacing:'1px', fontSize:'1.1rem'}}>Lalith Electricals Location</h5>
                <button type="button" className="btn-close btn-close-white ms-2" aria-label="Close" style={{filter:'brightness(2)', fontSize:'1.2rem'}} onClick={()=>setShowMap(false)}></button>
              </div>
              <div className="modal-body p-0" style={{height:'calc(80vh - 48px)', width:'100%'}}>
                <iframe
                  title="Lalith Electricals Kurunegala Map"
                  src="https://www.google.com/maps?q=Lalith+Electricals+Kurunegala&output=embed"
                  width="100%"
                  height="100%"
                  style={{border:0}}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fullscreen Image Viewer */}
      {showFullscreenImage && (
        <div className="modal fade show d-flex align-items-center justify-content-center fullscreen-image-viewer" 
             style={{
               position: 'fixed', 
               top: 0, 
               left: 0, 
               right: 0,
               width: '100%', 
               height: '100%', 
               display: 'flex', 
               background: 'rgba(0,0,0,0.9)', 
               zIndex: 2050,
               backdropFilter: 'blur(5px)'
             }} 
             tabIndex="-1" 
             role="dialog" 
             onClick={closeFullscreenImage}>
          <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center" 
               style={{padding: '20px'}} 
               onClick={e => e.stopPropagation()}>
            
            {/* Close button */}
            <button 
              type="button" 
              className="position-absolute d-flex align-items-center justify-content-center" 
              aria-label="Close"
              onClick={closeFullscreenImage}
              style={{
                top: '20px',
                right: '30px',
                zIndex: 2051,
                background: 'rgba(220, 53, 69, 0.8)',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                fontSize: '1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 'bold'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'rgba(220, 53, 69, 1)';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'rgba(220, 53, 69, 0.8)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ✕
            </button>
            
            {/* Image */}
              <img 
              src={fullscreenImageSrc} 
              alt={fullscreenImageAlt}
              className="img-fluid fullscreen-image"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
            
            {/* Image info */}
            <div className="position-absolute bottom-0 left-0 right-0 text-center p-3">
              <p className="text-white mb-0" style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {fullscreenImageAlt}
              </p>
            </div>
            
            {/* Navigation hint */}
            <div className="position-absolute top-0 left-0 right-0 text-center p-3">
              <p className="text-white-50 mb-0" style={{
                fontSize: '0.9rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.7)'
              }}>
                Press <kbd style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>ESC</kbd> or click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        /* Media box hover effects */
        .media-box:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 35px rgba(0,0,0,0.15), 
            0 6px 18px rgba(59,130,246,0.15),
            inset 0 1px 0 rgba(255,255,255,0.9);
          cursor: pointer;
        }
        
        .media-box:hover .media-overlay {
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        
        .media-box .media-overlay {
          transition: opacity 0.3s ease;
        }
        
        /* Fullscreen image viewer styles */
        .fullscreen-image-viewer {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .fullscreen-image-viewer img {
          animation: imageZoomIn 0.4s ease-out;
        }
        
        @keyframes imageZoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Responsive fullscreen viewer */
        @media (max-width: 768px) {
          .fullscreen-image-viewer img {
            max-width: 95% !important;
            max-height: 95% !important;
            min-height: 70vh !important;
            height: auto !important;
            width: auto !important;
          }
          
          .fullscreen-image-viewer .btn-close {
            top: 10px !important;
            right: 15px !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 1.2rem !important;
          }
          
          .fullscreen-image-viewer .position-relative {
            padding: 10px !important;
          }
          
          /* Hide image info on mobile to give more space for image */
          .fullscreen-image-viewer .position-absolute.bottom-0 {
            display: none !important;
          }
          
          /* Adjust navigation hint position */
          .fullscreen-image-viewer .position-absolute.top-0 {
            top: 50px !important;
          }
        }
        
        /* For very small screens (phones in portrait) */
        @media (max-width: 480px) {
          .fullscreen-image-viewer img {
            max-width: 98% !important;
            max-height: 98% !important;
            min-height: 75vh !important;
          }
          
          .fullscreen-image-viewer .position-relative {
            padding: 5px !important;
          }
          
          /* Hide navigation hint on very small screens */
          .fullscreen-image-viewer .position-absolute.top-0 {
            display: none !important;
          }
        }
        
      /* Removed global body padding to avoid causing overflow on small screens.
        Header/nav spacing is handled via .main-navbar and .animated-bg rules. */
        
        /* Filter Animation */
        .transition-all {
          transition: all 0.3s ease;
        }
        .transition-all:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }
        
        /* Badge Animations */
        .badge-featured {
          animation: featuredPulse 2s ease-in-out infinite;
        }
        .badge-on-sale {
          animation: saleBounce 1.5s ease-in-out infinite;
        }
        
        @keyframes featuredPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(245,158,11,0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(245,158,11,0.6);
          }
        }
        
        @keyframes saleBounce {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            box-shadow: 0 2px 8px rgba(16,185,129,0.4);
          }
          50% { 
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 6px 16px rgba(16,185,129,0.6);
          }
        }
        
        /* Filter Tab Styles */
        .filter-tab-active {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-tab-inactive {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .filter-tab-inactive:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        /* Active tab animation */
        .filter-tab-active {
          animation: tabActivate 0.4s ease-out;
        }
        
        @keyframes tabActivate {
          0% {
            transform: translateY(0) scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-3px) scale(1.02);
          }
          100% {
            transform: translateY(-2px) scale(1);
            opacity: 1;
          }
        }
        
        /* Filter container responsive */
        @media (max-width: 768px) {
          .filter-tab-active, .filter-tab-inactive {
            font-size: 0.8rem !important;
            padding: 10px 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          .filter-tab-active, .filter-tab-inactive {
            font-size: 0.75rem !important;
            padding: 8px 12px !important;
          }
        }
        
        .heading-container {
          position: relative;
          display: inline-block;
        }
        .heading-container::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #3b82f6);
          background-size: 400% 400%;
          border-radius: 35px;
          z-index: -2;
          animation: gradientFlow 4s ease infinite;
          opacity: 0.7;
          filter: blur(8px);
        }
        .heading-with-bg {
          animation: headingFloat 6s ease-in-out infinite, headingGlow 3s ease-in-out infinite alternate;
          position: relative;
          z-index: 1;
        }
        .heading-with-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1));
          background-size: 200% 200%;
          border-radius: 25px;
          z-index: -1;
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes headingFloat {
          0%, 100% { transform: perspective(1000px) rotateX(5deg) translateY(0px); }
          50% { transform: perspective(1000px) rotateX(5deg) translateY(-8px); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes headingGlow {
          0% { 
            box-shadow: 0 15px 35px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3), 0 0 30px rgba(75,85,99,0.4);
          }
          100% { 
            box-shadow: 0 20px 50px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.4), 0 0 50px rgba(107,114,128,0.6);
          }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.08) 100%);
          z-index: -1;
          animation: bg-shimmer 10s ease-in-out infinite, bg-pulse 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes bg-shimmer {
          0%, 100% { opacity: 0.1; transform: translateX(-15px) scale(1); }
          50% { opacity: 0.4; transform: translateX(15px) scale(1.02); }
        }
        @keyframes bg-pulse {
          0%, 100% { filter: brightness(1) saturate(1); }
          50% { filter: brightness(1.1) saturate(1.2); }
        }
        .card-hover {
          backdrop-filter: blur(12px);
          background: linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.92) 50%, rgba(240,244,255,0.95) 100%) !important;
          border: 2px solid transparent !important;
          background-clip: padding-box;
          position: relative;
          transform: translateY(0px) scale(1);
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.08), 
            0 4px 15px rgba(59,130,246,0.12),
            0 0 0 1px rgba(255,255,255,0.6),
            inset 0 1px 0 rgba(255,255,255,0.9);
          overflow: hidden;
        }
        .card-hover .card-body {
          position: relative;
          z-index: 2;
        }
        .certificates-section {
          background: linear-gradient(135deg, rgba(75,85,99,0.85) 0%, rgba(107,114,128,0.85) 30%, rgba(156,163,175,0.85) 70%, rgba(209,213,219,0.85) 100%);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 6px 24px rgba(0,0,0,0.15);
        }
        .modal-backdrop { display: none; }
        .media-box {
          width: 200px;
          height: 200px;
          min-width: 180px;
          max-width: 220px;
          border-radius: 20px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8faff 0%, #e0e7ef 100%);
          box-shadow: 
            0 8px 25px rgba(0,0,0,0.1), 
            0 4px 12px rgba(59,130,246,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          border: 2px solid rgba(255,255,255,0.8);
        }
        .media-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(59,130,246,0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          font-size: 2rem;
          backdrop-filter: blur(2px);
          pointer-events: none;
        }
        .premium-card-content {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%);
          border-radius: 0 0 1.5rem 1.5rem;
          backdrop-filter: blur(10px);
        }
        .card-title-wrapper {
          position: relative;
        }
        .title-underline {
          height: 3px;
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, transparent 100%);
          border-radius: 2px;
          margin-top: 4px;
          width: 100%;
        }
        .description-box {
          background: linear-gradient(135deg, rgba(240,244,255,0.9) 0%, rgba(248,250,252,1) 100%);
          border-radius: 12px;
          padding: 12px;
          border: 1px solid rgba(59,130,246,0.2);
        }
        .description-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }
        .description-text {
          color: #6b7280;
          line-height: 1.5;
        }
        .date-section {
          padding: 4px 0;
        }
        .date-label {
          font-weight: 600;
          color: #374151;
        }
        .date-value {
          color: #2563eb;
          font-weight: 500;
        }
        .card-action-icon {
          opacity: 1;
          font-size: 1.2rem;
          transform: translateX(5px);
        }
        .modal-header-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
          opacity: 0.3;
        }
        .premium-description-box {
          position: relative;
          overflow: hidden;
        }
        .premium-description-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%);
        }
        .description-icon {
          position: absolute;
          top: -2px;
          right: 15px;
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
          box-shadow: 0 4px 8px rgba(59,130,246,0.3);
        }
        .description-header {
          color: #1e40af;
          font-size: 1rem;
          margin-bottom: 8px;
          display: block;
        }
        .description-content {
          color: #475569;
          line-height: 1.6;
        }
        .premium-date-section {
          background: linear-gradient(135deg, rgba(240,244,255,0.8) 0%, rgba(248,250,252,0.9) 100%);
          border-radius: 12px;
          padding: 12px 16px;
          border: 1px solid rgba(59,130,246,0.15);
          box-shadow: 0 4px 12px rgba(59,130,246,0.05);
        }
        .date-highlight {
          background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }
        .media-content {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          display: block;
          position: relative;
          z-index: 1;
        }
        .media-box video.media-content {
          object-fit: contain;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          display: block;
          position: relative;
          z-index: 1;
          pointer-events: auto;
        }
        video {
          position: relative;
          z-index: 2;
          pointer-events: auto;
        }
        @media (max-width: 600px) {
          .heading-with-bg {
            font-size: 0.9rem !important;
            padding: 0.5rem 1rem !important;
            border-radius: 15px !important;
            letter-spacing: 0.2px !important;
            max-width: 98% !important;
          }
          .heading-container::before {
            border-radius: 25px !important;
          }
          .media-box {
            width: 70px;
            height: 110px;
            min-width: 65px;
            max-width: 75px;
            border-radius: 8px;
          }
          .media-content, .media-box video.media-content {
            border-radius: 8px;
          }
          .modal-body.pt-3.pb-4.px-4 > .mb-4 {
            gap: 4px !important;
            height: 120px !important;
            padding-bottom: 2px !important;
          }
          .modal-body .mb-3 {
            padding: 0.5rem !important;
            font-size: 0.75rem !important;
            min-height: 25px !important;
            max-height: 60px !important;
          }
          .modal-body .mb-2 {
            font-size: 0.8rem !important;
          }
          .modal-title {
            font-size: 0.95rem !important;
          }
          .modal-header {
            padding-top: 0.4rem !important;
            padding-bottom: 0.4rem !important;
          }
          .modal-dialog {
            max-width: 75vw !important;
            width: 75vw !important;
            margin: 10px auto !important;
          }
          .modal-content {
            border-radius: 10px !important;
            width: 100% !important;
            min-width: 0 !important;
            margin: 0 !important;
          }
          .modal-header, .modal-body, .modal-footer {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          .modal-body.pt-3.pb-4.px-4 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 0.75rem !important;
            padding-bottom: 0.75rem !important;
          }
          .modal-body.pt-3.pb-4.px-4 > .mb-4 {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 3px !important;
            height: auto !important;
            min-height: 120px !important;
            padding-bottom: 2px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .media-box {
            width: calc(50% - 1.5px) !important;
            height: 110px !important;
            min-width: calc(50% - 1.5px) !important;
            max-width: calc(50% - 1.5px) !important;
            border-radius: 8px !important;
            flex-shrink: 0 !important;
          }
        }
        @media (max-width: 400px) {
          .heading-with-bg {
            font-size: 0.8rem !important;
            padding: 0.4rem 0.8rem !important;
            border-radius: 12px !important;
            letter-spacing: 0.1px !important;
            max-width: 99% !important;
          }
          .heading-container::before {
            border-radius: 22px !important;
          }
          .media-box {
            width: 80px;
            height: 120px;
            min-width: 70px;
            max-width: 90px;
            border-radius: 8px;
          }
          .media-content, .media-box video.media-content {
            border-radius: 8px;
          }
          .modal-body.pt-3.pb-4.px-4 > .mb-4 {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 4px !important;
            height: auto !important;
            min-height: 130px !important;
            padding-bottom: 2px !important;
          }
          .media-box {
            width: calc(50% - 2px) !important;
            height: 120px !important;
            min-width: calc(50% - 2px) !important;
            max-width: calc(50% - 2px) !important;
            border-radius: 8px !important;
            flex-shrink: 0 !important;
          }
          .modal-dialog {
            max-width: 100vw !important;
            width: 100vw !important;
            margin: 16px auto 2px auto !important;
          }
          .modal-content {
            border-radius: 6px !important;
            width: 100vw !important;
            min-width: 0 !important;
          }
        }
        .media-scrollbar {
          overflow-x: auto !important;
          overflow-y: hidden;
          scrollbar-width: thin;
          scrollbar-color: #2563eb #e0e7ef;
          width: 100%;
          scroll-behavior: smooth;
        }
        .media-scrollbar::-webkit-scrollbar {
          height: 8px;
          background: #e0e7ef;
          border-radius: 8px;
        }
        .media-scrollbar::-webkit-scrollbar-thumb {
          background: #2563eb;
          border-radius: 8px;
        }
        
        /* Mobile responsive modal media section */
        @media (max-width: 768px) {
          .modal-media-section {
            height: 120px !important;
            padding: 10px !important;
            margin-bottom: 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .modal-media-section {
            height: 130px !important;
            padding: 8px !important;
            margin-bottom: 1rem !important;
          }
        }
        .background-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }
        .background-animation img {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120%;
          height: 120%;
          object-fit: cover;
          transform: translate(-50%, -50%);
          animation: zoomInOut 8s ease-in-out infinite;
        }
        @keyframes zoomInOut {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
        .certificate-showcase {
          animation: certificateFloat 4s ease-in-out infinite;
        }
        @keyframes certificateFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .certificate-item {
          /* Removed hover effects */
        }
        .certificate-frame {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .certificate-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
        }
        .certificate-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: rgba(0,0,0,0.8);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }
        .hover-link {
          /* Removed hover effects */
        }
        footer {
          box-shadow: 0 -10px 30px rgba(0,0,0,0.3);
          border-top: 2px solid rgba(59,130,246,0.6) !important;
        }
        footer h6 {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        footer .badge {
          animation: badgePulse 3s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        /* Desktop spacing for cards */
        @media (min-width: 769px) {
          .row.g-3.g-md-5 {
            margin-left: -1rem !important;
            margin-right: -1rem !important;
          }
          .col-6.col-md-6 {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            margin-bottom: 2rem !important;
          }
          .card.h-100 {
            max-width: 350px !important;
            max-height: 420px !important;
            margin: 0 auto !important;
          }
          .card .position-relative {
            height: 180px !important;
          }
          .card-body {
            padding: 1.2rem !important;
          }
          .card-title {
            font-size: 1.1rem !important;
          }
          .card-subtitle {
            font-size: 0.9rem !important;
          }
          .card-text {
            font-size: 0.95rem !important;
            min-height: 30px !important;
          }
        }
        @media (max-width: 768px) {
          .row.g-3.g-md-5 {
            display: flex;
            flex-wrap: wrap;
            margin-left: -0.5rem !important;
            margin-right: -0.5rem !important;
          }
          .col-6.col-md-6 {
            display: flex;
            flex-direction: column;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .card.h-100 {
            height: 100% !important;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            transform: scale(0.85);
          }
          .card-body {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.5rem !important;
          }
          .card.h-100 .position-relative {
            height: 120px !important;
          }
          .card-title {
            font-size: 0.8rem !important;
            margin-bottom: 0.2rem !important;
          }
          .card-subtitle {
            font-size: 0.7rem !important;
            margin-bottom: 0.2rem !important;
          }
          .card-text {
            font-size: 0.75rem !important;
            margin-bottom: 0.2rem !important;
            min-height: 18px !important;
          }
          footer {
            padding: 0.4rem 0 !important;
            font-size: 0.75rem !important;
            line-height: 1.3 !important;
          }
          footer .container {
            padding: 0 0.4rem !important;
          }
          footer .row.g-4 {
            gap: 0.3rem !important;
          }
          footer h6 {
            font-size: 0.8rem !important;
            margin-bottom: 0.2rem !important;
            line-height: 1.2 !important;
          }
          footer .certificate-frame img {
            max-height: 60px !important;
          }
          footer .badge {
            font-size: 0.7rem !important;
            padding: 0.2rem 0.4rem !important;
          }
          footer .mb-2, footer .mb-3 {
            margin-bottom: 0.2rem !important;
          }
          footer .col-12.col-md-4 {
            margin-bottom: 0.3rem !important;
            padding: 0 0.2rem !important;
          }
          footer .d-flex.gap-4 {
            gap: 0.5rem !important;
          }
          footer .certificate-badge {
            width: 16px !important;
            height: 16px !important;
            font-size: 0.6rem !important;
          }
          footer hr {
            margin: 0.3rem 0 !important;
          }
          footer .certificate-item span {
            font-size: 0.65rem !important;
          }
        }
        @media (max-width: 576px) {
          footer .row.g-1.g-md-2.align-items-center {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            flex-wrap: nowrap !important;
            width: 100% !important;
            overflow-x: auto;
            column-gap: 0.5rem !important;
          }
          footer .col-12.col-md-4 {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            max-width: 33.3333% !important;
            width: 33.3333% !important;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 0 !important;
            padding: 0 0.1rem !important;
            order: unset !important;
          }
          footer .col-12.col-md-4 > * {
            margin-bottom: 0.25rem !important;
          }
          footer .col-12.col-md-4 > *:last-child {
            margin-bottom: 0 !important;
          }
          footer .col-12.col-md-4.order-1 {
            order: 1 !important;
          }
          footer .col-12.col-md-4.order-2 {
            order: 2 !important;
            align-items: center !important;
            text-align: center !important;
          }
          footer .col-12.col-md-4.order-3 {
            order: 3 !important;
            align-items: flex-end !important;
            text-align: right !important;
          }
          footer {
            padding: 0.2rem 0 !important;
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          footer .container {
            padding: 0 0.1rem !important;
          }
          footer .row.g-4, footer .row.g-1, footer .row.g-md-2 {
            gap: 0.1rem !important;
          }
          footer h6 {
            font-size: 0.7rem !important;
            margin-bottom: 0.05rem !important;
            line-height: 1 !important;
          }
          footer .certificate-frame img {
            max-height: 40px !important;
          }
          footer .d-flex.gap-2, footer .d-flex.gap-3, footer .d-flex.gap-4 {
            gap: 0.1rem !important;
          }
          footer .badge {
            font-size: 0.5rem !important;
            padding: 0.05rem 0.15rem !important;
          }
          footer .mb-2, footer .mb-1, footer .mb-0 {
            margin-bottom: 0 !important;
          }
          footer .certificate-item span {
            font-size: 0.5rem !important;
          }
          footer hr {
            margin: 0.1rem 0 !important;
          }
          footer .certificate-badge {
            width: 10px !important;
            height: 10px !important;
            font-size: 0.45rem !important;
          }
          footer .row.align-items-center > div {
            margin-bottom: 0 !important;
          }
          footer .row.align-items-center > div:last-child {
            margin-bottom: 0 !important;
          }
        }
        @media (max-width: 400px) {
          footer {
            padding: 0.25rem 0 !important;
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          footer .container {
            padding: 0 0.25rem !important;
          }
          footer .row.g-4 {
            gap: 0.15rem !important;
          }
          footer h6 {
            font-size: 0.7rem !important;
            margin-bottom: 0.1rem !important;
          }
          footer .certificate-frame img {
            max-height: 45px !important;
          }
          footer .d-flex.gap-4 {
            gap: 0.3rem !important;
          }
          footer .badge {
            font-size: 0.6rem !important;
            padding: 0.1rem 0.25rem !important;
          }
          footer .mb-2, footer .mb-3, footer .mb-0 {
            margin-bottom: 0.1rem !important;
          }
          footer .certificate-item span {
            font-size: 0.55rem !important;
          }
          footer hr {
            margin: 0.15rem 0 !important;
          }
          footer .col-12.col-md-4 {
            margin-bottom: 0.2rem !important;
            padding: 0 0.05rem !important;
          }
          footer .certificate-badge {
            width: 12px !important;
            height: 12px !important;
            font-size: 0.5rem !important;
          }
        }
        footer .row {
          margin-right: 0 !important;
          margin-left: 0 !important;
        }
        @media (min-width: 769px) {
          .animated-bg {
            padding-top: 20rem !important;
          }
        }
      `}</style>
      </div>
    </div>
  );
}
