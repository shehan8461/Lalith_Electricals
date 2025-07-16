import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import { Table, Button, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ItemProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/user/items`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.items || []);
      data.items?.forEach(order => {
        if (order.profilePicture) {
          fetchFirebaseImage(order.profilePicture, 'profilePicture', order._id);
        }
        if (order.alternateProfilePicture) {
          fetchFirebaseImage(order.alternateProfilePicture, 'alternateProfilePicture', order._id);
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchFirebaseImage = async (imageUrl, field, orderId) => {
    const storageRef = ref(storage, imageUrl);
    try {
      const downloadUrl = await getDownloadURL(storageRef);
      setOrders(prevOrders => prevOrders.map(order => {
        if (order._id === orderId) {
          return {
            ...order,
            [field]: downloadUrl
          };
        }
        return order;
      }));
    } catch (error) {
      console.error(`Error fetching image from Firebase for ${field}:`, error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const res = await fetch(`/api/user/item/delete/${orderIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderIdToDelete)
        );
      }
      setShowModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="item-profile-bg min-vh-100 py-5">
      <div className="container">
        <h2 className="mb-4 text-center fw-bold display-5 text-primary">My Items</h2>
        {orders.length > 0 ? (
          <div className="card shadow-lg border-0 rounded-4 p-3 fade-in-table">
            <div className="table-responsive rounded-4">
              <Table hover bordered className="align-middle mb-0 bg-white">
                <thead className="table-primary">
                  <tr>
                   
                    <th>Name</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Title</th>
                    <th className="text-center">Featured</th>
                    <th className="text-center">On Sale</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="row-border-left">
                   
                      <td className="fw-semibold">{order.Name}</td>
                      <td>{order.date}</td>
                      <td>{order.Description}</td>
                      <td><span className="badge bg-info bg-gradient text-dark fs-6 px-3 py-2 shadow-sm">{order.Title}</span></td>
                      <td className="text-center">
                        {order.featured ? (
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-star-fill me-1"></i>
                            Featured
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        {order.onSale ? (
                          <span className="badge bg-success">
                            <i className="bi bi-tag-fill me-1"></i>
                            On Sale
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        <Link to={`/update-item/${order._id}`} className="me-2">
                          <Button variant="outline-success" size="sm" className="d-inline-flex align-items-center gap-1 action-btn">
                            <FaEdit /> Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-inline-flex align-items-center gap-1 ms-1 action-btn"
                          onClick={() => {
                            setShowModal(true);
                            setOrderIdToDelete(order._id);
                          }}
                        >
                          <FaTrashAlt /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="alert alert-info text-center mt-4">You have no items yet!</div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered dialogClassName="modal-soft-shadow">
          <Modal.Header closeButton className="bg-danger bg-opacity-10 border-0">
            <Modal.Title className="text-danger d-flex align-items-center gap-2">
              <FaExclamationTriangle /> Confirm Delete
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p className="mb-4 fs-5">Are you sure you want to delete this item?</p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="danger" onClick={handleDeleteOrder} className="fw-bold px-4">
                Yes, Delete
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)} className="fw-bold px-4">
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <style>{`
        .item-profile-bg {
          background: linear-gradient(120deg, #f8fafc 60%, #e0e7ef 100%);
        }
        .fade-in-table {
          animation: fadeIn 0.8s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .row-border-left {
          border-left: 6px solid #0d6efd !important;
        }
        .action-btn {
          transition: box-shadow 0.2s, background 0.2s;
        }
        .action-btn:hover, .action-btn:focus {
          box-shadow: 0 2px 12px #0d6efd33;
          background: #e7f1ff !important;
        }
        .modal-soft-shadow .modal-content {
          box-shadow: 0 8px 48px rgba(13,110,253,0.12), 0 2px 24px #0d6efd22;
        }
        .avatar-placeholder {
          width: 44px;
          height: 44px;
          font-size: 1.1rem;
          font-weight: 600;
          background: #adb5bd;
        }
      `}</style>
    </div>
  );
}
