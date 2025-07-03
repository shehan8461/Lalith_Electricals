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
    petname:"",
    species:"",
    breed:"",
    age:"",
    gender:"",
    color:"",
    weight:"",
    profilePicture: "",
    alternateProfilePicture: "",
    price:""
        
        
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
        const response = await fetch(`/api/user/getitem/${id}`);
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
      const response = await fetch(`/api/user/updateitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
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
      `}</style>
    </div>
  )
}
export default UpdateUser;