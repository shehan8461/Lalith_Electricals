import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AddItem() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const fileRef2 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    userId: currentUser._id,
    Name: "",
    date: "",
    Description: "",
    Title: "",
    profilePicture: "",
    alternateProfilePicture: "",
  });

  useEffect(() => {
    if (image1) handleFileUpload(image1, 'profilePicture');
  }, [image1]);

  useEffect(() => {
    if (image2) handleFileUpload(image2, 'alternateProfilePicture');
  }, [image2]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      () => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, [field]: downloadURL }));
        });
      }
    );
  };

  const handleImage1Click = () => fileRef1.current.click();
  const handleImage2Click = () => fileRef2.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      alert('Item added successfully');
      navigate('/items');
    } catch {
      setError('Something went wrong!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Add Product Information</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input className="form-control" type="text" placeholder="Product Name" onChange={(e) => setFormData({ ...formData, Name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <input className="form-control" type="date" placeholder="Release Date" onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="col-md-6">
                <input className="form-control" type="text" placeholder="Short Description" onChange={(e) => setFormData({ ...formData, Description: e.target.value })} />
              </div>
              <div className="col-md-6">
                <input className="form-control" type="text" placeholder="Title" onChange={(e) => setFormData({ ...formData, Title: e.target.value })} />
              </div>

              <input type="file" ref={fileRef1} hidden accept="image/*" onChange={(e) => setImage1(e.target.files[0])} />
              <input type="file" ref={fileRef2} hidden accept="image/*" onChange={(e) => setImage2(e.target.files[0])} />

              <div className="col-md-6 text-center">
                <img
                  src={formData.profilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg'}
                  alt="Main"
                  className="img-thumbnail"
                  style={{ height: '200px', cursor: 'pointer' }}
                  onClick={handleImage1Click}
                />
                <button type="button" className="btn btn-outline-primary mt-2" onClick={handleImage1Click}>
                  Upload Main Picture
                </button>
              </div>

              <div className="col-md-6 text-center">
                <img
                  src={formData.alternateProfilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg'}
                  alt="Alternate"
                  className="img-thumbnail"
                  style={{ height: '200px', cursor: 'pointer' }}
                  onClick={handleImage2Click}
                />
                <button type="button" className="btn btn-outline-secondary mt-2" onClick={handleImage2Click}>
                  Upload Alternate Picture
                </button>
              </div>
            </div>

            {imagePercent > 0 && (
              <div className="progress mt-3">
                <div className="progress-bar" role="progressbar" style={{ width: `${imagePercent}%` }} aria-valuenow={imagePercent} aria-valuemin="0" aria-valuemax="100">
                  {imagePercent}%
                </div>
              </div>
            )}

            {imageError && (
              <div className="alert alert-danger mt-3" role="alert">
                Error uploading image. File must be under 2MB.
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-success mt-4 w-100">
              Add Product
            </button>

            <div className="mt-3">
      
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
