import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import certificate1 from '../components/images/cetificate1_page-0002.jpg';
import certificate2 from '../components/images/cetificate2_page-0001.jpg';
import bgImg1 from '../components/images/BackgroundImages/repair.webp';
import bgImg2 from '../components/images/BackgroundImages/back2.webp';
import bgImg3 from '../components/images/BackgroundImages/back3.png';
import bgImg4 from '../components/images/BackgroundImages/back4.jpg';
import bgImg5 from '../components/images/BackgroundImages/back5.jpg';
import { useDispatch } from 'react-redux';
import { signout } from '../redux/User/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AllDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
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
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchParam, orders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/auth/users/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
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

  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ minHeight: '100vh' }}>
      {/* Blurred Background Layer */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: `url(${backgroundImages[bgIndex]}) center center/cover no-repeat`,
          transition: 'background-image 1.5s cubic-bezier(0.4,0,0.2,1)',
          filter: 'blur(7px)',
          zIndex: -1
        }}
      ></div>
      
      {/* Content Layer */}
      <div className="d-flex flex-column min-vh-100 animated-bg">
      {/* Logout Button Top Right */}
      
      {/* Top Heading Section - Full Top */}
      <div className="w-100 d-flex justify-content-center pt-3 pb-4">
        <div className="heading-container d-flex justify-content-center">
          <h2 className="text-center text-white fw-bold heading-with-bg px-3 py-2 mx-auto" style={{
            letterSpacing: '0.4px', 
            textShadow: '2px 2px 6px rgba(0,0,0,0.8)', 
            background: 'linear-gradient(135deg, rgba(75,85,99,0.95) 0%, rgba(107,114,128,0.95) 25%, rgba(156,163,175,0.95) 50%, rgba(209,213,219,0.95) 75%, rgba(255,255,255,0.95) 100%)',
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
            background: 'linear-gradient(135deg, rgba(75,85,99,0.95) 0%, rgba(107,114,128,0.95) 30%, rgba(156,163,175,0.95) 70%, rgba(255,255,255,0.1) 100%)'
          }}>
            ⚡ Expert Generator Repair & Maintenance Services ⚡
          </h2>
        </div>
      </div>
  
      <div className="container my-3 flex-grow-1" style={{minHeight: 'calc(100vh - 200px)'}}>
        
        {/* Orders Display */}
        <div className="row g-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div className="col-md-4" key={order.itemId}>
                <div
                  className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden position-relative card-hover"
                  style={{ cursor: 'pointer' }}
                  onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                >
                  <div className="position-relative" style={{height: '120px', overflow: 'hidden'}}>
                    {order.productVideo && (order.profilePicture || order.alternateProfilePicture) ? (
                      <div className="d-flex w-100 h-100">
                        <video
                          src={order.productVideo}
                          controls
                          className="w-50 h-100 object-fit-cover card-img-top transition border-end"
                          style={{objectFit: 'cover', height: '100%', width: '50%', borderRadius: '0', background: '#000'}}
                        />
                        {order.profilePicture && order.alternateProfilePicture ? (
                          <div className="d-flex w-50 h-100">
                            <img
                              src={order.profilePicture}
                              alt="Product 1"
                              className="w-50 h-100 object-fit-cover card-img-top transition border-end"
                              style={{objectFit: 'cover', height: '100%', width: '50%', borderRadius: '0'}}
                            />
                            <img
                              src={order.alternateProfilePicture}
                              alt="Product 2"
                              className="w-50 h-100 object-fit-cover card-img-top transition"
                              style={{objectFit: 'cover', height: '100%', width: '50%', borderRadius: '0'}}
                            />
                          </div>
                        ) : (
                          <img
                            src={order.profilePicture || order.alternateProfilePicture}
                            alt="Product"
                            className="w-50 h-100 object-fit-cover card-img-top transition"
                            style={{objectFit: 'cover', height: '100%', width: '50%', borderRadius: '0'}}
                          />
                        )}
                      </div>
                    ) : order.productVideo ? (
                      <video
                        src={order.productVideo}
                        controls
                        className="w-100 h-100 object-fit-cover card-img-top transition"
                        style={{objectFit: 'cover', height: '100%', width: '100%', borderRadius: '0', background: '#000'}}
                      />
                    ) : order.profilePicture && order.alternateProfilePicture ? (
                      <div className="d-flex w-100 h-100">
                        <img
                          src={order.profilePicture}
                          alt="Product 1"
                          className="w-50 h-100 object-fit-cover card-img-top transition border-end"
                          style={{objectFit: 'cover', height: '100%', width: '50%', borderRadius: '0'}}
                        />
                        <img
                          src={order.alternateProfilePicture}
                          alt="Product 2"
                          className="w-50 h-100 object-fit-cover card-img-top transition"
                          style={{objectFit: 'cover', height: '100%', width: '50%', borderRadius: '0'}}
                        />
                      </div>
                    ) : (order.profilePicture || order.alternateProfilePicture) ? (
                      <img
                        src={order.profilePicture || order.alternateProfilePicture}
                        alt="Product"
                        className="w-100 h-100 object-fit-cover card-img-top transition"
                        style={{objectFit: 'cover', height: '100%', width: '100%', borderRadius: '0'}}
                      />
                    ) : null}
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'linear-gradient(180deg,rgba(0,0,0,0.15) 60%,rgba(0,0,0,0.5) 100%)'}}></div>
                  </div>
                  <div className="card-body p-3">
                    <h5 className="card-title text-primary fw-bold mb-2" style={{fontSize: '1.1rem'}}>{order.Title}</h5>
                    <p className="card-text text-muted mb-2" style={{minHeight: '32px', fontSize: '0.95rem'}}>
                      <strong>Description:</strong> {order.Description}
                    </p>
                    <p className="card-text mb-0" style={{fontSize: '0.9rem'}}>
                      <strong>Date:</strong> {order.date}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center fs-5 mt-5 text-danger">No matching items found!</p>
          )}
        </div>
        {/* Modal Popup */}
        {showModal && selectedOrder && (
          <div className="modal fade show d-flex align-items-center justify-content-center" style={{position:'fixed', top:'90px', left:0, width:'100vw', height:'calc(100vh - 90px)', display:'flex', background:'rgba(0,0,0,0.5)', zIndex:1050, overflowY:'auto', alignItems:'flex-start'}} tabIndex="-1" role="dialog" onClick={()=>setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'480px', width:'96vw', margin:'32px auto'}} role="document" onClick={e => e.stopPropagation()}>
              <div className="modal-content rounded-5 border-0 shadow-lg" style={{background: 'linear-gradient(120deg, #f0f4ff 70%, #e0e7ef 100%)', width:'100%', boxShadow:'0 8px 48px rgba(0,0,0,0.18)'}}>
                <div className="modal-header border-0 pb-0 align-items-start d-flex justify-content-between" style={{background:'linear-gradient(90deg,#3b82f6 0%,#60a5fa 100%)', borderTopLeftRadius:'2rem', borderTopRightRadius:'2rem', minHeight:'0', paddingTop:'0.5rem', paddingBottom:'0.5rem'}}>
                  <h4 className="modal-title text-white fw-bold m-0" style={{letterSpacing:'1px'}}>{selectedOrder.Title}</h4>
                  <button type="button" className="btn-close btn-close-white ms-2" aria-label="Close" style={{filter:'brightness(2)', fontSize:'1.2rem'}} onClick={()=>setShowModal(false)}></button>
                </div>
                <div className="modal-body pt-3 pb-4 px-4">
                  <div className="mb-4 w-100 d-flex justify-content-center align-items-center flex-nowrap overflow-auto media-scrollbar" style={{height:'220px', gap:'16px', whiteSpace:'nowrap'}}>
                    {selectedOrder.productVideo && (
                      <div className="media-box">
                        <video src={selectedOrder.productVideo} controls className="media-content" />
                      </div>
                    )}
                    {selectedOrder.profilePicture && (
                      <div className="media-box">
                        <img src={selectedOrder.profilePicture} alt="Main" className="media-content" />
                      </div>
                    )}
                    {selectedOrder.alternateProfilePicture && (
                      <div className="media-box">
                        <img src={selectedOrder.alternateProfilePicture} alt="Alt" className="media-content" />
                      </div>
                    )}
                  </div>
                  <div className="mb-3 p-4 bg-white rounded-4 shadow-sm border border-2 border-primary-subtle" style={{fontSize:'0.98rem', color:'#1e293b', wordBreak:'break-word', minHeight:'50px', maxHeight:'120px', overflowY:'auto', boxShadow:'0 2px 12px rgba(59,130,246,0.07)'}}>
                    <strong>Description:</strong> {selectedOrder.Description}
                  </div>
                  <div className="mb-2 text-end" style={{fontSize:'1.08rem', color:'#2563eb'}}><strong>Date:</strong> {selectedOrder.date}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Footer - appears at the bottom after content, not fixed */}
      <footer className="text-white py-0 pt-3 px-0 border-top border-primary" style={{paddingTop: '1.5rem', fontSize: '0.75rem', lineHeight: '1.1', background: 'linear-gradient(135deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 50%, rgba(15,23,42,0.95) 100%)', backdropFilter: 'blur(10px)', borderTop: '2px solid rgba(59,130,246,0.6) !important', width: '100%', margin: 0, padding: 0, position: 'relative', left: 0, right: 0}}>
        <div className="container-fluid px-0" style={{paddingLeft: 0, paddingRight: 0, margin: 0, width: '100%'}}>
          <div className="row g-1 g-md-2 align-items-center" style={{marginLeft: 0, marginRight: 0}}>
            {/* Contact Information */}
            <div className="col-12 col-md-4 order-1">
              <h6 className="fw-bold mb-2 text-primary" style={{fontSize:'0.8rem', letterSpacing:'0.2px'}}>
                <i className="bi bi-lightning-charge-fill me-1"></i>Contact Us
              </h6>
              <div className="mb-2">
                <i className="bi bi-envelope-fill me-1 text-primary"></i>
                <a href="mailto:lalitabesinha@gmail.com" className="text-white text-decoration-none hover-link">
                  lalitabesinha@gmail.com
                </a>
              </div>
              <div className="mb-2">
                <i className="bi bi-telephone-fill me-1 text-success"></i>
                <a href="tel:+94123456789" className="text-white text-decoration-none hover-link">
                  +94 123 456 789
                </a>
              </div>
              <div className="mb-2">
                <i className="bi bi-geo-alt-fill me-1 text-warning"></i>
                <span className="text-light">8 Family Point, Thoraya, Kurunegala</span>
              </div>
              <div className="mb-0">
                <i className="bi bi-map me-1 text-info"></i>
                <button onClick={() => setShowMap(true)} className="btn btn-link p-0 m-0 align-baseline text-info text-decoration-none hover-link" style={{fontSize:'inherit'}}>
                  📍 View on Google Maps
                </button>
              </div>
            </div>
            
            {/* Certificates & Credentials */}
            <div className="col-12 col-md-4 text-center order-2">
              <h6 className="fw-bold mb-2 text-warning" style={{fontSize:'0.8rem', letterSpacing:'0.2px'}}>
                <i className="bi bi-award-fill me-1"></i>Certified & Trusted
              </h6>
              <div className="d-flex justify-content-center gap-2 mb-2">
                <div className="d-flex flex-column align-items-center certificate-item">
                  <div className="certificate-frame position-relative">
                    <img src={certificate1} alt="Government Electrical License" className="img-fluid rounded-1 shadow border border-1 border-warning mb-0" style={{maxHeight:'70px', objectFit:'cover', background:'#fff'}} />
                    <div className="certificate-badge">
                      <i className="bi bi-patch-check-fill text-warning"></i>
                    </div>
                  </div>
                  <span className="fw-bold text-warning" style={{fontSize:'0.7rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>Government License</span>
                </div>
                <div className="d-flex flex-column align-items-center certificate-item">
                  <div className="certificate-frame position-relative">
                    <img src={certificate2} alt="Award of Excellence" className="img-fluid rounded-1 shadow border border-1 border-success mb-0" style={{maxHeight:'70px', objectFit:'cover', background:'#fff'}} />
                    <div className="certificate-badge">
                      <i className="bi bi-trophy-fill text-success"></i>
                    </div>
                  </div>
                  <span className="fw-bold text-success" style={{fontSize:'0.7rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>Excellence Award</span>
                </div>
              </div>
              <div className="text-center mb-2">
                <span className="badge text-white fw-bold px-1 py-0" style={{fontSize:'0.6rem', background: 'linear-gradient(45deg, #f59e0b, #d97706)', textShadow: '1px 1px 2px rgba(0,0,0,0.7)', boxShadow: '0 2px 8px rgba(245,158,11,0.3)'}}>
                  🏆 15+ Years Experience 🏆
                </span>
              </div>
            </div>
            
            {/* Services & Hours */}
            <div className="col-12 col-md-4 text-center text-md-end order-3">
              <h6 className="fw-bold mb-2 text-success" style={{fontSize:'0.8rem', letterSpacing:'0.2px'}}>
                <i className="bi bi-clock-fill me-1"></i>Service Hours
              </h6>
              <div className="mb-2">
                <i className="bi bi-calendar-check me-1 text-success"></i>
                <span className="text-success fw-bold">Mon - Sat:</span>
                <span className="text-light ms-1">8:00 AM - 6:00 PM</span>
              </div>
              <div className="mb-2">
                <i className="bi bi-calendar-x me-1 text-danger"></i>
                <span className="text-danger fw-bold">Sunday:</span>
                <span className="text-light ms-1">Closed</span>
              </div>
              <div className="mb-2">
                <i className="bi bi-tools me-1 text-primary"></i>
                <span className="text-primary fw-bold">Emergency Service:</span>
              </div>
              <div className="mb-0">
                <span className="badge bg-danger px-1 py-0" style={{fontSize:'0.55rem'}}>
                  🚨 24/7 Available
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <hr className="my-1 border-secondary" />
          <div className="row align-items-center" style={{marginLeft: 0, marginRight: 0}}>
            <div className="col-12 col-md-6 text-center text-md-start mb-0">
              <span className="text-light" style={{fontSize:'0.7rem'}}>
                &copy; {new Date().getFullYear()} <strong className="text-primary">Lalith Electricals</strong>. All rights reserved.
              </span>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <span className="text-muted" style={{fontSize:'0.65rem'}}>
                <i className="bi bi-shield-check me-1 text-success"></i>
                Trusted • Professional • Reliable
              </span>
            </div>
          </div>
        </div>
      </footer>
      {/* Google Maps Popup */}
      {showMap && (
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', display:'flex', background:'rgba(0,0,0,0.5)', zIndex:2000}} tabIndex="-1" role="dialog" onClick={()=>setShowMap(false)}>
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
      <style>{`
        body { padding-top: 160px !important; }
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
          backdrop-filter: blur(3px);
          background: linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%) !important;
          border: 2px solid rgba(255,255,255,0.5) !important;
          transform: translateY(0px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 0 20px rgba(59,130,246,0.1);
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
          width: 180px;
          height: 180px;
          min-width: 110px;
          max-width: 220px;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 4px 24px rgba(59,130,246,0.12), 0 0 16px #3b82f6, 0 2px 24px #60a5fa55;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        .media-content {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 18px;
          background: #000;
          display: block;
        }
        .media-box video.media-content {
          object-fit: contain;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          background: #000;
          display: block;
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
            width: 110px;
            height: 110px;
            min-width: 70px;
            max-width: 120px;
            border-radius: 10px;
            margin-right: 6px;
          }
          .media-content, .media-box video.media-content {
            border-radius: 10px;
          }
          .modal-body.pt-3.pb-4.px-4 > .mb-4 {
            gap: 6px !important;
            height: 120px !important;
          }
          .modal-dialog {
            max-width: 98vw !important;
            width: 98vw !important;
            margin: 48px auto 8px auto !important;
          }
          .modal-content {
            border-radius: 12px !important;
            width: 100vw !important;
            min-width: 0 !important;
          }
          .modal-header, .modal-body, .modal-footer {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
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
            width: 70px;
            height: 70px;
            min-width: 40px;
            max-width: 80px;
            border-radius: 6px;
            margin-right: 3px;
          }
          .media-content, .media-box video.media-content {
            border-radius: 6px;
          }
          .modal-body.pt-3.pb-4.px-4 > .mb-4 {
            gap: 3px !important;
            height: 70px !important;
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
          transition: all 0.3s ease;
        }
        .certificate-item:hover {
          transform: translateY(-3px) scale(1.05);
        }
        .certificate-frame {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .certificate-frame:hover {
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .certificate-frame::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          transition: left 0.5s;
        }
        .certificate-frame:hover::before {
          left: 100%;
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
          transition: all 0.3s ease;
        }
        .hover-link:hover {
          color: #60a5fa !important;
          text-shadow: 0 0 5px rgba(96,165,250,0.5);
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
        @media (max-width: 768px) {
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
      `}</style>
      </div>
    </div>
  );
}
