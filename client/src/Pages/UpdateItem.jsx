import {useEffect, useState,useRef} from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';



function UpdateUser(){
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState('');
  const navigate=useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);
  const fileRef2 = useRef(null);
  const [image1, setImage1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatediscount,setupdatediscount]=useState({
    Name:"",
    date:"",
    Description:"",
    Title:"",
    profilePicture: "",
    alternateProfilePicture: "",
    thirdProfilePicture: "",
    fourthProfilePicture: "",
    productVideo: "",
    featured: false,
    onSale: false
  })
  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  useEffect(() => {
    if (image2) {
      handleFileUpload(image2, 'alternateProfilePicture');
    }
  }, [image2]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    setLoading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('Image upload failed');
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdatediscount((prev) => ({
            ...prev,
            [field]: downloadURL
          }));
          setLoading(false);
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  const handleImage2Click = () => {
    fileRef2.current.click();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/item/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
            setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const response = await fetch(`/api/auth/itemUpdate/${id}`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount.id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/items'), 1200);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setLoading(false);
  };

  return (
 
  
    <div className="update-bg min-vh-100 py-5 d-flex align-items-center fade-in-table">
      <div className="container">
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="shadow-lg border-0 rounded-4 p-4">
              <Card.Body>
                <h2 className="mb-4 text-center fw-bold display-6 text-primary">Update Item</h2>
                <Form onSubmit={handleUpdate}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label> Name</Form.Label>
                        <Form.Control type="text" name="Name" value={updatediscount.Name} onChange={handleInputChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="Date" name="date" value={updatediscount.date} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="Description" value={updatediscount.Description} onChange={handleInputChange} />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="Title" value={updatediscount.Title} onChange={handleInputChange} />
                      </Form.Group>

                      {/* Featured and On Sale Checkboxes */}
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="switch"
                          id="featured-switch"
                          label={
                            <span>
                              <i className="bi bi-star-fill text-warning me-2"></i>
                              Featured Product
                            </span>
                          }
                          checked={updatediscount.featured || false}
                          onChange={(e) => setupdatediscount({
                            ...updatediscount,
                            featured: e.target.checked
                          })}
                          className="feature-switch"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="switch"
                          id="onSale-switch"
                          label={
                            <span>
                              <i className="bi bi-tag-fill text-success me-2"></i>
                              On Sale
                            </span>
                          }
                          checked={updatediscount.onSale || false}
                          onChange={(e) => setupdatediscount({
                            ...updatediscount,
                            onSale: e.target.checked
                          })}
                          className="sale-switch"
                        />
                      </Form.Group>
                    
                    </Col>
               
                  </Row>
                
                  <div className="d-grid mt-3">
                    <Button type="submit" variant="success" size="lg" className="fw-bold shadow-sm">
                      {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                      Update Information
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <style>{`
        .update-bg {
          background: linear-gradient(120deg, #f8fafc 60%, #e0e7ef 100%);
        }
        .fade-in-table {
          animation: fadeIn 0.8s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .avatar-img:hover {
          box-shadow: 0 2px 12px #0d6efd33;
          border-color: #0d6efd !important;
        }
        
        /* Feature and Sale Switch Styles */
        .feature-switch .form-check-input:checked {
          background-color: #f59e0b;
          border-color: #f59e0b;
        }
        .sale-switch .form-check-input:checked {
          background-color: #10b981;
          border-color: #10b981;
        }
        .form-check-label {
          font-weight: 500;
          font-size: 0.95rem;
        }
        .form-check {
          padding: 0.75rem;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(229, 231, 235, 0.8);
          transition: all 0.3s ease;
        }
        .form-check:hover {
          background: rgba(240, 244, 255, 0.9);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  )
}
export default UpdateUser;