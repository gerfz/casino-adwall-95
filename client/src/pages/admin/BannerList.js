import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  
  // Check if user is logged in and is admin
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
      
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }
      };
      
      const { data } = await axios.get('/api/banners', config);
      setBanners(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load banners');
      setLoading(false);
      console.error('Error fetching banners:', err);
    }
  };
  
  useEffect(() => {
    fetchBanners();
  }, []);
  
  // Delete banner handler
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
          }
        };
        
        await axios.delete(`/api/banners/${id}`, config);
        setSuccessMessage('Banner deleted successfully');
        fetchBanners();
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to delete banner'
        );
      }
    }
  };
  
  
  return (
    <div className="admin-banner-list py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="admin-title">Banners</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/banners/create">
            <Button className="admin-btn">
              <i className="fas fa-plus"></i> Add Banner
            </Button>
          </Link>
        </Col>
      </Row>
      
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center py-5">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-5">No banners found</div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner._id}>
                  <td>{banner._id}</td>
                  <td>
                    <img
                      src={banner.image}
                      alt={banner.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{banner.title}</td>
                  <td>{banner.position}</td>
                  <td>
                    {banner.isActive ? (
                      <span className="text-success">Active</span>
                    ) : (
                      <span className="text-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/banners/${banner._id}`}>
                      <Button variant="info" size="sm" className="me-2">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteHandler(banner._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BannerList;
