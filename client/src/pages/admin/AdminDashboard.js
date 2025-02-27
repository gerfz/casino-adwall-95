import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    casinos: 0,
    banners: 0,
    giveaways: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  
  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch casinos count
        const casinosRes = await axios.get('/api/casinos');
        
        // Fetch banners count
        const bannersRes = await axios.get('/api/banners');
        
        // Fetch giveaways count
        const giveawaysRes = await axios.get('/api/giveaways');
        
        setStats({
          casinos: casinosRes.data.length,
          banners: bannersRes.data.length,
          giveaways: giveawaysRes.data.length
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="admin-dashboard py-4">
      <h1 className="admin-title mb-4">Admin Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-5">Loading dashboard data...</div>
      ) : error ? (
        <div className="text-center py-5 text-danger">{error}</div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="admin-card text-center h-100">
                <Card.Body>
                  <h3>{stats.casinos}</h3>
                  <p>Total Casinos</p>
                  <Link to="/admin/casinos">
                    <Button className="admin-btn">Manage Casinos</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="admin-card text-center h-100">
                <Card.Body>
                  <h3>{stats.banners}</h3>
                  <p>Active Banners</p>
                  <Link to="/admin/banners">
                    <Button className="admin-btn">Manage Banners</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="admin-card text-center h-100">
                <Card.Body>
                  <h3>{stats.giveaways}</h3>
                  <p>Active Giveaways</p>
                  <Link to="/admin/giveaways">
                    <Button className="admin-btn">Manage Giveaways</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="mb-4">
            <Col>
              <Card className="admin-card">
                <Card.Body>
                  <h3 className="mb-3">Quick Actions</h3>
                  <Row>
                    <Col md={4} className="mb-2">
                      <Link to="/admin/casinos/create">
                        <Button className="admin-btn w-100">Add New Casino</Button>
                      </Link>
                    </Col>
                    <Col md={4} className="mb-2">
                      <Link to="/admin/banners/create">
                        <Button className="admin-btn w-100">Add New Banner</Button>
                      </Link>
                    </Col>
                    <Col md={4} className="mb-2">
                      <Link to="/admin/giveaways/create">
                        <Button className="admin-btn w-100">Add New Giveaway</Button>
                      </Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="admin-card">
                <Card.Body>
                  <h3 className="mb-3">Website Preview</h3>
                  <p>
                    View your website as visitors will see it. Check how your changes
                    appear on the front end.
                  </p>
                  <Link to="/" target="_blank">
                    <Button className="admin-btn">
                      Open Website
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
