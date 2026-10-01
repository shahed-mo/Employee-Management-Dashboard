// TopNavbar.jsx
import React, { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');

  const initials = useMemo(
    () =>
      (auth?.User?.name || '')
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U',
    [auth?.User?.name]
  );

  const handleSearch = (e) => {
    e?.preventDefault(); // يمنع reload الصفحة عند الضغط على Enter
    // TODO: اربط البحث بالصفحة المطلوبة (مثلاً navigate(`/employee?search=${query}`))
    console.log('Search:', query);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Form className="search-wrapper" onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSearch} />
        </Form>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="profile">
            <p className="inital">{initials}</p>
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