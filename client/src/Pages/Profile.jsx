import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'
import {app} from '../firebase';
import { useDispatch } from 'react-redux';
import './css/profile.css'
import { updateUserStart,updateUserFailure, updateUserSuccess, deleteUserStart,deleteUserSuccess,deleteUserFailure, signout } from '../redux/User/userSlice';


export default function Profile() {
  const dispatch=useDispatch()
  const fileRef=useRef(null);
  const [image,setImage]=useState(undefined);
  const [imagePercent,setImagePercent]=useState(0);
  const [imageError,setImageError]=useState(false);
  const [formData,setFormData]=useState({});
  const [updateSuccess,setuodateSuccess]=useState(false)

 
    const {currentUser,loading,error}=useSelector((state)=>state.user)
    useEffect(()=>{
      if(image){
        handleFileUpload(image)
          }
      },[image]);

      const handleFileUpload=async (image)=>{
        const storage=getStorage(app)
        const fileName=new Date().getTime()+image.name;
        const storageRef=ref(storage,fileName)
        const uploadTask=uploadBytesResumable(storageRef,image)

        uploadTask.on('state_changed',
          (snapshot)=>{
          const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
          setImagePercent(Math.round(progress))
          
    },
  
    (error)=>{
      setImageError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>setFormData({ ...formData, 
        profilePicture:downloadURL}))

      }
    
   )
  };

  const handlechange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }



  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData,)
      });
      const data=await res.json();
      if(data.success===false){
          dispatch(updateUserFailure(data));
          return
      }
      dispatch(updateUserSuccess(data));
      setuodateSuccess(true)
    }catch(error){
      dispatch(updateUserFailure(error));
    }
  };



  const handledeleteAccount =async ()=>{
    try{
      dispatch(deleteUserStart())
        const res=await fetch(`/api/user/delete/${currentUser._id}`,{

        method:'DELETE',
        })
        const data=await res.json();
        if(data.success===false){
          dispatch(deleteUserFailure(data))
          return;
        }
        dispatch(deleteUserSuccess(data))
        alert('user deleted successfully')
    }catch(error){
        dispatch(deleteUserFailure(error))
    }
  }


  const handleSignOut=async ()=>{
    try{

      await fetch('api/auth/signout')
      dispatch(signout())
    }catch(error){
        console.log(error)
    }
  }
  return (
<div className="container mt-5 mb-5">
  <div className="row justify-content-center">
    <div className="col-md-8">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary mb-4">User Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt="Profile"
              className="rounded-circle shadow border border-3 border-primary"
              style={{ width: '130px', height: '130px', cursor: 'pointer', objectFit: 'cover' }}
              onClick={() => fileRef.current.click()}
            />
            <div className="mt-2 text-muted small">
              {imageError ? (
                <div className="text-danger">Error uploading (Max: 2MB)</div>
              ) : imagePercent > 0 && imagePercent < 100 ? (
                <div>Uploading: {imagePercent}%</div>
              ) : imagePercent === 100 ? (
                <div className="text-success">Image uploaded successfully</div>
              ) : null}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              defaultValue={currentUser.username}
              type="text"
              id="username"
              className="form-control"
              onChange={handlechange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              defaultValue={currentUser.email}
              type="email"
              id="email"
              className="form-control"
              onChange={handlechange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              onChange={handlechange}
              placeholder="Enter new password"
            />
          </div>

          <div className="d-grid mb-3">
            <button className="btn btn-primary" type="submit">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            Something went wrong!
          </div>
        )}
        {updateSuccess && (
          <div className="alert alert-success text-center" role="alert">
            Profile updated successfully.
          </div>
        )}

        <hr />

        <div className="d-flex justify-content-between flex-wrap gap-2">
          <button onClick={handledeleteAccount} className="btn btn-outline-danger w-100">
            Close Account
          </button>
          <button onClick={handleSignOut} className="btn btn-outline-secondary w-100">
            Sign Out
          </button>
          <Link to="/additem" className="btn btn-outline-success w-100">
           Add Post
          </Link>
          <Link to="/items" className="btn btn-outline-primary w-100">
            My Posts
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}
