import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import Swal from 'sweetalert2';

export default function AddItem() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileInputRef = useRef(null);
  const fileRefVideo = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [images, setImages] = useState([]); // Array of up to 4 File objects
  const [video, setVideo] = useState(undefined);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    //userId: currentUser._id,
    Name: "",
    date: "",
    Description: "",
    Title: "",
    profilePicture: "",
    alternateProfilePicture: "",
    thirdProfilePicture: "",
    fourthProfilePicture: "",
    productVideo: "",
    featured: false,
    onSale: false,
  });

  useEffect(() => {
    // Upload images in order and set URLs in formData
    const uploadAll = async () => {
      if (images.length > 0) {
        const fields = ['profilePicture', 'alternateProfilePicture', 'thirdProfilePicture', 'fourthProfilePicture'];
        for (let i = 0; i < 4; i++) {
          if (images[i]) {
            await handleFileUpload(images[i], fields[i]);
          } else {
            setFormData((prev) => ({ ...prev, [fields[i]]: '' }));
          }
        }
      } else {
        // If no images, clear all
        setFormData((prev) => ({ ...prev, profilePicture: '', alternateProfilePicture: '', thirdProfilePicture: '', fourthProfilePicture: '' }));
      }
    };
    uploadAll();
    // eslint-disable-next-line
  }, [images]);

  useEffect(() => {
    if (video) {
      // Check video size limit (10MB)
      if (video.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: 'Video Too Large!',
          text: 'Video must be less than 10MB.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545',
          background: '#fff',
          color: '#333',
          showClass: { popup: 'animate__animated animate__shakeX' }
        });
        setError('Video must be less than 10MB.');
        setVideo(undefined);
        return;
      }
      handleFileUpload(video, 'productVideo');
    }
  }, [video]);

  const handleFileUpload = async (file, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('File upload failed');
        
        Swal.fire({
          title: 'Upload Failed!',
          text: 'There was an error uploading your file. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545',
          background: '#fff',
          color: '#333',
          showClass: {
            popup: 'animate__animated animate__shakeX'
          }
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, [field]: downloadURL }));
          setImageError(false);
        });
      }
    );
  };

  const handleImageSelectClick = () => fileInputRef.current.click();

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      Swal.fire({
        title: 'Too Many Images!',
        text: 'You can only select up to 4 images in total.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        background: '#fff',
        color: '#333',
        showClass: { popup: 'animate__animated animate__shakeX' }
      });
      setError('You can only select up to 4 images in total.');
      return;
    }
    // Check image size limit (2MB)
    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          title: 'Image Too Large!',
          text: 'Each image must be less than 2MB.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545',
          background: '#fff',
          color: '#333',
          showClass: { popup: 'animate__animated animate__shakeX' }
        });
        setError('Each image must be less than 2MB.');
        return;
      }
    }
    setError('');
    setImages(files.slice(0, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Add Product?',
      text: 'Are you sure you want to add this product?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add Product',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      background: '#fff',
      color: '#333',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await fetch('https://api.lalithelectrical.com/api/auth/store', {
        method: 'POST',
         credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      await Swal.fire({
        title: 'Success!',
        text: 'Item added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#198754',
        timer: 3000,
        timerProgressBar: true,
        background: '#fff',
        color: '#333',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      
      navigate('/items');
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#dc3545',
        background: '#fff',
        color: '#333',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
      setError(error.message || 'Something went wrong!');
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

              {/* Feature and Sale Checkboxes */}
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="featuredSwitch"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="featuredSwitch">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    Featured Product
                  </label>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="onSaleSwitch"
                    checked={formData.onSale}
                    onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="onSaleSwitch">
                    <i className="bi bi-tag-fill text-success me-2"></i>
                    On Sale
                  </label>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                multiple
                onChange={handleImagesChange}
              />
              <input type="file" ref={fileRefVideo} hidden accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />

              {/* Image Preview Grid */}
              <div className="col-12 mb-3">
                <div className="row g-3 justify-content-center">
                  {[0,1,2,3].map((idx) => (
                    <div className="col-md-3 col-6 text-center" key={idx}>
                      <img
                        src={
                          images[idx]
                            ? URL.createObjectURL(images[idx])
                            : formData[[
                                'profilePicture',
                                'alternateProfilePicture',
                                'thirdProfilePicture',
                                'fourthProfilePicture',
                              ][idx]] || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg'
                        }
                        alt={`Product ${idx+1}`}
                        className="img-thumbnail"
                        style={{ height: '200px', width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={handleImageSelectClick}
                      />
                      <div>
                        <button
                          type="button"
                          className={`btn mt-2 ${['btn-outline-primary','btn-outline-secondary','btn-outline-success','btn-outline-warning'][idx]}`}
                          onClick={handleImageSelectClick}
                        >
                          {images[idx] ? `Change Picture ${idx+1}` : `Upload Picture ${idx+1}`}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2">
                  <small className="text-muted">You can select up to 4 images at once.</small>
                </div>
              </div>

              <div className="col-md-12 text-center mt-3">
                {formData.productVideo ? (
                  <video controls width="320" height="180" style={{borderRadius: '10px', background: '#eee'}}>
                    <source src={formData.productVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div style={{height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '10px'}}>
                    <span className="text-muted">No video uploaded</span>
                  </div>
                )}
                <button type="button" className="btn btn-outline-info mt-2" onClick={() => fileRefVideo.current.click()}>
                  Upload Product Video
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
                Error uploading file. Please try again or check your network connection.
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
