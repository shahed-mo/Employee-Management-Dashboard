// TopNavbar.jsx
import React from 'react';
import { Auth } from '../../Context/Auth';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './Nav.css';
const TopNavbar = () => {
  const auth = Auth();

  const handleSearch = () => {
    alert('Search clicked!');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>

        <Form className="search-wrapper">
          <Form.Control
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <FontAwesomeIcon 
            icon={faSearch} 
            className="search-icon" 
            onClick={handleSearch} 
          />
        </Form>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="profile">
            <p className="inital">{auth?.User?.initials || 'U'}</p>
          </div>
          <div className="notifyicon">
            <NotificationsIcon />
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;