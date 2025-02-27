import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GiveawayList = () => {
  const [giveaways, setGiveaways] = useState([]);
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
  
  // Fetch giveaways from API
  const fetchGiveaways = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }
      };
      
      const { data } = await axios.get('/api/giveaways', config);
      setGiveaways(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load giveaways');
      setLoading(false);
      console.error('Error fetching giveaways:', err);
    }
  };
  
  useEffect(() => {
    fetchGiveaways();
  }, []);
  
  // Delete giveaway handler
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this giveaway?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
          }
        };
        
        await axios.delete(`/api/giveaways/${id}`, config);
        setSuccessMessage('Giveaway deleted successfully');
        fetchGiveaways();
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to delete giveaway'
        );
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="admin-giveaway-list py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="admin-title">Giveaways</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/giveaways/create">
            <Button className="admin-btn">
              <i className="fas fa-plus"></i> Add Giveaway
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
        <div className="text-center py-5">Loading giveaways...</div>
      ) : giveaways.length === 0 ? (
        <div className="text-center py-5">No giveaways found</div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Prize Pool</th>
                <th>Valid Period</th>
                <th>Status</th>
                <th>Custom Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {giveaways.map(giveaway => (
                <tr key={giveaway._id}>
                  <td>{giveaway._id}</td>
                  <td>{giveaway.title}</td>
                  <td>{giveaway.prizePool || 'N/A'}</td>
                  <td>
                    {formatDate(giveaway.startDate)} - {formatDate(giveaway.endDate)}
                  </td>
                  <td>
                    {giveaway.isActive ? (
                      <span className="text-success">Active</span>
                    ) : (
                      <span className="text-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    {giveaway.customLink ? (
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                        {giveaway.customLink}
                      </span>
                    ) : (
                      <span className="text-muted">Default</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/giveaways/${giveaway._id}`}>
                      <Button variant="info" size="sm" className="me-2">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteHandler(giveaway._id)}
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

export default GiveawayList;
