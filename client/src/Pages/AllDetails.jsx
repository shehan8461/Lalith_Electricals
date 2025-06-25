import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import certificate1 from '../components/images/cetificate1_page-0002.jpg';
import certificate2 from '../components/images/cetificate2_page-0001.jpg';

export default function AllDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container my-5 flex-grow-1" style={{minHeight: 'calc(100vh - 180px)'}}>
        <h2 className="text-center mb-5 text-primary fw-bold display-5" style={{letterSpacing: '1px'}}>Explore Our Featured Electrical Products</h2>
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
                  <div className="mb-4 w-100 d-flex justify-content-center align-items-center flex-nowrap overflow-auto" style={{height:'220px', gap:'16px', whiteSpace:'nowrap'}}>
                    {selectedOrder.productVideo && (
                      <div style={{boxShadow:'0 4px 24px rgba(59,130,246,0.12)', borderRadius:'18px', overflow:'hidden', background:'#000', display:'inline-block', position:'relative'}}>
                        <video src={selectedOrder.productVideo} controls style={{height:'180px', width:'180px', minWidth:'120px', maxWidth:'220px', borderRadius:'18px', background:'#000', boxShadow:'0 0 16px #3b82f6, 0 2px 24px #60a5fa55'}} />
                      </div>
                    )}
                    {selectedOrder.profilePicture && (
                      <div style={{boxShadow:'0 4px 24px rgba(59,130,246,0.18)', borderRadius:'18px', overflow:'hidden', display:'inline-block', position:'relative', background:'linear-gradient(135deg,#fff 60%,#dbeafe 100%)'}}>
                        <img src={selectedOrder.profilePicture} alt="Main" style={{height:'180px', width:'90px', minWidth:'60px', maxWidth:'120px', objectFit:'cover', borderRadius:'18px', transition:'transform 0.3s', boxShadow:'0 0 12px #2563eb88'}} />
                        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',borderRadius:'18px',boxShadow:'0 0 0 4px #3b82f6aa inset',pointerEvents:'none'}}></div>
                      </div>
                    )}
                    {selectedOrder.alternateProfilePicture && (
                      <div style={{boxShadow:'0 4px 24px rgba(59,130,246,0.18)', borderRadius:'18px', overflow:'hidden', display:'inline-block', position:'relative', background:'linear-gradient(135deg,#fff 60%,#dbeafe 100%)'}}>
                        <img src={selectedOrder.alternateProfilePicture} alt="Alt" style={{height:'180px', width:'90px', minWidth:'60px', maxWidth:'120px', objectFit:'cover', borderRadius:'18px', transition:'transform 0.3s', boxShadow:'0 0 12px #2563eb88'}} />
                        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',borderRadius:'18px',boxShadow:'0 0 0 4px #60a5fa99 inset',pointerEvents:'none'}}></div>
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
      {/* Certificates Section - Owner's Credentials */}
      <section className="container my-5 py-4">
        <h3 className="text-center text-primary fw-bold mb-4" style={{letterSpacing:'1px'}}>Our Certifications & Owner's Credentials</h3>
        <p className="text-center text-secondary mb-4" style={{maxWidth:'600px', margin:'0 auto', fontSize:'1.08rem'}}>
          Lalith Electricals is led by a highly qualified owner, recognized for excellence and trust in the electrical industry. Our certifications and awards are a testament to our commitment to quality and customer satisfaction.
        </p>
        <div className="row justify-content-center g-4">
          <div className="col-12 col-md-5 d-flex flex-column align-items-center">
            <img src={certificate1} alt="Government Electrical License" className="img-fluid rounded-3 shadow border border-2 border-primary mb-2" style={{maxHeight:'140px', objectFit:'cover', background:'#fff'}} />
            <span className="fw-semibold text-primary" style={{fontSize:'0.98rem'}}>Government Electrical License</span>
          </div>
          <div className="col-12 col-md-5 d-flex flex-column align-items-center">
            <img src={certificate2} alt="Award of Excellence" className="img-fluid rounded-3 shadow border border-2 border-success mb-2" style={{maxHeight:'140px', objectFit:'cover', background:'#fff'}} />
            <span className="fw-semibold text-success" style={{fontSize:'0.98rem'}}>Award of Excellence</span>
          </div>
        </div>
      </section>
      {/* Footer - appears at the bottom after content, not fixed */}
      <footer className="bg-dark text-white py-2 px-0 border-top border-primary" style={{fontSize: '0.85rem', lineHeight: '1.1'}}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 px-2">
          <div className="mb-0 col-12 col-md-6 text-center text-md-start" style={{fontSize:'0.85rem'}}>
            <div className="mb-1"><i className="bi bi-envelope me-2 text-primary"></i> <a href="mailto:lalithelectricals@gmail.com" className="text-white text-decoration-none">lalithelectricals@gmail.com</a></div>
            <div className="mb-1"><i className="bi bi-geo-alt me-2 text-primary"></i> 123 Main Street, Colombo, Sri Lanka</div>
            <div className="mb-1"><i className="bi bi-geo me-2 text-primary"></i> <button onClick={() => setShowMap(true)} className="btn btn-link p-0 m-0 align-baseline text-white text-decoration-underline" style={{fontSize:'inherit'}}>View Location</button></div>
          </div>
          <div className="mb-0 col-12 col-md-6 text-center text-md-end" style={{fontSize:'0.85rem'}}>
            <h6 className="fw-bold mb-1" style={{fontSize:'0.92rem'}}>Working Hours</h6>
            <div className="mb-1"><span className="text-success fw-bold">Mon - Sat:</span> 8:00 AM - 6:00 PM</div>
            <div className="mb-1"><span className="text-danger fw-bold">Sunday:</span> Closed</div>
          </div>
        </div>
        <div className="text-center mt-1 small text-secondary" style={{fontSize:'0.75rem', lineHeight:'1'}}>&copy; {new Date().getFullYear()} Lalith Electricals. All rights reserved.</div>
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
        .card-hover:hover .card-img-top {
          transform: scale(1.08);
          filter: brightness(0.95) saturate(1.1);
        }
        .card-hover:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
        }
        .modal-backdrop { display: none; }
      `}</style>
    </div>
  );
}
