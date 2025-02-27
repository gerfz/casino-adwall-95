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
                
                <Form.Group className="mb-3">
                  <Form.Label>Logo</Form.Label>
                  {logoPreview && (
                    <div className="mb-2">
                      <Image
                        src={logoPreview}
                        alt="Casino Logo Preview"
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                        thumbnail
                      />
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
