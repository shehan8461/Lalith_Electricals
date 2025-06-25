import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, NavDropdown, Image, Badge } from 'react-bootstrap';
import { 
  FaUserCircle, 
  FaHome, 
  FaInfoCircle, 
  FaShoppingCart,
  FaBell,
  FaStore,
  FaBolt,
  FaLightbulb,
  FaTools
} from 'react-icons/fa';
import { RiFlashlightFill } from 'react-icons/ri';
import img1 from './images/1.jpeg'; // Adjust the path as needed
import img2 from './images/2.jpeg';
import img3 from './images/3.jpeg';
import img4 from './images/4.jpeg';
import img5 from './images/5.jpeg';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {/* Top Announcement Bar */}
  
      <style>{`
        .announcement-text-nowrap {
          white-space: nowrap !important;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 768px) {
          .announcement-bar .announcement-phone {
            margin-left: auto !important;
            margin-top: 8px;
            width: auto;
            display: flex;
            justify-content: flex-end;
          }
          .announcement-bar .announcement-text-nowrap {
            font-size: 0.98rem !important;
            max-width: 60vw;
            white-space: nowrap !important;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .announcement-bar .position-relative {
            flex-direction: row !important;
            align-items: center !important;
          }
        }
      `}</style>

      {/* Animated Brand Name - very top of the page, no space between phone number and animation */}
      <div className="w-100 d-flex flex-column justify-content-center align-items-center position-fixed header-bg-blur" style={{zIndex: 2000, background: 'rgba(15,23,42,0.92)', minHeight: '160px', top: 0, left: 0, boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}}>
        <span className="animated-brand-name fw-bold moving-text d-flex align-items-center gap-4" style={{
          fontSize:'3.6rem',
          letterSpacing:'0.7em',
          textShadow:'0 6px 32px #fff, 0 0 24px #2563eb',
          whiteSpace:'nowrap',
          display:'inline-flex',
          width:'auto',
          color:'#fff',
          fontFamily: 'Montserrat, Arial, sans-serif',
          fontStyle: 'italic',
          fontWeight: 700,
          background:'none',
        }}>
          Lalith Electricals
        </span>
        {/* Animated image row */}
        <div className="brand-image-marquee mt-3 w-100 overflow-hidden d-flex justify-content-center align-items-center" style={{maxWidth:'100vw', minHeight:'64px'}}>
          <div className="marquee-track d-flex align-items-center gap-5" style={{animation: 'brand-marquee 18s linear infinite'}}>
            <img src={img1} alt="Brand 1" className="brand-marquee-img" style={{height:'72px', width:'72px', borderRadius:'14px', objectFit:'cover', boxShadow:'0 2px 8px #222', border:'2px solid #fbbf24', background:'#fff', padding:'2px'}} />
            <img src={img2} alt="Brand 2" className="brand-marquee-img" style={{height:'72px', width:'72px', borderRadius:'14px', objectFit:'cover', boxShadow:'0 2px 8px #222', border:'2px solid #60a5fa', background:'#fff', padding:'2px'}} />
            <img src={img3} alt="Brand 3" className="brand-marquee-img" style={{height:'72px', width:'72px', borderRadius:'14px', objectFit:'cover', boxShadow:'0 2px 8px #222', border:'2px solid #f472b6', background:'#fff', padding:'2px'}} />
            <img src={img4} alt="Brand 4" className="brand-marquee-img" style={{height:'72px', width:'72px', borderRadius:'14px', objectFit:'cover', boxShadow:'0 2px 8px #222', border:'2px solid #22d3ee', background:'#fff', padding:'2px'}} />
            <img src={img5} alt="Brand 5" className="brand-marquee-img" style={{height:'72px', width:'72px', borderRadius:'14px', objectFit:'cover', boxShadow:'0 2px 8px #222', border:'2px solid #a3e635', background:'#fff', padding:'2px'}} />
          </div>
        </div>
      </div>
      <style>{`
        .header-bg-blur {
          background: url('../components/images/1.jpeg') center center/cover no-repeat, rgba(15,23,42,0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        @keyframes brand-glow {
          0% { text-shadow: 0 6px 32px #fff, 0 0 0 #3b82f6; }
          50% { text-shadow: 0 12px 48px #fbbf24, 0 0 48px #f472b6; }
          100% { text-shadow: 0 6px 32px #fff, 0 0 0 #3b82f6; }
        }
        .animated-brand-name {
          animation: brand-glow 2.5s infinite ease-in-out;
          transition: color 0.3s;
        }
        @keyframes move-text {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100vw); }
        }
        .moving-text {
          animation: move-text 10s linear infinite;
        }
        @keyframes brand-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-60%); }
        }
        .brand-image-marquee {
          width: 100vw;
          overflow: hidden;
        }
        .marquee-track {
          min-width: 800px;
        }
        .brand-marquee-img {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .brand-marquee-img:hover {
          transform: scale(1.15) rotate(-3deg);
          box-shadow: 0 8px 32px #3b82f6, 0 0 24px #fbbf24;
        }
        body { padding-top: 160px !important; }
      `}</style>

      {/* Main Navbar */}
      <Navbar bg="white" expand="lg" sticky="top" className="main-navbar shadow-sm py-3 position-relative">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center brand-logo">
            <FaStore className="text-primary me-2" size={30} />
            <span className="text-dark fs-4 fw-bold">Lalith Electricals</span>
          </Navbar.Brand>

          {/* Search Bar */}
          <div className="d-flex align-items-center ms-auto me-3 search-container shadow-sm rounded-pill">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="form-control border-0 shadow-none rounded-start-pill px-3 py-2"
            />
            <button className="btn btn-primary rounded-end-pill px-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-2">
              <Nav.Link 
                as={Link} 
                to="/" 
                className="nav-link-hover d-flex align-items-center px-3 fw-medium text-dark"
              >
                <FaHome className="me-1" /> Home
              </Nav.Link>

     

              {currentUser ? (
                <>
                  <NavDropdown
                    title={
                      <div className="d-inline-flex align-items-center">
                        {currentUser.profilePicture ? (
                          <Image 
                            src={currentUser.profilePicture} 
                            alt="Profile" 
                            roundedCircle 
                            width="32"
                            height="32"
                            className="me-2 border border-2 border-primary"
                          />
                        ) : (
                          <FaUserCircle className="me-2" size={24} />
                        )}
                        <span className="fw-medium">{currentUser.username || 'My Account'}</span>
                      </div>
                    }
                    id="basic-nav-dropdown"
                    align="end"
                    className="dropdown-hover"
                  >
                    <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-hover">
                      <i className="bi bi-person me-2"></i> Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orders" className="dropdown-item-hover">
                      <i className="bi bi-bag me-2"></i> My Orders
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/logout" className="dropdown-item-hover text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Optional: Notification or Cart */}
                 
                </>
              ) : (
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className="btn btn-outline-primary rounded-pill px-4 fw-medium"
                >
                  <FaUserCircle className="me-2" /> Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
              <a href="tel:0779189558" className="text-decoration-none announcement-phone ms-3" style={{minWidth:'fit-content'}}>
            <span className="bg-primary text-white px-3 py-1 rounded-pill shadow-sm fw-bold d-flex align-items-center gap-2" style={{letterSpacing:'1px', fontSize:'1.08rem', transition:'background 0.2s'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-telephone-fill me-2" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 1 1.015-.063l2.29 2.29c.329.329.445.81.302 1.234l-.547 1.64a.678.678 0 0 0 .145.67l2.457 2.457a.678.678 0 0 0 .67.145l1.64-.547c.424-.143.905-.027 1.234.302l2.29 2.29a.678.678 0 0 1-.063 1.015l-2.013 1.51c-.29.218-.667.246-.98.07a17.634 17.634 0 0 1-7.01-7.01c-.176-.313-.148-.69.07-.98l1.51-2.013z"/>
              </svg>
              077 -918 9558
            </span>
          </a>
        </Container>
      </Navbar>
    </>
  );
}
