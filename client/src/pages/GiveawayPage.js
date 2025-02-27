import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Container } from 'react-bootstrap';
import axios from 'axios';

const GiveawayPage = () => {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch giveaways from API
  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const { data } = await axios.get('/api/giveaways');
        setGiveaways(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load giveaways');
        setLoading(false);
        console.error('Error fetching giveaways:', err);
      }
    };

    fetchGiveaways();
  }, []);

  // Format date for display with month name, day with ordinal suffix, and year
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format prize distribution for display
  const formatPrizeDistribution = (distribution) => {
    if (!distribution) return null;
    
    return distribution.split('\n').map((line, index) => (
      <div key={index} className="prize-line">
        {line}
      </div>
    ));
  };

  return (
    <Container>
      <section className="giveaway-section py-5">
        <h1 className="text-center mb-2">Casino Giveaways</h1>
        
        <p className="text-center mb-5">
          Join exclusive giveaways and win amazing prizes from our partner casinos.
          Don't miss your chance to win big!
        </p>
        
        {loading ? (
          <div className="text-center py-5">Loading giveaways...</div>
        ) : error ? (
          <div className="text-center py-5 text-danger">{error}</div>
        ) : giveaways.length === 0 ? (
          <div className="text-center py-5">No active giveaways at the moment</div>
        ) : (
          <Row>
            {giveaways.map(giveaway => (
              <Col key={giveaway._id} md={12} className="mb-5">
                <Card className="giveaway-card shadow">
                  <Row className="g-0">
                    <Col md={4} className="giveaway-image-container">
                      {giveaway.image ? (
                        <div 
                          className="casino-logo-section"
                          style={{ backgroundColor: giveaway.backgroundColor || '#1a1e2c' }}
                        >
                          <img 
                            src={giveaway.image} 
                            alt={giveaway.title} 
                            className="casino-logo"
                          />
                        </div>
                      ) : giveaway.casino && giveaway.casino.logo ? (
                        <div 
                          className="casino-logo-section"
                          style={{ backgroundColor: giveaway.backgroundColor || '#1a1e2c' }}
                        >
                          <img 
                            src={giveaway.casino.logo} 
                            alt={giveaway.casino.name || 'Casino'} 
                            className="casino-logo"
                          />
                        </div>
                      ) : (
                        <div className="giveaway-image-placeholder d-flex align-items-center justify-content-center">
                          <div className="placeholder-text">
                            {giveaway.title}
                          </div>
                        </div>
                      )}
                      <div className="giveaway-date-badge">
                        <div className="date-range">
                          {formatDate(giveaway.startDate)} - {formatDate(giveaway.endDate)}
                        </div>
                        <div className="days-remaining">
                          {getDaysRemaining(giveaway.endDate)} days left
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={8}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h2 className="giveaway-title">{giveaway.title}</h2>
                            {giveaway.casino && (
                              <h4 className="casino-name">{giveaway.casino.name}</h4>
                            )}
                          </div>
                          <Badge bg="warning" text="dark" className="prize-pool-badge">
                            Prize Pool: {giveaway.prizePool}
                          </Badge>
                        </div>
                        
                        <Card.Text className="giveaway-description mb-4">
                          {giveaway.description}
                        </Card.Text>
                        
                        <Row className="giveaway-details">
                          <Col md={6}>
                            <div className="detail-section">
                              <h5 className="detail-title">How to Participate</h5>
                              <p>{giveaway.depositRequirements}</p>
                            </div>
                            
                            {giveaway.additionalNotes && (
                              <div className="detail-section">
                                <h5 className="detail-title">Additional Info</h5>
                                <p>{giveaway.additionalNotes}</p>
                              </div>
                            )}
                          </Col>
                          
                          <Col md={6}>
                            <div className="detail-section">
                              <h5 className="detail-title">Prize Distribution</h5>
                              <div className="prize-distribution">
                                {formatPrizeDistribution(giveaway.prizeDistribution)}
                              </div>
                            </div>
                          </Col>
                        </Row>
                        
                        <div className="text-center mt-4">
                          <Button 
                            className="btn-claim-large" 
                            href={giveaway.customLink || (giveaway.casino && giveaway.casino.playNowUrl)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            size="lg"
                          >
                            {giveaway.buttonText || 'Join Giveaway'}
                          </Button>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </Container>
  );
};

export default GiveawayPage;
