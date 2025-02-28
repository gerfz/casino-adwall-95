import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Form, Alert, Card, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CasinoList = () => {
  const [casinos, setCasinos] = useState([]);
  const [filteredCasinos, setFilteredCasinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  
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
  
  // Fetch casinos from API
  const fetchCasinos = async (category = null) => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }
      };
      
      let url = '/api/casinos';
      if (category && category !== 'All') {
        url += `?category=${encodeURIComponent(category)}`;
      }
      
      const { data } = await axios.get(url, config);
      setCasinos(data);
      setFilteredCasinos(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load casinos');
      setLoading(false);
      console.error('Error fetching casinos:', err);
    }
  };
  
  useEffect(() => {
    fetchCasinos();
  }, []);
  
  // Filter casinos based on search term
  useEffect(() => {
    if (casinos.length > 0) {
      const filtered = casinos.filter(
        casino => casino.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCasinos(filtered);
    }
  }, [searchTerm, casinos]);
  
  // Delete casino handler
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this casino?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
          }
        };
        
        await axios.delete(`/api/casinos/${id}`, config);
        setSuccessMessage('Casino deleted successfully');
        fetchCasinos(activeCategory !== 'All' ? activeCategory : null);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to delete casino'
        );
      }
    }
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setReorderMode(false);
    fetchCasinos(category !== 'All' ? category : null);
  };
  
  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    // For better visual feedback
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    
    // Add a class to the dragged item for styling
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Return if the item is dragged over itself
    if (draggedItem === index) {
      return;
    }
    
    // Reorder the items
    const items = Array.from(filteredCasinos);
    const draggedItemContent = items[draggedItem];
    
    // Remove the dragged item
    items.splice(draggedItem, 1);
    // Add it at the new position
    items.splice(index, 0, draggedItemContent);
    
    // Update the dragged item index
    setDraggedItem(index);
    // Update the list
    setFilteredCasinos(items);
  };
  
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };
  
  // Save order
  const saveOrder = async () => {
    if (activeCategory === 'All') {
      setError('Please select a specific category to reorder casinos');
      return;
    }
    
    try {
      setSavingOrder(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }
      };
      
      const casinoIds = filteredCasinos.map(casino => casino._id);
      
      await axios.put(
        '/api/casinos/reorder',
        { 
          category: activeCategory, 
          casinoIds 
        },
        config
      );
      
      setSuccessMessage('Casino order updated successfully');
      setReorderMode(false);
      setSavingOrder(false);
      fetchCasinos(activeCategory);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to update casino order'
      );
      setSavingOrder(false);
    }
  };
  
  // Toggle reorder mode
  const toggleReorderMode = () => {
    if (activeCategory === 'All') {
      setError('Please select a specific category to reorder casinos');
      return;
    }
    
    setReorderMode(!reorderMode);
  };
  
  return (
    <div className="admin-casino-list py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="admin-title">Casinos</h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/casinos/create">
            <Button className="admin-btn me-2">
              <i className="fas fa-plus"></i> Add Casino
            </Button>
          </Link>
          {!reorderMode ? (
            <Button 
              className="admin-btn" 
              onClick={toggleReorderMode}
              disabled={activeCategory === 'All'}
            >
              <i className="fas fa-sort"></i> Reorder Casinos
            </Button>
          ) : (
            <Button 
              className="admin-btn" 
              variant="success" 
              onClick={saveOrder}
              disabled={savingOrder}
            >
              {savingOrder ? 'Saving...' : 'Save Order'}
            </Button>
          )}
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
      
      <Card className="mb-4">
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link 
                active={activeCategory === 'All'} 
                onClick={() => handleCategoryChange('All')}
                className="nav-link-custom"
              >
                All Casinos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeCategory === 'Featured'} 
                onClick={() => handleCategoryChange('Featured')}
                className="nav-link-custom"
              >
                Front Page
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeCategory === 'Top-rated'} 
                onClick={() => handleCategoryChange('Top-rated')}
                className="nav-link-custom"
              >
                Top Rated
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeCategory === 'New'} 
                onClick={() => handleCategoryChange('New')}
                className="nav-link-custom"
              >
                New Casinos
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeCategory === 'Top P&P'} 
                onClick={() => handleCategoryChange('Top P&P')}
                className="nav-link-custom"
              >
                Top P&P
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search casinos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={reorderMode}
                />
              </Form.Group>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center py-5">Loading casinos...</div>
          ) : filteredCasinos.length === 0 ? (
            <div className="text-center py-5">No casinos found</div>
          ) : reorderMode ? (
            <div className="reorder-list">
              {filteredCasinos.map((casino, index) => (
                <div
                  key={index}
                  className="reorder-item mb-2 p-3 bg-light rounded border"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i className="fas fa-grip-vertical text-muted"></i>
                    </div>
                    <div className="d-flex align-items-center flex-grow-1">
                      <img
                        src={casino.logo}
                        alt={casino.name}
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        className="me-3"
                      />
                      <div>
                        <h5 className="mb-0">{casino.name}</h5>
                        <small className="text-muted">{casino.depositBonus}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Bonus</th>
                    <th>Free Spins</th>
                    <th>Status</th>
                    <th>Categories</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCasinos.map(casino => (
                    <tr key={casino._id}>
                      <td>{casino._id}</td>
                      <td>{casino.name}</td>
                      <td>{casino.depositBonus}</td>
                      <td>{casino.freeSpins}</td>
                      <td>
                        {casino.isActive ? (
                          <span className="text-success">Active</span>
                        ) : (
                          <span className="text-danger">Inactive</span>
                        )}
                      </td>
                      <td>
                        {casino.categories.join(', ')}
                      </td>
                      <td>
                        <Link to={`/admin/casinos/${casino._id}`}>
                          <Button variant="info" size="sm" className="me-2">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteHandler(casino._id)}
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default CasinoList;
