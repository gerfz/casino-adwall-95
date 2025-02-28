import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Image, Badge } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const CasinoEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoZoom, setLogoZoom] = useState(1);
  const [logoPositionX, setLogoPositionX] = useState(50); // Center (0-100%)
  const [logoPositionY, setLogoPositionY] = useState(50); // Center (0-100%)
  const [rating, setRating] = useState(0);
  const [depositBonus, setDepositBonus] = useState('');
  const [freeSpins, setFreeSpins] = useState(0);
  const [signupSpins, setSignupSpins] = useState(0);
  const [playNowUrl, setPlayNowUrl] = useState('');
  const [features, setFeatures] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  // Available categories
  const availableCategories = ['Featured', 'Top-rated', 'New', 'Top P&P'];
  
  // Check if user is logged in and is admin
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
      
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);
  
  // Fetch casino details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCasino = async () => {
        try {
          setLoading(true);
          
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
            }
          };
          
          const { data } = await axios.get(`/api/casinos/${id}`, config);
          
          setName(data.name);
          setLogo(data.logo);
          setLogoPreview(data.logo);
          setRating(data.rating);
          setDepositBonus(data.depositBonus);
          setFreeSpins(data.freeSpins);
          setSignupSpins(data.signupSpins);
          setPlayNowUrl(data.playNowUrl);
          setFeatures(data.features.length > 0 ? data.features : ['']);
          setCategories(data.categories);
          setIsActive(data.isActive);
          // Set logo zoom and position if available, otherwise default values
          setLogoZoom(data.logoZoom || 1);
          setLogoPositionX(data.logoPositionX !== undefined ? data.logoPositionX : 50);
          setLogoPositionY(data.logoPositionY !== undefined ? data.logoPositionY : 50);
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load casino details');
          setLoading(false);
          console.error('Error fetching casino details:', err);
        }
      };
      
      fetchCasino();
    }
  }, [id, isEditMode]);
  
  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      // Reset zoom and position to default when new logo is uploaded
      setLogoZoom(1);
      setLogoPositionX(50);
      setLogoPositionY(50);
    }
  };
  
  // Handle feature input change
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  
  // Add new feature input
  const addFeature = () => {
    setFeatures([...features, '']);
  };
  
  // Remove feature input
  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures.length > 0 ? updatedFeatures : ['']);
  };
  
  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };
  
  // Fill form with test data
  const fillWithTestData = () => {
    setRating(5);
    setDepositBonus('100% up to 200€');
    setFreeSpins(150);
    setSignupSpins(50);
    setPlayNowUrl('https://ysivitonen95.com/');
    setFeatures(['24/7 Support', 'Fast Withdrawals', 'Free Spins']);
    setCategories([...availableCategories]); // Select all categories
    setIsActive(true);
  };
  
  // Reset logo position and zoom
  const resetLogoSettings = () => {
    setLogoZoom(1);
    setLogoPositionX(50);
    setLogoPositionY(50);
  };
  
  // Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      // Create form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('rating', rating);
      formData.append('depositBonus', depositBonus);
      formData.append('freeSpins', freeSpins);
      formData.append('signupSpins', signupSpins);
      formData.append('playNowUrl', playNowUrl);
      formData.append('features', JSON.stringify(features.filter(f => f.trim() !== '')));
      formData.append('categories', JSON.stringify(categories));
      formData.append('isActive', isActive);
      formData.append('logoZoom', logoZoom);
      formData.append('logoPositionX', logoPositionX);
      formData.append('logoPositionY', logoPositionY);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      
      if (isEditMode) {
        // Update existing casino
        await axios.put(`/api/casinos/${id}`, formData, config);
      } else {
        // Create new casino
        await axios.post('/api/casinos', formData, config);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/casinos');
      }, 2000);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to save casino'
      );
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-casino-edit py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="admin-title">
            {isEditMode ? 'Edit Casino' : 'Add New Casino'}
          </h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/casinos">
            <Button variant="secondary">Back to Casinos</Button>
          </Link>
        </Col>
      </Row>
      
      <Card className="admin-card">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Casino {isEditMode ? 'updated' : 'created'} successfully!
            </Alert>
          )}
          
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Casino Name</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter casino name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Button 
                      variant="info" 
                      className="ms-2" 
                      onClick={fillWithTestData}
                      title="Fill all fields except name with test data"
                    >
                      <i className="fas fa-magic"></i> Fill Test Data
                    </Button>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Logo</Form.Label>
                  {logoPreview && (
                    <div className="mb-3">
                      <Row>
                        <Col md={6}>
                          <div className="mb-2">
                            <strong>Standard Preview:</strong>
                          </div>
                          <Image
                            src={logoPreview}
                            alt="Casino Logo Preview"
                            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                            thumbnail
                          />
                        </Col>
                        <Col md={6}>
                          <div className="mb-2">
                            <strong>Casino Card Preview:</strong>
                          </div>
                          <div 
                            className="casino-logo-container-preview"
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              display: 'inline-block',
                              backgroundColor: 'transparent',
                              border: '1px solid #ddd',
                              position: 'relative'
                            }}
                          >
                            <div style={{ 
                              width: '100%', 
                              height: '100%', 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              position: 'relative'
                            }}>
                              <img
                                src={logoPreview}
                                alt="Casino Logo Card Preview"
                                style={{ 
                                  position: 'absolute',
                                  width: `${logoZoom * 100}%`,
                                  height: 'auto',
                                  objectFit: 'contain',
                                  left: `${logoPositionX}%`,
                                  top: `${logoPositionY}%`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      
                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Logo Adjustments:</strong>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={resetLogoSettings}
                          >
                            Reset to Default
                          </Button>
                        </div>
                        
                        <Form.Label>Zoom Level: {logoZoom.toFixed(1)}x</Form.Label>
                        <Form.Range
                          min={0.1}
                          max={3}
                          step={0.1}
                          value={logoZoom}
                          onChange={(e) => setLogoZoom(parseFloat(e.target.value))}
                        />
                        <div className="d-flex justify-content-between">
                          <small>Zoom Out</small>
                          <small>Zoom In</small>
                        </div>
                        
                        <Form.Label className="mt-3">Horizontal Position: {logoPositionX}%</Form.Label>
                        <Form.Range
                          min={0}
                          max={100}
                          step={1}
                          value={logoPositionX}
                          onChange={(e) => setLogoPositionX(parseInt(e.target.value))}
                        />
                        <div className="d-flex justify-content-between">
                          <small>Left</small>
                          <small>Right</small>
                        </div>
                        
                        <Form.Label className="mt-3">Vertical Position: {logoPositionY}%</Form.Label>
                        <Form.Range
                          min={0}
                          max={100}
                          step={1}
                          value={logoPositionY}
                          onChange={(e) => setLogoPositionY(parseInt(e.target.value))}
                        />
                        <div className="d-flex justify-content-between">
                          <small>Top</small>
                          <small>Bottom</small>
                        </div>
                        
                        <Form.Text className="text-muted d-block mt-2">
                          Adjust zoom and position to control how the logo appears in the casino card
                        </Form.Text>
                      </div>
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    onChange={handleLogoChange}
                    accept="image/*"
                    required={!isEditMode}
                  />
                  <Form.Text className="text-muted">
                    Upload a square logo image for best results
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Rating (0-5)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="Enter rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Deposit Bonus</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 100% up to €200"
                    value={depositBonus}
                    onChange={(e) => setDepositBonus(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Free Spins</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Enter number of free spins"
                    value={freeSpins}
                    onChange={(e) => setFreeSpins(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Signup Spins</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Enter number of signup spins"
                    value={signupSpins}
                    onChange={(e) => setSignupSpins(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Play Now URL</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Enter affiliate link"
                    value={playNowUrl}
                    onChange={(e) => setPlayNowUrl(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    id="isActive"
                    label="Active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col>
                <Form.Label>Features</Form.Label>
                {features.map((feature, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      type="text"
                      placeholder="e.g., 24/7 Support"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                    />
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => removeFeature(index)}
                      disabled={features.length === 1 && feature === ''}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={addFeature}>
                  <i className="fas fa-plus"></i> Add Feature
                </Button>
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col>
                <Form.Label>Categories</Form.Label>
                <div>
                  {availableCategories.map((category) => (
                    <Form.Check
                      key={category}
                      inline
                      type="checkbox"
                      id={`category-${category}`}
                      label={category}
                      checked={categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                  ))}
                </div>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                className="admin-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Casino' : 'Add Casino'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CasinoEdit;
