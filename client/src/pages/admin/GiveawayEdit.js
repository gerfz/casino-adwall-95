import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Image } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GiveawayEdit = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [casino, setCasino] = useState('');
  const [casinos, setCasinos] = useState([]);
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#1a1e2c');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [bonusDetails, setBonusDetails] = useState('');
  const [depositRequirements, setDepositRequirements] = useState('Every 25€ deposit gives you 1 ticket, no max tickets.');
  const [prizePool, setPrizePool] = useState('2000€');
  const [prizeDistribution, setPrizeDistribution] = useState('1st place - 750€\n2nd-3rd place - 500€\n4th place - 250€\n5th-9th place - 50€');
  const [additionalNotes, setAdditionalNotes] = useState('Prize cash will be added to your player account');
  const [customLink, setCustomLink] = useState('');
  const [buttonText, setButtonText] = useState('Join Giveaway');
  const [isActive, setIsActive] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
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
  
  // Fetch casinos for dropdown
  useEffect(() => {
    const fetchCasinos = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
          }
        };
        
        const { data } = await axios.get('/api/casinos', config);
        setCasinos(data);
      } catch (err) {
        setError('Failed to load casinos');
        console.error('Error fetching casinos:', err);
      }
    };
    
    fetchCasinos();
  }, []);
  
  // Fetch giveaway details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchGiveaway = async () => {
        try {
          setLoading(true);
          
          const config = {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
            }
          };
          
          const { data } = await axios.get(`/api/giveaways/${id}`, config);
          
          setTitle(data.title);
          setDescription(data.description);
          setCasino(data.casino._id);
          setImage(data.image);
          setImagePreview(data.image);
          setBackgroundColor(data.backgroundColor || '#1a1e2c');
          setStartDate(new Date(data.startDate).toISOString().split('T')[0]);
          setEndDate(new Date(data.endDate).toISOString().split('T')[0]);
          setRequirements(data.requirements || '');
          setBonusDetails(data.bonusDetails);
          setDepositRequirements(data.depositRequirements || 'Every 25€ deposit gives you 1 ticket, no max tickets.');
          setPrizePool(data.prizePool || '2000€');
          setPrizeDistribution(data.prizeDistribution || '1st place - 750€\n2nd-3rd place - 500€\n4th place - 250€\n5th-9th place - 50€');
          setAdditionalNotes(data.additionalNotes || 'Prize cash will be added to your player account');
          setCustomLink(data.customLink || '');
          setButtonText(data.buttonText || 'Join Giveaway');
          setIsActive(data.isActive);
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load giveaway details');
          setLoading(false);
          console.error('Error fetching giveaway details:', err);
        }
      };
      
      fetchGiveaway();
    } else {
      // Set default dates for new giveaway
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(nextMonth.toISOString().split('T')[0]);
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
      formData.append('description', description);
      formData.append('casino', casino);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('requirements', requirements);
      formData.append('bonusDetails', bonusDetails);
      formData.append('depositRequirements', depositRequirements);
      formData.append('prizePool', prizePool);
      formData.append('prizeDistribution', prizeDistribution);
      formData.append('additionalNotes', additionalNotes);
      formData.append('customLink', customLink);
      formData.append('buttonText', buttonText);
      formData.append('isActive', isActive);
      formData.append('backgroundColor', backgroundColor);
      
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
        // Update existing giveaway
        await axios.put(`/api/giveaways/${id}`, formData, config);
      } else {
        // Create new giveaway
        await axios.post('/api/giveaways', formData, config);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/giveaways');
      }, 2000);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to save giveaway'
      );
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-giveaway-edit py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="admin-title">
            {isEditMode ? 'Edit Giveaway' : 'Add New Giveaway'}
          </h1>
        </Col>
        <Col className="text-end">
          <Link to="/admin/giveaways">
            <Button variant="secondary">Back to Giveaways</Button>
          </Link>
        </Col>
      </Row>
      
      <Card className="admin-card">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Giveaway {isEditMode ? 'updated' : 'created'} successfully!
            </Alert>
          )}
          
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter giveaway title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                
                {/* Casino field removed as requested */}
                
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter giveaway description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
                
                {/* Bonus Details section removed as requested */}
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Image (Optional)</Form.Label>
                  {imagePreview && (
                    <div className="mb-2">
                      <Image
                        src={imagePreview}
                        alt="Giveaway Preview"
                        style={{ width: '200px', height: 'auto', objectFit: 'contain' }}
                        thumbnail
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <Form.Text className="text-muted">
                    Upload a giveaway image (recommended size: 800x400px)
                  </Form.Text>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                <Form.Group className="mb-2">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-2">
                  <Form.Label>Requirements (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="e.g., Minimum deposit €20, Wagering 35x"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Background Color</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      title="Choose background color for logo"
                      style={{ width: '60px', height: '40px' }}
                    />
                    <span className="ms-2">{backgroundColor}</span>
                  </div>
                  <Form.Text className="text-muted">
                    Choose a background color for the logo container
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-2">
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
            
            <h4 className="mt-3 mb-2">Giveaway Details</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Deposit Requirements</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Every 25€ deposit gives you 1 ticket, no max tickets"
                    value={depositRequirements}
                    onChange={(e) => setDepositRequirements(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Prize Pool</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 2000€"
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Prize Distribution</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="e.g., 1st place - 750€&#10;2nd-3rd place - 500€&#10;4th place - 250€&#10;5th-9th place - 50€"
                    value={prizeDistribution}
                    onChange={(e) => setPrizeDistribution(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="e.g., Prize cash will be added to your player account"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Custom Link (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., https://record.magiplayaffiliates.com/_l4N4mP86oGbUOsjNOfgKeWNd7ZgqdRLk/1/"
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    If provided, this link will be used instead of the casino's default link
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Button Text</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Text for the call-to-action button"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Customize the text shown on the button (e.g., "Join Giveaway", "Claim Bonus")
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                className="admin-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Giveaway' : 'Add Giveaway'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GiveawayEdit;
