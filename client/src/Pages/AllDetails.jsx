import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function AllDetails() {
  const [orders, setOrders] = useState([]);

  const [filteredOrders, setFilteredOrders] = useState([]);

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
              <Link to={`/onepet/${order._id}`} className="text-decoration-none">
                <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden position-relative card-hover">
                  <div className="position-relative" style={{height: '180px', overflow: 'hidden'}}>
                    {order.profilePicture && order.alternateProfilePicture ? (
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
                  <div className="card-body p-4">
                    <h5 className="card-title text-primary fw-bold mb-2" style={{fontSize: '1.3rem'}}>{order.Title}</h5>
                    <p className="card-text text-muted mb-2" style={{minHeight: '48px'}}>
                      <strong>Description:</strong> {order.Description}
                    </p>
                    <p className="card-text mb-0">
                      <strong>Date:</strong> {order.date}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center fs-5 mt-5 text-danger">No matching items found!</p>
        )}
      </div>
      <style>{`
        .card-hover:hover .card-img-top {
          transform: scale(1.08);
          filter: brightness(0.95) saturate(1.1);
        }
        .card-hover:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
        }
      `}</style>
    </div>
  );
}
