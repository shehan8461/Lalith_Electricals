import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, NavDropdown, Image, Badge } from 'react-bootstrap';
import { 
  FaUserCircle, 
  FaHome, 
  FaInfoCircle, 
  FaShoppingCart,
  FaBell,
  FaStore
} from 'react-icons/fa';
import { RiFlashlightFill } from 'react-icons/ri';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar bg-dark text-white py-1 text-center small">
        <Container>
          <span className="d-inline-flex align-items-center">
            <RiFlashlightFill className="me-2 text-warning" />
            <strong>Power Up Your Home with Top Deals on Electricals & Appliances in Sri Lanka</strong>

          </span>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar bg="white" expand="lg" sticky="top" className="main-navbar shadow-sm py-3">
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

              <Nav.Link 
                as={Link} 
                to="/about" 
                className="nav-link-hover d-flex align-items-center px-3 fw-medium text-dark"
              >
                <FaInfoCircle className="me-1" /> About
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
        </Container>
      </Navbar>
    </>
  );
}
