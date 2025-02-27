import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Image } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BannerEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [welcomeBonus, setWelcomeBonus] = useState('');
  const [freeSpinsText, setFreeSpinsText] = useState('');
  const [rtp, setRtp] = useState('95.0%');
  const [payoutTime, setPayoutTime] = useState('Instant');
  const [paymentMethods, setPaymentMethods] = useState({
    bitcoin: true,
    visa: true,
    mastercard: true,
    ethereum: true
  });
  const [playNowUrl, setPlayNowUrl] = useState('#');
  const [backgroundColor, setBackgroundColor] = useState('#1a1e2c');
  const [position, setPosition] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [pageType, setPageType] = useState('home');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [takenPositions, setTakenPositions] = useState([]);
  
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
  
  // Fetch taken positions for the current page type
  useEffect(() => {
    const fetchTakenPositions = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
          }
        };
        
        // Get all banners of the same page type
        const { data } = await axios.get('/api/banners', config);
        
        // Filter banners by page type and exclude the current banner if in edit mode
        const otherBanners = data.filter(banner => 
          banner.pageType === pageType && 
          (!isEditMode || banner._id !== id)
        );
        
        // Get positions that are already taken
        const taken = otherBanners.map(banner => banner.position);
        setTakenPositions(taken);
      } catch (err) {
        console.error('Error fetching taken positions:', err);
      }
    };
    
    fetchTakenPositions();
  }, [id, isEditMode, pageType]); // Add pageType as a dependency
  
  // Fetch banner details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBanner = async () => {
        try {
          setLoading(true);
          
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
            }
          };
          
          const { data } = await axios.get(`/api/banners/${id}`, config);
          
          setTitle(data.title);
          setImage(data.image);
          setImagePreview(data.image);
          setWelcomeBonus(data.welcomeBonus || '');
          setFreeSpinsText(data.freeSpinsText || '');
          setRtp(data.rtp || '95.0%');
          setPayoutTime(data.payoutTime || 'Instant');
          setPlayNowUrl(data.playNowUrl || '#');
          
          // Set payment methods with fallback to defaults
          setPaymentMethods({
            bitcoin: data.paymentMethods?.bitcoin ?? true,
            visa: data.paymentMethods?.visa ?? true,
            mastercard: data.paymentMethods?.mastercard ?? true,
            ethereum: data.paymentMethods?.ethereum ?? true
          });
          
          setBackgroundColor(data.backgroundColor || '#1a1e2c');
          setPosition(data.position || 1);
          setIsActive(data.isActive);
          setPageType(data.pageType || 'home');
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load banner details');
          setLoading(false);
          console.error('Error fetching banner details:', err);
        }
      };
      
      fetchBanner();
    }
  }, [id, isEditMode]);
  
  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      formData.append('title', title);
      formData.append('welcomeBonus', welcomeBonus);
      formData.append('freeSpinsText', freeSpinsText);
      formData.append('rtp', rtp);
      formData.append('payoutTime', payoutTime);
      formData.append('playNowUrl', playNowUrl);
      
      // Add payment methods as JSON string
      formData.append('paymentMethods', JSON.stringify(paymentMethods));
      
      formData.append('backgroundColor', backgroundColor);
      formData.append('position', position);
      formData.append('isActive', isActive);
      formData.append('pageType', pageType);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      
      if (isEditMode) {
        // Update existing banner
        await axios.put(`/api/banners/${id}`, formData, config);
      } else {
        // Create new banner
        await axios.post('/api/banners', formData, config);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/banners');
      }, 2000);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to save banner'
      );
      setLoading(false);
    }
  };
  
  // Check if a position is already taken
  const isPositionTaken = (pos) => {
    return takenPositions.includes(pos);
  };
  
  return (
    <div className="admin-banner-edit py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="admin-title">
            {isEditMode ? 'Edit Banner' : 'Add New Banner'}
          </h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/banners">
            <Button variant="secondary">Back to Banners</Button>
          </Link>
        </Col>
      </Row>
      
      <Card className="admin-card">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Banner {isEditMode ? 'updated' : 'created'} successfully!
            </Alert>
          )}
          
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter banner title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Welcome Bonus</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 300% up to 1500€"
                    value={welcomeBonus}
                    onChange={(e) => setWelcomeBonus(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Free Spins Text</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., +150 Free Spins"
                    value={freeSpinsText}
                    onChange={(e) => setFreeSpinsText(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>RTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 95.0%"
                    value={rtp}
                    onChange={(e) => setRtp(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Payout Time</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Instant"
                    value={payoutTime}
                    onChange={(e) => setPayoutTime(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Play Now URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., https://example.com"
                    value={playNowUrl}
                    onChange={(e) => setPlayNowUrl(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Payment Methods</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    <Form.Check 
                      type="checkbox"
                      id="bitcoin"
                      label="Bitcoin"
                      checked={paymentMethods.bitcoin}
                      onChange={(e) => setPaymentMethods({...paymentMethods, bitcoin: e.target.checked})}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="visa"
                      label="Visa"
                      checked={paymentMethods.visa}
                      onChange={(e) => setPaymentMethods({...paymentMethods, visa: e.target.checked})}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="mastercard"
                      label="Mastercard"
                      checked={paymentMethods.mastercard}
                      onChange={(e) => setPaymentMethods({...paymentMethods, mastercard: e.target.checked})}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="ethereum"
                      label="Ethereum"
                      checked={paymentMethods.ethereum}
                      onChange={(e) => setPaymentMethods({...paymentMethods, ethereum: e.target.checked})}
                    />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Banner Image</Form.Label>
                  {imagePreview && (
                    <div className="mb-2">
                      <Image
                        src={imagePreview}
                        alt="Banner Preview"
                        style={{ width: '200px', height: 'auto', objectFit: 'contain' }}
                        thumbnail
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    required={!isEditMode}
                  />
                  <Form.Text className="text-muted">
                    Upload a banner image (recommended size: 800x400px)
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Background Color</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      title="Choose background color for the logo section"
                      style={{ width: '60px', height: '38px' }}
                    />
                    <Form.Control
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="e.g., #1a1e2c"
                      className="ms-2"
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Select a background color that matches the logo's background
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <div>
                    {[1, 2, 3].map((pos) => (
                      <Form.Check
                        key={pos}
                        type="radio"
                        id={`position-${pos}`}
                        label={`Position ${pos}${isPositionTaken(pos) && pos !== position ? ' (Already taken)' : ''}`}
                        value={pos}
                        checked={position === pos}
                        onChange={() => setPosition(pos)}
                        disabled={isPositionTaken(pos) && pos !== position}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  <Form.Text className="text-muted">
                    Select the position for this banner (1-3)
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Page Type</Form.Label>
                  <Form.Select
                    value={pageType}
                    onChange={(e) => setPageType(e.target.value)}
                  >
                    <option value="home">Home Page</option>
                    <option value="allCasinos">All Casinos Page</option>
                    <option value="newCasinos">New Casinos Page</option>
                    <option value="topPayment">Top Payment Page</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select which page this banner should appear on
                  </Form.Text>
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
            
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                className="admin-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Banner' : 'Add Banner'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BannerEdit;
