import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AllDetails() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    <div className="container my-5">
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
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', display:'flex', background:'rgba(0,0,0,0.5)', zIndex:1050}} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'92vw', width:'92vw', margin:'auto'}} role="document">
            <div className="modal-content rounded-5 border-0 shadow-lg" style={{background: 'linear-gradient(120deg, #f0f4ff 70%, #e0e7ef 100%)', width:'100%', boxShadow:'0 8px 48px rgba(0,0,0,0.18)'}}>
              <div className="modal-header border-0 pb-0 align-items-start" style={{background:'linear-gradient(90deg,#3b82f6 0%,#60a5fa 100%)', borderTopLeftRadius:'2rem', borderTopRightRadius:'2rem'}}>
                <h4 className="modal-title text-white fw-bold" style={{letterSpacing:'1px'}}>{selectedOrder.Title}</h4>
                <button type="button" className="btn-close bg-white" aria-label="Close" onClick={()=>setShowModal(false)}></button>
              </div>
              <div className="modal-body pt-3 pb-4 px-4">
                <div className="mb-4 w-100 d-flex justify-content-center align-items-center" style={{height:'420px', gap:'32px'}}>
                  {selectedOrder.productVideo && (
                    <div style={{boxShadow:'0 4px 24px rgba(59,130,246,0.12)', borderRadius:'18px', overflow:'hidden', background:'#000'}}>
                      <video src={selectedOrder.productVideo} controls style={{height:'420px', width:'40vw', minWidth:'320px', maxWidth:'700px', borderRadius:'18px', background:'#000'}} />
                    </div>
                  )}
                  {selectedOrder.profilePicture && (
                    <div style={{boxShadow:'0 4px 24px rgba(59,130,246,0.10)', borderRadius:'18px', overflow:'hidden'}}>
                      <img src={selectedOrder.profilePicture} alt="Main" style={{height:'420px', width:'18vw', minWidth:'120px', maxWidth:'260px', objectFit:'cover', borderRadius:'18px'}} />
                    </div>
                  )}
                  {selectedOrder.alternateProfilePicture && (
                    <div style={{boxShadow:'0 4px 24px rgba(59,130,246,0.10)', borderRadius:'18px', overflow:'hidden'}}>
                      <img src={selectedOrder.alternateProfilePicture} alt="Alt" style={{height:'420px', width:'18vw', minWidth:'120px', maxWidth:'260px', objectFit:'cover', borderRadius:'18px'}} />
                    </div>
                  )}
                </div>
                <div className="mb-3 p-4 bg-white rounded-4 shadow-sm border border-2 border-primary-subtle" style={{fontSize:'1.22rem', color:'#1e293b', wordBreak:'break-word', minHeight:'70px', maxHeight:'200px', overflowY:'auto', boxShadow:'0 2px 12px rgba(59,130,246,0.07)'}}>
                  <strong>Description:</strong> {selectedOrder.Description}
                </div>
                <div className="mb-2 text-end" style={{fontSize:'1.08rem', color:'#2563eb'}}><strong>Date:</strong> {selectedOrder.date}</div>
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
